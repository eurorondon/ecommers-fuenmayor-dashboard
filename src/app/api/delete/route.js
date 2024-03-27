import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.API_SECRET,
});

// export async function POST(id) {
//   try {
//     const result = await cloudinary.uploader.destroy(id);
//     return { success: true, message: "Imagen eliminada correctamente" };
//   } catch (error) {
//     console.error("Error al eliminar la imagen de Cloudinary:", error);
//     throw new Error("Error al eliminar la imagen de Cloudinary");
//   }
// }

// export async function POST(request) {
//   const data = await request.json();
//   return NextResponse.json(data);
// }

export async function POST(request) {
  const data = await request.json();
  console.log(data.publicId);

  const response = await cloudinary.uploader.destroy(data.publicId);
  console.log(response);
  return NextResponse.json({
    message: "imagen Eliminada",
    data: response,
  });
}
