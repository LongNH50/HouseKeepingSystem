import mongoose from "mongoose";

const HouseKeeperSchema = mongoose.Schema(
  {
    admin_id: mongoose.Types.ObjectId,
    name: String,
    phone_number: String,
    email:  {type: String, unique: true},
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      location: [Number],
    },
    availability: Boolean,
    hourly_rate: Number,
    year_of_experience: Number,
    language: String,
    contract_details: [
      {
        house_owner_id: String,
        house_owner_name: String,
        start_date: Date,
        end_date: Date,
        total_price: Number,
      },
    ],
  },
  { timestamps: true }
);

const HouseKeeper = mongoose.model("HouseKeeper", HouseKeeperSchema);

export default HouseKeeper;
