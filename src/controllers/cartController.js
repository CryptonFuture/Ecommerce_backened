const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.addToCart = async (req, res) => {

    try {

        const { userId, productId, quantity } = req.body;

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {

            cart = new Cart({
                userId,
                products: []
            });

        }

        const productIndex = cart.products.findIndex(
            item => item.product.toString() === productId
        );

        if (productIndex > -1) {

            cart.products[productIndex].quantity += quantity;

        } else {

            cart.products.push({
                product: productId,
                quantity
            });

        }

        await cart.save();

        res.status(200).json({

            success: true,
            message: "Product added to cart",
            data: cart

        });

    }

    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


exports.viewCart = async (req, res) => {

    try {

        const { userId } = req.params;

        const cart = await Cart.findOne({ userId })
            .populate("products.product");

        if (!cart) {

            return res.status(404).json({

                success: false,
                message: "Cart Empty"

            });

        }

        let total = 0;

        cart.products.forEach(item => {

            total += item.product.price * item.quantity;

        });

        res.status(200).json({

            success: true,
            totalItems: cart.products.length,
            grandTotal: total,
            data: cart

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,
            message: err.message

        });

    }

};