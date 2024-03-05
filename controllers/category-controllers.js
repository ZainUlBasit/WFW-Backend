const Category = require("../Models/Category");

const addCategory = async (req, res, next) => {
  let category;
  const { company_id, categoryname, shop } = req.body;
  try {
    category = new Category({
      company_id,
      categoryname,
      shop,
    });
    await category.save();
  } catch (err) {
    console.log(err);
  }

  if (!category) {
    return res.status(500).json({ message: "Unable to add category" });
  }
  return res.status(201).json({ category });
};

const getAllCategories = async (req, res, next) => {
  const { shop } = req.body;
  let categories;
  try {
    if (shop === "Admin") categories = await Category.find();
    else categories = await Category.find({ shop });
  } catch (err) {
    console.log(err);
  }
  if (!categories)
    return res.status(404).json({ message: "No category found...!" });
  return res.status(200).json(categories);
};
//******************************************************
// working
//******************************************************
const updateCategory = async (req, res, next) => {
  const id = req.params.id;
  let category;
  let { categoryNew } = req.body;
  try {
    category = await Category.findByIdAndUpdate(
      id,
      {
        categoryname: categoryNew,
      },
      { new: true },
      (err, data) => {
        if (data === null) {
          return res.status(404).json({ message: "Sub Category not found" });
        } else {
          return res.status(200).json({ category });
        }
      }
    );
  } catch (err) {}
};
//******************************************************
// working
//******************************************************
const deleteCategory = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  try {
    const delCat = await Category.findByIdAndDelete(id);
    if (!delCat) {
      return res.status(400).json({ message: "Bad Request" });
    } else {
      return res.status(201).json(delCat);
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.addCategory = addCategory;
exports.getAllCategories = getAllCategories;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
