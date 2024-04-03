"use client";

import Product from "../components/Product";
import { deleteProductFunction, getProducts } from "@/utils/graphqlFunctions";
import { useQueryClient, useMutation, useQuery } from "react-query";
import DrawerMenu from "../components/DrawerMenu";

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
    <>
      <DrawerMenu />
      <div className="  grid grid-cols-5 md:grid-cols-3 lg:grid-cols-5  p-10 ">
        {productos &&
          productos.map((product) => (
            <div className="z-0" key={product.id}>
              <Product product={product} handleDelete={handleDelete} />
            </div>
          ))}
      </div>
    </>
  );
}

export default Productos;
