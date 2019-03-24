const projectResolver = require('./project');
const authResolver = require('./auth');

const rootResolver = {
    ...authResolver,
    ...projectResolver
};

module.exports = rootResolver;
