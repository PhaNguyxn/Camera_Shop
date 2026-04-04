
const Users = require('../../Model/users.model')

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

    const { fullname, email, password, phone } = req.query;

    if (!fullname || !email || !password || !phone) {
        return res.json("missing data");
    }

    const user = await Users.create({
        fullname,
        email,
        password,
        phone
    });

    res.json(user);
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    const users = await Users.findOne({email, password});

    if (users) {
        res.json(users);
    } else {
        res.json("false");
    }
}

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