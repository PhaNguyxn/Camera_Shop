const test = require("node:test");
const assert = require("node:assert/strict");
const { buildProductFilter, buildChatHistory, findRecommendedProducts } = require("./ai");

test("extracts the existing million-VND budget syntax", () => {
  assert.deepEqual(buildProductFilter("máy ảnh dưới 20 triệu"), { price: { $lte: 20000000 } });
  assert.deepEqual(buildProductFilter("10 TR"), { price: { $lte: 10000000 } });
  assert.deepEqual(buildProductFilter(undefined), {});
});

test("normalizes history roles and removes empty and leading model entries", () => {
  assert.deepEqual(buildChatHistory([
    { role: "ai", text: "intro" },
    { role: "user", text: "" },
    { role: "user", text: "question" },
    { role: "ai", text: "answer" },
  ]), [
    { role: "user", parts: [{ text: "question" }] },
    { role: "model", parts: [{ text: "answer" }] },
  ]);
  assert.deepEqual(buildChatHistory(), []);
  const history = Array.from({ length: 6 }, (_, i) => ({ role: i % 2 ? "ai" : "user", text: String(i) }));
  assert.equal(buildChatHistory(history).length, 4);
  assert.equal(buildChatHistory(history)[0].parts[0].text, "2");
});

test("matches product names case-insensitively and limits recommendations", () => {
  const products = ["Canon", "Sony", "Nikon", "Fuji"].map(name => ({ name }));
  assert.deepEqual(findRecommendedProducts(products, "CANON sony NIKON fuji"), products.slice(0, 3));
  assert.deepEqual(findRecommendedProducts(products, "No matching cameras"), []);
});
