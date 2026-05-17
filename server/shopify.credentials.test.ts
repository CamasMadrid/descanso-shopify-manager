import { describe, expect, it } from "vitest";

describe("Shopify credentials", () => {
  it("SHOPIFY_CLIENT_ID is set", () => {
    expect(process.env.SHOPIFY_CLIENT_ID).toBeTruthy();
  });

  it("SHOPIFY_CLIENT_SECRET is set", () => {
    expect(process.env.SHOPIFY_CLIENT_SECRET).toBeTruthy();
  });

  it("SHOPIFY_STORE_DOMAIN is set", () => {
    expect(process.env.SHOPIFY_STORE_DOMAIN).toBe("descanso-rapido-castilla.myshopify.com");
  });
});
