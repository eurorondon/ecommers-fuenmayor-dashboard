"use client";

import Product from "../components/Product";
import { deleteProductFunction, getProducts } from "@/utils/graphqlFunctions";
import { useQueryClient, useMutation, useQuery } from "react-query";

function Productos() {
  const queryClient = useQueryClient();

  //GET ALL PRODUCST WITH REACT QUERY
  const { data: productos } = useQuery("AllProducts", getProducts);

  //DELETE PRODUCT WITH REACT QUERY
  const { mutate } = useMutation(deleteProductFunction, {
    onSuccess: () => {
      queryClient.invalidateQueries("AllProducts");
    },
  });

  const handleDeleteImage = async (publicId) => {
    try {
      const response = await fetch(`/api/upload?publicId=${publicId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error de red al eliminar la imagen desde page", error);
    }
  };

  const handleDelete = async (id, publicId) => {
    console.log(id, publicId);
    const userConfirmed = window.confirm("Do you want to delete?");
    if (userConfirmed) {
      try {
        mutate(id);
      } catch (error) {
        console.log(error);
      }
      handleDeleteImage(publicId);
    }
  };

  return (
    <div className="container my-20 grid grid-cols-5 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {productos &&
        productos.map((product) => (
          <div className="" key={product.id}>
            <Product product={product} handleDelete={handleDelete} />
          </div>
        ))}
    </div>
  );
}

export default Productos;
