import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    url: String,
    userId: String,
    status: String,
    statusText: String
});


export default mongoose.model('urls',schema)