import { mongoose, Schema } from "../commons/mongo";

const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: Array
    },
    user_id: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

const Notes = mongoose.model('note', noteSchema);

export {
    Notes
}