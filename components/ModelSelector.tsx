import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const models = [
  {
    id: "Salesforce/blip-image-captioning-large",
    name: "BLIP Large",
    task: "image-to-text",
  },
  {
    id: "microsoft/git-large-coco",
    name: "GIT Large COCO",
    task: "image-to-text",
  },
  {
    id: "nlpconnect/vit-gpt2-image-captioning",
    name: "ViT-GPT2",
    task: "image-to-text",
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  return (
    <Select onValueChange={onModelChange} value={selectedModel}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
