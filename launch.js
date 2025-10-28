const fs = require("fs");
const path = require("path");

const folder = path.join(__dirname, "/public/images");
const dataFolder = path.join(__dirname, "/images.json");
const images = fs.readdirSync(folder);

fs.writeFileSync(dataFolder, JSON.stringify(images.map(image => ({image,description: ""})), null, 4))