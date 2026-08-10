"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { X, Loader2, ImagePlus, Package  } from "lucide-react";
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
  const [uploadedImages, setUploadedImages] = useState(product.images);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [uploading, setUploading] = useState(false);

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
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images,
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
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB.");
      return file;
    }

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

        const res = await fetch(`/api/upload`, {
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
      setValue("images", updatedUploads, { shouldValidate: true });
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
      const res = await fetch(`/api/upload/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: target.publicId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete image from Cloudinary");
      }

      const updatedUploads = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(updatedUploads);
      setValue("images", updatedUploads, { shouldValidate: true });
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
        headers: { "Content-Type": "application/json" },
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
    <Card className="mx-auto max-w-3xl rounded-2xl border-muted/60 shadow-lg">
      <CardHeader className="space-y-2 border-b pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Edit Product
          </CardTitle>
        </div>
        <p className="text-muted-foreground">
          Update your product information.
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-7 pt-6">
          {/* Product Name */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-sm font-medium">
              Product Name
            </Label>
            <Input
              id="title"
              placeholder="e.g. iPhone 13 Pro"
              className="rounded-xl"
              {...register("title")}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="rounded-xl">
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
          <div className="space-y-1.5">
            <Label htmlFor="price" className="text-sm font-medium">
              Price
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                id="price"
                type="number"
                placeholder="5000"
                className="rounded-xl pl-7"
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
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              rows={6}
              placeholder="Describe your product..."
              className="rounded-xl"
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Images */}
          <div className="space-y-1.5">
            <Label htmlFor="images" className="text-sm font-medium">
              Images (up to 3)
            </Label>

            <label
              htmlFor="images"
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                uploading || images.length >= 3
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <ImagePlus className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload or drag images here
              </span>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                disabled={uploading || images.length >= 3}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {uploading && (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading...
              </p>
            )}

            {uploadedImages.length > 0 && (
              <div className="mt-3 flex gap-3">
                {uploadedImages.map((img, index) => (
                  <div
                    key={img.publicId}
                    className="relative h-20 w-20 overflow-hidden rounded-xl shadow-sm"
                  >
                    <Image
                      src={img.imageUrl}
                      alt={product.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={
                        deletingIndex === index || uploading || isSubmitting
                      }
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white shadow-sm transition-transform hover:scale-110 disabled:opacity-50"
                    >
                      {deletingIndex === index ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                    </button>
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

          {submitError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">
              {submitError}
            </p>
          )}

          <Button
            className="w-full rounded-xl"
            size="lg"
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
        </CardContent>
      </form>
    </Card>
  );
}