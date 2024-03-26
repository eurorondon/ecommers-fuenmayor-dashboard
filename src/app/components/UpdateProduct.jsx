"use client";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import amplifyconfig from "@/aws-exports";
import { generateClient } from "aws-amplify/api";
import { createProduct, updateProduct } from "@/graphql/mutations";
import { getProduct } from "@/graphql/queries";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "react-query";
import {
  getCategories,
  newProduct,
  productDetails,
} from "@/utils/graphqlFunctions";

Amplify.configure(amplifyconfig);
const client = generateClient();

function UpdateProduct({ hasEdit, productId }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryList, setCategoryList] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");

  // console.log("product id  desde update", productId);

  const { data, status, error } = useQuery(
    ["GetProduct", productId],
    () => productDetails(productId),
    {
      enabled: !!productId,
      onSuccess: (data) => {
        setName(data.name);
        // setCategoryList(data?.categories[0]);
        setCategory(data.categories ? data?.categories[0] : "");
        setPrice(data.price);
        setDescription(data.description);
        setImage(data.photo[0].url);
        setCountInStock(data.countInStock);
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

  const { data: dataCategories } = useQuery("AllCategories", getCategories);

  const handleSubmit = async () => {
    let responseImageUrl;
    let imagePublicId;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("esta es la data public_id", data.data.public_id);
      responseImageUrl = data.data.url;
      imagePublicId = data.data.public_id;
    }

    mutate({
      name,
      price,
      categories: [category, categoryList],
      responseImageUrl,
      imagePublicId,
      description: description,
    });
  };

  const handleUpdate = async () => {
    try {
      const result = await client.graphql({
        query: updateProduct,
        variables: {
          input: {
            id: productId,
            name,
            categories: category,
            price,
            description,
            countInStock,
          },
        },
      });
      console.log(result);
      // setName(""), setPrice(""), console.log(res);
      router.push("/productos");
    } catch (error) {
      console.log(error);
    }
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
                  // value={selectedCategory}
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

            {/* <div className="mb-4">
              <label
                htmlFor="product_title"
                className="block   text-sm font-bold mt-2 "
              >
                Categoria 2
              </label>
              <input
                type="text"
                placeholder="Opcional"
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                id="product_title"
                // required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div> */}
            {/* <div className="mb-4">
              <label
                htmlFor="product_title"
                className="block   text-sm font-bold mt-2"
              >
                Categoria 3
              </label>
              <input
                type="text"
                placeholder="Opcional"
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                id="product_title"
                // required
                // value={category3}
                onChange={(e) => setCategory3(e.target.value)}
              />
            </div> */}
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
            {image && (
              <div>
                <Image src={image} width={150} height={150} alt="Imagen" />
              </div>
            )}

            <div className="mb-4">
              <input
                className=" bg-amber-300 rounded-md"
                multiple
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </div>
            <button
              className="bg-slate-950 text-white px-5 py-2 rounded-md"
              onClick={hasEdit ? handleUpdate : handleSubmit}
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
