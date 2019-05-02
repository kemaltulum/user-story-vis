var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StorySchema = new Schema({
    id_user: {
        type: String,
        required: true,
    },

    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },

    full_text: {
        type: String,
        required: true
    },

    actor: {
        type: String,
        trim: true,
        required: false
    },

    action: {
        type: String,
        trim: true,
        required: false
    },

    benefit: {
        type: String,
        trim: true,
        required: false
    },

    is_parsed: {
        type: Boolean,
        required: false
    },

    tokens: {
        action: Schema.Types.Mixed,
        actor: Schema.Types.Mixed,
        benefit: Schema.Types.Mixed
    },

    error_status: {
        status: {
            type: Boolean,
            required: false
        },
        errors: [
            {
                error_type: String,
                error_place: String,
                message: String
            }
        ]
    }
},{ timestamps: true });

StorySchema.index({id_user: 1}, {project_id: 1}, {unique: true});
var Story = mongoose.model('Story', StorySchema);

module.exports = Story;