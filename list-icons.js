const PocketBase = require('pocketbase/cjs');
require('dotenv').config();

(async () => {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
  
  // Get all topic_icons
  const icons = await pb.collection('topic_icons').getFullList();
  
  console.log('Total topic_icons:', icons.length);
  console.log('\n--- Looking for "Careers" icons ---\n');
  
  icons.filter(i => i.combination_key && i.combination_key.includes('Careers')).forEach(icon => {
    console.log('Key:', icon.combination_key);
    console.log('Has image:', icon.icon_image ? 'YES' : 'NO');
    console.log('---');
  });
  
  // Also show the exact key we're looking for
  console.log('\n--- Target key for Gregory Kirkpatrick event ---');
  const targetKey = 'Careers & Professional Development,Defense Policy & Intelligence|Domestic US||';
  console.log('Looking for:', targetKey);
  
  const match = icons.find(i => i.combination_key === targetKey);
  if (match) {
    console.log('\n✅ FOUND matching icon!');
    console.log('   ID:', match.id);
    console.log('   Has image:', match.icon_image ? 'YES - ' + match.icon_image : 'NO');
  } else {
    console.log('\n❌ No exact match found');
    console.log('\nAll keys containing "Careers" and "Defense":');
    icons.filter(i => i.combination_key && i.combination_key.includes('Careers') && i.combination_key.includes('Defense')).forEach(i => {
      console.log('  "' + i.combination_key + '"');
    });
  }
})();
