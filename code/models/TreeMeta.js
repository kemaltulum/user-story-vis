var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TreeMetaSchema = new Schema({
    dataType: {
        type: String,
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


var TreeMeta = mongoose.model('TreeMeta', TreeMetaSchema);

module.exports = TreeMeta;