const Carts = require("../../Model/carts.model");
const Products = require("../../Model/products.model");


module.exports.index = async (req, res) => {
  try {
    const idUser = req.user.id;

    const carts = await Carts.find({
      idUser,
    });

    return res.json(carts);
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      message: "Unable to load cart.",
    });
  }
};


module.exports.addToCart = async (req, res) => {
  try {
    const idUser = req.user.id;

    const idProduct = req.body.idProduct || req.query.idProduct;

    const count = req.body.count || req.query.count;

    if (!idProduct) {
      return res.status(400).json({
        message: "Product ID is required.",
      });
    }

    const quantity = Number(count);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Invalid quantity.",
      });
    }

    const product = await Products.findById(idProduct);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const cart = await Carts.findOne({
      idUser,
      idProduct,
    });

    if (!cart) {
      const newCart = await Carts.create({
        idUser,
        idProduct,
        nameProduct: product.name,
        priceProduct: product.price,
        count: quantity,
        img: product.img1,
      });

      return res.status(201).json(newCart);
    }

    cart.count = Number(cart.count) + quantity;

    await cart.save();

    return res.json(cart);
  } catch (error) {
    console.error("Add cart error:", error);

    return res.status(500).json({
      message: "Unable to add product to cart.",
    });
  }
};


module.exports.deleteToCart = async (req, res) => {
  try {
    const idUser = req.user.id;

    const idProduct = req.body.idProduct || req.query.idProduct;

    if (idProduct) {
      await Carts.deleteOne({
        idUser,
        idProduct,
      });

      return res.json({
        message: "Product removed from cart.",
      });
    }

    await Carts.deleteMany({
      idUser,
    });

    return res.json({
      message: "Cart cleared.",
    });
  } catch (error) {
    console.error("Delete cart error:", error);

    return res.status(500).json({
      message: "Unable to remove cart item.",
    });
  }
};


module.exports.updateToCart = async (req, res) => {
  try {
    const idUser = req.user.id;

    const idProduct = req.body.idProduct || req.query.idProduct;

    const count = req.body.count || req.query.count;

    const quantity = Number(count);

    if (!idProduct) {
      return res.status(400).json({
        message: "Product ID is required.",
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Invalid quantity.",
      });
    }

    const cart = await Carts.findOne({
      idUser,
      idProduct,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart item not found.",
      });
    }

    cart.count = quantity;

    await cart.save();

    return res.json(cart);
  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(500).json({
      message: "Unable to update cart.",
    });
  }
};
