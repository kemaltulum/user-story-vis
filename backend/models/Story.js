var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StorySchema = new Schema({
    id_user: {
        type: String,
        required: true,
        unique: true
    },

    full_text: {
        type: String,
        required: true
    },

    actor: {
        type: String,
        lowercase: true,
        trim: true,
        required: false
    },

    goal: {
        type: String,
        lowercase: true,
        trim: true,
        required: false
    },

    reason: {
        type: String,
        lowercase: true,
        trim: true,
        required: false
    },

    is_parsed: {
        type: Boolean,
        required: false
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
    },

    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }
},
    {
        timestamps: true
    }
);


var Story = mongoose.model('Story', StorySchema);

module.exports = Story;