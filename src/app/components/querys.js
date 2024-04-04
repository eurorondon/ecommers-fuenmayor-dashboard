import { updateProduct } from "@/graphql/mutations";
import { Amplify } from "aws-amplify";
import amplifyconfig from "@/aws-exports";
import { generateClient } from "aws-amplify/api";
import { Router } from "next/router";

Amplify.configure(amplifyconfig);
const client = generateClient();

export const handleSubmit = async (
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
) => {
  console.log("esto es price", price);
  let photo = [];
  if (file) {
    if (file.length > 0) {
      for (let i = 0; i < file.length; i++) {
        const formData = new FormData();
        formData.append("file", file[i]);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        photo.push({
          url: data.data.url,
          publicId: data.data.public_id,
        });
        console.log(photo);
      }
    }
  }

  mutate({
    name,
    price,
    countInStock,
    categories: [category],
    photo,
    description: description,
    inOffer: toggle,
    discountPercentage,
    bestSellers,
  });
};

export const handleUpdate = async (
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
) => {
  setIsLoading(true);
  let photo = imageUrl;

  if (file) {
    if (file.length > 0) {
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
      }
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
            // photo: imageUrl,
            photo,
          },
        },
      });

      queryClient.invalidateQueries("GetProduct");
      setFile(null);
      inputFileRef.current.value = "";
      // Router.push("/productos");
    } catch (error) {
      console.log(error);
    }
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
    setIsLoading(false);
  } catch (error) {
    console.log(error);
  }
};

export const handleDeleteImage = async (
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
) => {
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
  } catch (error) {
    console.log(error);
  }
};
