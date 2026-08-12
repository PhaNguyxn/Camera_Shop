const Histories = require("../../Model/histories.model");
const Carts = require("../../Model/carts.model");
const Products = require("../../Model/products.model");

const parsePrice = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }

  const numericValue = String(value).replace(/[^\d]/g, "");

  return Number(numericValue) || 0;
};


module.exports.index = async (req, res) => {
  try {
    const idUser = req.query.idUser;

    if (!idUser) {
      return res.status(400).json({
        message: "Thiếu idUser",
      });
    }

    const histories = await Histories.find({
      idUser,
    }).sort({
      createdAt: -1,
    });

    return res.json(histories);
  } catch (error) {
    console.error("Get histories error:", error);

    return res.status(500).json({
      message: "Không thể tải lịch sử đơn hàng",
    });
  }
};


module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const history = await Histories.findById(id);

    if (!history) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.json(history);
  } catch (error) {
    console.error("Get history detail error:", error);

    return res.status(500).json({
      message: "Không thể tải đơn hàng",
    });
  }
};


module.exports.history = async (req, res) => {
  try {
    const histories = await Histories.find().sort({
      createdAt: -1,
    });

    return res.json(histories);
  } catch (error) {
    console.error("Get all histories error:", error);

    return res.status(500).json({
      message: "Không thể tải danh sách đơn hàng",
    });
  }
};


module.exports.postHistory = async (req, res) => {
  try {
    const {
      idUser,
      fullname,
      email,
      phone,
      address,
      paymentMethod = "COD",
    } = req.body;

    if (
      !idUser ||
      !fullname?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !address?.trim()
    ) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    if (!["COD", "PAYOS"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Phương thức thanh toán không hợp lệ",
      });
    }


    const carts = await Carts.find({
      idUser,
    });

    if (!carts.length) {
      return res.status(400).json({
        message: "Giỏ hàng đang trống",
      });
    }


    const productIds = carts.map((item) => item.idProduct);

    const products = await Products.find({
      _id: {
        $in: productIds,
      },
    });

    const productMap = new Map();

    products.forEach((product) => {
      productMap.set(product._id.toString(), product);
    });


    const orderItems = [];

    let totalAmount = 0;

    for (const cartItem of carts) {
      const product = productMap.get(cartItem.idProduct);

      if (!product) {
        return res.status(400).json({
          message: "Có sản phẩm trong giỏ hàng không còn tồn tại",
        });
      }

      const quantity = Number(cartItem.count);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({
          message: "Số lượng sản phẩm không hợp lệ",
        });
      }

      const price = parsePrice(product.price);

      if (price <= 0) {
        return res.status(400).json({
          message: `Giá sản phẩm ${product.name} không hợp lệ`,
        });
      }

      totalAmount += price * quantity;

      orderItems.push({
        idProduct: product._id.toString(),

        nameProduct: product.name,

        priceProduct: price,

        count: quantity,

        img: product.img1 || "",
      });
    }


    const order = await Histories.create({
      orderCode: Date.now(),

      idUser,

      fullname: fullname.trim(),

      email: email.trim(),

      phone: phone.trim(),

      address: address.trim(),

      cart: orderItems,

      total: String(totalAmount),

      totalAmount,

      paymentMethod,

      paymentStatus: paymentMethod === "COD" ? "UNPAID" : "PENDING",

      orderStatus: "PENDING",

      status: false,

      delivery: false,
    });


    if (paymentMethod === "COD") {
      await Carts.deleteMany({
        idUser,
      });
    }

    return res.status(201).json({
      message: "Đặt hàng thành công",

      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Lỗi server khi tạo đơn hàng",
    });
  }
};


module.exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;

    const { status } = req.body;

    const paid =
      status === true || status === 1 || status === "1" || status === "true";

    const updated = await Histories.findByIdAndUpdate(
      id,
      {
        status: paid,

        paymentStatus: paid ? "PAID" : "UNPAID",

        paidAt: paid ? new Date() : null,
      },
      {
        new: true,
      },
    );

    if (!updated) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.json(updated);
  } catch (error) {
    console.error("Update order error:", error);

    return res.status(500).json({
      message: "Update thất bại",
    });
  }
};

module.exports.updateOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const { orderStatus, paymentStatus } = req.body;

    const validOrderStatuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPING",
      "DELIVERED",
      "CANCELLED",
    ];

    const validPaymentStatuses = ["UNPAID", "PAID"];

    const order = await Histories.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (orderStatus !== undefined) {
      if (!validOrderStatuses.includes(orderStatus)) {
        return res.status(400).json({
          message: "Trạng thái đơn hàng không hợp lệ",
        });
      }

      order.orderStatus = orderStatus;

      order.delivery = ["SHIPPING", "DELIVERED"].includes(orderStatus);
    }

    if (paymentStatus !== undefined) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          message: "Trạng thái thanh toán không hợp lệ",
        });
      }

      if (order.paymentMethod === "PAYOS") {
        return res.status(400).json({
          message: "Thanh toán PAYOS phải được xác nhận tự động",
        });
      }

      order.paymentStatus = paymentStatus;

      order.status = paymentStatus === "PAID";

      order.paidAt = paymentStatus === "PAID" ? new Date() : null;
    }

    await order.save();

    return res.json({
      message: "Cập nhật đơn hàng thành công",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);

    return res.status(500).json({
      message: "Có lỗi xảy ra khi cập nhật đơn hàng",
    });
  }
};
