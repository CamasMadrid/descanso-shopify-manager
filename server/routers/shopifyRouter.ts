import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import * as shopify from "../shopify";

export const shopifyRouter = router({
  status: adminProcedure.query(async () => {
    const connected = await shopify.isConnected();
    if (!connected) return { connected: false, shop: null };
    try {
      const shop = await shopify.getShopInfo();
      return { connected: true, shop };
    } catch {
      return { connected: false, shop: null };
    }
  }),

  products: adminProcedure.query(async () => {
    return shopify.getProducts(100);
  }),

  product: adminProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return shopify.getProduct(input.id);
  }),

  updateProduct: adminProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      bodyHtml: z.string().optional(),
      price: z.string().optional(),
      status: z.enum(["active", "draft", "archived"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, title, bodyHtml, price, status } = input;
      const updates: Record<string, unknown> = {};
      if (title) updates.title = title;
      if (bodyHtml !== undefined) updates.body_html = bodyHtml;
      if (status) updates.status = status;
      if (price) updates.variants = [{ price }];
      return shopify.updateProduct(id, updates);
    }),

  collections: adminProcedure.query(async () => {
    return shopify.getCollections();
  }),

  createCollection: adminProcedure
    .input(z.object({ title: z.string(), bodyHtml: z.string().optional() }))
    .mutation(async ({ input }) => {
      return shopify.createCollection(input.title, input.bodyHtml);
    }),

  addToCollection: adminProcedure
    .input(z.object({ collectionId: z.string(), productId: z.string() }))
    .mutation(async ({ input }) => {
      return shopify.addProductToCollection(input.collectionId, input.productId);
    }),

  pages: adminProcedure.query(async () => {
    return shopify.getPages();
  }),

  updatePage: adminProcedure
    .input(z.object({ id: z.string(), title: z.string().optional(), bodyHtml: z.string().optional() }))
    .mutation(async ({ input }) => {
      const updates: Record<string, unknown> = {};
      if (input.title) updates.title = input.title;
      if (input.bodyHtml !== undefined) updates.body_html = input.bodyHtml;
      return shopify.updatePage(input.id, updates);
    }),

  createPage: adminProcedure
    .input(z.object({ title: z.string(), bodyHtml: z.string() }))
    .mutation(async ({ input }) => {
      return shopify.createPage(input.title, input.bodyHtml);
    }),
});
