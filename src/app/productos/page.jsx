"use client";

import Product from "../components/Product";
import { deleteProductFunction, getProducts } from "@/utils/graphqlFunctions";
import {
  useQueryClient,
  useMutation,
  useQuery,
  useInfiniteQuery,
} from "react-query";
import DrawerMenu from "../components/DrawerMenu";
import { useParams } from "next/navigation";
import { listProducts } from "@/graphql/queries";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import InfiniteScroll from "react-infinite-scroll-component";

function Productos() {
  Amplify.configure(amplifyconfig);
  const client = generateClient();
  const queryClient = useQueryClient();

  const { category, search } = useParams();

  //GET ALL PRODUCST WITH REACT QUERY
  // const { data: productos } = useQuery("AllProducts", getProducts);

  // const handleNavigate = (id) => {
  //   window.scroll(0, 0);
  //   navigate(`/products/${id}`);
  // };

  const { data, isLoading, hasNextPage, fetchNextPage, refetch, isFetching } =
    useInfiniteQuery(
      [category ? `infinity-products-${category}` : "infinity-products"],
      async ({ pageParam }) => {
        try {
          // const filter = {
          //   ...(category ? { categories: { contains: category } } : {}),
          //   // ...(search !== "" ? { name: { contains: search } } : {}),
          // };

          let filter;
          if (category) {
            filter = { categories: { contains: category } };
          }

          if (search) {
            filter = { name: { contains: search } };
          }

          const productsData = await client.graphql({
            query: listProducts,
            variables: {
              limit: 10,
              filter,
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
      {/* <div className="  grid grid-cols-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 md:p-10 lg:p-10 p-2 gap-0  ">
        {products &&
          products.map((product) => (
            <div className="z-0" key={product.id}>
              <Product product={product} handleDelete={handleDelete} />
            </div>
          ))}
      </div> */}
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
        <div className=" grid grid-cols-5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 md:p-10 lg:p-10 p-2 gap-0   ">
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
                />
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
}

export default Productos;
