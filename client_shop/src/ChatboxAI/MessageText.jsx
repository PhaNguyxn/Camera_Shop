import React from "react";

export default function MessageText({ text }) {
  return (
    <div className="csai-text">
      {String(text || "")
        .split(/(\*\*[^*]+\*\*)/g)
        .map((part, index) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={index}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
    </div>
  );
}

