"use client";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import amplifyconfig from "@/aws-exports";
import { generateClient } from "aws-amplify/api";
import { createProduct, updateProduct } from "@/graphql/mutations";
import { getProduct } from "@/graphql/queries";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getAllCategories,
  newProduct,
  productDetails,
} from "@/utils/graphqlFunctions";
import SwitchOfert from "./SwitchOffer";
import SwitchOffer from "./SwitchOffer";
import SwitchSellers from "./SwitchOffer";

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
  const [imageUrl, setImageUrl] = useState("");
  const [publicIdCloudinary, setPublicIdCloudinary] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [bestSellers, setBestSellers] = useState(false);

  console.log("this is file ", file);
  const queryClient = useQueryClient();

  // console.log("product id  desde update", productId);

  const { data, status, error } = useQuery(
    ["GetProduct", productId],
    () => productDetails(productId),
    {
      enabled: !!productId,
      onSuccess: (data) => {
        console.log(data);
        setName(data.name);
        // setCategoryList(data?.categories[0]);
        setCategory(data.categories ? data?.categories[0] : "");
        setPrice(data.price);
        setDescription(data.description);
        setImageUrl(data.photo);
        setPublicIdCloudinary(data?.photo[0]?.publicId);
        setCountInStock(data.countInStock);
        setToggle(data.inOffer);
        setDiscountPercentage(data.discountPercentage);
        setBestSellers(data.bestSellers);
      },
    }
  );

  console.log(imageUrl);

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

  const { data: dataCategories } = useQuery("AllCategories", getAllCategories);

  const handleSubmit = async () => {
    let responseImageUrl = [];
    let imagePublicId = [];
    let photo = [];
    if (file) {
      if (file.length > 0) {
        console.log("Más de un archivo");
        for (let i = 0; i < file.length; i++) {
          const formData = new FormData();
          formData.append("file", file[i]);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();

          photo.push({
            url: data.data.url, // Suponiendo que la URL de la imagen está en la propiedad 'url' de la respuesta
            publicId: data.data.public_id, // Suponiendo que el publicId está en la propiedad 'public_id' de la respuesta
          });
          console.log(photo);
        }
        // Verificar si la respuesta del servidor es válida
      } else {
        console.log("una sola imagen");
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("esta es la data public_id", data.data.public_id);
        photo.push({
          url: data.data.url, // Suponiendo que la URL de la imagen está en la propiedad 'url' de la respuesta
          publicId: data.data.publicId, // Suponiendo que el publicId está en la propiedad 'public_id' de la respuesta
        });
      }
    }

    mutate({
      name,
      price,
      categories: [category, categoryList],
      responseImageUrl,
      imagePublicId,
      photo,
      description: description,
      inOffer: toggle,
      discountPercentage,
      bestSellers,
    });
  };

  const handleUpdate = async () => {
    let responseImageUrl;
    let imagePublicId;
    let photo = [];

    if (file) {
      if (file.length > 0) {
        console.log("Más de un archivo");
        for (let i = 0; i < file.length; i++) {
          const formData = new FormData();
          formData.append("file", file[i]);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();

          photo.push({
            url: data.data.url, // Suponiendo que la URL de la imagen está en la propiedad 'url' de la respuesta
            publicId: data.data.public_id, // Suponiendo que el publicId está en la propiedad 'public_id' de la respuesta
          });
          console.log("imprimiendo valor de photo = ", photo);
        }
        // Verificar si la respuesta del servidor es válida
      } else {
        console.log("una sola imagen");
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("esta es la data public_id", data.data.public_id);
        photo.push({
          url: data.data.url, // Suponiendo que la URL de la imagen está en la propiedad 'url' de la respuesta
          publicId: data.data.publicId, // Suponiendo que el publicId está en la propiedad 'public_id' de la respuesta
        });
      }

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
              inOffer: toggle,
              discountPercentage,
              bestSellers,
              // photo: {
              //   url: responseImageUrl,
              //   publicId: imagePublicId,
              // },
              photo,
            },
          },
        });

        // setName(""), setPrice(""),
        router.push("/productos");
      } catch (error) {
        console.log(error);
      }
      // try {
      //   const response = await fetch(`/api/delete`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ publicId: publicIdCloudinary }),
      //   });
      //   // console.log(response);
      // } catch (error) {
      //   console.error("Error de red al eliminar la imagen desde page", error);
      // }
    }
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
            inOffer: toggle,
            discountPercentage,
            bestSellers,
          },
        },
      });

      router.push("/productos");
      setName(""), setPrice(""), console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      const response = await fetch(`/api/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicId: [id] }),
      });
      // console.log(response);
    } catch (error) {
      console.error("Error de red al eliminar la imagen desde page", error);
    }

    const filtrando = imageUrl.filter((item) => item.publicId !== id);
    console.log("el id para filtrar = ", id);
    console.log("filtrando", filtrando);

    const filtrandoFormatted = filtrando.map((item) => ({
      url: item.url,
      publicId: item.publicId,
    }));
    try {
      const result = await client.graphql({
        query: updateProduct,
        variables: {
          input: {
            id: productId,
            name,
            categories: category,
            price,
            photo: filtrandoFormatted,
            inOffer: toggle,
            discountPercentage,
            bestSellers,
          },
        },
      });

      console.log(result);
      queryClient.invalidateQueries("GetProduct");

      // setName(""), setPrice(""), console.log(res);
      // router.push("/productos");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log(discountPercentage);
  }, [discountPercentage]);

  const handleDiscountChange = (value) => {
    setSelectedDiscount(value);
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
                        onClick={() => handleDeleteImage(item?.publicId)}
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
