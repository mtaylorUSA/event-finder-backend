/**
 * base-scraper.js
 * 
 * Universal scraper class for any organization
 * - Checks scraping_enabled before scraping
 * - Uses source_id for deduplication
 * - Updates last_scraped timestamp
 * - Matches new PocketBase schema (2025-11-28)
 * 
 * Last Updated: 2025-11-28
 */

const axios = require('axios');
const cheerio = require('cheerio');
const PocketBase = require('pocketbase');

class BaseScraper {
  constructor() {
    this.pb = new PocketBase(process.env.POCKETBASE_URL);
    this.authenticated = false;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // AUTHENTICATION
  // ══════════════════════════════════════════════════════════════════════════

  async authenticate() {
    if (this.authenticated) return;

    try {
      await this.pb.admins.authWithPassword(
        process.env.POCKETBASE_ADMIN_EMAIL,
        process.env.POCKETBASE_ADMIN_PASSWORD
      );
      this.authenticated = true;
      console.log('✅ Authenticated with PocketBase');
    } catch (error) {
      console.error('❌ PocketBase authentication failed:', error.message);
      throw error;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ORGANIZATION METHODS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Get all organizations from PocketBase
   * Only returns orgs where scraping_enabled = true
   */
  async getAllOrganizations() {
    await this.authenticate();
    
    try {
      const result = await this.pb.collection('organizations').getList(1, 500, {
        filter: 'scraping_enabled = true',
        sort: 'name'
      });
      return result.items;
    } catch (error) {
      console.error('❌ Error fetching organizations:', error.message);
      return [];
    }
  }

  /**
   * Get a single organization by ID
   */
  async getOrganization(orgId) {
    await this.authenticate();
    return await this.pb.collection('organizations').getOne(orgId);
  }

  /**
   * Update last_scraped timestamp for an organization
   */
  async updateLastScraped(orgId) {
    await this.authenticate();
    
    try {
      await this.pb.collection('organizations').update(orgId, {
        last_scraped: new Date().toISOString()
      });
    } catch (error) {
      console.error(`❌ Error updating last_scraped for ${orgId}:`, error.message);
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // HTML FETCHING
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Fetch HTML content from a URL
   */
  async fetchHTML(url) {
    try {
      console.log(`📡 Fetching: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 15000
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch ${url}:`, error.message);
      return null;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EVENT SCRAPING
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Main scraping method - scrapes events from an organization
   */
  async scrapeEvents(organization) {
    console.log(`\n📥 Scraping: ${organization.name}`);
    console.log('────────────────────────────────────────');

    // Check if scraping is enabled
    if (!organization.scraping_enabled) {
      console.log('⏭️  Scraping disabled for this organization');
      return [];
    }

    await this.authenticate();

    // Determine which URL to scrape
    const urlToScrape = organization.events_url || organization.website;
    
    if (!urlToScrape) {
      console.log('⚠️  No URL available to scrape');
      return [];
    }

    const html = await this.fetchHTML(urlToScrape);
    if (!html) {
      return [];
    }

    const $ = cheerio.load(html);
    const events = [];

    // Try multiple common event patterns
    const eventSelectors = [
      '.event, .event-item, .event-card, .calendar-event',
      'article[class*="event"]',
      'div[class*="event"]',
      '[itemtype*="Event"]',
      'li[class*="event"]',
      '.upcoming-event, .future-event'
    ];

    let foundEvents = false;

    for (const selector of eventSelectors) {
      const items = $(selector);
      
      if (items.length > 0) {
        console.log(`✅ Found ${items.length} potential events using selector: ${selector}`);
        foundEvents = true;

        items.each((i, element) => {
          try {
            const event = this.extractEventData($, element, organization);
            if (event && event.title && event.source_id) {
              events.push(event);
            }
          } catch (error) {
            // Skip individual parsing errors
          }
        });

        break;
      }
    }

    if (!foundEvents) {
      console.log('⚠️  No events found with common selectors');
      console.log('💡 This organization may need a custom scraper');
    }

    // Remove duplicates based on source_id
    const uniqueEvents = this.deduplicateEvents(events);

    console.log(`📊 Found ${uniqueEvents.length} unique events`);

    // Save events to PocketBase
    if (uniqueEvents.length > 0) {
      await this.saveEvents(uniqueEvents, organization.id);
    }

    // Update last_scraped timestamp
    await this.updateLastScraped(organization.id);

    return uniqueEvents;
  }

  /**
   * Extract event data from an HTML element
   */
  extractEventData($, element, organization) {
    const $el = $(element);

    // Extract title
    let title = 
      $el.find('h1, h2, h3, h4, .title, .event-title, [class*="title"]').first().text().trim() ||
      $el.find('a').first().text().trim() ||
      $el.text().split('\n')[0].trim();

    // Extract URL
    let url = $el.find('a').first().attr('href') || '';
    if (url && !url.startsWith('http')) {
      const baseUrl = new URL(organization.website);
      url = new URL(url, baseUrl.origin).href;
    }

    // Generate source_id for deduplication
    const source_id = this.generateSourceId(url, title, organization.id);

    // Extract date
    let dateText = 
      $el.find('.date, .event-date, [class*="date"], time').first().text().trim() ||
      $el.find('[datetime]').first().attr('datetime') ||
      '';

    const { startDate, endDate, startTime, endTime } = this.parseDateTime(dateText);

    // Extract description
    let description = 
      $el.find('.description, .event-description, p').first().text().trim() || '';

    if (description.length > 500) {
      description = description.substring(0, 497) + '...';
    }

    // Extract location
    let location = 
      $el.find('.location, .event-location, [class*="location"]').first().text().trim() || '';

    return {
      title: title.substring(0, 200),
      description: description,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      timezone: 'EST',
      location: location.substring(0, 200),
      url: url.substring(0, 500),
      organization: organization.id,
      source_id: source_id,
      event_type: '',
      registration_required: false,
      cost: '',
      target_audience: ''
    };
  }

  /**
   * Generate a unique source_id for deduplication
   */
  generateSourceId(url, title, orgId) {
    if (url) {
      // Use URL as source_id (most reliable)
      return url.substring(0, 500);
    }
    // Fallback: hash of title + org
    const hash = Buffer.from(`${orgId}-${title}`).toString('base64').substring(0, 100);
    return `generated-${hash}`;
  }

  /**
   * Parse date and time from text
   */
  parseDateTime(dateText) {
    const result = {
      startDate: null,
      endDate: null,
      startTime: '',
      endTime: ''
    };

    if (!dateText) return result;

    try {
      // Try ISO format first
      let date = new Date(dateText);
      if (!isNaN(date.getTime())) {
        result.startDate = date.toISOString();
        result.endDate = date.toISOString();
        return result;
      }

      // Try common US formats
      const patterns = [
        /(\w+)\s+(\d{1,2}),?\s+(\d{4})/i,
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
        /(\d{4})-(\d{2})-(\d{2})/
      ];

      for (const pattern of patterns) {
        const match = dateText.match(pattern);
        if (match) {
          date = new Date(dateText);
          if (!isNaN(date.getTime())) {
            result.startDate = date.toISOString();
            result.endDate = date.toISOString();
            return result;
          }
        }
      }

      // Extract time if present
      const timeMatch = dateText.match(/(\d{1,2}:\d{2}\s*[AP]M)/gi);
      if (timeMatch) {
        result.startTime = timeMatch[0] || '';
        result.endTime = timeMatch[1] || '';
      }

      // Try direct parsing as last resort
      date = new Date(dateText);
      if (!isNaN(date.getTime())) {
        result.startDate = date.toISOString();
        result.endDate = date.toISOString();
      }

    } catch (error) {
      console.warn(`⚠️  Date parsing error: ${error.message}`);
    }

    return result;
  }

  /**
   * Remove duplicate events based on source_id
   */
  deduplicateEvents(events) {
    const seen = new Set();
    return events.filter(event => {
      if (seen.has(event.source_id)) {
        return false;
      }
      seen.add(event.source_id);
      return true;
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SAVING EVENTS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Save events to PocketBase
   */
  async saveEvents(events, organizationId) {
    let saved = 0;
    let skipped = 0;

    for (const event of events) {
      try {
        // Check if event already exists by source_id
        const existing = await this.pb.collection('events').getList(1, 1, {
          filter: `source_id = "${event.source_id.replace(/"/g, '\\"')}"`
        });

        if (existing.items.length > 0) {
          skipped++;
          continue;
        }

        // Create new event
        await this.pb.collection('events').create({
          title: event.title,
          description: event.description,
          start_date: event.start_date,
          end_date: event.end_date,
          start_time: event.start_time,
          end_time: event.end_time,
          timezone: event.timezone,
          location: event.location,
          url: event.url,
          organization: organizationId,
          source_id: event.source_id,
          event_type: event.event_type,
          registration_required: event.registration_required,
          cost: event.cost,
          target_audience: event.target_audience
        });

        saved++;
      } catch (error) {
        console.error(`❌ Error saving event "${event.title}":`, error.message);
      }
    }

    console.log(`💾 Saved ${saved} new events, skipped ${skipped} duplicates`);
  }
}

module.exports = BaseScraper;
