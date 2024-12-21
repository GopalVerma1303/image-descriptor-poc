import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as Blob | null;
    const model = formData.get("model") as string;
    const maxLength = parseInt(formData.get("maxLength") as string);

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

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
      return NextResponse.json(
        { error: "Failed to generate description" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error describing image:", error);
    return NextResponse.json(
      { error: "Failed to describe image" },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
