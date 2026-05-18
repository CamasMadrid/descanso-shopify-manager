import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const db = drizzle(conn);

  // Raw query to get the token
  const [rows] = await conn.execute('SELECT shop, accessToken, scope, createdAt FROM shopify_tokens ORDER BY createdAt DESC LIMIT 1');
  
  if (!rows || rows.length === 0) {
    console.log('NO_TOKEN: No Shopify token found in database');
    await conn.end();
    return;
  }

  const t = rows[0];
  console.log('TOKEN_FOUND:', JSON.stringify({ shop: t.shop, scope: t.scope, createdAt: t.createdAt }));

  // Test write_products scope
  const res = await fetch(`https://${t.shop}/admin/api/2024-01/products.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': t.accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product: { title: '__scope_test__', status: 'draft', published: false } }),
  });

  const body = await res.json();
  if (res.status === 201) {
    console.log('WRITE_PRODUCTS: YES - scope confirmed, test product id:', body.product?.id);
    // Clean up
    await fetch(`https://${t.shop}/admin/api/2024-01/products/${body.product.id}.json`, {
      method: 'DELETE',
      headers: { 'X-Shopify-Access-Token': t.accessToken },
    });
    console.log('CLEANUP: test product deleted');
  } else {
    console.log('WRITE_PRODUCTS: NO - status', res.status, JSON.stringify(body));
  }

  await conn.end();
}

main().catch(console.error);
