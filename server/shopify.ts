import { getDb } from "./db";
import { shopifyTokens } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const SHOP = process.env.SHOPIFY_STORE_DOMAIN || "descanso-rapido-castilla.myshopify.com";
const API_VERSION = "2024-01";

export async function getShopifyToken(): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(shopifyTokens).where(eq(shopifyTokens.shop, SHOP)).limit(1);
  return rows[0]?.accessToken ?? null;
}

export async function saveShopifyToken(accessToken: string, scope: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(shopifyTokens).values({ shop: SHOP, accessToken, scope })
    .onDuplicateKeyUpdate({ set: { accessToken, scope } });
}

async function shopifyFetch(path: string, options: RequestInit = {}) {
  const token = await getShopifyToken();
  if (!token) throw new Error("Shopify not connected. Please complete OAuth first.");
  const url = `https://${SHOP}/admin/api/${API_VERSION}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API error ${res.status}: ${text}`);
  }
  return res.json();
}

// Products
export async function getProducts(limit = 50) {
  const data = await shopifyFetch(`/products.json?limit=${limit}&fields=id,title,body_html,variants,images,status,product_type,tags`);
  return data.products || [];
}

export async function getProduct(id: string) {
  const data = await shopifyFetch(`/products/${id}.json`);
  return data.product;
}

export async function updateProduct(id: string, updates: Record<string, unknown>) {
  const data = await shopifyFetch(`/products/${id}.json`, {
    method: "PUT",
    body: JSON.stringify({ product: updates }),
  });
  return data.product;
}

// Collections
export async function getCollections() {
  const [custom, smart] = await Promise.all([
    shopifyFetch(`/custom_collections.json`),
    shopifyFetch(`/smart_collections.json`),
  ]);
  return [...(custom.custom_collections || []), ...(smart.smart_collections || [])];
}

export async function createCollection(title: string, bodyHtml = "") {
  const data = await shopifyFetch(`/custom_collections.json`, {
    method: "POST",
    body: JSON.stringify({ custom_collection: { title, body_html: bodyHtml } }),
  });
  return data.custom_collection;
}

export async function addProductToCollection(collectionId: string, productId: string) {
  return shopifyFetch(`/collects.json`, {
    method: "POST",
    body: JSON.stringify({ collect: { collection_id: collectionId, product_id: productId } }),
  });
}

// Pages
export async function getPages() {
  const data = await shopifyFetch(`/pages.json`);
  return data.pages || [];
}

export async function updatePage(id: string, updates: Record<string, unknown>) {
  const data = await shopifyFetch(`/pages/${id}.json`, {
    method: "PUT",
    body: JSON.stringify({ page: updates }),
  });
  return data.page;
}

export async function createPage(title: string, bodyHtml: string) {
  const data = await shopifyFetch(`/pages.json`, {
    method: "POST",
    body: JSON.stringify({ page: { title, body_html: bodyHtml } }),
  });
  return data.page;
}

// Shop info
export async function getShopInfo() {
  const data = await shopifyFetch(`/shop.json`);
  return data.shop;
}

export async function isConnected(): Promise<boolean> {
  const token = await getShopifyToken();
  return !!token;
}

// Generate Shopify OAuth install URL
export function getShopifyInstallUrl(redirectUri: string): string {
  const clientId = process.env.SHOPIFY_CLIENT_ID || "";
  const scopes = "read_products,write_products,read_content,write_content,read_themes,write_themes,read_orders,read_customers";
  const state = Math.random().toString(36).substring(2);
  return `https://${SHOP}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
}

// Exchange OAuth code for access token
export async function exchangeCodeForToken(code: string): Promise<{ access_token: string; scope: string }> {
  const clientId = process.env.SHOPIFY_CLIENT_ID || "";
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET || "";
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${await res.text()}`);
  return res.json();
}
