"use client";

import Product from "../components/Product";
import { deleteProductFunction, getProducts } from "@/utils/graphqlFunctions";
import { useQueryClient, useMutation, useQuery } from "react-query";

function Productos() {
  const queryClient = useQueryClient();

  //GET ALL PRODUCST WITH REACT QUERY
  const { data: productos } = useQuery("AllProducts", getProducts);

  console.log(productos);

  //DELETE PRODUCT WITH REACT QUERY
  const { mutate } = useMutation(deleteProductFunction, {
    onSuccess: () => {
      queryClient.invalidateQueries("AllProducts");
    },
  });

  const handleDelete = async (id, photo) => {
    const publicId = photo.map((item) => item.publicId);

    const userConfirmed = window.confirm("Do you want to delete?");
    if (userConfirmed) {
      try {
        const response = await fetch(`/api/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicId: publicId }),
        });
        // console.log(response);
      } catch (error) {
        console.error("Error de red al eliminar la imagen desde page", error);
      }
      try {
        mutate(id);
      } catch (error) {
        console.log(error);
      }
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
