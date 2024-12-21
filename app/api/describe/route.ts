import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const model = formData.get("model") as string;
    const maxLength = parseInt(formData.get("maxLength") as string);

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert the File to a Blob and then to an ArrayBuffer
    const imageBuffer = await image.arrayBuffer();

    const result = await hf.imageToText({
      model: model,
      data: new Uint8Array(imageBuffer),
      parameters: {
        max_new_tokens: maxLength,
      },
    });

    if (result && result.generated_text) {
      return NextResponse.json({ description: result.generated_text });
    } else {
      console.error("Unexpected response structure:", result);
      return NextResponse.json(
        { error: "Failed to generate description" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error describing image:", error);
    return NextResponse.json(
      { error: "Failed to describe image", details: (error as Error).message },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
