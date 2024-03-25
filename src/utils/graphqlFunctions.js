import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import { listProducts, getProduct } from "@/graphql/queries";
import { createProduct, deleteProduct } from "@/graphql/mutations";

Amplify.configure(amplifyconfig);
const client = generateClient();

export async function getProducts() {
  const res = await client.graphql({
    query: listProducts,
    variables: {},
  });

  return res.data.listProducts.items;
}

export async function productDetails(id) {
  const res = await client.graphql({
    query: getProduct,
    variables: {
      id,
    },
  });
  return res.data.getProduct;
}

export async function newProduct({
  name,
  price,
  description,
  categories,
  responseImageUrl,
  imagePublicId,
}) {
  console.log(imagePublicId);
  // if (typeof price !== "number" || isNaN(price)) {
  //   console.error('Error: El valor de "price" no es un número válido.');
  //   throw new Error('Error: El valor de "price" no es un número válido.');
  // }
  const res = await client.graphql({
    query: createProduct,
    variables: {
      input: {
        name,
        price,
        description,
        categories,
        photo: {
          url: responseImageUrl,
          publicId: imagePublicId,
        },
      },
    },
  });
  return res;
}

// export async function uploadPicture(formData) {
//   console.log("pase por uploadpicture");
//   const res = await fetch("/api/upload", {
//     method: "POST",
//     body: formData,
//   });
//   const data = await res.json();
//   console.log(data);
//   return data.url;
// }

export async function deleteProductFunction(id) {
  const res = await client.graphql({
    query: deleteProduct,
    variables: { input: { id } },
  });
  return res;
}
