import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SellPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-4xl px-4">
        <Card className="shadow-xl rounded-2xl">
          <CardHeader className="border-b">
            <CardTitle className="text-3xl font-bold text-center">
              Sell Your Product
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Fill in the details below to list your product.
            </p>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            {/* Images */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Product Images (Maximum 3)
              </Label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <label
                    key={item}
                    className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-black hover:bg-gray-100"
                  >
                    <ImagePlus className="mb-2 h-10 w-10 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      Click to Upload
                    </span>

                    <Input type="file" accept="image/*" className="hidden" />
                  </label>
                ))}
              </div>
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label className="font-semibold">Product Name</Label>

              <Input placeholder="e.g. iPhone 13 Pro" className="h-11" />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="font-semibold">Category</Label>

              <Select>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                  <SelectItem value="vehicles">Notes</SelectItem>
                  <SelectItem value="home-appliances">
                    Home Appliances
                  </SelectItem>
                  <SelectItem value="mobile">Mobiles</SelectItem>
                  <SelectItem value="laptops">Laptops</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label className="font-semibold">Price</Label>

              <Input type="number" placeholder="₹5000" className="h-11" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="font-semibold">Description</Label>

              <Textarea rows={6} placeholder="Describe your product..." />
            </div>

            <Button className="h-12 w-full text-base">Publish Product</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
