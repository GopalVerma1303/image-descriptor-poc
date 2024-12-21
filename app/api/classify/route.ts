import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

// Initialize the Hugging Face inference client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as Blob | null;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const imageBuffer = await image.arrayBuffer();

    // Perform image classification
    const result = await hf.imageClassification({
      model: "microsoft/resnet-50",
      data: new Uint8Array(imageBuffer),
    });

    if (result && result.length > 0) {
      const topResult = result[0];
      const description = `This image appears to be a ${topResult.label.toLowerCase()} with ${(topResult.score * 100).toFixed(2)}% confidence.`;
      return NextResponse.json({ description });
    } else {
      return NextResponse.json(
        { error: "Failed to classify image" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error classifying image:", error);
    return NextResponse.json(
      { error: "Failed to classify image" },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
