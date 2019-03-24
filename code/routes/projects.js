var express = require('express');
var router = express.Router();
var Project = require('../models/Project');

/* GET all the projects. */
router.get('/', function (req, res, next) {


    var promise = Project.find({});

    promise.then(function (data) {
        res.status(200).json(data);
    }).catch(function (error) {
        res.status(500).json({
            error: error
        })
    });
});

/* POST save a new project*/
router.post('/', function(req, res, next){
    const body = req.body;

    console.log(body);

    var newProject = new Project({
        name: body.name,
        description: body.description
    });

    var promise = newProject.save();

    promise.then(function(saved){
        res.status(200).json(saved);
    }).catch(function (error){
        res.status(500).json({
            error: error
        })
    });
});

module.exports = router;
