"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ModelSelector, models } from "./ModelSelector";
import Image from "next/image";

export default function ImageClassifier() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [selectedTask, setSelectedTask] = useState(models[0].task);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [maxResults, setMaxResults] = useState(5);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setDescription(null);
    }
  };

  const handleModelChange = (model: string, task: string) => {
    setSelectedModel(model);
    setSelectedTask(task);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("model", selectedModel);
    formData.append("task", selectedTask);
    formData.append("confidenceThreshold", confidenceThreshold.toString());
    formData.append("maxResults", maxResults.toString());

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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Image Classification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </div>
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
          <div className="space-y-2">
            <Label htmlFor="model-select">Select Model</Label>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={handleModelChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confidence-threshold">
              Confidence Threshold: {confidenceThreshold}
            </Label>
            <Slider
              id="confidence-threshold"
              min={0}
              max={1}
              step={0.01}
              value={[confidenceThreshold]}
              onValueChange={(value) => setConfidenceThreshold(value[0])}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-results">Max Results: {maxResults}</Label>
            <Slider
              id="max-results"
              min={1}
              max={10}
              step={1}
              value={[maxResults]}
              onValueChange={(value) => setMaxResults(value[0])}
            />
          </div>
          <Button
            type="submit"
            disabled={!image || isLoading}
            className="w-full"
          >
            {isLoading ? "Classifying..." : "Classify Image"}
          </Button>
        </form>
      </CardContent>
      {description && (
        <CardFooter>
          <div className="w-full p-4 bg-gray-100 rounded-md">
            <h2 className="text-lg font-semibold mb-2">Image Description:</h2>
            <p className="whitespace-pre-wrap">{description}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
