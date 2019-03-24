var util = require('../util');
var csv = require("fast-csv");
const formidable = require('formidable')
var Story = require('../models/Story');



function parse(story_single) {
    /*
        As a Public User, 
        I want to Search for Information, 
        so that I can obtain publicly available information concerning properties, County services, processes and other general information.
    */

    try {
        var first_comma = story_single.indexOf(',');
        var second_comma = util.findChar(story_single, ',', 2);

        var storyParsed = {
            errorStatus: {
                status: true,
                errors: []
            }
        };
        var isParsed = true;

        // Parse actor
        var actor = false;
        try {
            actor = story_single.substr(5, first_comma-5);
        } catch (error) {
            console.log("While parsing actor on story: ", story_single, error.message);
            isParsed = false;
            storyParsed.errorStatus.errors.push({
                error_type: 'Template Error',
                error_place: 'actor',
                message: error.message
            });
        }

        // Parse goal
        var goal = false;
        try {
            goal = story_single.substr(first_comma + 12, second_comma - (first_comma + 10));
        } catch (error) {
            console.log("While parsing goal on story: ", story_single, error.message);
            isParsed = false;
            storyParsed.errorStatus.errors.push({
                error_type: 'Template Error',
                error_place: 'goal',
                message: error.message
            });
        }

        // Parse reason
        var reason = false;
        try {
            reason = story_single.substr(second_comma + 9);
            if (reason.endsWith('.')) {
                reason = reason.substr(0, reason.length - 1);
            }
        } catch (error) {
            console.log("While parsing reason on story: ", story_single, error.message);
            isParsed = false;
            storyParsed.errorStatus.errors.push({
                error_type: 'Template Error',
                error_place: 'reason',
                message: error.message
            });
        }

        if (actor && util.typeOfUtil(actor) === 'string' && actor.length > 0) {
            storyParsed.actor = actor;
        }

        if (goal && util.typeOfUtil(goal) === 'string' && goal.length > 0) {
            storyParsed.goal = goal;
        }

        if (reason && util.typeOfUtil(reason) === 'string' && reason.length > 0) {
            storyParsed.reason = reason;
        }

        if (storyParsed.reason && storyParsed.goal && storyParsed.reason) {
            storyParsed.errorStatus.status = true;
        } else {
            storyParsed.errorStatus.status = false;
        }

        storyParsed.is_parsed = isParsed;
        storyParsed.full_text = story_single;

        return storyParsed;
    } catch (error) {
        return {
            full_text: story_single,
            errorStatus: {
                status: false,
                errors: [
                    {
                        error_type: 'Unknown',
                        error_place: 'all',
                        message: error.message
                    }
                ]
            }
    }};
 }

function parseAllRaw(story_text){
    if(util.typeOfUtil(story_text) !== 'string'){
        return false;
    }

    var stories = [];
    var storiesParsed = [];

    if(story_text.indexOf('\n') !== -1){
        // There are multiple lines
        var lines = story_text.split('\n');
        for(var i=0; i<lines.length; i++){
            stories.push(lines[i]);
        }
    } else{
        stories.push(story_text);
    }

    for(var i=0; i<stories.length; i++){
        var story = stories[i];
        var story_parsed = parse(story);
        storiesParsed.push(story_parsed);
    }

    return storiesParsed;
}

function parseAllCsv(storyCsv) {
    var storiesParsed = [];

    for (var i = 0; i < storyCsv.length; i++) {
        var story = storyCsv[i];
        var story_parsed = parse(story[1]);
        story_parsed.id_user = story[0];
        storiesParsed.push(story_parsed);
    }

    return storiesParsed;
}

function uploadAndParseFile(req, res, next){

    const projectId = req.params.projectId;
    const format = req.params.format;

    new formidable.IncomingForm().parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error', err)
            throw err
        }
        console.log('Fields', fields)
        console.log('Files', files)

        var csvData = [];
        if(format === 'csv'){
            csv.fromPath(files.csv.path)
                .on('data', data => {
                    console.log(data);
                    csvData.push(data);
                })
                .on('end', () => {
                    console.log('end');
                    var stories = parseAllCsv(csvData);
                    stories.forEach(element => {
                        element.project_id = projectId;
                    });

                    var promise = Story.insertMany(stories);

                    promise.then(function (data) {
                        res.status(200).json(data);
                    }).catch(function (error) {
                        res.status(500).json({
                            error: error
                        })
                    });
                });
        }
    });
}


module.exports = {
    parseAllRaw: parseAllRaw,
    uploadAndParseFile: uploadAndParseFile
}