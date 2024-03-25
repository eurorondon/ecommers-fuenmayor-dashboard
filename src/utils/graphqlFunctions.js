import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import {
  listProducts,
  getProduct,
  listCategories,
  getCategory,
} from "@/graphql/queries";
import {
  createCategories,
  createProduct,
  deleteCategories,
  deleteProduct,
} from "@/graphql/mutations";

Amplify.configure(amplifyconfig);
const client = generateClient();

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

export async function deleteProductFunction(id) {
  const res = await client.graphql({
    query: deleteProduct,
    variables: { input: { id } },
  });
  return res;
}

export async function newCategory({ categoryName, description, imgUrl }) {
  console.log(categoryName);
  // if (typeof price !== "number" || isNaN(price)) {
  //   console.error('Error: El valor de "price" no es un número válido.');
  //   throw new Error('Error: El valor de "price" no es un número válido.');
  // }
  const res = await client.graphql({
    query: createCategories,
    variables: {
      input: {
        categoryName,
        description,
        imgUrl,
      },
    },
  });
  return res;
}

export async function getCategories() {
  const res = await client.graphql({
    query: listCategories,
    variables: {},
  });

  return res.data.listCategories.items;
}

export async function deleteCategory(id) {
  const res = await client.graphql({
    query: deleteCategories,
    variables: { input: { id } },
  });
  return res;
}

export async function getCategoria(id) {
  console.log(id);
  const res = await client.graphql({
    query: getCategory,
    variables: { id },
  });

  return res.data.getCategories;
}
