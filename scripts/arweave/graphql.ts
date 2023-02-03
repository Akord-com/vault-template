import { gql } from 'graphql-request';

const transactionsByOwnerQuery = gql`
query transactionsByOwner($address: String!) {
  transactions(owners:[$address]) {
      edges {
          node {
              id
          }
      }
  }
}
`;

export {
  transactionsByOwnerQuery
}