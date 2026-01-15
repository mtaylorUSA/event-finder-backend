const PocketBase = require('pocketbase/cjs');
require('dotenv').config();

(async () => {
  const pb = new PocketBase(process.env.POCKETBASE_URL);
  await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
  
  // Build the key for "Coffee & Conversation with Gregory Kirkpatrick"
  // Topics: Careers & Professional Development, Defense Policy & Intelligence (sorted)
  // Regions: Domestic US
  // Countries: (empty)
  // Orgs: (empty)
  
  const topics = ['Careers & Professional Development', 'Defense Policy & Intelligence'].sort().join(',');
  const regions = 'Domestic US';
  const countries = '';
  const orgs = '';
  
  const key = `${topics}|${regions}|${countries}|${orgs}`;
  console.log('Looking for key:', key);
  
  // Search topic_icons
  const icons = await pb.collection('topic_icons').getFullList({
    filter: `combination_key = "${key}"`
  });
  
  if (icons.length) {
    const icon = icons[0];
    console.log('\n✅ Found topic_icon record:');
    console.log('   ID:', icon.id);
    console.log('   combination_key:', icon.combination_key);
    console.log('   icon_image:', icon.icon_image || '(empty)');
    console.log('   status:', icon.status);
    
    if (icon.icon_image) {
      const url = pb.files.getURL(icon, icon.icon_image);
      console.log('   Image URL:', url);
    }
  } else {
    console.log('\n❌ No topic_icon found for this key');
    
    // List all topic_icons to see what we have
    console.log('\nListing all topic_icons with "Careers" in key:');
    const allIcons = await pb.collection('topic_icons').getFullList();
    allIcons.filter(i => i.combination_key.includes('Careers')).forEach(i => {
      console.log('  -', i.combination_key, '| image:', i.icon_image ? 'YES' : 'NO');
    });
  }
})();
