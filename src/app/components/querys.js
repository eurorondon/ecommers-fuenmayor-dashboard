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
  let photo = [];
  try {
    if (file) {
      if (file.length > 0) {
        for (let i = 0; i < file.length; i++) {
          const formData = new FormData();
          formData.append("file", file[i]);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.err || "Upload failed");
          }

          const data = await response.json();
          console.log(data);

          // // Modify the URL to include f_auto,q_auto
          // let imageUrl = data.data.url;
          // const parts = imageUrl.split("/upload/");
          // if (parts.length === 2) {
          //   imageUrl = `${parts[0]}/upload/f_auto,q_auto/${parts[1]}`;
          // }

          photo.push({
            url: data.data.url,
            publicId: data.data.publicId,
          });

          console.log("photo is ", photo);
          // if (data) {
          //   console.log("publicId", data.data.publicId);
          //   console.log("url", data.data.url);
          // }
        }
      }
    }

    mutate(
      {
        name,
        price,
        countInStock,
        categories: [category],
        photo,
        description: description,
        inOffer: toggle,
        discountPercentage,
        bestSellers,
      },
      // {
      //   onCompleted: () => {
      //     Router.push("/productos");
      //   },
      // },
      {
        onError: (error) => {
          throw new Error(error.message || "Upload failed");
          // alert(error.message || "Error updating product");
        },
      }
    );
  } catch (error) {
    throw new Error(error.message || "Upload failed");
  }
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
