
const Histories = require('../../Model/histories.model')

module.exports.index = async (req, res) => {

    const idUser = req.query.idUser

    const histories = await Histories.find({ idUser: idUser })

    res.json(histories)
}

module.exports.detail = async (req, res) => {

    const id = req.params.id

    const histories = await Histories.findOne({_id: id})

    res.json(histories)

}

module.exports.history = async (req, res) => {

    const histories = await Histories.find()

    res.json(histories)

}

module.exports.postHistory = async (req, res) => {
    try {
        // Tạo đơn hàng mới từ dữ liệu req.body gửi từ Frontend
        const newOrder = await Histories.create(req.body)
        res.status(201).json(newOrder)
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lưu đơn hàng" })
    }
}
