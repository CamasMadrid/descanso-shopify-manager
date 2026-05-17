import type { Express, Request, Response } from "express";
import { exchangeCodeForToken, saveShopifyToken, getShopifyInstallUrl } from "./shopify";

export function registerShopifyRoutes(app: Express) {
  // Initiate Shopify OAuth
  app.get("/api/shopify/install", (req: Request, res: Response) => {
    const host = req.get("host") || "";
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const redirectUri = `${protocol}://${host}/api/shopify/callback`;
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
      res.redirect("/?shopify=connected");
    } catch (err) {
      console.error("[Shopify OAuth] Callback error:", err);
      res.redirect("/?shopify=error");
    }
  });
}
