import { buildChatHistory, formatPrice } from "./chatUtils";

test("formats supported prices and falls back for missing prices", () => {
  expect(formatPrice(20000000)).toBe("20.000.000 đ");
  expect(formatPrice("20.000.000 đ")).toBe("20.000.000 đ");
  [null, undefined, "", 0, NaN].forEach((value) => {
    expect(formatPrice(value)).toBe("Liên hệ");
  });
});

test("keeps only the last two successful conversation pairs", () => {
  const pair = (text) => [{ role: "user", text }, { role: "ai", text }];
  const recent = [...pair("second"), ...pair("third")];
  expect(buildChatHistory([
    ...pair("first"),
    { role: "user", text: "failed" },
    { role: "ai", text: "error", error: true },
    ...recent,
    { role: "user", text: "unanswered" },
  ])).toEqual(recent);
  expect(buildChatHistory([])).toEqual([]);
});
