const Company = require("../Models/Company");
const Item = require("../Models/Item");

//******************************************************
// working
//******************************************************
const getAllItems = async (req, res, next) => {
  const { shop } = req.body;
  console.log(shop);
  let items;
  try {
    if (shop === "Admin") items = await Item.find();
    else items = await Item.find({ itemshop: shop });
  } catch (err) {
    console.log(err);
  }
  if (!items) {
    return res.status(404).json({ message: "No Item Found" });
  }
  return res.status(200).json(items);
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
const addItem = async (req, res, next) => {
  let item;
  const {
    itemcode,
    itemname,
    itemcompany,
    itemcategory,
    itemsubcategory,
    itemunit,
    itempurchase,
    itemsale,
    itemqty,
    itemshop,
    itemaddeddate,
  } = req.body;
  try {
    item = new Item({
      itemcode,
      itemname,
      itemcompany,
      itemcategory,
      itemsubcategory,
      itemunit,
      itempurchase,
      itemsale,
      itemqty,
      itemshop,
      itemaddeddate,
    });
    await item.save();
    console.log(item);
  } catch (err) {
    console.log(err);
  }

  if (!item) {
    return res.status(500).json({ message: "Unable to Add Item" });
  }
  return res.status(201).json({ item });
};
//******************************************************
// working
//******************************************************
const updateItem = async (req, res, next) => {
  const itemId = req.params.id;
  const {
    itemcode,
    itemname,
    itemcompany,
    itemcategory,
    itemsubcategory,
    itemunit,
    itempurchase,
    itemsale,
  } = req.body;
  let item;
  try {
    item = await Item.findByIdAndUpdate(
      itemId,
      {
        itemcode: itemcode,
        itemname: itemname,
        itemcompany: itemcompany,
        itemcategory: itemcategory,
        itemsubcategory: itemsubcategory,
        itemunit: itemunit,
        itempurchase: itempurchase,
        itemsale: itemsale,
      },
      { new: true },
      (err, data) => {
        if (data === null) {
          return res.status(404).json({ message: "Item not found" });
        } else {
          return res.status(200).json({ item });
        }
      }
    );
  } catch (err) {}
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
  const itemId = req.params.id;
  try {
    const delItem = await Item.findByIdAndDelete(itemId);
    if (!itemId) {
      return res.status(400).json({ message: "Bad Request" });
    } else {
      return res.status(201).json({ delItem });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getAllItems = getAllItems;
exports.addItem = addItem;
exports.addManyItem = addManyItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.updateItemQty = updateItemQty;
