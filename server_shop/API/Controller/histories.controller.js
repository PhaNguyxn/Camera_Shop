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
    const idUser = req.user.id;

    const histories = await Histories.find({
      idUser,
    })
      .sort({ createdAt: -1 })
      .lean();

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
    const { id } = req.params;

    if (!/^[a-f\d]{24}$/i.test(String(id))) {
      return res.status(400).json({
        message: "Mã đơn hàng không hợp lệ",
      });
    }

    const filter = { _id: id };

    if (req.user.role !== "admin") {
      filter.idUser = req.user.id;
    }

    const order = await Histories.findOne(filter).lean();

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    return res.json(order);
  } catch (error) {
    console.error("Get history detail error:", error);

    return res.status(500).json({
      message: "Không thể tải chi tiết đơn hàng",
    });
  }
};


module.exports.history = async (req, res) => {
  try {
    const histories = await Histories.find().sort({ createdAt: -1 }).lean();

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
    const idUser = req.user.id;

    const { fullname, email, phone, address, paymentMethod = "COD" } = req.body;

    if (
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
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body || {};

    if (!/^[a-f\d]{24}$/i.test(String(id))) {
      return res.status(400).json({
        message: "Mã đơn hàng không hợp lệ",
      });
    }

    const validOrderStatuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPING",
      "DELIVERED",
      "CANCELLED",
    ];

    const validPaymentStatuses = ["UNPAID", "PAID"];

    if (orderStatus === undefined && paymentStatus === undefined) {
      return res.status(400).json({
        message: "Chưa có trạng thái cần cập nhật",
      });
    }

    if (
      orderStatus !== undefined &&
      !validOrderStatuses.includes(orderStatus)
    ) {
      return res.status(400).json({
        message: "Trạng thái đơn hàng không hợp lệ",
      });
    }

    if (
      paymentStatus !== undefined &&
      !validPaymentStatuses.includes(paymentStatus)
    ) {
      return res.status(400).json({
        message: "Trạng thái thanh toán không hợp lệ",
      });
    }

    const currentOrder = await Histories.findById(id)
      .select("_id paymentMethod paymentStatus status paidAt")
      .lean();

    if (!currentOrder) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    if (paymentStatus !== undefined && currentOrder.paymentMethod === "PAYOS") {
      return res.status(400).json({
        message: "Thanh toán PAYOS phải được xác nhận tự động",
      });
    }

    const changes = {};

    if (orderStatus !== undefined) {
      changes.orderStatus = orderStatus;
      changes.delivery = ["SHIPPING", "DELIVERED"].includes(orderStatus);
    }

    if (paymentStatus !== undefined) {
      const paid = paymentStatus === "PAID";

      changes.paymentStatus = paymentStatus;
      changes.status = paid;

      if (!paid) {
        changes.paidAt = null;
      } else {
        const alreadyPaid =
          currentOrder.paymentStatus === "PAID" ||
          (!currentOrder.paymentStatus && currentOrder.status === true);

        changes.paidAt =
          alreadyPaid && currentOrder.paidAt ? currentOrder.paidAt : new Date();
      }
    }

    const filter = { _id: id };

    if (paymentStatus !== undefined) {
      filter.paymentMethod = { $ne: "PAYOS" };
    }

    const updatedOrder = await Histories.findOneAndUpdate(
      filter,
      {
        $set: changes,
      },
      {
        new: true,
        runValidators: true,
        context: "query",
      },
    ).lean();

    if (!updatedOrder) {
      return res.status(409).json({
        message:
          "Đơn hàng đã thay đổi hoặc không còn tồn tại. Vui lòng tải lại.",
      });
    }

    return res.json({
      message: "Cập nhật đơn hàng thành công",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: "Dữ liệu cập nhật đơn hàng không hợp lệ",
      });
    }

    return res.status(500).json({
      message: "Có lỗi xảy ra khi cập nhật đơn hàng",
    });
  }
};
