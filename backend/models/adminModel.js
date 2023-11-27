import mongoose from 'mongoose';

const AdminSchema = mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

export default Admin;