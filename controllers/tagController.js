const Tag = require("../models/tag");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

const tag_list = asyncHandler(async (req, res, next) => {
  const allTags = await Tag.find({ userId: req.user._id })
    .sort({ name: 1 })
    .exec();
  res.status(200).render("tag/list", {
    title: "All Tags",
    tags: allTags,
    tag_details: undefined,
  });
});

const tag_details = asyncHandler(async (req, res, next) => {
  const allTags = await Tag.find({ userId: req.user._id })
    .sort({ name: 1 })
    .exec();
  const thisTag = await Tag.findById(req.params.id);
  const allItemsWithTag = await Item.find({ tags: req.params.id }).exec();
  res.status(200).render("tag/list", {
    title: thisTag.name,
    tags: allTags,
    tag_details: allItemsWithTag,
  });
});

const tag_create_get = asyncHandler(async (req, res, next) => {
  res.status(200).render("tag/form", { title: "Tag Form Get", info: null });
});

const tag_create_post = asyncHandler(async (req, res, next) => {
  const tagExists = await Tag.findOne({
    name: req.body.tagName.trim(),
    userId: req.user._id,
  }).exec();
  if (tagExists) {
    return res.redirect(tagExists.url);
  } else {
    const newTag = new Tag({
      name: req.body.tagName.trim(),
      userId: req.user._id,
    });
    await newTag.save();
    res.redirect(`/tag/${newTag._id.toString()}`);
  }
});

const tag_update_get = asyncHandler(async (req, res, next) => {
  const thisTag = await Tag.findById(req.params.id).exec();
  res
    .status(200)
    .render("tag/form", { title: "Update Tag Information", info: thisTag });
});

const tag_update_post = asyncHandler(async (req, res, next) => {
  const updatedTag = new Tag({
    name: req.body.tagName.trim(),
    _id: req.params.id.trim(),
    userId: req.user._id,
  });
  const update = await Tag.findByIdAndUpdate(req.params.id, updatedTag, {});
  res.redirect(`/tag/${update._id.toString()}`);
});

const tag_delete_get = asyncHandler(async (req, res, next) => {
  res.status(200).render("tag/form", { title: "Tag Form Delete Get" });
});

const tag_delete_post = asyncHandler(async (req, res, next) => {
  const tag = await Tag.findByIdAndRemove(req.params.id).exec();
  res.redirect("/tags");
});

module.exports = {
  tag_list,
  tag_details,
  tag_create_get,
  tag_create_post,
  tag_delete_get,
  tag_delete_post,
  tag_update_get,
  tag_update_post,
};
