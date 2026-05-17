import { createConnection } from 'mysql2/promise';

// Check if we have a stored access token in the database
const db = await createConnection(process.env.DATABASE_URL);

const [rows] = await db.execute('SELECT shop, scope, createdAt FROM shopify_tokens LIMIT 5');
console.log('Stored Shopify tokens:', rows);

if (rows.length > 0) {
  const [tokenRow] = await db.execute('SELECT accessToken FROM shopify_tokens LIMIT 1');
  const token = tokenRow[0]?.accessToken;
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  
  console.log('\nTesting Shopify API with stored token...');
  const res = await fetch(`https://${domain}/admin/api/2024-01/shop.json`, {
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
    }
  });
  
  if (res.ok) {
    const data = await res.json();
    console.log('Shop info:', JSON.stringify(data.shop, null, 2));
  } else {
    console.log('API error:', res.status, await res.text());
  }
} else {
  console.log('\nNo token stored yet — OAuth not completed.');
  console.log('Need to visit: /api/shopify/install to authorise the app.');
}

await db.end();
