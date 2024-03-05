const Company = require("../Models/Company");
const Titem = require("../Models/TItem");

const getAllItems = async (req, res, next) => {
  const { from, to } = req.body;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  let result;
  try {
    result = await Titem.find({
      itemdate: { $gte: fromDate, $lte: toDate },
    });
  } catch (err) {
    console.log(err);
  }
  if (!result) {
    return res.status(500).json({ message: "Unable to Add Item" });
  }
  return res.status(201).json(result);
};

// const setData = {
//   "itemid": "1",
//   "itemcode": "1S",
//   "itemname": "1 Qat Sardar",
//   "itemcompany": "Sardar Packages",
//   "itemcategory": "carton",
//   "itemunit": "Box",
//   "itempurchase": "56.00",
//   "itemsale": "60.00",
//   "itemqty": "0",
//   "itemaddeddate": "28/01/2023",
// };
const addItem = async (req, res, next) => {
  let item;
  let { itemname, itemdate } = req.body;
  itemdate = new Date(itemdate);
  console.log(itemdate);
  try {
    item = new Titem({
      itemname,
      itemdate,
    });
    await item.save();
  } catch (err) {
    console.log(err);
  }

  if (!item) {
    return res.status(500).json({ message: "Unable to Add Item" });
  }
  return res.status(201).json({ item });
};

exports.getAllItems = getAllItems;
exports.addItem = addItem;
