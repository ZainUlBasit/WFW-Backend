const SubCategory = require("../Models/SubCategory");

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
  const { company_id, categoryname, subcategoryname, shop } = req.body;
  try {
    subCategory = new SubCategory({
      company_id,
      categoryname,
      subcategoryname,
      shop,
    });
    await subCategory.save();
  } catch (err) {
    console.log(err);
  }
  if (!subCategory) {
    return res.status(500).json({ message: "Unable to add sub category" });
  }
  return res.status(201).json({ subCategory });
};

const getAllSubCategories = async (req, res, next) => {
  const { shop } = req.body;
  let subCategories;
  try {
    if (shop === "Admin") subCategories = await SubCategory.find();
    else subCategories = await SubCategory.find({ shop });
  } catch (err) {
    console.log(err);
  }

  if (!subCategories) {
    return res.status(404).json({ message: "No Sub Category found..." });
  }
  return res.status(200).json(subCategories);
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
  const id = req.params.subcategory;
  console.log(id);
  let subcategory;
  let { subcategoryNew } = req.body;
  try {
    subcategory = await SubCategory.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          subcategoryname: subcategoryNew,
        },
      },
      { new: true },
      (err, data) => {
        if (data === null) {
          return res.status(404).json({ message: "Sub Category not found" });
        } else {
          return res.status(200).json({ subcategory });
        }
      }
    );
  } catch (err) {}
};

const deleteSubCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delSubCat = await SubCategory.findByIdAndRemove(id);
    if (!delSubCat) {
      return res.status(400).json({ message: "Bad Request" });
    } else {
      return res.status(201).json({ delSubCat });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.addSubCategory = addSubCategory;
exports.addManySubCategory = addManySubCategory;
exports.getAllSubCategories = getAllSubCategories;
exports.getSubCategoriesByCompany = getSubCategoriesByCompany;
exports.updateSubCategory = updateSubCategory;
exports.deleteSubCategory = deleteSubCategory;
