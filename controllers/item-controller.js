const Joi = require("joi");
const Company = require("../Models/Company");
const Item = require("../Models/Item");
const { createError, successMessage } = require("../utils/ResponseMessage");

//******************************************************
// working
//******************************************************
const getAllItems = async (req, res, next) => {
  let items;
  try {
    items = await Item.find();
    if (!items) return createError(res, 404, "Items record not found!");
    return successMessage(res, items, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};

const getBranchItems = async (req, res, next) => {
  const { branch } = req.body;

  const itemSchema = Joi.object({
    branch: Joi.number().required(),
  });
  
  const { error } = itemSchema.validate(req.body.values);
  if (error) return createError(res, 422, error.message);

  let items;
  try {
    items = await Item.find({ branch });
    if (!items)
      return createError(res, 404, "Items record not found for branch!");
    return successMessage(res, items, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};
//******************************************************
// working
//******************************************************
const addManyItem = async (req, res, next) => {
  let item;
  const { data } = req.body;
  try {
    item = await Item.insertMany(data);
  } catch (err) {
    console.log(err);
  }
  if (!item) {
    return res.status(500).json({ message: "Unable to Add Item" });
  }
  return res.status(201).json({ item });
};
// Add Item
const addItem = async (req, res, next) => {
  let item;
  const {
    code,
    name,
    companyId,
    category,
    subcategory,
    unit,
    purchase,
    sale,
    qty,
    branch,
    addeddate = Math.floor(Date.now() / 1000),
  } = req.body;

  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();

  const itemSchema = Joi.object({
    code: reqStr,
    name: reqStr,
    companyId: reqStr,
    category: reqStr,
    subcategory: reqStr,
    unit: reqStr,
    purchase: reqNum,
    sale: reqNum,
    qty: reqNum,
    branch: reqNum,
  });
  const { error } = itemSchema.validate(req.body);
  if (error) return createError(res, 422, error.message);

  try {
    item = await new Item({
      code,
      name,
      companyId,
      category,
      subcategory,
      unit,
      purchase,
      sale,
      qty,
      branch,
      addeddate,
    }).save();
    if (!item) return createError(res, 400, "Unable to add new Item!");
    return successMessage(res, item, "Item Successfully Created!");
  } catch (err) {
    return createError(res, 500, err.message || err);
  }
};
//******************************************************
// working done
//******************************************************
const updateItem = async (req, res, next) => {
  const { itemId, payload } = req.body;
  // check the payload
  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();

  const companyPayloadSchema = Joi.object({
    code: reqStr,
    name: reqStr,
    company: reqStr,
    companyId: reqStr,
    category: reqStr,
    subcategory: reqStr,
    unit: reqStr,
    purchase: reqNum,
    sale: reqNum,
    qty: reqNum,
    branch: reqNum,
  });
  const CompanyUpdateSchema = Joi.object({
    itemId: reqStr,
    payload: Joi.object().min(1).required().keys(companyPayloadSchema),
  });
  // check if the validation returns error
  const { error } = CompanyUpdateSchema.validate(req.body.values);
  if (error) {
    return createError(res, 422, error.message);
  }
  let item;
  try {
    item = await Item.findById(itemId);
    if (!item) {
      return createError(res, 404, "Item with such id was not found!");
    }
    // Update item properties
    Object.assign(item, payload);
    // Save the updated item
    await item.save();
    return successMessage(res, item, "Item Successfully Updated!");
  } catch (err) {
    return createError(res, 500, err.message || err);
  }
};
//******************************************************
// working
//******************************************************
const updateItemQty = async (req, res, next) => {
  // parameter
  const itemId = req.params.id;
  let item;
  // getting quantity from request
  let { itemqty } = req.body;
  const newQty = itemqty;
  // query data
  const itemFilter = { _id: itemId };
  const itemUpdate = { $inc: { itemqty: newQty } };
  try {
    item = Item.updateOne(itemFilter, itemUpdate, (err, result) => {
      if (err) {
        console.error("Failed to increment value:", err);
        res.status(500).send("Failed to increment value");
      } else {
        res.send("Value incremented successfully");
      }
    });
  } catch (err) {}
};
//******************************************************
// working
//******************************************************
const deleteItem = async (req, res, next) => {
  const { itemId } = req.body;
  if (!itemId) return createError(res, 422, "Invalid Item Id!");
  try {
    const DeleteItem = await Company.findByIdAndDelete(itemId);
    if (!DeleteItem)
      return createError(res, 400, "Such Item with itemId does not exist!");
    return successMessage(
      res,
      DeleteItem,
      `Item ${DeleteItem.name} is successfully deleted!`
    );
  } catch (error) {
    return createError(res, 500, error.message || error);
  }
};

module.exports = {
  getBranchItems,
  getAllItems,
  addItem,
  addManyItem,
  updateItem,
  deleteItem,
  updateItemQty,
};
