import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

const model = google("models/gemini-2.5-flash");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["application/pdf"];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // 1. Validate file presence
    if (!file) {
      return NextResponse.json(
        { error: "No file provided", reason: "no_file_provided" },
        { status: 400 }
      );
    }

    // 2. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
          reason: "file_too_large",
        },
        { status: 400 }
      );
    }

    // 3. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(
            ", "
          )}`,
          reason: "unsupported_file_type",
        },
        { status: 400 }
      );
    }

    // 4. Convert file to buffer
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    // 5. Step 1: Validate content (is this a job offer?)
    const validation = await generateText({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Does this PDF contain a job offer related to software development?
Answer only with "yes" or "no".
              `,
            },
            {
              type: "file",
              data: fileBuffer,
              mediaType: "application/pdf",
            },
          ],
        },
      ],
    });

    const classificationResult = validation.text.trim().toLowerCase();
    console.log("Validation result:", classificationResult);

    const isValidJobOffer = classificationResult.startsWith("yes");

    if (!isValidJobOffer) {
      return NextResponse.json(
        {
          error: "not_a_job_offer",
          reason:
            "The uploaded PDF does not appear to contain a software job description.",
        },
        { status: 400 }
      );
    }

    // 6. Step 2: Summarize into Spanish “need” string
    const summary = await generateText({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Read the attached job description PDF and summarize it in Spanish,
in the style of: "Necesito un desarrollador experto en React y Tailwind".
              `,
            },
            {
              type: "file",
              data: fileBuffer,
              mediaType: "application/pdf",
            },
          ],
        },
      ],
    });

    const text = summary.text.trim();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error in PDF-to-text API:", error);
    return NextResponse.json(
      { error: "Error processing file", reason: "processing_error" },
      { status: 500 }
    );
  }
}
