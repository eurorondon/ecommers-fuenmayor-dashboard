"use client";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import { listProducts } from "@/graphql/queries";
import { useEffect, useState } from "react";
import Product from "../components/Product";
import { deleteProduct } from "@/graphql/mutations";

Amplify.configure(amplifyconfig);
const client = generateClient();

function Productos() {
  const [productos, setProductos] = useState(null);

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

  useEffect(() => {
    (async () => {
      try {
        const data = await client.graphql({
          query: listProducts,
          variables: {},
        });
        if (data) setProductos(data.data.listProducts.items);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  // if (productos) console.log(prodcutos);
  return (
    <div className="container  my-20 grid grid-cols-5 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
