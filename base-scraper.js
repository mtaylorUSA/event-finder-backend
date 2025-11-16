const axios = require('axios');
const cheerio = require('cheerio');
const PocketBase = require('pocketbase').default;

/**
 * Base Scraper Class
 * Provides core scraping functionality for any organization
 */
class BaseScraper {
  constructor() {
    this.pb = new PocketBase(process.env.POCKETBASE_URL);
    this.authenticated = false;
  }

  /**
   * Authenticate with PocketBase
   */
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

  /**
   * Fetch HTML content from a URL
   */
  async fetchHTML(url) {
    try {
      console.log(`📡 Fetching: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 15000 // 15 second timeout
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch ${url}:`, error.message);
      return null;
    }
  }

  /**
   * Generic event scraper - tries common patterns
   */
  async scrapeEvents(organization) {
    console.log(`\n📥 Scraping: ${organization.name}`);
    console.log(`────────────────────────────────────────`);

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
      // Common event containers
      '.event, .event-item, .event-card, .calendar-event',
      'article[class*="event"]',
      'div[class*="event"]',
      '[itemtype*="Event"]',
      // List items that might be events
      'li[class*="event"]',
      // Common date-based selectors
      '.upcoming-event, .future-event',
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
            if (event && event.title && event.start_date) {
              events.push(event);
            }
          } catch (error) {
            // Skip individual parsing errors
          }
        });

        break; // Stop after first successful pattern
      }
    }

    if (!foundEvents) {
      console.log('⚠️  No events found with common selectors');
      console.log('💡 This organization may need a custom scraper');
    }

    // Remove duplicates based on title and start_date
    const uniqueEvents = this.deduplicateEvents(events);

    console.log(`📊 Found ${uniqueEvents.length} unique events`);

    // Save events to PocketBase
    if (uniqueEvents.length > 0) {
      await this.saveEvents(uniqueEvents, organization.id);
    }

    return uniqueEvents;
  }

  /**
   * Extract event data from an element
   */
  extractEventData($, element, organization) {
    const $el = $(element);

    // Extract title - try multiple patterns
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

    // Extract date text - try multiple patterns
    let dateText = 
      $el.find('.date, .event-date, [class*="date"], time').first().text().trim() ||
      $el.find('[datetime]').first().attr('datetime') ||
      '';

    // Parse date and time
    const dateTimeInfo = this.parseDateAndTime(dateText);

    // Extract description
    let description = 
      $el.find('.description, .event-description, p').first().text().trim() ||
      '';

    // Limit description length
    if (description.length > 500) {
      description = description.substring(0, 497) + '...';
    }

    return {
      title: title.substring(0, 200), // Limit title length
      start_date: dateTimeInfo.start_date,
      end_date: dateTimeInfo.end_date, // Will be null if not found
      start_time: dateTimeInfo.start_time, // Will be empty if not found
      end_time: dateTimeInfo.end_time, // Will be empty if not found
      timezone: dateTimeInfo.timezone || 'EST', // Default to EST
      url: url.substring(0, 500), // Limit URL length
      description: description
    };
  }

  /**
   * Parse date and time information from text
   * Returns: { start_date, end_date, start_time, end_time, timezone }
   */
  parseDateAndTime(dateText) {
    if (!dateText) {
      return { start_date: null, end_date: null, start_time: '', end_time: '', timezone: '' };
    }

    const result = {
      start_date: null,
      end_date: null,
      start_time: '',
      end_time: '',
      timezone: ''
    };

    // Extract timezone if present
    const timezoneMatch = dateText.match(/(EST|EDT|PST|PDT|CST|CDT|MST|MDT|GMT|UTC)/i);
    if (timezoneMatch) {
      result.timezone = timezoneMatch[1].toUpperCase();
    }

    // Extract times (e.g., "2:00 PM", "14:00", "2:00 PM - 3:00 PM")
    const timeRangeMatch = dateText.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*(?:to|-)\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/i);
    if (timeRangeMatch) {
      result.start_time = timeRangeMatch[1].trim();
      result.end_time = timeRangeMatch[2].trim();
    } else {
      // Single time
      const singleTimeMatch = dateText.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/i);
      if (singleTimeMatch) {
        result.start_time = singleTimeMatch[1].trim();
      }
    }

    // Remove time and timezone info to isolate date
    let cleanDateText = dateText
      .replace(/\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?/gi, '') // Remove times
      .replace(/\s*(?:to|-)\s*/gi, ' ') // Remove separators
      .replace(/(EST|EDT|PST|PDT|CST|CDT|MST|MDT|GMT|UTC)/gi, '') // Remove timezone
      .replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\.?\s+/i, '') // Remove day of week
      .trim();

    // Try to parse the date
    const parsedDate = this.parseDate(cleanDateText);
    if (parsedDate) {
      result.start_date = parsedDate;
      // Note: We don't auto-fill end_date - leave it null unless explicitly found
    }

    return result;
  }

  /**
   * Parse date text and return ISO 8601 format for PocketBase
   */
  parseDate(dateText) {
    if (!dateText) return null;

    try {
      // Try parsing directly
      let date = new Date(dateText);
      
      // Check if valid
      if (!isNaN(date.getTime())) {
        // Return in ISO 8601 format: YYYY-MM-DDTHH:MM:SSZ
        return date.toISOString();
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Remove duplicate events
   */
  deduplicateEvents(events) {
    const seen = new Set();
    return events.filter(event => {
      const key = `${event.title}-${event.start_date}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Save events to PocketBase
   */
  async saveEvents(events, organizationId) {
    let saved = 0;
    let skipped = 0;
    let errors = 0;

    for (const event of events) {
      try {
        // Skip events without valid start_date
        if (!event.start_date) {
          console.log(`⚠️  Skipping "${event.title}" - no valid start date`);
          errors++;
          continue;
        }

        // Check if event already exists
        const existing = await this.pb.collection('events').getList(1, 1, {
          filter: `organization="${organizationId}" && title="${event.title.replace(/"/g, '\\"')}" && start_date="${event.start_date}"`
        });

        if (existing.items.length > 0) {
          skipped++;
          continue;
        }

        // Prepare event data - only include fields that have values
        const eventData = {
          organization: organizationId,
          title: event.title,
          start_date: event.start_date,
          url: event.url || '',
          description: event.description || '',
          timezone: event.timezone || 'EST'
        };

        // Only add end_date if it exists (don't default to start_date)
        if (event.end_date) {
          eventData.end_date = event.end_date;
        }

        // Only add times if they exist
        if (event.start_time) {
          eventData.start_time = event.start_time;
        }
        if (event.end_time) {
          eventData.end_time = event.end_time;
        }

        // Create new event
        await this.pb.collection('events').create(eventData);

        saved++;
      } catch (error) {
        console.error(`❌ Error saving event "${event.title}":`, error.message);
        if (error.data) {
          console.error('   Error details:', JSON.stringify(error.data));
        }
        errors++;
      }
    }

    console.log(`💾 Saved ${saved} new events, skipped ${skipped} duplicates, ${errors} errors`);
  }

  /**
   * Get organization from PocketBase by ID
   */
  async getOrganization(orgId) {
    await this.authenticate();
    return await this.pb.collection('organizations').getOne(orgId);
  }

  /**
   * Get all organizations from PocketBase
   */
  async getAllOrganizations() {
    await this.authenticate();
    const result = await this.pb.collection('organizations').getList(1, 500, {
      sort: 'name'
    });
    return result.items;
  }
}

module.exports = BaseScraper;
