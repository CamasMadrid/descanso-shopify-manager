import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { enquiries } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { invokeLLM } from "../_core/llm";
import { notifyOwner } from "../_core/notification";

export const enquiriesRouter = router({
  list: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
  }),

  get: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const rows = await db.select().from(enquiries).where(eq(enquiries.id, input.id)).limit(1);
    return rows[0] ?? null;
  }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      subject: z.string().optional(),
      message: z.string().min(1),
      source: z.enum(["contact_form", "mobile_showroom", "manual"]).default("contact_form"),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const [result] = await db.insert(enquiries).values(input);
      // Notify owner
      await notifyOwner({
        title: `Nueva consulta de ${input.name}`,
        content: `Asunto: ${input.subject || "Sin asunto"}\n\n${input.message}`,
      });
      return { success: true, id: (result as any).insertId };
    }),

  updateStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.enum(["new", "replied", "closed"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(enquiries).set({ status: input.status }).where(eq(enquiries.id, input.id));
      return { success: true };
    }),

  saveReply: adminProcedure
    .input(z.object({ id: z.number(), reply: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(enquiries)
        .set({ ownerReply: input.reply, status: "replied" })
        .where(eq(enquiries.id, input.id));
      return { success: true };
    }),

  generateAiReply: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      const rows = await db.select().from(enquiries).where(eq(enquiries.id, input.id)).limit(1);
      const enquiry = rows[0];
      if (!enquiry) throw new Error("Enquiry not found");

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `Eres el asistente de atención al cliente de Descanso Rápido Castilla, una tienda premium de camas y colchones en Madrid que ofrece entrega en 48 horas. 
Redacta respuestas en español, con tono profesional, cálido y cercano. 
La tienda ofrece: canapés abatibles, bases tapizadas, colchones de muelles, colchones viscoelásticos, colchones de látex y colchones de espuma.
También ofrecemos un servicio de tienda móvil donde visitamos al cliente en casa para que pueda probar los productos antes de comprar.
Entrega en 48 horas en Madrid. Calidad premium a precios competitivos.
Firma siempre como "El equipo de Descanso Rápido Castilla".`,
          },
          {
            role: "user",
            content: `Redacta una respuesta personalizada para esta consulta de cliente:\n\nNombre: ${enquiry.name}\nAsunto: ${enquiry.subject || "Consulta general"}\nMensaje: ${enquiry.message}`,
          },
        ],
      });

      const aiReply = (response.choices?.[0]?.message?.content as string) || "";
      await db.update(enquiries).set({ aiDraftReply: aiReply }).where(eq(enquiries.id, input.id));
      return { aiReply };
    }),
});
