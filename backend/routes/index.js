var express = require('express');
var router = express.Router();
var usersRouter = require('./users');
var projectsRouter = require('./projects');
var storiesRouter = require('./stories');

router.use('/users', usersRouter);
router.use('/projects', projectsRouter);
router.use('/stories', storiesRouter);

module.exports = router;
