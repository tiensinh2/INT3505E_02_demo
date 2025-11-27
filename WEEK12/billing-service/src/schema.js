const { gql } = require('apollo-server');

const typeDefs = gql`
  type Invoice {
    id: ID!
    userId: Int!
    amount: Float!
    status: String!
    createdAt: String!
  }

  type Query {
    invoices(userId: Int, status: String, from: String, to: String): [Invoice!]!
    invoice(id: ID!): Invoice
  }
`;

module.exports = typeDefs;
