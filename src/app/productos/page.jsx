"use client";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import { deleteProduct } from "@/graphql/mutations";
import { getProducts } from "@/utils/graphqlFunctions";
import { useQuery } from "react-query";

Amplify.configure(amplifyconfig);
const client = generateClient();

function Productos() {
  const [productos, setProductos] = useState(null);
  const { data } = useQuery("test", getProducts);

  useEffect(() => {
    if (data) {
      setProductos(data);
    }
  }, [data]);

  console.log(productos);

  const handleDelete = async (id) => {
    const userConfirmed = window.confirm("Do you want to delete?");
    if (userConfirmed) {
      try {
        const res = await client.graphql({
          query: deleteProduct,
          variables: { input: { id } },
        });
        console.log(res);
        setProductos((prevList) =>
          prevList.filter((product) => product.id !== id)
        );
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
            <Product
              product={product}
              handleDelete={() => handleDelete(product.id)}
            />
          </div>
        ))}
    </div>
  );
}

export default Productos;
