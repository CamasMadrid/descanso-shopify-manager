import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { showroomBookings } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { notifyOwner } from "../_core/notification";

export const showroomRouter = router({
  list: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(showroomBookings).orderBy(desc(showroomBookings.createdAt));
  }),

  get: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db.select().from(showroomBookings).where(eq(showroomBookings.id, input.id)).limit(1);
    return rows[0] ?? null;
  }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      phone: z.string().min(1),
      district: z.string().min(1),
      preferredDate: z.string().min(1),
      preferredTime: z.string().min(1),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const [result] = await db.insert(showroomBookings).values({
        ...input,
        email: input.email ?? "",
      });
      await notifyOwner({
        title: `Nueva solicitud de tienda móvil — ${input.district}`,
        content: `Cliente: ${input.name}\nEmail: ${input.email}\nTeléfono: ${input.phone || "No indicado"}\nZona: ${input.district}\nFecha preferida: ${input.preferredDate} a las ${input.preferredTime}\nNotas: ${input.notes || "Ninguna"}`,
      });
      return { success: true, id: (result as any).insertId };
    }),

  updateStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(showroomBookings).set({ status: input.status }).where(eq(showroomBookings.id, input.id));
      return { success: true };
    }),
});
