const gql = require("graphql-tag");

const GET_SHIRTS = gql`
  {
    products(
      first: 12
      reverse: false
      savedSearchId: "gid://shopify/SavedSearch/1489445486743"
    ) {
      edges {
        node {
          id
          title
          totalInventory
          onlineStoreUrl
          images(first: 2) {
            edges {
              node {
                transformedSrc
              }
            }
          }
          featuredImage {
            id
            transformedSrc
          }
        }
      }
    }
  }
`;

module.exports = GET_SHIRTS;
