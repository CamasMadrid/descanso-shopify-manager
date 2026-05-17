import type { Express, Request, Response } from "express";
import { exchangeCodeForToken, saveShopifyToken, getShopifyInstallUrl } from "./shopify";

// The public-facing domain — must match the redirect URL whitelisted in Shopify Dev Dashboard
const APP_PUBLIC_URL = "https://descansoshop-ntep5r75.manus.space";

export function registerShopifyRoutes(app: Express) {
  // Initiate Shopify OAuth
  app.get("/api/shopify/install", (req: Request, res: Response) => {
    const redirectUri = `${APP_PUBLIC_URL}/api/shopify/callback`;
    const installUrl = getShopifyInstallUrl(redirectUri);
    res.redirect(installUrl);
  });

  // Shopify OAuth callback
  app.get("/api/shopify/callback", async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const shop = req.query.shop as string;

    if (!code || !shop) {
      res.status(400).send("Missing code or shop parameter");
      return;
    }

    try {
      const tokenData = await exchangeCodeForToken(code);
      await saveShopifyToken(tokenData.access_token, tokenData.scope);
      res.redirect(`${APP_PUBLIC_URL}/?shopify=connected`);
    } catch (err) {
      console.error("[Shopify OAuth] Callback error:", err);
      res.redirect(`${APP_PUBLIC_URL}/?shopify=error`);
    }
  });
}
