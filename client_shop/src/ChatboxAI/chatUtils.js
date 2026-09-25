const MAX_IMAGE_DIMENSION = 400;
const IMAGE_QUALITY = 0.5;
const MAX_HISTORY_MESSAGES = 4;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "Liên hệ";
  const amount =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/[^\d]/g, ""));
  return Number.isFinite(amount) && amount > 0
    ? `${amount.toLocaleString("vi-VN")} đ`
    : "Liên hệ";
}

export function prepareImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(new Error("Không đọc được ảnh. Vui lòng chọn lại."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () =>
        reject(new Error("Ảnh không hợp lệ. Hãy chọn ảnh JPG, PNG hoặc WebP."));
      image.onload = () => {
        try {
          const scale = Math.min(
            1,
            MAX_IMAGE_DIMENSION / Math.max(image.width, image.height),
          );
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Trình duyệt không thể xử lý ảnh này.");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
        } catch (error) {
          reject(error);
        }
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export function buildChatHistory(messages) {
  return messages
    .flatMap((message, index) => {
      const reply = messages[index + 1];
      return message.role === "user" && reply?.role === "ai" && !reply.error
        ? [
          { role: "user", text: message.text },
          { role: "ai", text: reply.text },
        ]
        : [];
    })
    .slice(-MAX_HISTORY_MESSAGES);
}
