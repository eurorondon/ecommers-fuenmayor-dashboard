"use client";
import { getAllCategories } from "@/utils/graphqlFunctions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useQuery } from "react-query";

function Page() {
  const { data } = useQuery("AllCategories", getAllCategories);

  console.log(data);

  return (
    <div
      className=" md:p-5 lg:p-10 grid-cols-3 md:grid-cols-5 lg:grid-cols-5  "
      style={{
        display: "grid",
        // gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1px",
        // padding: "1rem",
      }}
    >
      {data?.map((category, index) => (
        <Link
          href={`categorias/${category.categoryName}`}
          className="bg-blue-100 flex flex-col p-5 rounded-md justify-center items-center   "
          key={index}
        >
          <div className="rounded-full">
            <img
              className=""
              width={"100%"}
              // height={"200px"}
              alt="categoria imagen"
              src={
                category?.photo?.[0]?.url
                  ? category?.photo?.[0]?.url
                  : "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
              }
              style={{
                width: "180px",
                // height: "180px",
                objectFit: "scale-down",
                // objectFit: "cover",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
                borderRadius: "50%",
              }}
            />
          </div>

          <span className="font-semibold">{category.categoryName}</span>
        </Link>
      ))}
    </div>
  );
}

export default Page;
