

import { GenerateTemplateAImodel } from "@/config/Aimodel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();

  try {
    const result = await GenerateTemplateAImodel.sendMessage(prompt);
    const airesp = result.response.text()

    return NextResponse.json(JSON.parse(airesp))
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}


