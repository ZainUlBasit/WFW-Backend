const Joi = require("joi");
const SubCategory = require("../Models/SubCategory");
const { createError, successMessage } = require("../utils/ResponseMessage");
const Category = require("../Models/Category");
const Company = require("../Models/Company");

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

const GetTriForEdit = async (req, res, next) => {
  const { branch } = req.body;

  const reqNum = Joi.number().required();
  const subCategorySchema = Joi.object({
    branch: reqNum,
  });
  const { error } = subCategorySchema.validate(req.body.values);
  if (error) return createError(res, 422, error.message);
  try {
    const subCategories = await SubCategory.find({ branch });
    if (!subCategories)
      return createError(res, 404, "No SubCategory record found!");
    const categories = await Category.find({ branch });
    if (!categories) return createError(res, 404, "No Category record found!");
    const companies = await Company.find({ branch });
    if (!companies) return createError(res, 404, "No Company record found!");

    return successMessage(
      res,
      {
        company: companies,
        category: categories,
        subcategory: subCategories,
      },
      null
    );
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};

const updateSubCategory = async (req, res, next) => {
  const { subcategoryId, new_name } = req.body;

  const reqStr = Joi.string().required();

  const SubCategoryUpdateSchema = Joi.object({
    subcategoryId: reqStr,
    new_name: reqStr,
  });
  // check if the validation returns error
  const { error } = SubCategoryUpdateSchema.validate(req.body);
  if (error) return createError(res, 422, error.message);

  let subCategory;
  try {
    subCategory = await SubCategory.findById(subcategoryId);
    if (!subCategory)
      return createError(res, 404, "SubCategory with such id was not found!");
    Object.assign(subCategory, {
      name: new_name,
    });

    await subCategory.save();
    return successMessage(
      res,
      subCategory,
      "SubCategory Successfully Updated!"
    );
  } catch (err) {
    return createError(res, 500, err.message || err);
  }
};
const deleteSubCategory = async (req, res, next) => {
  const { id: subcategoryId } = req.params;

  if (!subcategoryId) return createError(res, 422, "Invalid subcategoryId");
  try {
    const delCat = await SubCategory.findByIdAndDelete(subcategoryId);
    if (!delCat)
      return createError(
        res,
        400,
        `Such SubCategory with ${subcategoryId} does not exist!`
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
  addSubCategory,
  getBranchSubCategories,
  getAllSubCategories,
  updateSubCategory,
  deleteSubCategory,
  GetTriForEdit,
};
