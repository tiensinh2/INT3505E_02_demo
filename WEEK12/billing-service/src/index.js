const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');

// Sample in-memory invoices
let invoices = [
  { id: '1', userId: 1, amount: 100.0, status: 'paid', createdAt: new Date().toISOString() },
  { id: '2', userId: 1, amount: 55.5, status: 'pending', createdAt: new Date().toISOString() },
  { id: '3', userId: 2, amount: 12.0, status: 'failed', createdAt: new Date().toISOString() }
];

const resolvers = {
  Query: {
    invoices: (_, args) => {
      let res = invoices.slice();
      if (args.userId != null) res = res.filter(i => i.userId === args.userId);
      if (args.status) res = res.filter(i => i.status === args.status);
      if (args.from) res = res.filter(i => new Date(i.createdAt) >= new Date(args.from));
      if (args.to) res = res.filter(i => new Date(i.createdAt) <= new Date(args.to));
      return res;
    },
    invoice: (_, { id }) => invoices.find(i => i.id === id)
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 3002 }).then(({ url }) => {
  console.log(`Billing GraphQL running at ${url}`);
});
