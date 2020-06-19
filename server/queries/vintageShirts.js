const gql = require("graphql-tag");

// s
const GET_POLICY = gql`
  {
    products(
      first: 12
      reverse: false
      savedSearchId: "gid://shopify/SavedSearch/1484691865751"
    ) {
      edges {
        node {
          id
          title
          totalInventory
          onlineStoreUrl
          featuredImage {
            id
            transformedSrc
          }
        }
      }
    }
  }
`;

module.exports = GET_POLICY;
