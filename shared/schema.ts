import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  invoiceNumber: text("invoice_number").notNull(),
  isQuotation: boolean("is_quotation").notNull().default(false),
  date: timestamp("date").notNull(),
  dueDate: timestamp("due_date"),
  clientName: text("client_name").notNull(),
  clientAddress: text("client_address"),
  clientEmail: text("client_email"),
  companyName: text("company_name").notNull(),
  companyAddress: text("company_address"),
  companyEmail: text("company_email"),
  companyLogo: text("company_logo"), // URL or base64 string
  paymentMethod: text("payment_method"),
  paymentTerms: text("payment_terms"),
  paymentInstructions: text("payment_instructions"),
  items: jsonb("items").notNull(),
  notes: text("notes"),
  taxRate: text("tax_rate"),
  discount: text("discount"),
  subtotal: text("subtotal").notNull(),
  taxAmount: text("tax_amount"),
  discountAmount: text("discount_amount"),
  total: text("total").notNull(),
  signatureData: text("signature_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const itemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  amount: z.number().nonnegative(),
});

export const invoiceItemsSchema = z.array(itemSchema);

export const insertInvoiceSchema = createInsertSchema(invoices)
  .omit({ id: true, userId: true, createdAt: true })
  .extend({
    items: invoiceItemsSchema,
    taxRate: z.string().optional(),
    discount: z.string().optional(),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type InvoiceItem = z.infer<typeof itemSchema>;
