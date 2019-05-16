var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectMetaSchema = new Schema({
    type: {
        type: String,
        required: true
    },

    data: {
        type: Schema.Types.Mixed,
        required: true
    },

    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }
}, { timestamps: true });


var ProjectMeta = mongoose.model('ProjectMeta', ProjectMetaSchema);

module.exports = ProjectMeta;