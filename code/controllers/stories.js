

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