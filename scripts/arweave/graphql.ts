import { gql } from 'graphql-request';

const transactionsByOwnerQuery = gql`
query transactionsByOwner($address: String!, $nextToken: String) {
  transactions(owners:[$address], first: 100, after: $nextToken) {
      edges {
          node {
              id
          }
          cursor
      }
      pageInfo {
        hasNextPage
      }
  }
}
`;

export {
  transactionsByOwnerQuery
}