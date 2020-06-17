const gql = require("graphql-tag");

// savedSearchId: "gid://shopify/SavedSearch/1484691865751"
const GET_POLICY = gql`
  {
    products(first: 10, reverse: true) {
      edges {
        node {
          id
          title
          totalInventory
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
