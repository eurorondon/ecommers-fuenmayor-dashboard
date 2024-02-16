"use client";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import amplifyconfig from "@/aws-exports";
import { generateClient } from "aws-amplify/api";
import { createProduct, updateProduct } from "@/graphql/mutations";
import { getProduct } from "@/graphql/queries";
import Image from "next/image";
import { useRouter } from "next/navigation";

Amplify.configure(amplifyconfig);
const client = generateClient();

function UpdateProduct({ hasEdit, productId }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [image, setImage] = useState("");
  const [product, setProduct] = useState({});

  console.log("product id  desde update", productId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!productId) {
          console.log("productId es null, no se realiza la consulta");
          return;
        }

        const data = await client.graphql({
          query: getProduct,
          variables: {
            id: productId,
          },
        });

        console.log("este es el resultado de un producto");

        setName(data.data.getProduct.name);
        setPrice(data.data.getProduct.price);
        setImage(data.data.getProduct.photo[0].url);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Llama a la función fetchData dentro del useEffect
  }, [hasEdit, productId]);

  console.log(productId);

  console.log(product);
  console.log(hasEdit);

  const handleSubmit = async () => {
    let responseImageUrl;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      responseImageUrl = data.url;
    }

    try {
      const res = await client.graphql({
        query: createProduct,
        variables: {
          input: {
            name,
            price,
            photo: {
              url: responseImageUrl,
            },
          },
        },
      });
      setName(""), setPrice(""), console.log(res);
      router.push("/productos");
    } catch (error) {
      console.log(error.errors[0].message);
      alert(error.errors[0].message);
    }
  };

  const handleUpdate = async () => {
    try {
      const result = await client.graphql({
        query: updateProduct,
        variables: {
          input: {
            id: productId,
            name,
            price,
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
    <div className=" flex-row h-screen flex justify-center items-center bg-slate-700">
      <div className="">
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <div className="mb-4">
              <label
                htmlFor="product_title"
                className="block text-stone-50  text-sm font-bold mb-2"
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
                className="block text-stone-50 text-sm font-bold mb-2"
              >
                Categoria
              </label>
              <div className="  ">
                <select
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  // value={selectedCategory}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Seleccione una categoría</option>
                  {/* {categoriesList.categories.map((category) => (
                  <option key={category._id} value={category.categoria}>
                    {category.categoria}
                  </option>
                ))} */}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="product_title"
                className="block text-stone-50 text-sm font-bold mb-2 "
              >
                Categoria 2
              </label>
              <input
                type="text"
                placeholder="Opcional"
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                id="product_title"
                // required
                // value={category2}
                onChange={(e) => setCategory2(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="product_title"
                className="block text-sm text-slate-50 font-bold mb-2"
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
            </div>
            <div className="mb-4">
              <label
                htmlFor="product_price"
                className="block text-slate-50 font-bold mb-2"
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
                className="block text-slate-50 font-bold mb-2"
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
              <label className="block text-slate-50 font-bold mb-2">
                Descripcion
              </label>
              <textarea
                placeholder="Escribir aqui"
                className="border border-gray-500 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                rows="7"
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
