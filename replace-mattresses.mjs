/**
 * Replace demo mattress products with 3 real Sleepinbed models.
 * Run: node replace-mattresses.mjs
 */
import { createConnection } from "mysql2/promise";
import { writeFileSync } from "fs";

const STORE = "descanso-rapido-castilla.myshopify.com";
const API_VERSION = "2024-01";

// ── Get token from DB ──────────────────────────────────────────────────────
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) { console.error("No DATABASE_URL"); process.exit(1); }
const conn = await createConnection(dbUrl);
const [rows] = await conn.execute(
  "SELECT accessToken FROM shopify_tokens ORDER BY createdAt DESC LIMIT 1"
);
await conn.end();
const TOKEN = rows[0]?.accessToken;
if (!TOKEN) { console.error("No token found"); process.exit(1); }
console.log(`Token: ${TOKEN.slice(0, 10)}...`);

// ── Helpers ────────────────────────────────────────────────────────────────
async function shopifyGet(path) {
  const r = await fetch(`https://${STORE}/admin/api/${API_VERSION}${path}`, {
    headers: { "X-Shopify-Access-Token": TOKEN },
  });
  return r.json();
}
async function shopifyDelete(path) {
  await fetch(`https://${STORE}/admin/api/${API_VERSION}${path}`, {
    method: "DELETE",
    headers: { "X-Shopify-Access-Token": TOKEN },
  });
}
async function shopifyPost(path, data) {
  const r = await fetch(`https://${STORE}/admin/api/${API_VERSION}${path}`, {
    method: "POST",
    headers: { "X-Shopify-Access-Token": TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return r.json();
}

// ── Step 1: Delete old mattress products ──────────────────────────────────
const { products } = await shopifyGet("/products.json?limit=250");
console.log(`Found ${products.length} total products`);
const mattressKeywords = ["memory", "hybrid", "colch", "mattress", "visconube", "viscografeno", "macanuu"];
for (const p of products) {
  if (mattressKeywords.some(k => p.title.toLowerCase().includes(k))) {
    console.log(`Deleting: ${p.title} (${p.id})`);
    await shopifyDelete(`/products/${p.id}.json`);
  }
}

// ── Step 2: Create 3 new mattress products ─────────────────────────────────
const newProducts = [
  {
    title: "Colchón Visconube",
    body_html: "<p>Colchón doble cara HR 23 kg/m³, altura 24 cm. Cara invierno: fibra hueca de silicona + viscoelástica + acolchado Super Soft, tejido stretch. Cara verano: fibra hueca de silicona + tejido 3D alta transpirabilidad. Banda lateral diseño.</p>",
    vendor: "Sleepinbed",
    product_type: "Colchón",
    status: "active",
    tags: "colchon,viscoelastico,doble-cara,sleepinbed",
    options: [{ name: "Tamaño" }],
    variants: [
      { option1: "80/90 × 180/190 cm", price: "215.00" },
      { option1: "80/90 × 200 cm",     price: "240.00" },
      { option1: "105 × 180/190 cm",   price: "240.00" },
      { option1: "105 × 200 cm",       price: "265.00" },
      { option1: "120 × 180/190 cm",   price: "265.00" },
      { option1: "120 × 200 cm",       price: "295.00" },
      { option1: "135 × 180/190 cm",   price: "265.00" },
      { option1: "135 × 200 cm",       price: "295.00" },
      { option1: "150 × 180/190 cm",   price: "295.00" },
      { option1: "150 × 200 cm",       price: "320.00" },
    ],
  },
  {
    title: "Colchón Viscografeno",
    body_html: "<p>Colchón doble cara HR 25 kg/m³, altura 29–30 cm. Cara invierno: lámina viscoelástica termoreguladora + fibra hueca de silicona + acolchado Super Soft, tejido stretch. Cara verano: fibra hueca de silicona + tejido 3D alta transpirabilidad. Banda lateral diseño.</p>",
    vendor: "Sleepinbed",
    product_type: "Colchón",
    status: "active",
    tags: "colchon,viscoelastico,grafeno,doble-cara,sleepinbed,premium",
    options: [{ name: "Tamaño" }],
    variants: [
      { option1: "80/90 × 180/190 cm",   price: "335.00" },
      { option1: "80/90 × 200 cm",       price: "370.00" },
      { option1: "105 × 180/190 cm",     price: "375.00" },
      { option1: "105 × 200 cm",         price: "405.00" },
      { option1: "120/135 × 180/190 cm", price: "430.00" },
      { option1: "120/135 × 200 cm",     price: "465.00" },
      { option1: "150 × 180/190 cm",     price: "455.00" },
      { option1: "150 × 200 cm",         price: "495.00" },
    ],
  },
  {
    title: "Colchón Macanuu",
    body_html: "<p>Colchón doble cara HR 25 kg/m³, altura 26 cm. Ambas caras: tejido stretch 300g, acolchado de fibra 250g + acolchado Super Soft. Banda lateral de tela.</p>",
    vendor: "Sleepinbed",
    product_type: "Colchón",
    status: "active",
    tags: "colchon,hr,doble-cara,sleepinbed",
    options: [{ name: "Tamaño" }],
    variants: [
      { option1: "80 × 180/190 cm",  price: "240.00" },
      { option1: "80 × 200 cm",      price: "265.00" },
      { option1: "90 × 180/190 cm",  price: "240.00" },
      { option1: "90 × 200 cm",      price: "265.00" },
      { option1: "105 × 180/190 cm", price: "265.00" },
      { option1: "105 × 200 cm",     price: "295.00" },
      { option1: "120 × 180/190 cm", price: "310.00" },
      { option1: "120 × 200 cm",     price: "335.00" },
      { option1: "135 × 180/190 cm", price: "310.00" },
      { option1: "135 × 200 cm",     price: "335.00" },
      { option1: "150 × 180/190 cm", price: "350.00" },
      { option1: "150 × 200 cm",     price: "375.00" },
    ],
  },
];

const created = {};
for (const prod of newProducts) {
  const resp = await shopifyPost("/products.json", { product: prod });
  if (!resp.product) { console.error("ERROR:", JSON.stringify(resp)); process.exit(1); }
  const p = resp.product;
  created[prod.title] = {
    id: p.id,
    variants: Object.fromEntries(p.variants.map(v => [v.option1, v.id])),
  };
  console.log(`✓ Created: ${p.title} (${p.id}) — ${p.variants.length} variants`);
}

writeFileSync("/home/ubuntu/new-mattress-variants.json", JSON.stringify(created, null, 2));
console.log("\n=== VARIANT MAP ===");
console.log(JSON.stringify(created, null, 2));
console.log("\nSaved to /home/ubuntu/new-mattress-variants.json");
