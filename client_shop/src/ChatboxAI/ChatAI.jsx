import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AIAPI from "../API/AiAPI";
import CartAPI from "../API/CartAPI";
import ChatIcon from "./ChatIcon";
import MessageText from "./MessageText";
import ChatProducts from "./ChatProducts";
import {
  buildChatHistory,
  prepareImage,
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from "./chatUtils";
import "./ChatAI.css";

const SUGGESTIONS = [
  "Máy ảnh cho người mới bắt đầu",
  "Tư vấn máy ảnh dưới 20 triệu",
  "Máy ảnh phù hợp để quay vlog",
];

export default function ChatAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [notice, setNotice] = useState(null);
  const mounted = useRef(false);
  const sending = useRef(false);
  const adding = useRef(false);
  const imageVersion = useRef(0);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const scrollRef = useRef(null);
  const launcherRef = useRef(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      imageVersion.current += 1;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        launcherRef.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const area = scrollRef.current;
    if (area) area.scrollTop = messages.length ? area.scrollHeight : 0;
  }, [messages, loading, isOpen]);

  const closeChat = () => {
    setIsOpen(false);
    launcherRef.current?.focus({ preventScroll: true });
  };

  const chooseImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || sending.current) return;
    if (
      !IMAGE_TYPES.includes(file.type) ||
      file.size > MAX_IMAGE_BYTES
    ) {
      setNotice({
        type: "error",
        text: "Chọn ảnh JPG, PNG hoặc WebP, tối đa 5 MB.",
      });
      return;
    }
    const version = ++imageVersion.current;
    setImageBusy(true);
    setNotice(null);
    try {
      const data = await prepareImage(file);
      if (mounted.current && version === imageVersion.current)
        setAttachment({ data, name: file.name });
    } catch (error) {
      if (mounted.current && version === imageVersion.current)
        setNotice({ type: "error", text: error.message });
    } finally {
      if (mounted.current && version === imageVersion.current)
        setImageBusy(false);
    }
  };

  const sendMessage = async (suggestion) => {
    const text = (typeof suggestion === "string" ? suggestion : draft).trim();
    if (sending.current || imageBusy || (!text && !attachment)) return;
    sending.current = true;
    setLoading(true);
    setNotice(null);
    const image = attachment?.data || null;
    const history = buildChatHistory(messages);
    setMessages((previous) => [
      ...previous,
      { role: "user", text: text || "Tư vấn giúp tôi về hình ảnh này.", image },
    ]);
    setDraft("");
    setAttachment(null);
    try {
      const response = await AIAPI.chat({ message: text, image, history });
      if (!mounted.current) return;
      if (typeof response?.reply !== "string" || !response.reply.trim())
        throw new Error("EMPTY_REPLY");
      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          text: response.reply,
          products: Array.isArray(response.products) ? response.products : [],
        },
      ]);
    } catch (error) {
      if (!mounted.current) return;
      const errorText =
        error.response?.status === 401
          ? "Phiên đăng nhập đã hết hạn. Bạn hãy đăng nhập lại để tiếp tục."
          : "Chưa kết nối được với trợ lý. Bạn có thể thử gửi lại sau ít phút.";
      setMessages((previous) => [
        ...previous,
        { role: "ai", text: errorText, error: true, retry: { text, image } },
      ]);
    } finally {
      sending.current = false;
      if (mounted.current) setLoading(false);
    }
  };

  const restoreMessage = (retry) => {
    setDraft(retry.text || "");
    setAttachment(
      retry.image ? { data: retry.image, name: "Ảnh gửi lại" } : null,
    );
    inputRef.current?.focus({ preventScroll: true });
  };

  const addToCart = async (product) => {
    if (adding.current) return;
    const userId = sessionStorage.getItem("id_user");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) {
      setNotice({
        type: "error",
        text: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ.",
        login: true,
      });
      return;
    }
    const id = product._id || product.id;
    if (!id) return;
    adding.current = true;
    setAddingId(id);
    setNotice(null);
    try {
      const query = new URLSearchParams({
        idUser: userId,
        idProduct: id,
        count: "1",
      });
      await CartAPI.postAddToCart(`?${query.toString()}`);
      window.dispatchEvent(new Event("cartUpdated"));
      if (mounted.current)
        setNotice({
          type: "success",
          text: `Đã thêm ${product.name} vào giỏ hàng.`,
        });
    } catch (error) {
      if (mounted.current)
        setNotice({
          type: "error",
          text:
            error.response?.status === 401
              ? "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
              : "Chưa thêm được sản phẩm. Vui lòng thử lại.",
          login: error.response?.status === 401,
        });
    } finally {
      adding.current = false;
      if (mounted.current) setAddingId(null);
    }
  };

  return (
    <div className="csai">
      {isOpen && (
        <section
          className="csai-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="csai-title"
        >
          <header className="csai-header">
            <div className="csai-brand-icon">
              <ChatIcon size={24} />
            </div>
            <div className="csai-heading">
              <span className="csai-eyebrow">CAMERA SHOP</span>
              <h2 id="csai-title">Trợ lý mua sắm AI</h2>
              <p>Tìm chiếc máy ảnh dành cho bạn</p>
            </div>
            <button
              className="csai-icon-button csai-close"
              type="button"
              onClick={closeChat}
              aria-label="Đóng khung chat"
            >
              <ChatIcon name="close" />
            </button>
          </header>

          <div className="csai-conversation" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="csai-welcome">
                <span className="csai-eyebrow">
                  MỖI KHOẢNH KHẮC, MỘT LỰA CHỌN
                </span>
                <h3>
                  Chào bạn,
                  <br />
                  mình có thể giúp gì?
                </h3>
                <p>
                  Chia sẻ nhu cầu và ngân sách. Mình sẽ giúp bạn tìm máy ảnh phù
                  hợp.
                </p>
                <div className="csai-suggestions">
                  {SUGGESTIONS.map((text) => (
                    <button
                      key={text}
                      type="button"
                      disabled={loading || imageBusy}
                      onClick={() => sendMessage(text)}
                    >
                      <span>{text}</span>
                      <ChatIcon name="arrow" size={17} />
                    </button>
                  ))}
                </div>
                <div className="csai-photo-hint">
                  <ChatIcon name="image" size={17} />
                  <span>Bạn cũng có thể gửi ảnh để được tư vấn.</span>
                </div>
              </div>
            )}

            <div
              className="csai-log"
              role="log"
              aria-label="Nội dung trò chuyện"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.map((message, index) => (
                <div
                  className={`csai-message csai-message--${message.role}`}
                  key={index}
                >
                  {message.role === "ai" && (
                    <div className="csai-avatar">
                      <ChatIcon name="spark" size={16} />
                    </div>
                  )}
                  <div className="csai-message-body">
                    <span className="csai-sender">
                      {message.role === "user" ? "Bạn" : "Camera Shop AI"}
                    </span>
                    <div
                      className={`csai-bubble${message.error ? " csai-bubble--error" : ""}`}
                    >
                      {message.image && (
                        <img
                          className="csai-sent-image"
                          src={message.image}
                          alt="Ảnh bạn đã gửi để tư vấn"
                        />
                      )}
                      <MessageText text={message.text} />
                      {message.error && (
                        <button
                          className="csai-retry"
                          type="button"
                          disabled={loading || imageBusy}
                          onClick={() => restoreMessage(message.retry)}
                        >
                          Nhập lại câu hỏi <ChatIcon name="arrow" size={14} />
                        </button>
                      )}
                    </div>
                    {message.role === "ai" && message.products?.length > 0 && (
                      <ChatProducts
                        products={message.products}
                        addingId={addingId}
                        onAddToCart={addToCart}
                        onNavigate={closeChat}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            {loading && (
              <div className="csai-typing" role="status">
                <div className="csai-avatar">
                  <ChatIcon name="spark" size={16} />
                </div>
                <div className="csai-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <span>Đang tìm câu trả lời…</span>
              </div>
            )}
          </div>

          <footer className="csai-footer">
            {notice && (
              <div
                className={`csai-notice csai-notice--${notice.type}`}
                role={notice.type === "error" ? "alert" : "status"}
              >
                <div>
                  {notice.text}
                  {notice.login && (
                    <Link to="/signin" onClick={closeChat}>
                      Đăng nhập
                    </Link>
                  )}
                </div>
                <button
                  type="button"
                  className="csai-icon-button"
                  onClick={() => setNotice(null)}
                  aria-label="Đóng thông báo"
                >
                  <ChatIcon name="close" size={16} />
                </button>
              </div>
            )}
            {attachment && (
              <div className="csai-attachment">
                <img src={attachment.data} alt="Ảnh đính kèm" />
                <div>
                  <strong>Ảnh đã sẵn sàng</strong>
                  <span>{attachment.name}</span>
                </div>
                <button
                  type="button"
                  className="csai-icon-button"
                  onClick={() => setAttachment(null)}
                  aria-label="Bỏ ảnh đính kèm"
                >
                  <ChatIcon name="close" size={16} />
                </button>
              </div>
            )}
            {imageBusy && (
              <p className="csai-image-status" role="status">
                Đang xử lý ảnh…
              </p>
            )}
            <form
              className="csai-composer"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <textarea
                ref={inputRef}
                rows={2}
                maxLength={2000}
                placeholder="Bạn đang tìm máy ảnh nào?"
                aria-label="Nội dung tin nhắn"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <div className="csai-composer-actions">
                <button
                  type="button"
                  className="csai-attach-button"
                  disabled={loading || imageBusy}
                  onClick={() => fileRef.current?.click()}
                  aria-label="Đính kèm ảnh JPG, PNG hoặc WebP"
                >
                  <ChatIcon name="image" size={19} />
                  <span>Thêm ảnh</span>
                </button>
                <span className="csai-enter-hint">Enter để gửi</span>
                <button
                  className="csai-send"
                  type="submit"
                  disabled={
                    loading || imageBusy || (!draft.trim() && !attachment)
                  }
                  aria-label="Gửi tin nhắn"
                >
                  <ChatIcon name="send" size={18} />
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept={IMAGE_TYPES.join(",")}
                hidden
                onChange={chooseImage}
              />
            </form>
            <p className="csai-disclaimer">
              Gợi ý từ AI · Kiểm tra thông tin tại trang sản phẩm.
            </p>
          </footer>
        </section>
      )}
      <button
        ref={launcherRef}
        type="button"
        className={`csai-launcher${isOpen ? " csai-launcher--open" : ""}`}
        onClick={() => setIsOpen((value) => !value)}
        aria-label={isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
        aria-expanded={isOpen}
      >
        <ChatIcon name={isOpen ? "close" : "spark"} size={23} />
        {!isOpen && (
          <span>
            Hỏi Camera Shop <small>AI</small>
          </span>
        )}
      </button>
    </div>
  );
}
