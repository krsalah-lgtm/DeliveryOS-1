import { NextResponse } from "next/server";
import { extractOrderData } from "@/lib/ai-provider";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const result = await extractOrderData(body.text);

    if (!result) {
      return NextResponse.json({ 
        error: "AI extraction is currently unavailable. Manual entry remains available." 
      }, { status: 503 });
    }

    return NextResponse.json({ result });
    
  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json({ 
      error: "Something went wrong while processing the request." 
    }, { status: 500 });
  }
}
