import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {type: string, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    imageUrl: {type: Object, default: {}}
}, {minimize: false})

const Usaer = mongoose.models.user || mongoose.model('User', userSchema);

export default User