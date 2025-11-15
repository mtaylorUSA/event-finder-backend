require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');

const POCKETBASE_URL = process.env.POCKETBASE_URL;

async function syncOrganizations() {
  try {
    console.log('Loading organizations from JSON...');
    const orgsData = JSON.parse(fs.readFileSync('organizations.json', 'utf8'));
    const organizations = orgsData.organizations;
    
    console.log(`Found ${organizations.length} organizations in JSON\n`);

    for (const org of organizations) {
      try {
        // Check if organization already exists
        const existingResponse = await fetch(
          `${POCKETBASE_URL}/api/collections/organizations/records?filter=(name='${org.name}')`
        );
        const existingData = await existingResponse.json();

        if (existingData.items && existingData.items.length > 0) {
          // Update existing organization
          const existingOrg = existingData.items[0];
          
          const updateResponse = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records/${existingOrg.id}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: org.name,
                website: org.website,
                description: org.description
              })
            }
          );

          if (updateResponse.ok) {
            console.log(`✓ Updated: ${org.name}`);
            
            // Update JSON with PocketBase ID if it changed
            if (org.pocketbase_id !== existingOrg.id) {
              console.log(`  → Updating JSON with ID: ${existingOrg.id}`);
              org.pocketbase_id = existingOrg.id;
            }
          } else {
            const errorData = await updateResponse.json();
            console.error(`✗ Failed to update ${org.name}:`, errorData);
          }
        } else {
          // Create new organization
          const createResponse = await fetch(
            `${POCKETBASE_URL}/api/collections/organizations/records`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: org.name,
                website: org.website,
                description: org.description
              })
            }
          );

          if (createResponse.ok) {
            const newOrg = await createResponse.json();
            console.log(`✓ Created: ${org.name}`);
            console.log(`  → New ID: ${newOrg.id}`);
            
            // Update JSON with new PocketBase ID
            org.pocketbase_id = newOrg.id;
          } else {
            const errorData = await createResponse.json();
            console.error(`✗ Failed to create ${org.name}:`, errorData);
          }
        }
      } catch (err) {
        console.error(`✗ Error processing ${org.name}:`, err.message);
      }
    }

    // Write updated JSON back to file
    fs.writeFileSync(
      'organizations.json',
      JSON.stringify(orgsData, null, 2),
      'utf8'
    );

    console.log('\n✓ Sync complete!');
    console.log('organizations.json has been updated with PocketBase IDs');
  } catch (error) {
    console.error('Sync failed:', error.message);
  }
}

syncOrganizations();