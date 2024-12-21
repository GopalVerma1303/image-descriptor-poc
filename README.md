# Image Descriptor POC Application

This web application allows users to upload an image and receive a text description of its content using a pre-trained image classification model from Hugging Face.

## Available Models

| Model Name     | Model ID                               | Task          |
| -------------- | -------------------------------------- | ------------- |
| BLIP Large     | Salesforce/blip-image-captioning-large | image-to-text |
| GIT Large COCO | microsoft/git-large-coco               | image-to-text |
| ViT-GPT2       | nlpconnect/vit-gpt2-image-captioning   | image-to-text |
| BLIP Base      | Salesforce/blip-image-captioning-base  | image-to-text |
| GIT Base COCO  | microsoft/git-base-coco                | image-to-text |
| ViT-GPT2 COCO  | ydshieh/vit-gpt2-coco-en               | image-to-text |

## Technologies Used

- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Hugging Face Inference API

## Prerequisites

- [Bun](https://bun.sh/) installed on your system
- A Hugging Face account and API key

## Setup Guide

1. Clone the repository:

```bash
git clone https://github.com/yourusername/image-description-poc.git
cd image-description-poc
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
# Copy the example environment file
cp .env.example .env
```

4. Open `.env` and add your Hugging Face API key:

```bash
HUGGING_FACE_API_KEY=your_api_key_here
```

5. Start the development server:

```bash
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
