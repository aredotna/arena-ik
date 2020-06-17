const gql = require("graphql-tag");

const GET_POLICY = gql`
  {
    me {
      policy {
        key
        AWSAccessKeyId
        acl
        success_action_status
        policy
        signature
        bucket
      }
    }
  }
`;

module.exports = GET_POLICY;
