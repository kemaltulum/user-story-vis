var express = require('express');
var router = express.Router();
var Story = require('../models/Story');


var storiesCtrl = require('../controllers/stories');

/* GET all the stories of a project. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/:projectId/upload/:format', storiesCtrl.uploadAndParseFile);

/* POST save new story or stories to a project */
router.post('/:projectId/add/:format', function (req, res, next) {

    const body = req.body;
    const projectId = req.params.projectId;
    const format = req.params.format;

    console.log(body);

    var stories = [];
    if(format === 'raw'){
        var storiesText = body.stories_text;
        stories = storiesCtrl.parseAllRaw(storiesText);
        stories.forEach(element => {
            element.project_id = projectId;
        });
    }

    var promise = Story.insertMany(stories);

    promise.then(function (saved) {
        res.status(200).json(saved);
    }).catch(function (error) {
        res.status(500).json({
            error: error
        })
    });
});

module.exports = router;
