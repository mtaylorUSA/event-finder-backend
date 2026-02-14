/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PHONE NUMBER IMPROVEMENT PATCH FOR org-scanner.js
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * DATE: 2026-02-11
 * PURPOSE: Improve phone number capture in Claude AI contact discovery
 * 
 * THIS FILE CONTAINS TWO REPLACEMENT SECTIONS:
 * 
 *   SECTION 1: Replace gatherPOCViaClaude() — lines 3027–3246
 *              (Improved Claude prompt that prioritizes phone numbers)
 * 
 *   SECTION 2: Replace SCAN RESULTS display — lines 5553–5563
 *              (Shows name, phone, and title alongside email)
 * 
 * HOW TO APPLY:
 *   1. Open org-scanner.js in your editor
 *   2. Find gatherPOCViaClaude() at line 3027
 *   3. Select from line 3027 through line 3246 (the closing brace + blank line)
 *   4. Paste SECTION 1 below as the replacement
 *   5. Find the SCAN RESULTS display at line 5553 (the "// Updated POC display" comment)
 *   6. Select from line 5553 through line 5563 (the closing brace of the else block)
 *   7. Paste SECTION 2 below as the replacement
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: REPLACEMENT gatherPOCViaClaude()
// 
// REPLACE: Lines 3027–3246 in org-scanner.js
// (from "async function gatherPOCViaClaude" through the closing brace "}")
//
// CHANGES MADE:
//   - Added system prompt that emphasizes phone numbers as a primary objective
//   - Rewrote user prompt to explicitly instruct Claude to search for phone numbers
//   - Added realistic phone example in JSON format (was "number or empty")
//   - Added instruction to search "[org] phone number" and "[org] main office"
//   - Added instruction to include org's main switchboard number on every contact
//   - Console output now shows phone numbers when found
// ═══════════════════════════════════════════════════════════════════════════════

async function gatherPOCViaClaude(orgName, domain, options = {}) {
    if (!ANTHROPIC_API_KEY) {
        console.log('      ⚠️ Anthropic API key not configured - skipping Claude search');
        return [];
    }
    
    const shortName = extractShortOrgName(orgName);
    if (shortName !== orgName) {
        console.log(`      📛 Search name: "${shortName}" (from "${orgName.substring(0, 50)}${orgName.length > 50 ? '...' : ''}")`);
    }
    
    console.log('      🤖 Searching for contacts via Claude AI + web search...');
    
    // ─────────────────────────────────────────────────────────────────────────
    // System prompt: Sets expectations for phone number priority
    // ─────────────────────────────────────────────────────────────────────────
    const systemPrompt = `You are a research assistant helping find professional contact information for organizations. Your task is to find email addresses AND phone numbers for professional outreach.

IMPORTANT - PHONE NUMBERS ARE A TOP PRIORITY:
- Always search specifically for the organization's main office phone number
- Search for "[org name] phone number" and "[org name] contact us" to find phone numbers
- Include the organization's main switchboard/office phone on EVERY contact if you find it
- Check the organization's Contact Us page, About page, and footer for phone numbers
- Phone numbers are just as important as email addresses
- US phone format examples: (202) 555-1234, 202-555-1234, +1-202-555-1234

Return ONLY a valid JSON array. No markdown, no explanation, no extra text.
If you find no contacts at all, return: []`;

    // ─────────────────────────────────────────────────────────────────────────
    // User prompt: Explicit instructions for both email AND phone discovery
    // ─────────────────────────────────────────────────────────────────────────
    const domainHint = domain ? ` Their website is ${domain}.` : '';
    const userMessage = `Find contact information for ${shortName}.${domainHint}

I need BOTH email addresses AND phone numbers for professional outreach about event partnerships.

STEP 1 - Find the organization's main phone number:
- Search for "${shortName} phone number" or "${shortName} contact us"
- Look for their main office, switchboard, or general phone number
- This number should be included on every contact you return

STEP 2 - Find key contacts:
- Events team (events@, programs@, conferences@)
- Media/Communications (media@, press@, communications@)
- General inquiries (info@, contact@)
- Legal/Permissions (legal@, permissions@)
- Leadership with direct phone numbers if available

STEP 3 - For each contact, include ALL available info.

Return a JSON array where each contact has:
{"name": "person or department name", "email": "address", "phone": "(202) 555-1234 or empty string", "title": "role or department"}

IMPORTANT: If you find the org's main phone number, include it in the "phone" field for ALL contacts — even department emails like info@ or events@. An email with a phone number attached is far more valuable than an email alone.`;

    try {
        const response = await fetchModule('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 1500,
                system: systemPrompt,
                tools: [{
                    type: 'web_search_20250305',
                    name: 'web_search'
                }],
                messages: [{
                    role: 'user',
                    content: userMessage
                }]
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.log(`      ⚠️ Claude API error (${response.status}): ${JSON.stringify(errorData.error || errorData).substring(0, 200)}`);
            return [];
        }
        
        const data = await response.json();
        
        // Extract text from response (may contain multiple content blocks)
        const textBlocks = (data.content || [])
            .filter(block => block.type === 'text')
            .map(block => block.text);
        
        const fullText = textBlocks.join('\n');
        
        if (!fullText.trim()) {
            console.log('      ⚠️ Claude returned no text content');
            return [];
        }
        
        // Parse JSON from response — handle markdown fences and extra text
        let contacts = [];
        try {
            // Try to find JSON array in the response
            const jsonMatch = fullText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                contacts = JSON.parse(jsonMatch[0]);
            } else {
                console.log('      ⚠️ No JSON array found in Claude response');
                console.log(`      📝 Raw response: ${fullText.substring(0, 300)}...`);
                return [];
            }
        } catch (parseError) {
            console.log(`      ⚠️ Failed to parse Claude response as JSON: ${parseError.message}`);
            console.log(`      📝 Raw response: ${fullText.substring(0, 300)}...`);
            return [];
        }
        
        if (!Array.isArray(contacts) || contacts.length === 0) {
            console.log('      ℹ️ Claude found no contacts for this organization');
            return [];
        }
        
        console.log(`      📋 Claude found ${contacts.length} potential contact(s) — validating...`);
        
        // ─────────────────────────────────────────────────────────────────
        // Validate and format contacts (same rules as before)
        // ─────────────────────────────────────────────────────────────────
        
        // Build accepted domains (same logic as Google function)
        const acceptedDomains = new Set();
        if (domain) {
            acceptedDomains.add(getBaseDomain(domain));
        }
        if (options.parentOrgWebsite) {
            try {
                const parentDomain = new URL(options.parentOrgWebsite).hostname.replace(/^www\./, '');
                acceptedDomains.add(getBaseDomain(parentDomain));
            } catch (e) { /* ignore */ }
        }
        
        const validatedContacts = [];
        const seenEmails = new Set();
        
        // ─────────────────────────────────────────────────────────────────
        // NEW: Extract org-wide phone from any contact that has one
        // If Claude found the org's main phone, propagate it to all contacts
        // ─────────────────────────────────────────────────────────────────
        let orgPhone = '';
        for (const contact of contacts) {
            const phone = (contact.phone || '').trim();
            if (phone && phone.length >= 10) {
                orgPhone = phone;
                break;  // Use the first valid phone found
            }
        }
        if (orgPhone) {
            console.log(`      📞 Org phone found: ${orgPhone} — will apply to all contacts`);
        }
        
        for (const contact of contacts) {
            // Must have an email
            if (!contact.email || !contact.email.includes('@')) {
                // Log contacts with phone but no email (still useful info)
                if (contact.phone && contact.name) {
                    console.log(`      ℹ️ Skipping (no email): ${contact.name} - ${contact.phone}`);
                }
                continue;
            }
            
            const emailLower = contact.email.toLowerCase().trim();
            
            // Skip duplicates
            if (seenEmails.has(emailLower)) continue;
            
            // Skip obvious junk
            if (emailLower.includes('example.com') || emailLower.includes('domain.com')) continue;
            
            // ── Domain validation (same order as before) ──
            const emailDomain = emailLower.split('@')[1];
            const baseDomain = getBaseDomain(emailDomain);
            let isValid = false;
            let validationReason = '';
            
            // Check 1: Accepted domain match
            if (acceptedDomains.has(baseDomain)) {
                isValid = true;
                validationReason = 'domain_match';
            }
            
            // Check 2: Org name in domain
            if (!isValid && shortName) {
                const nameAsLower = shortName.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (nameAsLower.length >= 3 && baseDomain.includes(nameAsLower)) {
                    isValid = true;
                    validationReason = 'name_in_domain';
                }
            }
            
            // Check 3: Blacklist (only if not matched to org)
            if (!isValid && isBlacklistedEmailDomain(contact.email)) {
                console.log(`      ⏭️ Skipping blacklisted: ${contact.email}`);
                continue;
            }
            
            // Check 4: Personal email (gmail etc.) - allow
            if (!isValid && isPersonalEmailDomain(contact.email)) {
                isValid = true;
                validationReason = 'personal_email';
            }
            
            // Check 5: Claude found it via web search — trust it if domain looks reasonable
            if (!isValid) {
                const orgWords = shortName.toLowerCase().split(/\s+/).filter(w => w.length >= 4);
                const domainMatchesOrgWord = orgWords.some(word => baseDomain.includes(word));
                if (domainMatchesOrgWord) {
                    isValid = true;
                    validationReason = 'org_word_in_domain';
                }
            }
            
            // Check 6: If still not validated, reject
            if (!isValid) {
                console.log(`      ❌ Rejected (unrelated domain): ${contact.email}`);
                continue;
            }
            
            seenEmails.add(emailLower);
            
            // Auto-categorize by email prefix (reuse existing logic)
            const emailType = detectEmailType(contact.email);
            const contactType = mapEmailTypeToContactType(emailType);
            
            // ── Phone: use contact's own phone, or fall back to org-wide phone ──
            const contactPhone = (contact.phone || '').trim();
            const finalPhone = contactPhone.length >= 10 ? contactPhone : orgPhone;
            
            const validated = {
                email: contact.email.trim(),
                name: (contact.name || '').trim(),
                title: (contact.title || '').trim(),
                phone: finalPhone,
                source: 'claude_web_search',
                contactType: contactType,
                categoryType: emailType,
                validationReason: validationReason
            };
            
            validatedContacts.push(validated);
            const titleStr = validated.title ? ` (${validated.title})` : '';
            const nameStr = validated.name ? ` - ${validated.name}` : '';
            const phoneStr = validated.phone ? ` 📞 ${validated.phone}` : '';
            console.log(`      ✅ Found ${emailType}: ${validated.email}${nameStr}${titleStr}${phoneStr} (${validationReason})`);
        }
        
        // Track usage for logging
        const usage = data.usage || {};
        const inputTokens = usage.input_tokens || 0;
        const outputTokens = usage.output_tokens || 0;
        const phonesFound = validatedContacts.filter(c => c.phone).length;
        console.log(`      📊 Found ${validatedContacts.length} validated contacts via Claude (${phonesFound} with phone numbers)`);
        console.log(`      💰 Tokens: ${inputTokens} in / ${outputTokens} out (~$${((inputTokens/1000000) + (outputTokens*5/1000000)).toFixed(4)})`);
        
        return validatedContacts;
        
    } catch (error) {
        console.log(`      ⚠️ Claude API call failed: ${error.message}`);
        return [];
    }
}


// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: REPLACEMENT SCAN RESULTS POC DISPLAY
// 
// REPLACE: Lines 5553–5563 in org-scanner.js
// (from "// Updated POC display" through the closing "}" of the else block)
//
// CHANGES MADE:
//   - Shows name and title alongside email
//   - Shows phone number with 📞 emoji when present
//   - Shows phone count summary
// ═══════════════════════════════════════════════════════════════════════════════

    // Updated POC display for multi-contact support (UPDATED 2026-02-11: shows phone, name, title)
    if (result.pocSkipped) {
        console.log(`   POC Contacts: ⏭️ Skipped (${result.pocInfo?.reason || 'already have contacts'})`);
    } else if (result.pocContacts && result.pocContacts.length > 0) {
        const phonesFound = result.pocContacts.filter(c => c.phone).length;
        console.log(`   POC Contacts: ${result.pocContacts.length} found (${phonesFound} with phone)`);
        for (const c of result.pocContacts) {
            const nameStr = c.name ? ` - ${c.name}` : '';
            const titleStr = c.title ? ` (${c.title})` : '';
            const phoneStr = c.phone ? ` 📞 ${c.phone}` : '';
            console.log(`      • ${c.categoryType || c.contactType}: ${c.email}${nameStr}${titleStr}${phoneStr}`);
        }
    } else {
        console.log(`   POC Contacts: None found`);
    }
