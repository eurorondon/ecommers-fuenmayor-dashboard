"use client";
import React from "react";
import { useParams } from "next/navigation";
import { listProducts } from "@/graphql/queries";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import Product from "@/app/components/Product";
import { deleteProductFunction } from "@/utils/graphqlFunctions";
import { toast } from "react-toastify";

Amplify.configure(amplifyconfig);
const client = generateClient();

function Page() {
  const queryClient = useQueryClient();

  const { categoria } = useParams();

  //DELETE PRODUCT WITH REACT QUERY
  const { mutate } = useMutation(deleteProductFunction, {
    onSuccess: () => {
      queryClient.invalidateQueries(`infinity-products-${categoria}`);
    },
  });

  const handleDelete = async (id, photo) => {
    const publicId = photo.map((item) => item.publicId);

    const userConfirmed = window.confirm("¿Seguro de Eliminar este Producto?");
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

        try {
          mutate(id);
          queryClient.invalidateQueries(`infinity-products-${categoria}`);
        } catch (error) {
          console.log(error);
        }
        toast.warn("Producto Eliminado");
      } catch (error) {
        console.error("Error de red al eliminar la imagen desde page", error);
        toast.error("Error al eliminar producto");
      }
    }
  };

  console.log(categoria);
  const { data, isLoading, hasNextPage, fetchNextPage, refetch, isFetching } =
    useInfiniteQuery(
      [categoria ? `infinity-products-${categoria}` : "infinity-products"],
      async ({ pageParam }) => {
        try {
          // const filter = {
          //   ...(categoria ? { categories: { contains: categoria } } : {}),
          //   ...(search !== "" ? { name: { contains: search } } : {}),
          // };

          // let filter;
          // if (categoria) {
          //   filter = { categories: { contains: categoria } };
          // }

          // if (search) {
          //   filter = { name: { contains: search } };
          // }

          const productsData = await client.graphql({
            query: listProducts,
            variables: {
              // limit: 100,
              filter: { categories: { contains: categoria } },
              nextToken: pageParam,
            },
          });

          return productsData.data.listProducts;
        } catch (err) {
          console.error("Error fetching todos", err.errors);
          throw err;
        }
      },
      {
        // refetchOnMount: false,
        // refetchInterval: false,
        // refetchOnWindowFocus: false,
        // refetchIntervalInBackground: false,
        // onSuccess: (data) => {},
        getNextPageParam: (lastPage) => {
          return lastPage.nextToken || null;
        },
      }
    );

  const products =
    data?.pages.reduce(
      (prevProducts, page) => prevProducts.concat(page.items),
      []
    ) ?? [];

  console.log(products);

  return (
    <div>
      {" "}
      <InfiniteScroll
        dataLength={products ? products.length : 0}
        hasMore={hasNextPage}
        next={() => fetchNextPage()}
        // loader={
        //   <div className="mx-auto">
        //     <Loading />
        //   </div>
        // }
      >
        <div className=" grid grid-cols-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-col-4 xl:grid-cols-5 md:p-10 lg:p-10 p-2 gap-0   ">
          {products?.map((product) => (
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
                  handleDelete={handleDelete}
                />
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Page;
