import { getDb } from "./server/db";
import { shopifyTokens } from "./drizzle/schema";

async function main() {
  const db = await getDb();
  if (!db) { console.error("No DB"); process.exit(1); }

  const rows = await db.select().from(shopifyTokens).limit(1);
  if (!rows[0]) { console.error("No Shopify token in DB"); process.exit(1); }

  const token = rows[0].accessToken;
  const shop = "descanso-rapido-castilla.myshopify.com";

  const res = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json() as { shop: Record<string, string> };
  console.log("Store name:", data.shop?.name);
  console.log("Currency:", data.shop?.currency);
  console.log("Money format:", data.shop?.money_format);
  console.log("Country:", data.shop?.country_name);
  console.log("Plan:", data.shop?.plan_name);
}

main().catch(console.error);
