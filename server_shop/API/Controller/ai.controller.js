const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
    buildProductFilter,
    buildChatHistory,
    findRecommendedProducts,
} = require("../../utils/ai");
const Products = require('../../Model/products.model');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
    try {
        const { message, image } = req.body;
        if (!message && !image) {
            return res.status(400).json({ reply: "Vui lòng nhập nội dung hoặc gửi ảnh!" });
        }

        // 1. Lấy danh sách sản phẩm từ DB
        const allProducts = await Products.find(buildProductFilter(message), 'name price img1').lean();
        const productContext = allProducts.map(p => `- ${p.name}: ${p.price.toLocaleString()} ₫`).join("\n");

        // 2. Cấu hình Gemini
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            systemInstruction: `Bạn là trợ lý tư vấn máy ảnh chuyên nghiệp. 
            Khi trả lời, hãy tuân thủ:
            - Văn bản: Chào hỏi thân thiện, xuống dòng 1 lần giữa các đoạn.
            - Danh sách: Tối đa 3 máy, dùng dấu "•".
            - Định dạng: Tên máy -> Xuống dòng -> •[Giá] -> Xuống dòng -> - [Mô tả].
            - Kết thúc: Luôn có câu hỏi gợi mở.

            SẢN PHẨM CÓ SẴN:
            ${productContext}`
        });

        const chatSession = model.startChat({
            history: buildChatHistory(req.body.history),
        });

        // 4. Gửi nội dung
        const promptParts = [];
        if (message) promptParts.push({ text: message });
        
        if (image && image.includes("base64,")) {
            const base64Data = image.split(",")[1];
            promptParts.push({
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg"
                }
            });
        }

        const result = await chatSession.sendMessage(promptParts);
        const replyAI = result.response.text();

        const lines = replyAI.split('\n');
        
        // Nội dung thực sự gửi cho người dùng (bỏ dòng 0)
        const cleanReply = lines.slice(1).join('\n').trim();

        // Tìm kiếm tất cả sản phẩm AI nhắc đến để hiện Card
        const recommendedProducts = findRecommendedProducts(allProducts, replyAI);

        return res.status(200).json({
            reply: cleanReply, // Trả về nội dung đã bỏ dòng tiêu đề
            products: recommendedProducts
        });

    } catch (error) {
        console.error("LỖI AI CONTROLLER (GEMINI):", error);
        return res.status(500).json({ 
            reply: "Cửa hàng đang gặp sự cố kết nối AI. Vui lòng thử lại!", 
            products: [] 
        });
    }
};
