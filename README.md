# Image Description Web Application

This web application allows users to upload an image and receive a text description of its content using a pre-trained image classification model from Hugging Face.

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
