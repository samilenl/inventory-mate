#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Folder = require("./models/folder")
const Tag = require("./models/tag")
const Item = require("./models/item")

const folders = []
const tags = []
const items = []

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

"mongodb+srv://samilenloa:MxKv6F3AgoNqca8l@cluster0.olr9nno.mongodb.net/?retryWrites=true&w=majority"

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createFolders()
  await createTags()
  await createItems()
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// folders[0] will always be the Real Estate Folder, regardless of the order
// in which the elements of promise.all's argument complete.


async function folderCreate(index, name, description) {
  const folder = new Folder({
    name: name,
    description: description
  })
  await folder.save()
  folders[index] = folder
  console.log(`Added Folder: ${name}`)
}

async function tagCreate(index, name) {
  const tag = new Tag({
    name: name
  })
  await tag.save()
  tags[index] = tag
  console.log(`Added Tag: ${name}`)
}

async function itemCreate(name, description, tags, folder, quantity=1) {
  const item = new Item({
    name: name,
    description: description,
    quantity: quantity,
    folder: folder
  })
  if (tags !== false) item.tags = tags
  await item.save()
  items.push(item)
  console.log(`Added Item: ${name}`)
}

async function createFolders() {
  console.log("Adding Folders");
  await Promise.all([
    folderCreate(0, "Real Estate", "The properties that I own"),
    folderCreate(1, "Other Assets", "My other expensive and valuable assets"),
    folderCreate(2, "Personal Belongings", "")    
  ]);
}

async function createTags() {
  console.log("Adding genres");
  await Promise.all([
    tagCreate(0, "Possessions"),
    tagCreate(1, "Furniture"),
    tagCreate(2, "Properties"),
    tagCreate(3, "Apartment"),
    tagCreate(4, "Clothing"),
    tagCreate(5, "Vehicle"),
    tagCreate(6, "Sport Cars"),
    tagCreate(7, "Luxury"),
    tagCreate(8, "Work Place"),
  ]);
}


async function createItems() {
  console.log("Adding genres");
  await Promise.all([
    itemCreate(
      "300 Square KM Property",
      "A Property in Italy, previously owned by Mr. Alcto Sebline",
      tags[2],
      folders[0]
    ),
    itemCreate(
      "Plain T shirt",
      "A plain t shirt",
      tags[4],
      folders[2]
    ),
    itemCreate(
      "Bugatti Veyron",
      "The Bugatti Veyron EB 16.4 is a mid-engine sports car, designed and developed in Germany by the Volkswagen Group and Bugatti and manufactured in Molsheim",
      tags[6],
      folders[1]
    ),
    itemCreate(
      "3 Bedroom Apartment",
      "An apartment in Romania, purchased through SVD Real Estate",
      tags[3],
      folders[0]
    ),
    itemCreate(
      "2 Bedroom Apartment",
      "A Property in Spain, purchased through SVD Real Estate",
      tags[3],
      folders[0]
    ),
    itemCreate(
      "Tool Box",
      "Consists of all necessary tools for any situation",
      tags[0],
      folders[2]
    ),
    itemCreate(
      "Alpine A110 R",
      "Named the Alpine A110 R, the car you see above you is the fastest and most driver-focused Alpine yet, but you won't find a more powerful engine under its carbonfibre bonnet. Like the standard A110 S, the R makes do with 'just' 296bhp from its 1.8-litre, four-cylinder engine.e",
      tags[6],
      folders[1]
    ),
    itemCreate(
      "Toyota GR Supra",
      "The Toyota GR Supra is a sports car produced by Toyota since 2019. The fifth-generation Supra, the GR Supra was sold under and developed by Toyota ",
      tags[6],
      folders[1]
    ),
    itemCreate(
      "Porsche 718 Cayman",
      "A 2.0-litre turbo flat engine with direct fuel injection (DFI), VarioCam Plus and integrated dry-sump lubrication is used in the 718 and 718 T Style Edition. It produces 220 kW (300 brake horsepower) at 6,500 rpm, max. torque: 380 Nm.",
      tags[6],
      folders[1]
    ),
    itemCreate(
      "Checkered Shirt",
      "Simple Checkered Shirt",
      tags[4],
      folders[2]
    )
  ]);
}
