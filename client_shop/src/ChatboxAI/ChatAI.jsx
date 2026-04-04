import React, { useState, useEffect, useRef } from 'react';
import './ChatAI.css';
import AIAPI from "../API/AiAPI";
import CartAPI from "../API/CartAPI";
import { useHistory } from 'react-router-dom';


const ChatAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [aiMessage, setAiMessage] = useState('');
    const [aiHistory, setAiHistory] = useState([]);
    const [loadingAI, setLoadingAI] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const history = useHistory();

    const renderMessage = (text) => {
    // Regex tìm: **Tên Máy** (ID: 123)
    const parts = text.split(/(\*\*.*?\*\*\s\(ID:\s.*?\))/g);

    return parts.map((part, index) => {
        const match = part.match(/\*\*(.*?)\*\*\s\(ID:\s(.*?)\)/);
        if (match) {
            const productName = match[1];
            const productId = match[2];
            return (
                <div 
                    key={index} 
                    className="product-title-link"
                    onClick={() => history.push(`/detail/${productId}`)}
                    style={{ 
                        color: '#d35400', 
                        cursor: 'pointer', 
                        fontWeight: 'bold', 
                        fontSize: '16px',
                        marginTop: '10px',
                        display: 'block' 
                    }}
                >
                    {productName}
                </div>
            );
        }
        // Xử lý xuống dòng cho các phần còn lại (Giá và Mô tả)
        return <span key={index} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
    });
};

    const handleAddToCart = async (product) => {
    // Sửa localStorage thành sessionStorage
    const idUser = sessionStorage.getItem('id_user'); 
    
    console.log("ID User lấy từ Session:", idUser);

    if (!idUser) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
        return;
    }

    try {
        const params = {
            idUser: idUser,
            idProduct: product._id,
            count: 1
        };
        // Sử dụng query string giống như cách bạn làm trong file SignIn
        const query = `?idUser=${idUser}&idProduct=${product._id}&count=1`;
        const response = await CartAPI.postAddToCart(query);
        
        if (response) {
            alert(`Đã thêm ${product.name} vào giỏ hàng!`);
        }
    } catch (error) {
        console.error("Lỗi thêm giỏ hàng:", error);
    }
};

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aiHistory, loadingAI]);

    const compressImage = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Giảm hẳn chiều rộng xuống 400px để tối ưu dung lượng
                const MAX_WIDTH = 400; 
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Xuất ảnh chất lượng 0.5 (50%)
                resolve(canvas.toDataURL('image/jpeg', 0.5));
            };
        };
    });
};

    const handleSendAI = async (e) => {
        if (e) e.preventDefault();
        const trimmedMsg = aiMessage.trim();
        if ((!trimmedMsg && !selectedImage) || loadingAI) return;

        setLoadingAI(true);
        const currentMsg = { 
            role: 'user', 
            text: trimmedMsg || "Đang phân tích hình ảnh...", 
            image: previewUrl 
        };
        setAiHistory(prev => [...prev, currentMsg]);
        setAiMessage('');
        setPreviewUrl(null);

        try {
            const res = await AIAPI.chat({
                message: trimmedMsg,
                image: selectedImage ? await compressImage(selectedImage) : null,
                history: aiHistory.slice(-3)
            });
            
            setAiHistory(prev => [...prev, { 
                role: 'ai', 
                text: res.reply, 
                products: res.products 
            }]);
        } catch (error) {
            setAiHistory(prev => [...prev, { role: 'ai', text: 'Lỗi kết nối server.' }]);
        } finally {
            setLoadingAI(false);
            setSelectedImage(null);
        }
        
    };

    return (
        <div className="chatbot-wrapper">
            <div className={`chat-launcher ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <i className={isOpen ? "fas fa-times" : "fas fa-robot"}></i>
            </div>

            {isOpen && (
                <div className="chat-container-main">
                    <div className="chat-header-custom">
                        <div className="d-flex align-items-center">
                            <div className="ai-status-dot"></div>
                            <h6 className="mb-0 ml-2">Trợ lý AI</h6>
                        </div>
                        <i className="fas fa-times" onClick={() => setIsOpen(false)} style={{cursor:'pointer'}}></i>
                    </div>

                    <div className="chat-content-area">
                        {aiHistory.map((msg, i) => (
                            <div key={i} className={`msg-box ${msg.role === 'user' ? 'user-msg' : 'ai-msg'}`}>
                                {msg.role === 'ai' && <div className="ai-icon-small"><i className="fas fa-robot"></i></div>}
                                {/* Trong vòng lặp aiHistory.map... */}
<div className="bubble">
    {msg.image && <img src={msg.image} className="img-in-chat" alt="User upload" />}
    <div className="text-content">{msg.text}</div>
    
    {/* HIỂN THỊ SẢN PHẨM DẠNG CARD RIÊNG BIỆT */}
    {msg.role === 'ai' && msg.products?.length > 0 && (
        <div className="recommended-container">
            {msg.products.map(p => (
                <div key={p._id} className="product-card-premium">
    <div className="product-card-body">
        
        {/* === THAY ĐỔI DÒNG NÀY ĐỂ THÊM LINK VÀO HÌNH ẢNH === */}
        <img 
            src={p.img1} 
            alt={p.name} 
            className="product-img-thumb click-for-detail" // Thêm class mới
            onClick={() => window.location.href = `/detail/${p._id}`} // Điều hướng khi nhấp
        />
        {/* ================================================== */}

        <div className="product-details">
            {/* Nếu bạn muốn nhấp vào tên cũng xem chi tiết, hãy thêm onClick vào đây */}
            <div 
                className="p-main-name click-for-detail"
                onClick={() => window.location.href = `/detail/${p._id}`}
            >
                {p.name}
            </div>
            <div className="p-main-price">{p.price?.toLocaleString()} đ</div>
        </div>
        <div className="p-action" onClick={() => handleAddToCart(p)}>
            + Thêm
        </div>
    </div>
</div>
            ))}

            {/* CÁC NÚT HÀNH ĐỘNG DƯỚI CÙNG */}
            <div className="action-suggestion-group">
                <button className="action-chip" onClick={() => setAiMessage("Tìm sản phẩm khác")}>
                    Tìm sản phẩm khác
                </button>
            </div>
        </div>
    )}
</div>
                            </div>
                        ))}
                        {loadingAI && <div className="typing-loader">AI đang trả lời...</div>}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="chat-input-footer">
                        {previewUrl && (
                            <div className="preview-container">
                                <img src={previewUrl} alt="preview" />
                                <i className="fas fa-times-circle" onClick={() => {setSelectedImage(null); setPreviewUrl(null)}}></i>
                            </div>
                        )}
                        <form className="input-wrapper" onSubmit={handleSendAI}>
                            <i className="fas fa-image" onClick={() => fileInputRef.current.click()}></i>
                            <input type="file" hidden ref={fileInputRef} accept="image/*" 
                                   onChange={(e) => {
                                       if(e.target.files[0]) {
                                           setSelectedImage(e.target.files[0]);
                                           setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                                       }
                                   }} />
                            <input type="text" placeholder="Nhập câu hỏi..." value={aiMessage} 
                                   onChange={(e) => setAiMessage(e.target.value)} />
                            <button type="submit" disabled={loadingAI}>
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatAI;