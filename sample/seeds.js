const mongoose = require("mongoose");

const Maplist = require("../models/mapList");

mongoose.connect("mongodb://127.0.0.1:27017/hand");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database 연결됨");
});

const seedMaps = [
  {
    location: "지도 1",
    image: "https://source.unsplash.com/collection/4831251",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et dolorum optio, enim, nobis ut, non eaque harum amet odio repudiandae voluptate. Laborum, aliquam labore velit modi suscipit magnam. Sed, iusto!",
  },
  {
    location: "지도 2",
    image: "https://source.unsplash.com/collection/4831251",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et dolorum optio, enim, nobis ut, non eaque harum amet odio repudiandae voluptate. Laborum, aliquam labore velit modi suscipit magnam. Sed, iusto!",
  },
  {
    location: "지도 3",
    image: "https://source.unsplash.com/collection/4831251",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et dolorum optio, enim, nobis ut, non eaque harum amet odio repudiandae voluptate. Laborum, aliquam labore velit modi suscipit magnam. Sed, iusto!",
  },
];

Maplist.deleteMany({});

Maplist.insertMany(seedMaps)
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });
