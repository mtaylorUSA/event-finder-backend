/**
 * audit-events.js
 * 
 * Quick data quality audit to identify events with:
 * - Missing dates
 * - Obviously wrong dates (before 2024 or after 2030)
 * - Missing descriptions
 * - Missing URLs
 * 
 * Usage:
 *   node audit-events.js
 * 
 * Created: 2026-01-17
 */

require('dotenv').config();

const POCKETBASE_URL = process.env.POCKETBASE_URL;
const POCKETBASE_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const POCKETBASE_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

let authToken = '';

async function authenticate() {
    console.log('🔐 Authenticating...');
    
    const response = await fetch(`${POCKETBASE_URL}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identity: POCKETBASE_ADMIN_EMAIL,
            password: POCKETBASE_ADMIN_PASSWORD
        })
    });
    
    if (!response.ok) throw new Error('Auth failed');
    const data = await response.json();
    authToken = data.token;
    console.log('✅ Authenticated\n');
}

async function getAllEvents() {
    const response = await fetch(
        `${POCKETBASE_URL}/api/collections/events/records?perPage=500&expand=organization`,
        { headers: { 'Authorization': authToken } }
    );
    
    if (!response.ok) throw new Error('Failed to fetch events');
    const data = await response.json();
    return data.items || [];
}

function analyzeDate(dateStr) {
    if (!dateStr || dateStr === '' || dateStr === 'TBD') {
        return { status: 'missing', issue: 'No date' };
    }
    
    try {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        
        if (isNaN(year)) {
            return { status: 'invalid', issue: `Invalid date format: ${dateStr}` };
        }
        
        if (year < 2024) {
            return { status: 'wrong', issue: `Year too old: ${year}` };
        }
        
        if (year > 2030) {
            return { status: 'wrong', issue: `Year too far future: ${year}` };
        }
        
        return { status: 'ok', date: date.toISOString().split('T')[0] };
        
    } catch (e) {
        return { status: 'invalid', issue: `Parse error: ${dateStr}` };
    }
}

async function main() {
    console.log('════════════════════════════════════════════════════════════════');
    console.log('📊 EVENT DATA QUALITY AUDIT');
    console.log('════════════════════════════════════════════════════════════════\n');
    
    await authenticate();
    
    const events = await getAllEvents();
    console.log(`📋 Total events in database: ${events.length}\n`);
    
    // Categorize issues
    const issues = {
        missingDate: [],
        wrongDate: [],
        invalidDate: [],
        missingDescription: [],
        missingUrl: [],
        goodEvents: []
    };
    
    // Group by org for reporting
    const byOrg = {};
    
    for (const event of events) {
        const orgName = event.expand?.organization?.name || 'Unknown';
        
        if (!byOrg[orgName]) {
            byOrg[orgName] = { total: 0, issues: 0, events: [] };
        }
        byOrg[orgName].total++;
        
        const dateAnalysis = analyzeDate(event.start_date);
        let hasIssue = false;
        const eventIssues = [];
        
        if (dateAnalysis.status === 'missing') {
            issues.missingDate.push({ event, orgName, issue: dateAnalysis.issue });
            eventIssues.push('Missing date');
            hasIssue = true;
        } else if (dateAnalysis.status === 'wrong') {
            issues.wrongDate.push({ event, orgName, issue: dateAnalysis.issue });
            eventIssues.push(dateAnalysis.issue);
            hasIssue = true;
        } else if (dateAnalysis.status === 'invalid') {
            issues.invalidDate.push({ event, orgName, issue: dateAnalysis.issue });
            eventIssues.push(dateAnalysis.issue);
            hasIssue = true;
        }
        
        if (!event.description || event.description.length < 10) {
            issues.missingDescription.push({ event, orgName });
            eventIssues.push('Missing/short description');
            hasIssue = true;
        }
        
        if (!event.url) {
            issues.missingUrl.push({ event, orgName });
            eventIssues.push('Missing URL');
            hasIssue = true;
        }
        
        if (hasIssue) {
            byOrg[orgName].issues++;
            byOrg[orgName].events.push({ title: event.title, issues: eventIssues, date: event.start_date });
        } else {
            issues.goodEvents.push({ event, orgName });
        }
    }
    
    // ════════════════════════════════════════════════════════════════
    // SUMMARY
    // ════════════════════════════════════════════════════════════════
    
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📊 SUMMARY');
    console.log('────────────────────────────────────────────────────────────────');
    console.log(`   ✅ Good events (no issues): ${issues.goodEvents.length}`);
    console.log(`   ❌ Missing date: ${issues.missingDate.length}`);
    console.log(`   ❌ Wrong date (wrong year): ${issues.wrongDate.length}`);
    console.log(`   ❌ Invalid date format: ${issues.invalidDate.length}`);
    console.log(`   ⚠️ Missing description: ${issues.missingDescription.length}`);
    console.log(`   ⚠️ Missing URL: ${issues.missingUrl.length}`);
    console.log('');
    
    const totalDateIssues = issues.missingDate.length + issues.wrongDate.length + issues.invalidDate.length;
    const percentBadDates = ((totalDateIssues / events.length) * 100).toFixed(1);
    console.log(`   📈 Events with date problems: ${totalDateIssues} (${percentBadDates}%)`);
    console.log('');
    
    // ════════════════════════════════════════════════════════════════
    // BY ORGANIZATION
    // ════════════════════════════════════════════════════════════════
    
    console.log('────────────────────────────────────────────────────────────────');
    console.log('📊 ISSUES BY ORGANIZATION');
    console.log('────────────────────────────────────────────────────────────────');
    
    const sortedOrgs = Object.entries(byOrg).sort((a, b) => b[1].issues - a[1].issues);
    
    for (const [orgName, data] of sortedOrgs) {
        const icon = data.issues === 0 ? '✅' : (data.issues === data.total ? '❌' : '⚠️');
        console.log(`\n${icon} ${orgName}: ${data.issues}/${data.total} events with issues`);
        
        if (data.issues > 0) {
            for (const evt of data.events.slice(0, 5)) { // Show first 5
                console.log(`      • "${evt.title.substring(0, 45)}..."`);
                console.log(`        Date in DB: ${evt.date || '(empty)'}`);
                console.log(`        Issues: ${evt.issues.join(', ')}`);
            }
            if (data.events.length > 5) {
                console.log(`      ... and ${data.events.length - 5} more`);
            }
        }
    }
    
    // ════════════════════════════════════════════════════════════════
    // WRONG DATES DETAIL
    // ════════════════════════════════════════════════════════════════
    
    if (issues.wrongDate.length > 0) {
        console.log('\n────────────────────────────────────────────────────────────────');
        console.log('❌ EVENTS WITH WRONG DATES (need correction)');
        console.log('────────────────────────────────────────────────────────────────');
        
        for (const item of issues.wrongDate) {
            console.log(`\n   "${item.event.title.substring(0, 50)}..."`);
            console.log(`      Org: ${item.orgName}`);
            console.log(`      Date in DB: ${item.event.start_date}`);
            console.log(`      Issue: ${item.issue}`);
            console.log(`      URL: ${item.event.url || '(none)'}`);
        }
    }
    
    // ════════════════════════════════════════════════════════════════
    // RECOMMENDATION
    // ════════════════════════════════════════════════════════════════
    
    console.log('\n════════════════════════════════════════════════════════════════');
    console.log('💡 RECOMMENDATION');
    console.log('════════════════════════════════════════════════════════════════');
    
    if (percentBadDates > 50) {
        console.log('   ⚠️ HIGH DATA QUALITY ISSUES');
        console.log('   More than 50% of events have date problems.');
        console.log('   Recommended: Delete all events and re-scrape with fixed scraper.');
    } else if (percentBadDates > 20) {
        console.log('   ⚠️ MODERATE DATA QUALITY ISSUES');
        console.log('   Consider re-scraping affected orgs with the fixed scraper.');
    } else {
        console.log('   ✅ MANAGEABLE DATA QUALITY');
        console.log('   Fix individual events manually or re-scrape specific orgs.');
    }
    
    console.log('\n════════════════════════════════════════════════════════════════\n');
}

main().catch(console.error);
