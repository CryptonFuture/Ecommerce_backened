const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");

const {
  addProduct,
  viewProducts,
  viewSingleProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.post("/add", upload.single("image"), addProduct);

router.get("/", viewProducts);

router.get("/:id", viewSingleProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct)

module.exports = router;