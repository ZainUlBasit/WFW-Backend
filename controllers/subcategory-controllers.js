const Joi = require("joi");
const SubCategory = require("../Models/SubCategory");
const { createError, successMessage } = require("../utils/ResponseMessage");

const addManySubCategory = async (req, res, next) => {
  let subCategory;
  const { data } = req.body;
  try {
    subCategory = await SubCategory.insertMany(data);
  } catch (err) {
    console.log(err);
  }
  if (!subCategory) {
    return res.status(500).json({ message: "Unable to add sub category" });
  }
  return res.status(201).json({ subCategory });
};
const addSubCategory = async (req, res, next) => {
  let subCategory;
  const { company_id, category_id, name, branch } = req.body;

  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();

  const subCategorySchema = Joi.object({
    company_id: reqStr,
    category_id: reqStr,
    name: reqStr,
    branch: reqNum,
  });

  const { error } = subCategorySchema.validate(req.body.values);
  if (error) return createError(res, 422, error.message);

  try {
    subCategory = await new SubCategory({
      company_id,
      category_id,
      name,
      branch,
    }).save();
    if (!subCategory)
      return createError(res, 400, "Unable to Add SubCategory!");
    return successMessage(res, subCategory, "SubCategory Successfully Added!");
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};
const getAllSubCategories = async (req, res, next) => {
  let subCategories;
  try {
    subCategories = await SubCategory.find();
    if (!subCategories)
      return createError(res, 404, "No SubCategory record found!");
    return successMessage(res, subCategories, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};
const getBranchSubCategories = async (req, res, next) => {
  const { branch } = req.body;

  const reqNum = Joi.number().required();
  const subCategorySchema = Joi.object({
    branch: reqNum,
  });
  const { error } = subCategorySchema.validate(req.body.values);
  if (error) return createError(res, 422, error.message);

  let subCategories;
  try {
    subCategories = await SubCategory.find({ branch });
    if (!subCategories)
      return createError(res, 404, "No SubCategory record found!");
    return successMessage(res, subCategories, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};
const getSubCategoriesByCompany = async (req, res, next) => {
  let subCategories;
  const company = req.params.company;
  try {
    subCategories = await SubCategory.find({ categorycompany: company });
  } catch (err) {
    console.log(err);
  }

  if (!subCategories) {
    return res.status(404).json({ message: "No Sub Category found..." });
  }
  return res.status(200).json(subCategories);
};
const updateSubCategory = async (req, res, next) => {
  const { subcategoryId, payload } = req.body;

  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();
  const subCategoryPayloadSchema = Joi.object({
    categoryname: reqStr,
    name: reqStr,
    branch: reqNum,
  });
  const SubCategoryUpdateSchema = Joi.object({
    subcategoryId: reqStr,
    payload: Joi.object().min(1).required().keys(subCategoryPayloadSchema),
  });
  // check if the validation returns error
  const { error } = SubCategoryUpdateSchema.validate(req.body.values);
  if (error) return createError(res, 422, error.message);

  let subCategory;
  try {
    subCategory = await SubCategory.findById(subcategoryId);
    if (!subCategory)
      return createError(res, 404, "SubCategory with such id was not found!");
    Object.assign(subCategory, payload);

    await subCategory.save();
    return successMessage(
      res,
      subCategory,
      "SubCategory Successfully Updated!"
    );
  } catch (err) {
    return createError(res, 500, error.message || error);
  }
};
const deleteSubCategory = async (req, res, next) => {
  const { subcategoryId } = req.body;
  if (!subcategoryId) return createError(res, 422, "Invalid subcategoryId");
  try {
    const delCat = await Category.findByIdAndDelete(subcategoryId);
    if (!delCat)
      return createError(
        res,
        400,
        "Such SubCategory with subcategoryId does not exist!"
      );
    else
      return successMessage(
        res,
        delCat,
        `SubCategory ${delCat.name} is successfully deleted!`
      );
  } catch (err) {
    return createError(res, 500, err.message || err);
  }
};

module.exports = {
  getBranchSubCategories,
  addSubCategory,
  addManySubCategory,
  getAllSubCategories,
  getSubCategoriesByCompany,
  updateSubCategory,
  deleteSubCategory,
};
