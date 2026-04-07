import { z } from "zod";

const NumericStringToNumber = z.preprocess((val) => {
  if (typeof val === "number") return val;

  if (typeof val === "string") {
    const parsed = Number(val);
    return Number.isFinite(parsed) ? parsed : val;
  }

  return val;
}, z.number());

export const ProductSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().nullable().optional(),
  price: NumericStringToNumber.pipe(
    z.number().nonnegative("Price must be non-negative")
  ),
  type: z.enum(["physical", "digital", "service"]),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  metadata: z.record(z.unknown()).default({}),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  tenant_id: true,
  created_at: true,
  updated_at: true,
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
