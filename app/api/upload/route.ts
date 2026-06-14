import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { uploadImage } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploaded = await uploadImage(buffer, "sareeva/products");

    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to upload image." },
      { status: 500 },
    );
  }
}
