const { GoogleGenerativeAI } = require("@google/generative-ai");
const Products = require('../../Model/products.model');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
    try {
        const { message, image } = req.body;
        
        let filterCondition = {};
        const priceMatch = (message || "").match(/(\d+)\s*(triệu|tr)/i);
        if (priceMatch) {
            const limitValue = parseInt(priceMatch[1]) * 1000000;
            filterCondition.price = { $lte: limitValue };
        }

        if (!message && !image) {
            return res.status(400).json({ reply: "Vui lòng nhập nội dung hoặc gửi ảnh!" });
        }

        // 1. Lấy danh sách sản phẩm từ DB
        let allProducts = await Products.find(filterCondition, 'name price img1').lean();
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

        // 3. Xử lý Lịch sử Chat an toàn
        let cleanedHistory = (req.body.history || [])
            .map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.text || "" }],
            }))
            .filter(h => h.parts[0].text !== "");

        while (cleanedHistory.length > 0 && cleanedHistory[0].role !== 'user') {
            cleanedHistory.shift();
        }

        const chatSession = model.startChat({
            history: cleanedHistory.slice(-4), 
        });

        // 4. Gửi nội dung
        let promptParts = [];
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

        // --- 5. LOGIC XỬ LÝ CHUỖI ĐỂ KHÔNG BỊ DƯ DÒNG ĐẦU ---
        const lines = replyAI.split('\n');
        // Dòng đầu tiên dùng để so khớp trong DB
        const identifiedModel = lines[0].trim().toLowerCase();
        
        // Nội dung thực sự gửi cho người dùng (bỏ dòng 0)
        const cleanReply = lines.slice(1).join('\n').trim();

        // Tìm kiếm tất cả sản phẩm AI nhắc đến để hiện Card
        const replyLower = replyAI.toLowerCase();
        const recommendedProducts = allProducts.filter(p => {
            return replyLower.includes(p.name.toLowerCase());
        }).slice(0, 3);

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