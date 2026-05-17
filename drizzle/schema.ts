import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const shopifyTokens = mysqlTable("shopify_tokens", {
  id: int("id").autoincrement().primaryKey(),
  shop: varchar("shop", { length: 255 }).notNull().unique(),
  accessToken: text("accessToken").notNull(),
  scope: text("scope"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShopifyToken = typeof shopifyTokens.$inferSelect;

export const enquiries = mysqlTable("enquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  source: mysqlEnum("source", ["contact_form", "mobile_showroom", "manual"]).default("contact_form").notNull(),
  status: mysqlEnum("status", ["new", "replied", "closed"]).default("new").notNull(),
  aiDraftReply: text("aiDraftReply"),
  ownerReply: text("ownerReply"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type InsertEnquiry = typeof enquiries.$inferInsert;

export const showroomBookings = mysqlTable("showroom_bookings", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  district: varchar("district", { length: 255 }).notNull(),
  preferredDate: varchar("preferredDate", { length: 50 }).notNull(),
  preferredTime: varchar("preferredTime", { length: 50 }).notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ShowroomBooking = typeof showroomBookings.$inferSelect;
export type InsertShowroomBooking = typeof showroomBookings.$inferInsert;

export const upsellOffers = mysqlTable("upsell_offers", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  titleEs: varchar("titleEs", { length: 255 }).notNull(),
  description: text("description"),
  descriptionEs: text("descriptionEs"),
  category: mysqlEnum("category", ["bed_frame", "mattress_topper", "pillow", "other"]).notNull(),
  shopifyProductId: varchar("shopifyProductId", { length: 100 }),
  price: varchar("price", { length: 50 }),
  imageUrl: text("imageUrl"),
  isActive: boolean("isActive").default(true).notNull(),
  triggerType: mysqlEnum("triggerType", ["post_purchase", "cart", "both"]).default("post_purchase").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UpsellOffer = typeof upsellOffers.$inferSelect;
export type InsertUpsellOffer = typeof upsellOffers.$inferInsert;

export const deliveryBanners = mysqlTable("delivery_banners", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  placement: mysqlEnum("placement", ["homepage", "product", "cart", "global"]).default("global").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  backgroundColor: varchar("backgroundColor", { length: 20 }).default("#1a1a2e"),
  textColor: varchar("textColor", { length: 20 }).default("#ffffff"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DeliveryBanner = typeof deliveryBanners.$inferSelect;
export type InsertDeliveryBanner = typeof deliveryBanners.$inferInsert;

export const storePages = mysqlTable("store_pages", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  titleEs: varchar("titleEs", { length: 255 }).notNull(),
  contentEs: text("contentEs").notNull(),
  shopifyPageId: varchar("shopifyPageId", { length: 100 }),
  lastSyncedAt: timestamp("lastSyncedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StorePage = typeof storePages.$inferSelect;
export type InsertStorePage = typeof storePages.$inferInsert;
