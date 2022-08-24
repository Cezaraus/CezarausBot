import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    saveId: {type: String, required: true},
    message: { type: String, required: true },
})

const saveSchema = mongoose.model('save', schema, 'save');
export default saveSchema;
