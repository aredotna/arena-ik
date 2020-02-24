const gql = require('graphql-tag');

const ADD_BLOCK = gql`
  mutation CreateBlock($input: CreateBlockInput!) {
    create_block(input: $input) {
      blokk {
        ... on Model {
          id
        }
      }
    }
  }
`;

module.exports = ADD_BLOCK;
