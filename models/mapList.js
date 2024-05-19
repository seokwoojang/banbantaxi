const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const MapListSchema = new Schema({
  location: String,
  image: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

MapListSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Maplist", MapListSchema);
