"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getAllCategories,
  newProduct,
  productDetails,
} from "@/utils/graphqlFunctions";
import SwitchOffer from "./SwitchOffer";
import SwitchSellers from "./SwitchOffer";
import { handleDeleteImage, handleSubmit, handleUpdate } from "./querys";

import { ToastContainer, toast } from "react-toastify";
import { Spinner } from "flowbite-react";

function UpdateProduct({ hasEdit, productId }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [publicIdCloudinary, setPublicIdCloudinary] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [bestSellers, setBestSellers] = useState(false);
  const [descripcion, setDescripcion] = useState(false);
  const inputFileRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoArray, setPhotoArray] = useState(null);

  const queryClient = useQueryClient();

  // get product
  const { data, status } = useQuery(
    ["GetProduct", productId],
    () => productDetails(productId),
    {
      enabled: !!productId,
      onSuccess: (data) => {
        setName(data.name);
        setCategory(data.categories ? data?.categories[0] : "");
        setPrice(data.price);
        setDescription(data.description);

        const photosInicio = data.photo.map((item) => ({
          url: item.url,
          publicId: item.publicId,
        }));
        setImageUrl(photosInicio);
        setPublicIdCloudinary(data?.photo[0]?.publicId);
        setCountInStock(data.countInStock);
        setToggle(data.inOffer);
        setDiscountPercentage(data.discountPercentage);
        setBestSellers(data.bestSellers);
      },
    }
  );

  // New Product React Query
  const {
    mutate,
    data: dataMutation,
    status: statusMutation,
    isLoading: isLoadingMutate,
    isSuccess,
    isError,
    error,
  } = useMutation(newProduct, {
    onSuccess: () => {
      setIsLoading(false);
      setName("");
      setPrice(0.0);
      setCountInStock(0);
      setToggle(false);
      setDescripcion(false);
      setBestSellers(false);
      toast.success("Producto publicado con éxito");
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    },
    onError: (error) => {
      // const errorMessage = "Error desconocido";
      // toast.error(errorMessage);
      setIsLoading(false);
    },
  });

  React.useEffect(() => {
    if (isSuccess === "false") {
      // toast.error(errorMutate.errors[0].message);
      alert(error?.errors[0].message);
    }
  }, [isError, error, isSuccess]);

  // Get ALl Categories
  const { data: dataCategories } = useQuery("AllCategories", getAllCategories);

  const capitalizeFirstLetter = (str) => {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  //En esta funcion conviven dos funciones , handlesubmit que sube la imagen a cloudinary, y esta
  // mutate , que es la funcion que sube los datos a la tabla dynamo
  const handleClickForm = async () => {
    setIsLoading(true);
    const capitalizedName = capitalizeFirstLetter(name);

    try {
      const result = await handleSubmit(file);
      console.log(result);
      const photo = result;

      mutate(
        {
          name: capitalizedName,
          price,
          countInStock,
          categories: [category],
          description,
          toggle,
          discountPercentage,
          bestSellers,
          photo,
        },
        {
          onError: (error) => {
            toast.error(error.errors[0].message);
            return;
          },
        }
      );
      if (photo && Array.isArray(photo) && photo.length > 0) {
        const publicIds = photo.map((item) => item.publicId);
        console.log(publicIds);
        const array = {
          publicId: publicIds,
        };
        setPhotoArray(array);
      }

      if (isError || error) {
        try {
          console.log(publicIds);

          alert.message("Buscando Eliminar imagen");
          const response = await fetch(`/api/delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(array),
          });
          // console.log(response);
        } catch (error) {
          console.error("Error de red al eliminar la imagen desde page", error);
        }
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Error al subir producto";
      toast.error(errorMessage, {
        autoClose: false,
      });
      console.error("Error:", error);
    }
  };

  React.useEffect(() => {
    if (isError && photoArray) {
      (async () => {
        console.log("entrando en efect");
        if (photoArray) {
          await fetch(`/api/delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(photoArray),
          });
          alert("Imagen eliminada");
          setPhotoArray(null);
        }
      })();
    }
    if (isError) {
      console.log(error);
    }
  }, [isError, photoArray, error]);

  const handleClickUpdate = async () => {
    const capitalizedName = capitalizeFirstLetter(name);
    try {
      await handleUpdate(
        capitalizedName,
        price,
        countInStock,
        category,
        description,
        toggle,
        discountPercentage,
        bestSellers,
        file,
        imageUrl,
        productId,
        queryClient,
        inputFileRef,
        setIsLoading,
        setFile
      );

      toast.success("Producto Actualizado");
    } catch (error) {
      setIsLoading(false);
      toast.error("Error al actualizar producto");
    }

    // router.push("/productos");
  };

  const handleClickDeleteImage = async (id) => {
    const userConfirmed = window.confirm("¿Seguro de Eliminar esta Imagen?");
    if (userConfirmed) {
      try {
        await handleDeleteImage(
          id,
          imageUrl,
          productId,
          name,
          category,
          price,
          toggle,
          discountPercentage,
          bestSellers,
          queryClient
        );
        toast.warning("Producto Eliminado");
      } catch (error) {
        console.log(error);
        toast.error("Error al eliminar producto");
      }
    }
  };

  // React.useEffect(() => {
  //   if (isSuccess) {
  //     setIsLoading(false);
  //   }
  //   if (isError) {
  //     setIsLoading(false);
  //   }
  // }, [isSuccess, isError]);

  return (
    <div className="   ">
      <div
        className="bg-white  p-5  border  shadow-lg "
        style={{ minHeight: "90vh" }}
      >
        <div className="card  ">
          <div className="card-body">
            <div className="">
              <label
                htmlFor="product_title"
                className="block   text-sm font-bold mt-2"
              >
                Titulo de Producto
              </label>
              <input
                type="text"
                placeholder="Escribir aqui"
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                id="product_title"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="product_title"
                className="block   text-sm font-bold mt-2 "
              >
                Categoria
              </label>
              <div className="  ">
                <select
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {category ? (
                    <option value={category}>{category}</option>
                  ) : (
                    <option value="">Seleccione una categoría</option>
                  )}
                  {dataCategories?.map((category) => (
                    <option key={category.id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="product_price"
                className="block   text-sm font-bold mt-2"
              >
                Precio
              </label>
              <input
                type="number"
                placeholder="Type here"
                className="border border-gray-300 p-2 rounded-md focus:outline-none  focus:ring focus:border-blue-500"
                id="product_price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-4 ">
              <div className="flex items-center  gap-3">
                <SwitchOffer toggle={toggle} setToggle={setToggle} />
                <label
                  htmlFor="product_price"
                  className="block   text-sm font-bold "
                >
                  En oferta
                </label>
              </div>
              {toggle && (
                <div className="flex gap-4">
                  <div className="form-check"></div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="percentage"
                      id="10%"
                      value={10}
                      defaultChecked={discountPercentage === 10}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="10%">
                      10%
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="percentage"
                      id="20%"
                      value={20}
                      defaultChecked={discountPercentage === 20}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="20%">
                      20%
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="percentage"
                      id="50%"
                      value={50}
                      defaultChecked={discountPercentage === 50}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="50%">
                      50%
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center  gap-3">
              <SwitchSellers toggle={bestSellers} setToggle={setBestSellers} />
              <label
                htmlFor="product_price"
                className="block   text-sm font-bold "
              >
                Incluir en productos mas vendidos
              </label>
            </div>

            <div className="mb-4">
              <label
                htmlFor="product_price"
                className="block   text-sm font-bold mt-2"
              >
                Cantidad en Stock
              </label>
              <input
                type="number"
                placeholder="Type here"
                className="border border-gray-300 p-2 rounded-md  focus:outline-none focus:ring focus:border-blue-500"
                id="product_price"
                // required
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>

            <div className="flex items-center  mt-3 mb-3 gap-3">
              <SwitchSellers toggle={descripcion} setToggle={setDescripcion} />
              <label
                htmlFor="product_price"
                className="block   text-sm font-bold "
              >
                Agregar Descripcion
              </label>
            </div>
            {descripcion && (
              <div className="mb-4 ">
                <label className="block   text-sm font-bold mt-2">
                  Descripcion
                </label>
                <textarea
                  placeholder="Escribir aqui"
                  className="border border-gray-500 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  rows="2"
                  // required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            )}

            <div className="flex">
              {imageUrl &&
                imageUrl.map((item) => (
                  <div
                    className="relative"
                    key={item?.publicId}
                    onClick={() => console.log(item?.publicId)}
                  >
                    <div className="bg-red-600 absolute right-2  font-extrabold text-white z-10 rounded-full w-5 h-5 flex justify-center items-center">
                      <button
                        className=" "
                        onClick={() => handleClickDeleteImage(item?.publicId)}
                      >
                        X
                      </button>
                    </div>

                    <Image
                      src={item.url}
                      width={150}
                      height={150}
                      alt="Imagen"
                    />
                  </div>
                ))}
            </div>

            <div className="mb-4">
              <input
                ref={inputFileRef}
                className="bg-gray-100 rounded-md overflow-hidden text-ellipsis whitespace-nowrap px-2"
                multiple
                type="file"
                onChange={(e) => {
                  setFile(e.target.files);
                }}
                style={{ width: "100%", maxWidth: "300px" }}
              />
            </div>

            <button
              disabled={isLoading}
              className="bg-slate-950 text-white px-5 py-2 rounded-md flex justify-center items-center"
              onClick={hasEdit ? handleClickUpdate : handleClickForm}
              style={{ minWidth: 100 }}
            >
              {isLoading ? <Spinner /> : hasEdit ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
      {/* {isError && alert(errorMutate.message)} */}
    </div>
  );
}

export default UpdateProduct;
