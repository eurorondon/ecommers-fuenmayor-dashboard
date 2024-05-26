"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { listProducts } from "@/graphql/queries";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Product from "../components/Product";
import { deleteProductFunction } from "@/utils/graphqlFunctions";
import { toast } from "react-toastify";
import { Table } from "flowbite-react";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { IoGridOutline, IoListOutline } from "react-icons/io5";
import Loader from "../components/Loader";

function Page() {
  const [mosaico, setMosaico] = React.useState(false);
  const searchParams = useSearchParams();
  Amplify.configure(amplifyconfig);
  const client = generateClient();
  const search = searchParams.get("search");
  const [cargando, setCargando] = React.useState(true);

  console.log(search);
  const queryClient = useQueryClient();

  const { data, refetch, isLoading } = useQuery(
    [`Keywords`],
    async () => {
      try {
        const res = await client.graphql({
          query: listProducts,
          variables: {
            limit: 500,
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

  //DELETE PRODUCT WITH REACT QUERY
  const { mutate } = useMutation(deleteProductFunction, {
    onSuccess: () => {
      queryClient.invalidateQueries(`Keyword`);
      refetch();
    },
  });

  React.useEffect(() => {
    if (isLoading) {
      setCargando(false);
    }
  }, [isLoading]);

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
        toast.error("Error al eliminar producto");
      }
      try {
        mutate(id);
        queryClient.invalidateQueries(`Keyword`);
        // toast.warn("Producto Eliminado");
      } catch (error) {
        console.log(error);
        // toast.error("Error al eliminar producto");
      }
    }
  };

  React.useEffect(() => {
    refetch({ search }); // refetch with the new search value
  }, [search, refetch]);

  console.log(isLoading);

  if (cargando) return <Loader />;
  // if (isLoading) return <Loader />;

  return (
    <div className="bg-white" style={{ minHeight: "100vh" }}>
      <div className=" flex justify-end items-center   ">
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
      <div className=" ml-5 text-lg font-semibold">
        <span>Resultado de Busqueda:</span>
      </div>
      {data?.length === 0 ? (
        <div className="flex justify-center items-center h-80 mb-10">
          <span className="text-4xl">Sin resultados </span>
        </div>
      ) : mosaico ? (
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
                  handleDelete={handleDelete}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Table>
          <Table.Body className="divide-y">
            {data?.map((product) => (
              <Table.Row
                key={product.id}
                className="flex justify-between relative items-center "
              >
                <Table.Cell>
                  <span className=" absolute font-bold left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    {[product.name]}
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
                    loading="lazy"
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
    </div>
  );
}

export default Page;
