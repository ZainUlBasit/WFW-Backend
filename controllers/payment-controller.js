const moment = require("moment/moment");
const Joi = require("joi");
const { createError, successMessage } = require("../utils/ResponseMessage");
const { isValidObjectId } = require("mongoose");
const Payment = require("../Models/Payment");

const addPayment = async (req, res, next) => {
  const {
    user_type,
    user_Id,
    depositor,
    payment_type,
    bank_name,
    bank_number,
    amount,
    date,
    desc,
    branch,
  } = req.body;

  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();

  const paymentSchema = Joi.object({
    user_type: Joi.number().valid(1, 2).required(),
    user_Id: reqStr,
    depositor: reqStr,
    payment_type: Joi.number().valid(1, 2).required(),
    bank_name: reqStr.allow(null), // Allow null for Cash payments
    bank_number: reqNum.allow(null), // Allow null for Cash payments
    amount: reqNum,
    date: reqNum.default(() => Math.floor(Date.now() / 1000)),
    desc: reqStr,
    branch: reqNum,
  });

  const { error } = paymentSchema.validate(req.body.values);
  if (error) {
    return createError(res, 422, error.message);
  }

  try {
    const newPayment = await new Payment({
      user_type,
      user_Id,
      depositor,
      payment_type,
      bank_name,
      bank_number,
      amount,
      date,
      desc,
      branch,
    }).save();

    if (!newPayment) {
      return createError(res, 400, "Unable to add new Payment!");
    }

    return successMessage(res, newPayment, "Payment Successfully Created!");
  } catch (err) {
    return createError(res, 500, err.message || err);
  }
};

const getAllPayments = async (req, res, next) => {
  try {
    const allPayments = await Payment.find();
    if (!allPayments) {
      return createError(res, 404, "Payments record not found!");
    }
    return successMessage(res, allPayments, null);
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};

const getBranchPayments = async (req, res, next) => {
  const { branch } = req.body;

  // Validate branch input
  const paymentSchema = Joi.object({
    branch: Joi.number().required(),
  });

  // Check if the validation returns an error
  const { error } = paymentSchema.validate(req.body.values);
  if (error) {
    return createError(res, 422, error.message);
  }

  let branchPayments;
  try {
    branchPayments = await Payment.find({ branch });

    if (!branchPayments) {
      return createError(res, 404, "Payments record not found for branch!");
    } else {
      return successMessage(res, branchPayments, null);
    }
  } catch (err) {
    console.log(err);
    return createError(res, 500, err.message || err);
  }
};

const deletePayment = async (req, res, next) => {
  const { paymentId } = req.body;
  if (!paymentId || !isValidObjectId(paymentId)) {
    return createError(res, 422, "Invalid Payment Id!");
  }

  try {
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);
    if (!deletedPayment) {
      return createError(res, 400, "Payment with such id does not exist!");
    }

    return successMessage(
      res,
      deletedPayment,
      `Payment ${deletedPayment._id} is successfully deleted!`
    );
  } catch (error) {
    return createError(res, 500, error.message || error);
  }
};

const updatePayment = async (req, res, next) => {
  const { paymentId, payload } = req.body;

  // Check the payload
  const reqStr = Joi.string().required();
  const reqNum = Joi.number().required();

  const paymentSchema = Joi.object({
    user_type: Joi.number().valid(1, 2).required(),
    user_Id: reqStr,
    depositor: reqStr,
    payment_type: Joi.number().valid(1, 2).required(),
    bank_name: reqStr.allow(null),
    bank_number: reqNum.allow(null),
    amount: reqNum,
    date: reqNum.default(() => Math.floor(Date.now() / 1000)),
    desc: reqStr,
    branch: reqNum,
  });

  const paymentUpdateSchema = Joi.object({
    paymentId: reqStr,
    payload: paymentSchema,
  });

  // Check if the validation returns an error
  const { error } = paymentUpdateSchema.validate(req.body.values);
  if (error) {
    return createError(res, 422, error.message);
  }

  let payment;
  try {
    payment = await Payment.findById(paymentId);
    if (!payment) {
      return createError(res, 404, "Payment with such id was not found!");
    }

    // Update payment properties
    Object.assign(payment, payload);

    // Save the updated payment
    await payment.save();

    return successMessage(res, payment, "Payment Successfully Updated!");
  } catch (err) {
    console.log("error: ", err);
    return createError(res, 500, err.message || err);
  }
};

module.exports = {
  addPayment,
  getAllPayments,
  getBranchPayments,
  deletePayment,
  updatePayment,
};
