import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import { listProducts } from "@/graphql/queries";
import { createProduct } from "@/graphql/mutations";

Amplify.configure(amplifyconfig);
const client = generateClient();

export async function getProducts() {
  const data = await client.graphql({
    query: listProducts,
    variables: {},
  });

  return data.data.listProducts.items;
}

export async function newProduct(responseImageUrl) {
  const data = await client.graphql({
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
  return data;
}
