const moment = require("moment/moment");
const Sale = require("../Models/Sale");
const { createError, successMessage } = require("../utils/ResponseMessage");
const Sales = require("../Models/Sales");
const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const SaleReturn = require("../Models/SaleReturn");

const getNextRecieptNo = async () => {
  try {
    const highestReceipt = await SaleReturn.findOne()
      .sort("-reciept_no")
      .select("reciept_no")
      .lean();

    return (highestReceipt && highestReceipt.reciept_no + 1) || 1;
  } catch (error) {
    console.error("Error getting next reciept_no:", error);
    throw error;
  }
};

const addSale = async (req, res, next) => {
  let {
    customerId,
    branch,
    date = Math.floor(Date.now() / 1000),
    salesInfo,
  } = req.body;

  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();
  // const reqDate = Joi.date().required();

  const salesSchema = Joi.object({
    name: reqStr,
    qty: reqNum,
    price: reqNum,
    purchase: reqNum,
    total: reqNum,
  });

  const saleSchema = Joi.object({
    customerId: reqStr,
    branch: reqNum,
    date: reqNum.default(() => Math.floor(Date.now() / 1000)),
    sales: Joi.array().items(salesSchema).required(),
  });

  const { error } = saleSchema.validate(req.body.values);
  if (error) {
    return createError(res, 422, error.message);
  }

  let newSale;
  try {
    const reciept_no = await getNextRecieptNo();
    const salesId = await Promise.all(
      salesInfo.map(async (sale) => {
        const { name, qty, price, purchase, total } = sale;
        const savedSales = await new Sales({
          name,
          qty,
          price,
          purchase,
          total,
          reciept_no: reciept_no,
        }).save();
        return savedSales._id;
      })
    );
    newSale = await new SaleReturn({
      customerId,
      branch,
      date,
      reciept_no: reciept_no,
      sales: salesId,
    }).save();
    if (!newSale) return createError(res, 400, "Unable to add Return Sale!");
    return successMessage(res, newSale, "Sale Return Successfully Created!");
  } catch (err) {
    return createError(res, 500, err.message || err);
  }
};

const GetAllSale = async (req, res, next) => {
  let allSales;
  try {
    allSales = await SaleReturn.find().populate("sales");
    if (!allSales)
      return createError(res, 404, "SalesReturn record not found!");
    return successMessage(res, allSales, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};

const GetBranchSales = async (req, res, next) => {
  const { branch } = req.body;

  const SalesSchema = Joi.object({
    branch: Joi.number().required(),
  });

  const { error } = SalesSchema.validate(req.body.values);
  if (error) return createError(res, 422, error.message);

  let allSales;
  try {
    allSales = await SaleReturn.find({ branch }).populate("sales");
    if (!allSales)
      return createError(res, 404, "SalesReturn record not found for branch!");
    else return successMessage(res, allSales, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};

const UpdateSales = async (req, res, next) => {
  const { salesId, payload } = req.body;
  // check the payload
  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();

  const salesSchema = Joi.object({
    name: reqStr,
    qty: reqNum,
    price: reqNum,
    purchase: reqNum,
    total: reqNum,
  });

  const SaleUpdateSchema = Joi.object({
    salesId: reqStr,
    payload: Joi.array().items(salesSchema).required(),
  });
  // check if the validation returns error
  const { error } = SaleUpdateSchema.validate(req.body.values);
  if (error) {
    return createError(res, 422, error.message);
  }
  let sale;
  try {
    sale = await SaleReturn.findById(salesId);
    if (!Sale)
      return createError(res, 404, "SaleReturn with such id was not found!");
    // add or update all the sale and get their ids
    const addSales = await Promise.all(
      payload.map(async (salesData) => {
        try {
          // Check if _id is provided in salesData
          const { _id, ...restSalesData } = salesData;
          let salesId;
          if (_id) {
            await Sales.findByIdAndUpdate(_id, { $set: restSalesData });
            salesId = _id;
          } else {
            const newSales = await new Sales(restSalesData).save();
            salesId = newSales._id;
          }
          return salesId;
        } catch (error) {
          console.error("Error adding/updating sales:", error);
          throw error;
        }
      })
    );

    const UpdatedPayload = { sales: addSales };
    // Update item properties
    Object.assign(sale, UpdatedPayload);
    // Save the updated item
    await sale.save();
    const UpdatedSale = await Sale.findById(salesId).populate("sales");
    return successMessage(res, UpdatedSale, "Sales Successfully Updated!");
  } catch (err) {
    console.log("error: ", err);
    return createError(res, 500, err.message || err);
  }
};

const DeleteSale = async (req, res, next) => {
  const { saleId } = req.body;
  if (!saleId || !isValidObjectId(saleId))
    return createError(res, 422, "Invalid Sale Id!");
  try {
    const DeleteSale = await SaleReturn.findByIdAndDelete(saleId);
    if (!DeleteSale)
      return createError(res, 400, "Such Sale Return with saleId does not exist!");
    // Delete associated sales records
    const deletedSales = await Sales.deleteMany({
      _id: { $in: DeleteSale.sales },
    });
    return successMessage(
      res,
      { DeleteSale, deletedSales },
      `Sale Return ${DeleteSale._id} and associated sales are successfully deleted!`
    );
  } catch (err) {
    console.log("error: ", err);
    return createError(res, 500, err.message || err);
  }
};

module.exports = {
  addSale,
  GetAllSale,
  GetBranchSales,
  UpdateSales,
  DeleteSale,

  addManyCustomerTransaction,
  deleteCustomerTransaction,
  getCustomerTransaction,
  getAllCustomerTransaction,
  getAllTransactionSortedByDate,
  getAllTransactionSortedByBillNo,
};
