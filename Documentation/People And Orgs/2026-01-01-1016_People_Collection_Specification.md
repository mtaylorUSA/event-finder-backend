# DOCUMENT NAME: 2025-01-01_People_Collection_Specification.md


---


# INTELLECTUAL PROPERTY NOTICE: The contents of this document and everything related to this project is subject to my copyright and may not be used to train AI models or for any purpose.


---


# DOCUMENT OVERVIEW
     * Purpose: Specification for a new "people" collection to track speakers, event participants, organization officials, and personal contacts
     * Status: DRAFT - For Future Implementation
     * Created: 2025-01-01
     * Related To: Event Finder Project


---


# FEATURE SUMMARY
     * The People Intelligence System will:
          ** Track individuals across events and organizations
          ** Automatically extract speaker/participant info from event scrapes
          ** Suggest updates when new information is found
          ** Import and sync with Outlook contacts
          ** Use AI to extract expertise topics and regions from bios
          ** Map relationships between people based on event co-participation


---


# COLLECTIONS SCHEMA

     * Collection: `people`
          ** Core Fields:
               *** `id`: Auto-generated unique identifier
               *** `name`: Text (required) - Full name
               *** `email`: Email - Contact email
               *** `phone`: Text - Phone number
               *** `title`: Text - Current job title
               *** `bio`: Text (long) - Biography
               *** `photo_url`: URL - Link to headshot image
               *** `linkedin_url`: URL - LinkedIn profile
               *** `twitter_handle`: Text - Twitter/X handle

          ** Expertise Fields (AI-populated):
               *** `expertise_topics`: JSON array - e.g., ["AI", "Cybersecurity", "Nuclear"]
               *** `expertise_regions`: JSON array - e.g., ["Indo-Pacific", "Middle East", "Europe"]

          ** Classification Fields:
               *** `category`: Select - Government / Industry / Academic / Think Tank / Military / Media / Other
               *** `category_confidence`: Text - How category was determined (AI-suggested / Manual / Inferred from org)

          ** Personal/CRM Fields:
               *** `personal_notes`: Text (long) - Your private notes (e.g., "Met at CSIS event 2024")
               *** `is_personal_contact`: Boolean - Imported from Outlook vs scraped
               *** `outlook_sync_id`: Text - ID for syncing with Outlook (if applicable)

          ** Data Management Fields:
               *** `source_url`: URL - Where we first found this person
               *** `source_type`: Select - Manual / Outlook Import / Event Scrape
               *** `last_scraped`: DateTime - Last time data was refreshed from scrape
               *** `update_suggestions`: JSON - Pending changes awaiting review
               *** `created`: DateTime - Auto
               *** `updated`: DateTime - Auto

     * Collection: `person_organization_links`
          ** Purpose: Many-to-many relationship between people and organizations
          ** Fields:
               *** `id`: Auto-generated
               *** `person`: Relation to `people` collection
               *** `organization`: Relation to `organizations` collection
               *** `relationship_type`: Select - Works At / Fellow / Board Member / Advisor / Spoke At / Affiliated
               *** `title_at_org`: Text - Their title at this specific organization
               *** `is_current`: Boolean - Currently active relationship
               *** `start_date`: Date - When relationship began (if known)
               *** `end_date`: Date - When relationship ended (if known)
               *** `source`: Select - Manual / Scraped / Outlook Import
               *** `source_url`: URL - Where this relationship was found
               *** `created`: DateTime - Auto
               *** `updated`: DateTime - Auto

     * Collection: `person_event_links`
          ** Purpose: Track who participated in which events
          ** Fields:
               *** `id`: Auto-generated
               *** `person`: Relation to `people` collection
               *** `event`: Relation to `events` collection
               *** `role`: Select - Keynote Speaker / Speaker / Panelist / Moderator / Presenter / Attendee / Host
               *** `session_title`: Text - Specific session/panel name (if applicable)
               *** `source`: Select - Manual / Scraped
               *** `source_url`: URL - Where this was found
               *** `created`: DateTime - Auto

     * Collection: `person_connections`
          ** Purpose: Track relationships between people (co-panelists, colleagues, etc.)
          ** Fields:
               *** `id`: Auto-generated
               *** `person_a`: Relation to `people` collection
               *** `person_b`: Relation to `people` collection
               *** `connection_type`: Select - Co-Panelist / Co-Author / Colleague / Same Organization
               *** `connection_strength`: Number - Count of shared events/activities
               *** `shared_events`: JSON array - List of event IDs where they appeared together
               *** `source`: Select - Auto-calculated / Manual
               *** `created`: DateTime - Auto
               *** `updated`: DateTime - Auto


---


# AUTOMATION WORKFLOWS

     * Workflow 1: Extract People from Event Scrapes
          ** Trigger: When an event is scraped that includes speaker information
          ** Steps:
               *** 1. Parse speaker/participant information from event page
               *** 2. Extract: Name, Title, Organization, Bio, Photo URL
               *** 3. For each person found:
                    **** a. Search existing `people` collection for match (by name + organization)
                    **** b. If NO MATCH: Create new person record, link to event and organization
                    **** c. If MATCH FOUND: Compare scraped data with existing data
                         ***** If different: Add to `update_suggestions` for human review
                         ***** If same: Just add event link
               *** 4. Create `person_event_links` record
               *** 5. Create/update `person_organization_links` record

     * Workflow 2: AI Expertise Extraction
          ** Trigger: When a person has a bio but empty expertise fields
          ** Steps:
               *** 1. Send bio text to AI for analysis
               *** 2. Extract topics of expertise (e.g., "cybersecurity", "nuclear policy", "AI governance")
               *** 3. Extract regional expertise (e.g., "China", "Indo-Pacific", "Russia")
               *** 4. Suggest category based on title and organization
               *** 5. Save to person record

     * Workflow 3: Calculate Person Connections
          ** Trigger: Periodic batch job (weekly) or on-demand
          ** Steps:
               *** 1. Query all `person_event_links`
               *** 2. Find people who appeared at same events
               *** 3. Calculate connection strength (number of shared events)
               *** 4. Create/update `person_connections` records

     * Workflow 4: Outlook Import
          ** Trigger: Manual (user uploads Outlook CSV export)
          ** Steps:
               *** 1. Parse CSV file
               *** 2. Map Outlook fields to people fields:
                    **** Full Name → `name`
                    **** Email → `email`
                    **** Phone → `phone`
                    **** Company → Create `person_organization_links`
                    **** Job Title → `title`
                    **** Notes → `personal_notes`
               *** 3. Check for duplicates (by email, then by name)
               *** 4. If duplicate found: Merge data, flag for review
               *** 5. If new: Create record with `source_type` = "Outlook Import"
               *** 6. Set `is_personal_contact` = true

     * Workflow 5: Update Suggestions Review
          ** Trigger: User opens Admin Interface or dedicated review page
          ** Display: List of people with pending `update_suggestions`
          ** For each suggestion, show:
               *** Current value vs. New scraped value
               *** Source of new data
               *** Options: Accept / Reject / Accept All / Reject All


---


# UPDATE SUGGESTIONS DATA STRUCTURE

     * The `update_suggestions` field stores pending changes as JSON:
          ** Example:
```json
{
  "pending_updates": [
    {
      "field": "title",
      "current_value": "Senior Fellow",
      "suggested_value": "Director",
      "source_url": "https://csis.org/events/cyber-summit-2025",
      "scraped_date": "2025-01-15",
      "event_id": "abc123"
    },
    {
      "field": "bio",
      "current_value": "Jane Smith is a Senior Fellow...",
      "suggested_value": "Jane Smith is the Director of Cyber Policy...",
      "source_url": "https://csis.org/events/cyber-summit-2025",
      "scraped_date": "2025-01-15",
      "event_id": "abc123"
    }
  ],
  "last_reviewed": null,
  "review_count": 0
}
```


---


# DUPLICATE DETECTION STRATEGY

     * Matching Priority:
          ** 1. Email (exact match) - Highest confidence
          ** 2. Name + Organization (fuzzy match) - High confidence
          ** 3. Name only (fuzzy match) - Low confidence, flag for review

     * Fuzzy Name Matching Rules:
          ** Normalize: "Dr. Jane A. Smith" → "jane smith"
          ** Handle variations: "Bob" = "Robert", "Bill" = "William"
          ** Compare using string similarity score (>85% = likely match)

     * When Duplicate Found:
          ** If confidence HIGH: Auto-merge, log action
          ** If confidence MEDIUM: Create record, flag for review
          ** If confidence LOW: Create separate record, suggest possible duplicate


---


# ADMIN INTERFACE FEATURES

     * People List View:
          ** Columns: Name, Title, Organization(s), Category, # Events, Last Updated
          ** Filters: Category, Organization, Has Updates Pending, Source Type
          ** Search: By name, email, organization, expertise

     * Person Detail View:
          ** Profile section: Photo, name, title, bio, contact info
          ** Organizations tab: List of linked orgs with relationship type
          ** Events tab: Timeline of events participated in
          ** Connections tab: Other people they've appeared with
          ** Notes tab: Personal notes field
          ** Update Suggestions tab: Pending changes to review

     * Bulk Actions:
          ** Import from Outlook CSV
          ** Export to CSV
          ** Batch approve/reject update suggestions
          ** Recalculate expertise (send bios to AI)
          ** Recalculate connections


---


# IMPLEMENTATION PHASES

     * Phase 1: Basic Collection (MVP)
          ** Create `people` collection with core fields
          ** Create `person_organization_links` collection
          ** Create `person_event_links` collection
          ** Manual data entry via Admin Interface
          ** Outlook CSV import script

     * Phase 2: Scraper Integration
          ** Modify event scrapers to extract speaker information
          ** Implement person matching/deduplication logic
          ** Auto-create person records from scrapes
          ** Implement `update_suggestions` workflow

     * Phase 3: AI Enrichment
          ** Implement expertise extraction from bios
          ** Implement category auto-suggestion
          ** Batch processing for existing bios

     * Phase 4: Connections & Network
          ** Create `person_connections` collection
          ** Implement connection calculation job
          ** Add connections visualization to Admin Interface

     * Phase 5: Advanced Features (Future)
          ** Outlook sync (two-way)
          ** LinkedIn data enrichment
          ** Network visualization graph
          ** "People you might want to meet" suggestions based on expertise overlap


---


# PRIVACY & DATA HANDLING

     * Public vs. Private Data:
          ** `source_type` field distinguishes data origin
          ** Personal notes are NEVER exposed outside Admin Interface
          ** Scraped data comes from public sources only

     * Data Retention:
          ** Respect organization TOU flags
          ** If person is primarily associated with a TOU-restricted org, flag their record
          ** Allow manual override for publicly available information

     * Export Controls:
          ** Ability to export with or without personal notes
          ** Ability to export only personal contacts vs. all people


---


# RELATED SCRIPTS TO CREATE

     * `import-outlook-contacts.js` - Import CSV export from Outlook
     * `extract-speakers-from-events.js` - Batch process existing events for speaker info
     * `calculate-person-connections.js` - Build connections based on shared events
     * `extract-expertise.js` - AI analysis of bios for topics/regions
     * `review-update-suggestions.js` - CLI tool to review pending updates
     * `deduplicate-people.js` - Find and merge duplicate records


---


# QUESTIONS FOR FUTURE CONSIDERATION

     * Q1: Should we track "last contacted" date for CRM-like functionality?
     * Q2: Should we add a "favorites" or "priority contacts" flag?
     * Q3: Should connections also track "introduced by" for networking history?
     * Q4: Should we add calendar integration to see upcoming events with people you know?
     * Q5: How many Outlook contacts do you have? (Affects import script design)


---


# REVISION HISTORY
     * 2025-01-01: Initial specification created based on discussion with project owner


