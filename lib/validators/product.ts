import { z } from "zod";

export const ProductImageSchema = z.object({
  imageUrl: z.string().url(),
  publicId: z.string().min(1),
});

export const ProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description is too short")
    .max(1000, "Description cannot exceed 1000 characters"),

  price: z.coerce
    .number()
    .int("Price must be a whole number") // your Prisma field is Int, not Float
    .positive("Price must be greater than 0"),

  category: z
    .string()
    .trim()
    .min(1, "Select a category"),

  images: z
    .array(ProductImageSchema)
    .min(1, "Upload at least one image")
    .max(3, "Maximum 3 images"),
});

export type ProductFormInput = z.input<typeof ProductSchema>;
export type ProductOutput = z.output<typeof ProductSchema>;