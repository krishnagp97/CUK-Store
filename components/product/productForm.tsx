"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
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
import { CATEGORIES } from "@/lib/categories";

type UploadedImage = {
  imageUrl: string;
  publicId: string;
};

export default function ProductForm() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

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
      title: "",
      category: "",
      price: "" as unknown as number,
      description: "",
      images: [],
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
      alert("Maximum 3 images allowed");
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

        if (!res.ok) throw new Error("Upload failed");

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
      alert("Image upload failed. Please try again.");
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
      alert("Failed to remove image. Please try again.");
    } finally {
      setDeletingIndex(null);
    }
  }

  async function onSubmit(values: ProductOutput) {
    setSubmitError("");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.message || "Failed to publish product");
        return;
      }

      router.push(`/products/${data.product.id}`);
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong. Please try again.");
    }
  }

  return (
    <Card className="mx-auto max-w-3xl rounded-2xl border border-[#E5E5EF] shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="px-4 pt-5 sm:px-6 sm:pt-6">
        <CardTitle className="text-xl font-bold text-[#1A1A2E] sm:text-2xl md:text-3xl">
          Sell Your Product
        </CardTitle>
        <p className="text-sm text-[#1A1A2E]/50 sm:text-base">
          Fill in the details below to list your product.
        </p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5 px-4 pb-6 sm:space-y-6 sm:px-6">
          {/* Product Name */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-[#1A1A2E]">
              Product Name
            </Label>
            <Input
              id="title"
              placeholder="e.g. iPhone 13 Pro"
              className="mt-1.5 h-11 rounded-xl border-[#E5E5EF] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#6C5CE7] focus-visible:ring-offset-0"
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
            <Label className="text-sm font-medium text-[#1A1A2E]">Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-1.5 h-11 rounded-xl border-[#E5E5EF] transition-colors duration-200 focus:ring-2 focus:ring-[#6C5CE7]">
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
            <Label htmlFor="price" className="text-sm font-medium text-[#1A1A2E]">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="₹5000"
              className="mt-1.5 h-11 rounded-xl border-[#E5E5EF] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#6C5CE7] focus-visible:ring-offset-0"
              {...register("price")}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-[#1A1A2E]">
              Description
            </Label>
            <Textarea
              id="description"
              rows={6}
              placeholder="Describe your product..."
              className="mt-1.5 rounded-xl border-[#E5E5EF] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#6C5CE7] focus-visible:ring-offset-0"
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
            <Label htmlFor="images" className="text-sm font-medium text-[#1A1A2E]">
              Images (up to 3)
            </Label>

            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              disabled={uploading || images.length >= 3}
              onChange={handleFileChange}
              className="mt-1.5 h-11 rounded-xl border-[#E5E5EF] file:mr-3 file:rounded-full file:border-0 file:bg-[#6C5CE7]/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#6C5CE7] file:transition-colors file:duration-200 hover:file:bg-[#6C5CE7]/20"
            />

            {uploading && (
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#1A1A2E]/50">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#6C5CE7]" />
                Uploading...
              </p>
            )}

            {uploadedImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {uploadedImages.map((img, index) => (
                  <div
                    key={img.publicId}
                    className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl shadow-sm transition-transform duration-200 hover:scale-[1.03] sm:h-24 sm:w-24"
                  >
                    <Image
                      src={img.imageUrl}
                      alt={`Product image ${index + 1}`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      disabled={deletingIndex === index}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1A1A2E] text-white shadow-md transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {deletingIndex === index ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
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
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-500">
              {submitError}
            </p>
          )}

          <Button
            className="h-12 w-full rounded-full bg-linear-to-r from-[#6C5CE7] to-[#8B7CF6] text-sm font-medium text-white shadow-md shadow-[#6C5CE7]/30 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg hover:shadow-[#6C5CE7]/40 active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 sm:h-11"
            disabled={isSubmitting || uploading}
            type="submit"
          >
            {isSubmitting ? "Publishing..." : "Publish Product"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}