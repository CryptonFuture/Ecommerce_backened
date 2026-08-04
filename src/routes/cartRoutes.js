const express = require("express");

const router = express.Router();

const { addToCart, viewCart } = require("../controllers/cartController");

router.post("/add", addToCart);

router.get("/:userId", viewCart);

module.exports=router;