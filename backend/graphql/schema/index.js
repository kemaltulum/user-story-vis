const { buildSchema } = require('graphql');

module.exports = buildSchema(`
scalar JSONObject
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

type Story {
  _id: ID!
  id_user: String!
  project_id: Project!
  full_text: String!
  actor: String
  action: String
  benefit: String
  is_parsed: Boolean
  tokens: TagData
  error_status: ErrorsStory
}

type TreeNode {
  _id: ID!
  name: String
  nodeType: String!
  project_id: String!
  stories: [Story!]!
  isRoot: Boolean
  children: [String!]!
}

type ErrorsStory {
  status: Boolean
  errors: [ErrorStory!]!
}

type ErrorStory {
  error_type: String
  error_place: String
  message: String!
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

type TokenData {
  expired: Boolean!
}

type TagDetailSec {
  verb: String
  object: String
}

type TagDetail {
  main_verb: String
  main_object: TagObject
  sec_verbs: [TagDetailSec]
}

type TagObject {
  chunk: String
  text: String
}

type TagData {
  action: TagDetail
  actor: TagDetail
  benefit: TagDetail
}

type ProjectMeta {
  _id: ID!
  project_id: String!
  type: String!
  data: JSONObject!
}

input StoryInput {
  project_id: String!
  full_text: String!
}

input UserInput {
  email: String!
  password: String!
}

type RootQuery {
    projects: [Project!]!
    login(email: String!, password: String!): AuthData!
    stories(projectId: String!): [Story!]!
    verifyToken(token: String!): TokenData!
    storyTree(projectId: String!, nodeType: String!): [TreeNode!]!
    projectMeta(projectId: String!, type: String!): ProjectMeta
}

type RootMutation {
  createProject(name: String!, description: String!): Project!
  createUser(userInput: UserInput): User!
  addStory(storyInput: StoryInput): Story!
  addStoryBulkRaw(rawText: String!, projectId: String!): [Story!]!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
