import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { deliveryBanners } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const deliveryRouter = router({
  list: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(deliveryBanners);
  }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      message: z.string().min(1),
      placement: z.enum(["homepage", "product", "cart", "global"]).default("global"),
      isActive: z.boolean().default(true),
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const [result] = await db.insert(deliveryBanners).values(input);
      return { success: true, id: (result as any).insertId };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      message: z.string().optional(),
      placement: z.enum(["homepage", "product", "cart", "global"]).optional(),
      isActive: z.boolean().optional(),
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const { id, ...updates } = input;
      const filtered = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
      await db.update(deliveryBanners).set(filtered).where(eq(deliveryBanners.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.delete(deliveryBanners).where(eq(deliveryBanners.id, input.id));
      return { success: true };
    }),
});
