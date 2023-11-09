const Item = require("../models/item");
const Folder = require("../models/folder");
const Tag = require("../models/tag");
const asyncHandler = require("express-async-handler");
const upload = require("../configs/multer");
const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({ folder: req.params.id })
    .populate("tags")
    .populate("folder")
    .exec();
  const folder = await Folder.findById(req.params.id).exec();
  const deleteItem = async (userId, folder, res) => {
  const item = await Item.findById(userId).populate("folder").exec();
  };
  res.status(200).render("item/list", { folder, items: allItems, deleteItem });
});

const item_details = asyncHandler(async (req, res, next) => {
  const thisItem = await Item.findById(req.params.id).populate("tags");
  if (thisItem.updatedAt) {
    const iso = thisItem.updatedAt.toISOString();
    thisItem.formattedDate =
      DateTime.fromISO(iso).toFormat("dd/MM/yyyy hh:mm a");
  } else {
    const iso = thisItem.date.toISOString();
    thisItem.formattedDate =
      DateTime.fromISO(iso).toFormat("dd/MM/yyyy hh:mm a");
  }
  res
    .status(200)
    .render("item/details", { title: "Item Details", item: thisItem });
});

const item_create_get = asyncHandler(async (req, res, next) => {
  const allTags = await Tag.find({ userId: req.user._id })
    .sort({ name: 1 })
    .exec();
  const allFolders = await Folder.find({ userId: req.user._id })
    .sort({ name: 1 })
    .exec();

  res.status(200).render("item/form", {
    title: "Create New Item",
    tags: allTags,
    folders: allFolders,
    info: null,
    active: "all-items",
  });
});

async function findTagIds(tagList, userId) {
  const tagIds = await Promise.all(
    tagList.map(async (item) => {
      const foundItem = await Tag.findOne({
        name: item,
        userId: userId,
      }).exec();
      return foundItem ? foundItem._id : null;
    })
  );

  return tagIds.filter((tagId) => tagId !== null);
}

const item_create_post = [
  upload.single("image"),

  asyncHandler(async (req, res, next) => {
    const sTags = req.body.tags.split(", ");
    const sTagsID = await findTagIds(sTags, req.user._id);
    let newItem = {};

    if (req.file) {
      console.log(req.file);
      newItem = new Item({
        name: req.body.name.trim(),
        quantity: req.body.quantity,
        description: req.body.description.trim(),
        folder: req.body.folder,
        image: req.file.id,
        tags: sTagsID,
        userId: req.user._id,
      });
    } else {
      newItem = new Item({
        name: req.body.name.trim(),
        quantity: req.body.quantity,
        description: req.body.description.trim(),
        folder: req.body.folder,
        tags: sTagsID,
        userId: req.user._id,
      });
    }
    await newItem.save();
    res.redirect(newItem.url);
  }),
];

const item_update_get = asyncHandler(async (req, res, next) => {
  const allTags = await Tag.find({ userId: req.user._id })
    .sort({ name: 1 })
    .exec();
  const allFolders = await Folder.find({ userId: req.user._id })
    .sort({ name: 1 })
    .exec();
  const itemInfo = await Item.findOne({ _id: req.params.id })
    .populate("tags")
    .populate("folder")
    .exec();

  res.status(200).render("item/form", {
    title: "Update Item Information",
    tags: allTags,
    folders: allFolders,
    info: itemInfo,
    active: "all-items",
  });
});

const item_update_post = [
  upload.single("image"),

  asyncHandler(async (req, res, next) => {
    const sTags = req.body.tags.split(", ");
    console.log(sTags);
    const sTagsID = await findTagIds(sTags, req.user._id);
    console.log(sTagsID);
    let updatedItem = {};

    if (req.file) {
      updatedItem = new Item({
        name: req.body.name.trim(),
        quantity: req.body.quantity,
        description: req.body.description.trim(),
        folder: req.body.folder,
        image: req.file.id,
        tags: sTagsID,
        _id: req.body.id,
        userId: req.user._id,
      });
    } else {
      updatedItem = new Item({
        name: req.body.name.trim(),
        quantity: req.body.quantity,
        description: req.body.description.trim(),
        folder: req.body.folder,
        tags: sTagsID,
        _id: req.params.id,
        userId: req.user._id,
      });
    }
    await Item.findByIdAndUpdate(req.params.id, updatedItem, {});
    res.redirect(updatedItem.url);
  }),
];

const item_delete_get = asyncHandler(async (req, res, next) => {
  res.status(200).render("item/form", { title: "Item Form Delete Get" });
});

const item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findByIdAndRemove(req.params.id)
    .populate("folder")
    .exec();
  res.redirect(`${item.folder.url}/content`);
});

const image_get = asyncHandler(async (req, res, next) => {
  try {
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "Images",
    });
    const file = await gfs
      .find({ _id: new mongoose.Types.ObjectId(req.params.id) })
      .toArray();
    if (file.length < 1) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.set("Content-Type", file[0].contentType);
    const readStream = gfs.openDownloadStream(
      new mongoose.Types.ObjectId(req.params.id)
    );
    readStream.pipe(res);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

module.exports = {
  item_list,
  item_details,
  item_create_get,
  item_create_post,
  item_delete_get,
  item_delete_post,
  item_update_get,
  item_update_post,
  image_get,
};
