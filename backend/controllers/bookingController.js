
import HouseKeeper from "../models/houseKeepersModel.js";
import User from "../models/usersModel.js";
import mongoose from "mongoose";

export async function booking(req, res, next) {
  try {
    const { user_id } = req.params;
    const contract_detail = req.body;
    const { house_keeper_id, start_date, end_date, total_price } = req.body;

    //check start date must be greater then end date of last contract
    const houseKeeper = await HouseKeeper.findOne({ _id: house_keeper_id });
    if (houseKeeper.contract_details.length > 0) {
      const lastContract = await HouseKeeper.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(house_keeper_id) }
        },
        {
          $unwind: '$contract_details'
        },
        {
          $sort: { 'contract_details.end_date': -1 }
        },
        {
          $limit: 1
        }
      ]);

      if (new Date(start_date) < lastContract[0].contract_details.end_date) {
        next(new Error(`Start Date of contract is invalid`));
      }

    }

    //update users
    await User.updateOne(
      { _id: user_id },
      { $push: { contract_details: contract_detail } }
    );

    //update house keeper
    const user = await User.findOne({ _id: user_id });
    const hk_contract_detail = {
      house_owner_id: user_id,
      house_owner_name: user.name,
      start_date: start_date,
      end_date: end_date,
      total_price: total_price
    }
    await HouseKeeper.updateOne(
      { _id: contract_detail.house_keeper_id },
      {
        $set: {'availability': false}
      }
    );

    const result = await HouseKeeper.updateOne(
      { _id: contract_detail.house_keeper_id },
      { $push: { contract_details: hk_contract_detail } }
    );

    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}