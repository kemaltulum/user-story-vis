const projectResolver = require('./project');
const authResolver = require('./auth');
const storyResolver = require('./story');
const { GraphQLJSONObject } = require('graphql-type-json');

const rootResolver = {
    ...authResolver,
    ...projectResolver,
    ...storyResolver,
    JSONObject: GraphQLJSONObject
};

module.exports = rootResolver;
