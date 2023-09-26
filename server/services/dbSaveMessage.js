const Data = require("../db/models/data");

async function dbSaveMessage(message, username, room, __createdtime__) {
  const data = new Data({ message, username, room, __createdtime__ });
  data
    .save()
    .then((result) => {
      // console.log("res " + result);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = dbSaveMessage;
