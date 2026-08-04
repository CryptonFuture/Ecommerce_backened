const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

router.post("/", placeOrder);

router.get("/", getOrders);

router.get("/:id", getOrderById);

router.put("/:id", updateOrderStatus);

router.delete("/:id", deleteOrder);

module.exports = router;