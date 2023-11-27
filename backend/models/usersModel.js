import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    name: String,
    phone_number: String,
    email:  {type: String, unique: true},
    password: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        location: [Number]
    },
    contract_details: [
        {
            house_keeper_id: String,
            house_keeper_name: String,
            start_date: Date,
            end_date: Date,
            total_price: Number,
        }
    ]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;