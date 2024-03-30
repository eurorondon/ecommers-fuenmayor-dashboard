import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import {
  listProducts,
  getProduct,
  listCategories,
  getCategories,
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
  countInStock,
  description,
  categories,
  responseImageUrl,
  imagePublicId,
  photo,
  inOffer,
  discountPercentage,
  bestSellers,
}) {
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
        countInStock,
        description,
        categories,
        // photo: {
        //   url: responseImageUrl,
        //   publicId: imagePublicId,
        // },
        photo,
        inOffer,
        discountPercentage,
        bestSellers,
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

export async function getAllCategories() {
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
    query: getCategories,
    variables: { id },
  });

  return res.data.getCategories;
}
