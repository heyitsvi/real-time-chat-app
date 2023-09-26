const Data = require("../db/models/data");

async function dbGetMessage(room) {
  try {
    const result = await Data.find({ room: room })
      .limit(10)
      .sort({ createdAt: 1 })
      .exec();
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = dbGetMessage;
