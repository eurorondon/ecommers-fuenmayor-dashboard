"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { listProducts } from "@/graphql/queries";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import { useQuery } from "react-query";

import Product from "../components/Product";

function Page() {
  const searchParams = useSearchParams();
  Amplify.configure(amplifyconfig);
  const client = generateClient();
  const search = searchParams.get("search");

  console.log(search);

  const { data, refetch } = useQuery(
    `Keyword`,
    async () => {
      try {
        const res = await client.graphql({
          query: listProducts,
          variables: {
            // limit: 10,
            filter: { name: { contains: search } },
            // nextToken: pageParam,
          },
        });

        return res.data.listProducts.items;
      } catch (error) {
        console.error("Error fetching products data:", error);
        return null;
      }
    },
    {
      enabled: false, // disable the query by default
    }
  );

  React.useEffect(() => {
    refetch({ search }); // refetch with the new search value
  }, [search, refetch]);

  return (
    <div>
      <div className="mt-10 ml-10 text-xl">
        <span>Resultado de Busqueda:</span>
      </div>
      {data?.length === 0 ? (
        <div className="flex justify-center items-center h-80 mb-10">
          <span className="text-4xl">Sin resultados </span>
        </div>
      ) : (
        <div className=" grid grid-cols-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-col-4 xl:grid-cols-5 md:p-10 lg:p-10 p-2 gap-0    ">
          {data?.map((product) => (
            <div key={product.id}>
              <div
                style={{ cursor: "pointer" }}
                className=""
                // onClick={() => handleNavigate(product.id)}
                //  to={`/products/${product.id}`}
              >
                <Product
                  id={product.id}
                  url={product?.photo[0]?.url}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  offer={product.inOffer}
                  discountPercentage={product.discountPercentage}
                  photo={product.photo}
                  // handleDelete={handleDelete}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Page;
