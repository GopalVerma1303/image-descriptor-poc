"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function ImageUploader() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setDescription(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to classify image");
      }

      const result = await response.json();
      setDescription(result.description);
    } catch (error) {
      console.error("Error classifying image:", error);
      setDescription("Error classifying image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
          {preview && (
            <div className="relative w-full h-64">
              <Image
                src={preview}
                alt="Preview"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
          <Button
            type="submit"
            disabled={!image || isLoading}
            className="w-full"
          >
            {isLoading ? "Classifying..." : "Classify Image"}
          </Button>
        </form>
        {description && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Image Description:</h2>
            <p>{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
