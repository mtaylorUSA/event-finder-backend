const PocketBase = require('pocketbase/cjs');
require('dotenv').config();

(async () => {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
  
  // Find an INSA event
  const events = await pb.collection('events').getList(1, 1, { filter: 'title ~ "Kirkpatrick"' });
  if (events.items.length) {
    const e = events.items[0];
    console.log('Title:', e.title);
    console.log('Topics:', e.topics);
    console.log('Regions:', e.regions);
    console.log('Countries:', e.countries);
    console.log('Transnational Orgs:', e.transnational_orgs);
    console.log('Icon field:', e.icon || '(empty)');
  } else {
    console.log('No event found');
  }
})();
