
const Users = require('../../Model/users.model')
const bcrypt = require("bcrypt");

module.exports.index = async (req, res) => {

    const users = await Users.find()

    res.json(users)

}

module.exports.detail = async (req, res) => {

    const id = req.params.id

    const users = await Users.findOne({ _id: id})

    res.json(users)

}

module.exports.signup = async (req, res) => {
  try {
    const { fullname, email, password, phone } = {
      ...req.query,
      ...req.body,
    };

    if (!fullname || !email || !password || !phone) {
      return res.status(400).json("missing data");
    }

    const exists = await Users.findOne({
      email,
    });

    if (exists) {
      return res.status(400).json("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({
      fullname,
      email,
      password: hashedPassword,
      phone,
      role: "customer"
    });

    const result = user.toObject();

    delete result.password;

    return res.json(result);
  } catch (error) {
    console.error(error);

    return res.status(500).json("Server Error!");
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email và mật khẩu không được để trống",
      });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    const result = user.toObject();

    delete result.password;

    return res.status(200).json({
      message: "Đăng nhập thành công",
      user: result,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server Error!",
    });
  }
};

module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        await Users.deleteOne({ _id: id });

        res.json({ message: "Delete success" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
}

module.exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, email, phone } = req.body;

        const user = await Users.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.fullname = fullname;
        user.email = email;
        user.phone = phone;

        await user.save();

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Update failed" });
    }
};