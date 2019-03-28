const projectResolver = require('./project');
const authResolver = require('./auth');
const storyResolver = require('./story');

const rootResolver = {
    ...authResolver,
    ...projectResolver,
    ...storyResolver
};

module.exports = rootResolver;
