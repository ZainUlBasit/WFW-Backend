const CustomerTransaction = require("../Models/CustomerTransaction");

const getUnderSeller = async (req, res, next) => {
  const itemsCollection = db.collection("items");

  const topSellers = await CustomerTransaction.aggregate([
    {
      $group: {
        _id: "$",
        totalSales: { $sum: "$sales" },
      },
    },
    {
      $sort: { totalSales: -1 },
    },
    {
      $limit: 3,
    },
  ]).toArray();

  res.json(topSellers);

  //   if (!items) {
  //     return res.status(404).json({ message: "No Item Found" });
  //   }
  //   return res.status(200).json(items);
};

const getTopSeller = async (req, res, next) => {
  console.log(req.body);
  let items;
  try {
    items = await Item.find();
  } catch (err) {
    console.log(err);
  }

  if (!items) {
    return res.status(404).json({ message: "No Item Found" });
  }
  return res.status(200).json(items);
};

exports.getTopSeller = getTopSeller;
exports.getUnderSeller = getUnderSeller;
