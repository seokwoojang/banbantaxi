const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MapListSchema = new Schema({
  location: String,
  image: String,
  description: String,
});

module.exports = mongoose.model("Maplist", MapListSchema);
