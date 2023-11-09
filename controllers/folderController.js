const Folder = require("../models/folder");
const asyncHandler = require("express-async-handler");
const upload = require("../configs/multer");

const folder_list = asyncHandler(async (req, res, next) => {
  const allFolders = await Folder.find({ userId: req.user._id }).exec();
  res
    .status(200)
    .render("folder/list", { title: "All Items", folders: allFolders });
});

const folder_create_get = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .render("folder/form", {
      title: "Create Folder",
      info: null,
      active: "all-items",
    });
});

const folder_create_post = [
  upload.single("image"),

  asyncHandler(async (req, res, next) => {
    let newFolder = {};
    if (req.file) {
      newFolder = new Folder({
        name: req.body.folderName.trim(),
        description: req.body.folderDes.trim(),
        image: req.file.id,
        userId: req.user._id,
      });
    } else {
      newFolder = new Folder({
        name: req.body.folderName.trim(),
        description: req.body.folderDes.trim(),
        userId: req.user._id,
      });
    }
    await newFolder.save();
    res.redirect(`${newFolder.url}/content`);
  }),
];

const folder_update_get = asyncHandler(async (req, res, next) => {
  const folderInfo = await Folder.findById(req.params.id);
  res.status(200).render("folder/form", {
    title: "Update Folder Information",
    info: folderInfo,
    active: "all-items",
  });
});

const folder_update_post = [
  upload.single("image"),

  asyncHandler(async (req, res, next) => {
    let updatedFolder = {};
    if (req.file) {
      updatedFolder = new Folder({
        name: req.body.folderName.trim(),
        description: req.body.folderDes.trim(),
        image: req.file.id,
        _id: req.params.id,
        userId: req.user._id,
      });
    } else {
      updatedFolder = new Folder({
        name: req.body.folderName.trim(),
        description: req.body.folderDes.trim(),
        _id: req.params.id,
        userId: req.user._id,
      });
    }
    const update = await Folder.findByIdAndUpdate(
      req.params.id,
      updatedFolder,
      {}
    );
    res.redirect(`${update.url}/content`);
  }),
];

const folder_delete_get = asyncHandler(async (req, res, next) => {
  res.status(200).render("folder/form", { title: "Folder Form Delete Get" });
});

const folder_delete_post = asyncHandler(async (req, res, next) => {
  const folder = await Folder.findByIdAndRemove(req.params.id).exec();
  res.redirect("/all-items");
});

module.exports = {
  folder_list,
  folder_create_get,
  folder_create_post,
  folder_delete_get,
  folder_delete_post,
  folder_update_get,
  folder_update_post,
};
