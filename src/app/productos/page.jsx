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
import { toast } from "react-toastify";
import { Table } from "flowbite-react";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import React from "react";
import { IoGridOutline } from "react-icons/io5";
import { IoListOutline } from "react-icons/io5";

import Loader from "../components/Loader";
import { capitalizeFirstLetter } from "@/utils/utils";

function Productos() {
  Amplify.configure(amplifyconfig);
  const client = generateClient();
  const queryClient = useQueryClient();
  const [mosaico, setMosaico] = React.useState(false);

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
        toast.warn("Producto Eliminado");
      } catch (error) {
        console.error("Error de red al eliminar la imagen desde page", error);
      }
      try {
        mutate(id);
        queryClient.invalidateQueries("AllProducts");
      } catch (error) {
        console.log(error);
      }
    }
  };

  console.log(isLoading);
  if (isLoading) return <Loader />;
  return (
    <>
      <div className=" flex justify-end items-center  bg-white ">
        <span className="font-bold">View Options</span>
        {mosaico ? (
          <IoListOutline
            size={40}
            className="m-5 bg-slate-600 text-white p-1 rounded-md"
            onClick={() => setMosaico(false)}
          />
        ) : (
          <IoGridOutline
            size={40}
            className="m-5 bg-slate-600 text-white p-1 rounded-md"
            onClick={() => setMosaico(true)}
          />
        )}
      </div>
      <InfiniteScroll
        dataLength={products ? products.length : 0}
        hasMore={hasNextPage}
        next={() => fetchNextPage()}
        // loader={
        //   <div className="mx-auto">
        //     <CircularProgress />
        //   </div>
        // }
      >
        {mosaico ? (
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
                    name={capitalizeFirstLetter(product.name)}
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
        ) : (
          <Table>
            <Table.Body className="divide-y">
              {products?.map((product) => (
                <Table.Row
                  key={product.id}
                  className="flex justify-between relative items-center "
                >
                  <Table.Cell>
                    <span className=" absolute font-bold left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2">
                      {[capitalizeFirstLetter(product.name)]}
                    </span>
                    <Image
                      src={
                        product &&
                        product.photo &&
                        product.photo[0] &&
                        product.photo[0].url
                          ? product.photo[0].url
                          : "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
                      }
                      alt="img"
                      width={80}
                      height={80}
                      style={{ width: "auto", height: "auto" }} // Mantén la proporción
                      // loading="lazy"
                      priority="false"
                    />
                  </Table.Cell>
                  <Table.Cell className="font-extrabold">
                    {product.price} $
                  </Table.Cell>
                  <Table.Cell className="flex   justify-center  gap-2">
                    <button
                      onClick={() => handleDelete(product.id, product.photo)}
                      className="btn btn-danger bg-red-500 text-white py-1 px-2 rounded-md"
                    >
                      <MdDelete size={24} />
                    </button>

                    <Link
                      href={`/product/${product.id}/edit`}
                      className="bg-green-500 mr-2 text-white  flex items-center justify-center px-3 py-3 lg:px-3 lg:py-2 rounded-md hover:bg-green-600 p-2 pb-3 col-span-6 md:col-span-3"
                    >
                      <FaEdit size={24} />
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </InfiniteScroll>
    </>
  );
}

export default Productos;
