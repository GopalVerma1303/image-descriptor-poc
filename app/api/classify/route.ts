import { NextRequest, NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as Blob | null;
    const model = formData.get("model") as string;
    const task = formData.get("task") as string;
    const confidenceThreshold = parseFloat(
      formData.get("confidenceThreshold") as string,
    );
    const maxResults = parseInt(formData.get("maxResults") as string);

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const imageBuffer = await image.arrayBuffer();

    let result;
    switch (task) {
      case "image-classification":
        result = await hf.imageClassification({
          model: model,
          data: imageBuffer,
        });
        break;
      case "object-detection":
        result = await hf.objectDetection({
          model: model,
          data: imageBuffer,
        });
        break;
      case "image-segmentation":
        result = await hf.imageSegmentation({
          model: model,
          data: imageBuffer,
        });
        break;
      case "zero-shot-image-classification":
        result = await hf.zeroShotImageClassification({
          model: model,
          data: imageBuffer,
          candidate_labels: [
            "animal",
            "human",
            "food",
            "vehicle",
            "nature",
            "building",
          ],
        });
        break;
      case "zero-shot-object-detection":
        result = await hf.zeroShotObjectDetection({
          model: model,
          data: new Uint8Array(imageBuffer),
          candidate_labels: [
            "animal",
            "human",
            "food",
            "vehicle",
            "nature",
            "building",
          ],
        });
        break;
      case "image-to-text":
        result = await hf.imageToText({
          model: model,
          data: imageBuffer,
        });
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported task" },
          { status: 400 },
        );
    }

    if (result) {
      let description = "";
      if (Array.isArray(result)) {
        const filteredResults = result
          .filter((item) =>
            "score" in item ? item.score >= confidenceThreshold : true,
          )
          .slice(0, maxResults);

        description = filteredResults
          .map((item) => {
            if ("label" in item && "score" in item) {
              return `${item.label} (${(item.score * 100).toFixed(2)}% confidence)`;
            } else if ("text" in item) {
              return item.text;
            } else {
              return JSON.stringify(item);
            }
          })
          .join("\n");
      } else if (typeof result === "object") {
        description = JSON.stringify(result, null, 2);
      } else {
        description = String(result);
      }

      return NextResponse.json({ description });
    } else {
      return NextResponse.json(
        { error: "Failed to process image" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
