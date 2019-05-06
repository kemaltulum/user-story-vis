var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TreeNodeSchema = new Schema({
    nodeType: {
        type: String,
    },

    name: {
        type: String,
        required: true
    },

    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },

    story_ids: [{
        type: Schema.Types.ObjectId,
        ref: 'Story',
    }],

    isRoot: Boolean,

    children: [{
        type: Schema.Types.ObjectId,
        ref: 'TreeNode',
        required: true
    }]
}, { timestamps: true });


var TreeNode = mongoose.model('TreeNode', TreeNodeSchema);

module.exports = TreeNode;