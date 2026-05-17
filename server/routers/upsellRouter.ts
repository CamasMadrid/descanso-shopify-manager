import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { upsellOffers } from "../../drizzle/schema";
import { eq, asc } from "drizzle-orm";

export const upsellRouter = router({
  list: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(upsellOffers).orderBy(asc(upsellOffers.sortOrder));
  }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      titleEs: z.string().min(1),
      description: z.string().optional(),
      descriptionEs: z.string().optional(),
      category: z.enum(["bed_frame", "mattress_topper", "pillow", "other"]),
      shopifyProductId: z.string().optional(),
      price: z.string().optional(),
      imageUrl: z.string().optional(),
      isActive: z.boolean().default(true),
      triggerType: z.enum(["post_purchase", "cart", "both"]).default("post_purchase"),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const [result] = await db.insert(upsellOffers).values(input);
      return { success: true, id: (result as any).insertId };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      titleEs: z.string().optional(),
      description: z.string().optional(),
      descriptionEs: z.string().optional(),
      price: z.string().optional(),
      imageUrl: z.string().optional(),
      isActive: z.boolean().optional(),
      triggerType: z.enum(["post_purchase", "cart", "both"]).optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const { id, ...updates } = input;
      const filtered = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
      await db.update(upsellOffers).set(filtered).where(eq(upsellOffers.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.delete(upsellOffers).where(eq(upsellOffers.id, input.id));
      return { success: true };
    }),
});
