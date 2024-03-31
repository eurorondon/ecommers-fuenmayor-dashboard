/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      name
      photo {
        url
        publicId
        __typename
      }
      categories
      color
      description
      reviews {
        name
        rating
        comment
        user
        createdAt
        updatedAt
        __typename
      }
      rating
      numReviews
      price
      countInStock
      createdAt
      updatedAt
      inOffer
      discountPercentage
      bestSellers
      id
      __typename
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        name
        categories
        color
        description
        rating
        numReviews
        price
        countInStock
        createdAt
        updatedAt
        inOffer
        discountPercentage
        bestSellers
        id
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCategories = /* GraphQL */ `
  query GetCategories($id: ID!) {
    getCategories(id: $id) {
      id
      categoryName
      description
      imgUrl
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCategories = /* GraphQL */ `
  query ListCategories(
    $filter: ModelCategoriesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        categoryName
        description
        imgUrl
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
