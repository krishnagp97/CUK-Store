"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { X, Loader2, ImagePlus } from "lucide-react";
import imageCompression from "browser-image-compression";

import {
  ProductSchema,
  ProductFormInput,
  ProductOutput,
} from "@/lib/validations/product";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EditProductData } from "@/lib/types";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/categories";

type EditProductFormProps = {
  product: EditProductData;
};

type UploadedImage = {
  imageUrl: string;
  publicId: string;
};

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState("");

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(
    product.images ?? [],
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, any, ProductOutput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: product.title,
      category: product.category,
      price: product.price,
      description: product.description,
      images: product.images ?? [],
    },
  });

  const images = watch("images") ?? [];

  async function compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: file.type,
    };

    try {
      return await imageCompression(file, options);
    } catch (err) {
      console.error("Compression failed, using original file:", err);

      return file;
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    if (images.length + files.length > 3) {
      toast.error("Maximum 3 images are allowed.");
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const newUploads: UploadedImage[] = [];

      for (const file of Array.from(files)) {
        const compressedFile = await compressImage(file);

        const formData = new FormData();
        formData.append("file", compressedFile, file.name);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message ?? "Upload failed");
        }

        const data = await res.json();

        if (!data.secure_url || !data.public_id) {
          throw new Error("Upload succeeded but response was incomplete");
        }

        newUploads.push({
          imageUrl: data.secure_url,
          publicId: data.public_id,
        });
      }

      const updatedUploads = [...uploadedImages, ...newUploads];

      setUploadedImages(updatedUploads);

      setValue("images", updatedUploads, {
        shouldValidate: true,
      });
    } catch (err) {
      console.error(err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Image upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function removeImage(index: number) {
    const target = uploadedImages[index];

    if (!target) return;

    setDeletingIndex(index);

    try {
      const res = await fetch("/api/upload/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_id: target.publicId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete image from Cloudinary");
      }

      const updatedUploads = uploadedImages.filter((_, i) => i !== index);

      setUploadedImages(updatedUploads);

      setValue("images", updatedUploads, {
        shouldValidate: true,
      });
    } catch (err) {
      console.error(err);

      toast.error("Failed to remove image. Please try again.");
    } finally {
      setDeletingIndex(null);
    }
  }

  async function onSubmit(values: ProductOutput) {
    setSubmitError("");

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.message || "Failed to update product");
        return;
      }

      toast.success("Product updated successfully!");

      router.push("/myListings");
      router.refresh();
    } catch (err) {
      console.error(err);

      setSubmitError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="w-full px-3 pb-24 sm:px-4 sm:pb-8">
      <Card className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[#E5E5EF] bg-white shadow-sm">
        {/* Header */}
        <CardHeader className="px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold tracking-tight text-[#1A1A2E] sm:text-2xl md:text-3xl">
              Edit Product
            </CardTitle>

            <p className="text-sm leading-5 text-[#1A1A2E]/50 sm:text-base">
              Update your product information.
            </p>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5 px-4 pb-8 sm:space-y-6 sm:px-6 sm:pb-7">
            {/* Product Name */}
            <div>
              <Label
                htmlFor="title"
                className="text-sm font-medium text-[#1A1A2E]"
              >
                Product Name
              </Label>

              <Input
                id="title"
                placeholder="e.g. iPhone 13 Pro"
                className="mt-1.5 h-11 w-full rounded-xl border-[#E5E5EF] bg-white text-sm transition-all focus-visible:border-[#6C5CE7] focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/20 focus-visible:ring-offset-0"
                {...register("title")}
              />

              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <Label className="text-sm font-medium text-[#1A1A2E]">
                Category
              </Label>

              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="mt-1.5 h-11 w-full rounded-xl border-[#E5E5EF] bg-white text-sm transition-all focus:ring-2 focus:ring-[#6C5CE7]/20">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>

                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <Label
                htmlFor="price"
                className="text-sm font-medium text-[#1A1A2E]"
              >
                Price
              </Label>

              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#1A1A2E]/40">
                  ₹
                </span>

                <Input
                  id="price"
                  type="number"
                  placeholder="5000"
                  className="h-11 w-full rounded-xl border-[#E5E5EF] bg-white pl-7 text-sm transition-all focus-visible:border-[#6C5CE7] focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/20 focus-visible:ring-offset-0"
                  {...register("price")}
                />
              </div>

              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium text-[#1A1A2E]"
              >
                Description
              </Label>

              <Textarea
                id="description"
                rows={6}
                placeholder="Describe your product..."
                className="mt-1.5 w-full resize-none rounded-xl border-[#E5E5EF] bg-white text-sm transition-all focus-visible:border-[#6C5CE7] focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/20 focus-visible:ring-offset-0"
                {...register("description")}
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="images"
                  className="text-sm font-medium text-[#1A1A2E]"
                >
                  Images
                </Label>

                <span className="rounded-full bg-[#6C5CE7]/10 px-2.5 py-1 text-xs font-medium text-[#6C5CE7]">
                  {images.length}/3
                </span>
              </div>

              {/* Upload input */}
              <div className="mt-1.5">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading || images.length >= 3}
                  onChange={handleFileChange}
                  className="h-11 w-full rounded-xl border-[#E5E5EF] bg-white text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#6C5CE7]/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#6C5CE7] hover:file:bg-[#6C5CE7]/20"
                />
              </div>

              {uploading && (
                <div className="mt-2 flex items-center gap-2 text-sm text-[#1A1A2E]/50">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#6C5CE7]" />
                  Uploading image...
                </div>
              )}

              {/* Images */}
              {uploadedImages.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
                  {uploadedImages.map((img, index) => (
                    <div
                      key={img.publicId}
                      className="group relative aspect-square w-full overflow-hidden rounded-xl bg-[#F7F7FA] shadow-sm sm:h-24 sm:w-24"
                    >
                      <Image
                        src={img.imageUrl}
                        alt={`Product image ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 33vw, 96px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Image overlay */}
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        disabled={
                          deletingIndex === index || uploading || isSubmitting
                        }
                        aria-label={`Remove image ${index + 1}`}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-black/85 disabled:pointer-events-none disabled:opacity-50"
                      >
                        {deletingIndex === index ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <X className="h-3.5 w-3.5" />
                        )}
                      </button>

                      {/* Image number */}
                      <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.images.message}
                </p>
              )}
            </div>

            {/* Submit Error */}
            {submitError && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-500">
                {submitError}
              </p>
            )}

            {/* Update Button */}
            <div className="pt-1 sm:pt-0">
              <Button
                className="h-12 w-full rounded-full bg-linear-to-r from-[#6C5CE7] to-[#8B7CF6] text-sm font-medium text-white shadow-md shadow-[#6C5CE7]/30 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#6C5CE7]/40 active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 sm:h-11"
                disabled={isSubmitting || uploading}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
