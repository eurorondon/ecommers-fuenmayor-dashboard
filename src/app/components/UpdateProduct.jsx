"use client";
import React, { useState } from "react";
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
  const inputFileRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  // get product
  const { data, status, error } = useQuery(
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
  } = useMutation(newProduct, {
    onSuccess: () => {
      setName(""), setPrice(""), router.push("/productos");
    },
  });

  // Get ALl Categories
  const { data: dataCategories } = useQuery("AllCategories", getAllCategories);

  const handleClickForm = () => {
    handleSubmit(
      name,
      price,
      countInStock,
      category,
      description,
      toggle,
      discountPercentage,
      bestSellers,
      file,
      mutate
    );
  };

  const handleClickUpdate = () => {
    handleUpdate(
      name,
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
  };

  const handleClickDeleteImage = (id) => {
    handleDeleteImage(
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
  };

  return (
    <div className=" flex-row h-screen flex justify-center items-center ">
      <div className="">
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
            <div className="mb-4">
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
            {isLoading ? (
              <h1 className="text-6xl">Cargando</h1>
            ) : (
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
            )}

            <div className="mb-4">
              <input
                ref={inputFileRef}
                className=" bg-amber-300 rounded-md"
                multiple
                type="file"
                onChange={(e) => {
                  setFile(e.target.files);
                }}
              />
            </div>
            <button
              className="bg-slate-950 text-white px-5 py-2 rounded-md"
              onClick={hasEdit ? handleClickUpdate : handleClickForm}
            >
              {hasEdit ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
