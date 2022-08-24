import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    saveId: {type: String, required: true},
    message: { type: String, required: true },
    imageUrl: {type: String, required: false}
})

const saveSchema = mongoose.model('save', schema, 'save');
export default saveSchema;
