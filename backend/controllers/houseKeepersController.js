import HouseKeeper from "../models/houseKeepersModel.js";

export async function getAllHouseKeepers(req, res, next) {
  try {
    const page_number = req.query?.page || 1;
    const page_size = req.query?.page_size || 1000;
    const result = await HouseKeeper.aggregate([
      {$skip: Number(page_size * (page_number - 1))},
      {$limit: Number(page_size)}
    ]);
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function addHouseKeeper(req, res, next) {
  try {
    const new_houseKeeper = req.body;
    const result = await HouseKeeper.create({
      ...new_houseKeeper,
      admin_id: req.token._id,
    });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function getHouseKeeperByID(req, res, next) {
  try {
    const { houseKeeper_id } = req.params;
    const result = await HouseKeeper.findOne({ _id: houseKeeper_id });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function updateHouseKeeperByID(req, res, next) {
  try {
    const { houseKeeper_id } = req.params;
    const {
      name,
      email,
      address,
      availability,
      hourly_rate,
      year_of_experience,
      phone_number,
    } = req.body;
    const result = await HouseKeeper.updateOne(
      { _id: houseKeeper_id },
      {
        $set: {
          name: name,
          email: email,
          address: address,
          availability: availability,
          hourly_rate: hourly_rate,
          phone_number: phone_number,
          year_of_experience: year_of_experience,
        },
      }
    );
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}

export async function deleteHouseKeeperByID(req, res, next) {
  try {
    const { houseKeeper_id } = req.params;
    const result = await HouseKeeper.deleteOne({ _id: houseKeeper_id });
    res.json({ success: true, data: result });
  } catch (e) {
    next(e);
  }
}