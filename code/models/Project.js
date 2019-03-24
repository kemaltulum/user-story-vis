var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    name: {
        type: String,
        text: true,
        required: true
    },

    description: {
        type: String,
        text: true,
        required: true
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });


var Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;