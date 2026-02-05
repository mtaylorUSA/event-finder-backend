/**
 * suggest-organizations.js
 *
 * AI-powered organization suggestion script
 * - Analyzes existing organizations to suggest similar ones
 * - Checks for duplicates by source_id (domain) before saving
 * - Saves new suggestions to organizations collection with status = "Nominated (Pending Mission Review)"
 * - NOW SCANS suggested orgs with org-scanner.js for real TOU/tech flags
 * - Saves POC contacts if found
 *
 * Usage: node suggest-organizations.js
 *
 * Last Updated: 2026-01-31
 * - NOW IMPORTS org-scanner.js for actual scanning (not AI guessing)
 * - After AI suggests, scans each org for real TOU/tech flags
 * - Saves contacts with smart POC gathering
 */

require('dotenv').config();

// Import org-scanner for actual scanning after AI suggestions
const scanner = require('./org-scanner');

// ============================================================================
// CONFIGURATION
// ============================================================================

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

// OpenAI model for suggestions
const OPENAI_MODEL = 'gpt-4o-mini';

// Maximum suggestions per run
const MAX_SUGGESTIONS = 10;

// ============================================================================
// MAIN FUNCTION (with dynamic import for Node.js v18+)
// ============================================================================

async function main() {
  // Dynamic import for node-fetch (Node.js v18+ compatible)
  const fetch = (await import('node-fetch')).default;

  let authToken = null;

  // ═══════════════════════════════════════════════════════════════════════════
  // POCKETBASE AUTHENTICATION
  // ═══════════════════════════════════════════════════════════════════════════

  async function authenticate() {
    if (authToken) return authToken;

    console.log('🔐 Authenticating with PocketBase...');

    try {
      const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: POCKETBASE_ADMIN_EMAIL,
          password: POCKETBASE_ADMIN_PASSWORD
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Authentication failed: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      authToken = data.token;
      console.log('✅ Authenticated successfully\n');
      return authToken;
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // POCKETBASE DATA FETCHING
  // ═══════════════════════════════════════════════════════════════════════════

  async function fetchAllOrganizations() {
    const token = await authenticate();

    console.log('📥 Fetching all organizations from PocketBase...\n');

    try {
      const response = await fetch(
        `${POCKETBASE_URL}/api/collections/organizations/records?perPage=500`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch organizations`);
      }

      const data = await response.json();
      const organizations = data.items || [];

      // Count by status
      const statusCounts = {};
      organizations.forEach(org => {
        const status = org.status || 'Unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      console.log(`   ✅ Total organizations: ${organizations.length}`);
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`      - ${status}: ${count}`);
      });
      console.log('');

      return organizations;
    } catch (error) {
      console.error(`❌ Error fetching organizations:`, error.message);
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DUPLICATE CHECKING
  // ═══════════════════════════════════════════════════════════════════════════

  function extractDomain(url) {
    if (!url) return '';
    try {
      // Remove protocol and www
      let domain = url.toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '');
      // Get just the domain part (before any path)
      domain = domain.split('/')[0];
      return domain;
    } catch (e) {
      return '';
    }
  }

  function normalizeString(str) {
    if (!str) return '';
    return str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  }

  function isDuplicate(newOrg, existingOrgs) {
    const newDomain = extractDomain(newOrg.website);
    const newName = normalizeString(newOrg.name);

    for (const existing of existingOrgs) {
      // Check source_id (domain) match - primary dedup method
      if (newDomain && existing.source_id && newDomain === existing.source_id) {
        return { isDupe: true, reason: `Domain matches existing: "${existing.name}" (${existing.source_id})` };
      }

      // Check website domain match
      const existingDomain = extractDomain(existing.website);
      if (newDomain && existingDomain && newDomain === existingDomain) {
        return { isDupe: true, reason: `Website domain matches: "${existing.name}"` };
      }

      // Check name match
      const existingName = normalizeString(existing.name);
      if (newName && existingName && newName === existingName) {
        return { isDupe: true, reason: `Name matches: "${existing.name}"` };
      }

      // Check partial name match (one contains the other)
      if (newName && existingName) {
        if (newName.includes(existingName) || existingName.includes(newName)) {
          // Only flag if significant overlap (more than 10 chars)
          if (Math.min(newName.length, existingName.length) > 10) {
            return { isDupe: true, reason: `Name similar to: "${existing.name}"` };
          }
        }
      }
    }

    return { isDupe: false, reason: null };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // OPENAI SUGGESTION GENERATION
  // ═══════════════════════════════════════════════════════════════════════════

  async function generateSuggestions(existingOrgs) {
    console.log('🤖 Asking OpenAI for organization suggestions...\n');

    // Filter to only approved/active orgs for context (exclude rejected)
    const approvedOrgs = existingOrgs.filter(org => 
      org.status !== 'Mission Rejected' && org.status !== 'Permission Rejected'
    );

    // Build context from existing organizations
    const orgContext = approvedOrgs.map(org => ({
      name: org.name,
      type: org.org_type || 'Unknown',
      description: org.description || ''
    }));

    const prompt = `You are an expert in national security, defense, and intelligence community organizations.

EXISTING ORGANIZATIONS IN DATABASE:
${JSON.stringify(orgContext, null, 2)}

TASK:
Suggest ${MAX_SUGGESTIONS} NEW organizations that would be good additions to this national security events database. Focus on:
- Government agencies (federal, state)
- Nonprofits and think tanks
- Academic institutions with national security programs
- Professional associations in defense/intel/cyber

DO NOT SUGGEST:
- For-profit companies (no contractors, no tech companies like OpenAI, Microsoft, etc.)
- Organizations already in the list above
- Foreign government agencies
- Organizations without public events

For each suggestion, provide:
1. name - Official organization name
2. website - Official website URL
3. description - Brief mission description (max 200 chars)
4. org_type - One of: Government, Nonprofit, Think Tank, Academic, Professional Association
5. events_url - Direct URL to their events page (if findable, otherwise empty)
6. tou_analysis - Brief analysis of whether their TOU allows scraping (check for: prohibited, robots.txt restrictions, API available, RSS feeds, or no restrictions mentioned)
7. tou_flag - true if TOU MAY prohibit scraping, false if likely OK or unclear
8. reasoning - Why this org fits the national security events mission

RESPOND WITH VALID JSON ONLY - an array of objects with the fields above. No markdown, no explanation, just the JSON array.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that responds only with valid JSON. No markdown code blocks, no explanations, just raw JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();

      // Parse JSON response
      let suggestions;
      try {
        // Remove markdown code blocks if present
        let cleanContent = content;
        if (cleanContent.startsWith('```json')) {
          cleanContent = cleanContent.slice(7);
        }
        if (cleanContent.startsWith('```')) {
          cleanContent = cleanContent.slice(3);
        }
        if (cleanContent.endsWith('```')) {
          cleanContent = cleanContent.slice(0, -3);
        }
        suggestions = JSON.parse(cleanContent.trim());
      } catch (parseError) {
        console.error('❌ Failed to parse OpenAI response as JSON');
        console.error('Raw response:', content);
        throw new Error('Invalid JSON response from OpenAI');
      }

      console.log(`✅ OpenAI suggested ${suggestions.length} organizations\n`);
      return suggestions;

    } catch (error) {
      console.error('❌ OpenAI API error:', error.message);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SAVE SUGGESTIONS TO POCKETBASE
  // ═══════════════════════════════════════════════════════════════════════════

  async function saveSuggestion(suggestion) {
    const token = await authenticate();

    // Extract domain for source_id
    const sourceId = extractDomain(suggestion.website);

    const record = {
      name: suggestion.name || '',
      website: suggestion.website || '',
      description: (suggestion.description || '').substring(0, 2000),
      org_type: suggestion.org_type || '',
      events_url: suggestion.events_url || '',
      source_id: sourceId,
      status: 'Nominated (Pending Mission Review)',
      discovered_date: new Date().toISOString(),
      discovery_method: 'profile-based',  // NEW: Track how org was discovered
      ai_reasoning: (suggestion.reasoning || '').substring(0, 2000),
      similarity_score: suggestion.similarity_score || 75,
      // NOTE: tou_flag will be updated by org-scanner with actual scan results
      tou_flag: false,  // Start false, scanner will set true if found
      tou_notes: '',    // Scanner will populate with real findings
      scraping_enabled: false
    };

    try {
      const response = await fetch(
        `${POCKETBASE_URL}/api/collections/organizations/records`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(record)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ Failed to save "${suggestion.name}":`, error.message);
      return null;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN EXECUTION
  // ═══════════════════════════════════════════════════════════════════════════

  console.log('════════════════════════════════════════');
  console.log('🔍 Organization Suggestion Script');
  console.log('    (AI-Powered with Dedupe Logic)');
  console.log('════════════════════════════════════════\n');

  try {
    // Initialize org-scanner for scanning suggested orgs
    console.log('🔧 Initializing org-scanner...');
    await scanner.init();
    console.log('✅ Scanner ready\n');

    // Step 1: Fetch all existing organizations
    const existingOrgs = await fetchAllOrganizations();

    // Filter to approved/active orgs for AI context
    const approvedOrgs = existingOrgs.filter(org => 
      org.status !== 'Rejected by Mission' && 
      org.status !== 'Rejected by Org' &&
      org.status !== 'Nominated (Pending Mission Review)'
    );

    if (approvedOrgs.length === 0) {
      console.log('⚠️  No approved organizations found. Add some manually first.');
      console.log('   The AI needs examples to suggest similar organizations.\n');
      return;
    }

    // Step 2: Generate suggestions from OpenAI
    const suggestions = await generateSuggestions(existingOrgs);

    // Step 3: Filter out duplicates and save
    console.log('🔎 Checking for duplicates and saving...\n');
    console.log('────────────────────────────────────────');

    const stats = {
      saved: 0,
      duplicates: 0,
      errors: 0
    };

    for (const suggestion of suggestions) {
      const dupeCheck = isDuplicate(suggestion, existingOrgs);

      if (dupeCheck.isDupe) {
        console.log(`⏭️  SKIP: "${suggestion.name}"`);
        console.log(`   └─ Duplicate: ${dupeCheck.reason}`);
        stats.duplicates++;
        continue;
      }

      const saved = await saveSuggestion(suggestion);

      if (saved) {
        console.log(`✅ SAVED: "${suggestion.name}"`);
        console.log(`   └─ Type: ${suggestion.org_type}`);
        console.log(`   └─ Status: Nominated (Pending Mission Review)`);
        stats.saved++;

        // ───────────────────────────────────────────────────────────────────
        // NEW: Scan the org with org-scanner.js for real TOU/tech flags
        // ───────────────────────────────────────────────────────────────────
        console.log(`   🔍 Scanning for TOU/tech issues...`);
        
        try {
          const scanResult = await scanner.scanOrganization({
            id: saved.id,
            name: saved.name,
            website: saved.website,
            source_id: saved.source_id
          }, { skipAI: true });  // Skip AI since we already have AI analysis
          
          // Report scan findings
          if (scanResult.touFlag) {
            console.log(`   └─ ⚠️ TOU restrictions found: ${scanResult.touUrl || 'Multiple pages'}`);
          }
          if (scanResult.techBlockFlag) {
            console.log(`   └─ ⛔ Tech block detected (403/401)`);
          }
          if (scanResult.techRenderingFlag) {
            console.log(`   └─ ⚙️ JS rendering detected`);
          }
          if (scanResult.pocInfo?.email) {
            console.log(`   └─ 👤 POC found: ${scanResult.pocInfo.email}`);
          }
          if (!scanResult.touFlag && !scanResult.techBlockFlag && !scanResult.techRenderingFlag) {
            console.log(`   └─ ✅ No restrictions detected`);
          }
          
        } catch (scanError) {
          console.log(`   └─ ⚠️ Scan failed: ${scanError.message}`);
        }

        // Add to existingOrgs to prevent duplicates within this batch
        existingOrgs.push({
          name: suggestion.name,
          website: suggestion.website,
          source_id: extractDomain(suggestion.website)
        });
      } else {
        stats.errors++;
      }
    }

    // Step 4: Print summary
    console.log('\n────────────────────────────────────────');
    console.log('📊 SUMMARY');
    console.log('────────────────────────────────────────');
    console.log(`   ✅ Saved: ${stats.saved}`);
    console.log(`   ⏭️  Duplicates skipped: ${stats.duplicates}`);
    console.log(`   ❌ Errors: ${stats.errors}`);
    console.log('');
    console.log('════════════════════════════════════════');
    console.log('✅ Suggestion script completed!');
    console.log('════════════════════════════════════════\n');

    if (stats.saved > 0) {
      console.log('📋 NEXT STEPS:');
      console.log('   1. Open Admin Interface');
      console.log('   2. Go to Organizations tab');
      console.log('   3. Filter by status = "Nominated (Pending Mission Review)"');
      console.log('   4. Review TOU/Tech flags (set by actual scan, not AI guess)');
      console.log('   5. Approve or reject for mission fit');
      console.log('   NOTE: POC contacts have been auto-saved if found');
      console.log('');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
