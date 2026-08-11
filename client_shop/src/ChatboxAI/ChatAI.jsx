import React, { useEffect, useRef, useState } from "react";

import { useHistory } from "react-router-dom";

import "./ChatAI.css";

import AIAPI from "../API/AiAPI";
import CartAPI from "../API/CartAPI";

const ChatAI = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [aiMessage, setAiMessage] = useState("");

  const [aiHistory, setAiHistory] = useState([]);

  const [loadingAI, setLoadingAI] = useState(false);

  const [previewUrl, setPreviewUrl] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const chatEndRef = useRef(null);

  const fileInputRef = useRef(null);

  const history = useHistory();


  const goToProductDetail = (productId) => {
    history.push(`/detail/${productId}`);
  };


  const handleAddToCart = async (product) => {
    const idUser = sessionStorage.getItem("id_user");

    if (!idUser) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");

      return;
    }

    try {
      const query = `?idUser=${idUser}&idProduct=${product._id}&count=1`;

      const response = await CartAPI.postAddToCart(query);

      if (response) {
        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
      }
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error);

      alert("Không thể thêm sản phẩm vào giỏ hàng!");
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [aiHistory, loadingAI]);


  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");

          const MAX_WIDTH = 400;

          const finalWidth = Math.min(img.width, MAX_WIDTH);

          const scaleSize = finalWidth / img.width;

          canvas.width = finalWidth;

          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL("image/jpeg", 0.5));
        };

        img.onerror = () => {
          reject(new Error("Không thể đọc ảnh"));
        };
      };

      reader.onerror = () => {
        reject(new Error("Không thể đọc file"));
      };

      reader.readAsDataURL(file);
    });
  };


  const handleSendAI = async (e) => {
    if (e) {
      e.preventDefault();
    }

    const trimmedMsg = aiMessage.trim();

    if ((!trimmedMsg && !selectedImage) || loadingAI) {
      return;
    }

    setLoadingAI(true);

    const currentMsg = {
      role: "user",

      text: trimmedMsg || "Đang phân tích hình ảnh...",

      image: previewUrl,
    };

    setAiHistory((prev) => [...prev, currentMsg]);

    setAiMessage("");

    try {
      const compressedImage = selectedImage
        ? await compressImage(selectedImage)
        : null;

      const res = await AIAPI.chat({
        message: trimmedMsg,

        image: compressedImage,

        history: aiHistory.slice(-3),
      });

      setAiHistory((prev) => [
        ...prev,

        {
          role: "ai",

          text: res.reply,

          products: res.products,
        },
      ]);
    } catch (error) {
      console.error("AI error:", error);

      setAiHistory((prev) => [
        ...prev,

        {
          role: "ai",
          text: "Lỗi kết nối server.",
        },
      ]);
    } finally {
      setLoadingAI(false);

      setSelectedImage(null);

      setPreviewUrl(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);

    setPreviewUrl(URL.createObjectURL(file));
  };


  const removeSelectedImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(null);

    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="chatbot-wrapper">

      <button
        type="button"
        className={`chat-launcher ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
      >
        <i className={isOpen ? "fas fa-times" : "fas fa-robot"}></i>
      </button>

      {isOpen && (
        <div className="chat-container-main">
          {/* HEADER */}

          <div className="chat-header-custom">
            <div className="d-flex align-items-center">
              <div className="ai-status-dot"></div>

              <h6 className="mb-0 ml-2">Trợ lý AI</h6>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="border-0 bg-transparent"
              aria-label="Đóng trợ lý AI"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="chat-content-area">
            {aiHistory.map((msg, index) => (
              <div
                key={index}
                className={`msg-box ${
                  msg.role === "user" ? "user-msg" : "ai-msg"
                }`}
              >
                {msg.role === "ai" && (
                  <div className="ai-icon-small">
                    <i className="fas fa-robot"></i>
                  </div>
                )}

                <div className="bubble">

                  {msg.image && (
                    <img
                      src={msg.image}
                      className="img-in-chat"
                      alt="Ảnh người dùng gửi"
                    />
                  )}


                  <div
                    className="text-content"
                    style={{
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.text}
                  </div>


                  {msg.role === "ai" && msg.products?.length > 0 && (
                    <div className="recommended-container">
                      {msg.products.map((product) => (
                        <div key={product._id} className="product-card-premium">
                          <div className="product-card-body">

                            <button
                              type="button"
                              className="border-0 bg-transparent p-0"
                              onClick={() => goToProductDetail(product._id)}
                            >
                              <img
                                src={product.img1}
                                alt={product.name}
                                className="product-img-thumb click-for-detail"
                              />
                            </button>


                            <div className="product-details">
                              <button
                                type="button"
                                className="p-main-name click-for-detail border-0 bg-transparent p-0 text-left"
                                onClick={() => goToProductDetail(product._id)}
                              >
                                {product.name}
                              </button>

                              <div className="p-main-price">
                                {Number(product.price).toLocaleString("vi-VN")}

                                {" đ"}
                              </div>
                            </div>


                            <button
                              type="button"
                              className="p-action"
                              onClick={() => handleAddToCart(product)}
                            >
                              + Thêm
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="action-suggestion-group">
                        <button
                          type="button"
                          className="action-chip"
                          onClick={() => setAiMessage("Tìm sản phẩm khác")}
                        >
                          Tìm sản phẩm khác
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loadingAI && (
              <div className="typing-loader">AI đang trả lời...</div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          <div className="chat-input-footer">
            {previewUrl && (
              <div className="preview-container">
                <img src={previewUrl} alt="Ảnh xem trước" />

                <button
                  type="button"
                  className="border-0 bg-transparent"
                  onClick={removeSelectedImage}
                  aria-label="Xóa ảnh"
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              </div>
            )}

            <form className="input-wrapper" onSubmit={handleSendAI}>

              <button
                type="button"
                className="border-0 bg-transparent"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Chọn ảnh"
              >
                <i className="fas fa-image"></i>
              </button>

              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
              />


              <input
                type="text"
                placeholder="Nhập câu hỏi..."
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
              />


              <button
                type="submit"
                disabled={loadingAI}
                aria-label="Gửi tin nhắn"
              >
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
