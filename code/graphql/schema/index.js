const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Project {
    _id: ID!
    name: String!
    description: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdProject: [Project!]
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

input UserInput {
  email: String!
  password: String!
}

type RootQuery {
    projects: [Project!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
  createProject(name: String!, description: String!): Project!
  createUser(userInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
