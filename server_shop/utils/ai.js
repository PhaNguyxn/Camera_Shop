const MAX_HISTORY_MESSAGES = 4;
const MAX_RECOMMENDATIONS = 3;

function buildProductFilter(message) {
  const filterCondition = {};
  const priceMatch = (message || "").match(/(\d+)\s*(triệu|tr)/i);
  if (priceMatch) {
    const limitValue = parseInt(priceMatch[1], 10) * 1000000;
    filterCondition.price = { $lte: limitValue };
  }

  return filterCondition;
}

function buildChatHistory(history) {
  const cleanedHistory = (history || [])
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.text || "" }],
    }))
    .filter((message) => message.parts[0].text !== "");

  while (cleanedHistory.length > 0 && cleanedHistory[0].role !== "user") {
    cleanedHistory.shift();
  }

  return cleanedHistory.slice(-MAX_HISTORY_MESSAGES);
}

function findRecommendedProducts(products, reply) {
  const normalizedReply = reply.toLowerCase();
  return products
    .filter((product) => normalizedReply.includes(product.name.toLowerCase()))
    .slice(0, MAX_RECOMMENDATIONS);
}

module.exports = { buildProductFilter, buildChatHistory, findRecommendedProducts };
