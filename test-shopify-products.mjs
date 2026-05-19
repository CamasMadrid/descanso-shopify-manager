import { createConnection } from '/home/ubuntu/descanso-shopify-manager/node_modules/mysql2/promise/index.js';

const DB_URL = process.env.DATABASE_URL;
const SHOP = "descanso-rapido-castilla.myshopify.com";
const API_VERSION = "2024-01";

async function main() {
  const conn = await createConnection(DB_URL);
  const [rows] = await conn.execute('SELECT accessToken FROM shopify_tokens WHERE shop = ? LIMIT 1', [SHOP]);
  await conn.end();
  
  const token = rows[0]?.accessToken;
  if (!token) {
    console.log("❌ No token found in DB");
    return;
  }
  console.log("✅ Token found:", token.substring(0, 12) + "...");

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products.json?limit=50&fields=id,title,status,variants`, {
    headers: { "X-Shopify-Access-Token": token }
  });
  
  if (!res.ok) {
    const text = await res.text();
    console.log("❌ API error:", res.status, text.substring(0, 200));
    return;
  }
  
  const data = await res.json();
  console.log(`\n📦 Products found: ${data.products.length}`);
  for (const p of data.products) {
    console.log(`\n  [${p.status.toUpperCase()}] ${p.title} (ID: ${p.id})`);
    for (const v of p.variants) {
      console.log(`    variant ${v.id} | "${v.title}" | €${v.price}`);
    }
  }
}

main().catch(console.error);
