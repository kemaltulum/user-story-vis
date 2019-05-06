var express = require('express');
var router = express.Router();
var projectsTreeRouter = require('./projectTree');

router.use('/projectsTree', projectsRouter);

module.exports = router;
