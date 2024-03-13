const Joi = require("joi");
const Category = require("../Models/Category");
const { createError, successMessage } = require("../utils/ResponseMessage");

const addCategory = async (req, res, next) => {
  let category;
  const { company_id, name, branch } = req.body;

  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();

  const categorySchema = Joi.object({
    company_id: reqStr,
    name: reqStr,
    branch: reqNum,
  });
  const { error } = categorySchema.validate(req.body);
  if (error) return createError(res, 422, error.message);

  try {
    category = await new Category({
      company_id,
      name,
      branch,
    }).save();
    if (!category) return createError(res, 400, "Unable to Add Category!");
    return successMessage(res, category, "Category Successfully Added!");
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};
const getAllCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find();
    if (!categories) return createError(res, 404, "No Category record found!");
    return successMessage(res, categories, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};
const getBranchCategories = async (req, res, next) => {
  const branch = req.params.id;
  console.log("req.body", branch);
  if (!branch) return createError(res, 422, "Branch is undefined!");

  let categories;
  try {
    categories = await Category.find({ branch });
    if (!categories) return createError(res, 404, "No Category record found!");
    return successMessage(res, categories, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};

//******************************************************
// working
//******************************************************
const updateCategory = async (req, res, next) => {
  const { categoryId, payload } = req.body;
  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();
  const categoryPayloadSchema = Joi.object({
    name: reqStr,
    branch: reqNum,
  });
  const CategoryUpdateSchema = Joi.object({
    categoryId: reqStr,
    payload: Joi.object().min(1).required().keys(categoryPayloadSchema),
  });
  // check if the validation returns error
  const { error } = CategoryUpdateSchema.validate(req.body);
  if (error) return createError(res, 422, error.message);

  let category;
  try {
    category = await Category.findById(categoryId);
    if (!category)
      return createError(res, 404, "Category with such id was not found!");
    Object.assign(category, payload);

    await category.save();
    return successMessage(res, category, "Category Successfully Updated!");
  } catch (err) {
    return createError(res, 500, error.message || error);
  }
};

//******************************************************
// working
//******************************************************
const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.body;

  try {
    const delCat = await Category.findByIdAndDelete(categoryId);
    if (!delCat)
      return createError(
        res,
        400,
        "Such Category with categoryId does not exist!"
      );
    else
      return successMessage(
        res,
        delCat,
        `Category ${delCat.name} is successfully deleted!`
      );
  } catch (err) {
    return createError(res, 500, err.message || err);
  }
};

module.exports = {
  getBranchCategories,
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
