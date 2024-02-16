import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.API_SECRET,
});

export async function POST(request) {
  const data = await request.formData();
  const image = data.get("file");

  if (!image) {
    return NextResponse.json("no se ha encontrado ninguna imagen", {
      status: 400,
    });
  }

  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const response = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "Next.js" }, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      })
      .end(buffer);
  });

  return NextResponse.json({
    message: "imagen subida",
    url: response.secure_url,
  });
}
