import { GraphQLClient } from 'graphql-request';
import { transactionsByOwnerQuery } from "./graphql";

const executeQuery = async function (query: any, variables: any) {
  const client = new GraphQLClient("https://arweave.net/graphql", { headers: {} })
  const result = await client.request(query, variables);
  return result;
};

const getTransactionsByAddress = async function (address: string): Promise<Array<string>> {
  const result = await executeQuery(transactionsByOwnerQuery, { address });
  let transactions = []
  for (let edge of result?.transactions.edges) {
    transactions.push(edge.node.id);
  }
  return transactions;
}

export { getTransactionsByAddress };