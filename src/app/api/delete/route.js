import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.API_SECRET,
});

export async function POST(request) {
  const data = await request.json();

  try {
    // Itera sobre cada publicId y elimina las imágenes correspondientes
    const responses = await Promise.all(
      data.publicId.map(async (publicId) => {
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
      })
    );

    console.log(responses); // Las respuestas de Cloudinary para cada eliminación

    return NextResponse.json({
      message: "Imágenes eliminadas correctamente",
      data: responses,
    });
  } catch (error) {
    console.error("Error al eliminar las imágenes:", error);
    return NextResponse.json({
      error: "Error al eliminar las imágenes",
    });
  }

  // const response = await cloudinary.uploader.destroy(data.publicId);
  // console.log(response);
  // return NextResponse.json({
  //   message: "imagen Eliminada",
  //   data: response,
  // });
}
