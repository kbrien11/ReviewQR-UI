import { useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function StyledQRPreview({
  fill,
  back,
  brand,
  text,
  size,
  border,
  slug,
  shape = "rectangle",
}) {
  const canvasRef = useRef(null);

  // SAFETY FALLBACKS
  const safeFill = fill || brand;
  const safeBack = back || "#FFFFFF";
  const safeBrand = brand || safeFill;

  useEffect(() => {
    const baseCanvas = canvasRef.current?.querySelector("canvas");
    if (!baseCanvas) return;

    const qr = baseCanvas;
    const ctx = qr.getContext("2d");
    const { width, height } = qr;

    // -----------------------------
    // 0. APPLY SHAPE MASK FIRST
    // -----------------------------
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = width;
    maskCanvas.height = height;
    const maskCtx = maskCanvas.getContext("2d");

    maskCtx.beginPath();

    if (shape === "circle") {
      maskCtx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
    }

    else if (shape === "heart") {
      const x = width / 2;
      const y = height / 2;
      const s = width * 0.28;

      maskCtx.moveTo(x, y + s * 0.8);
      maskCtx.bezierCurveTo(
        x + s, y + s * 0.2,
        x + s, y - s * 0.6,
        x, y - s * 0.2
      );
      maskCtx.bezierCurveTo(
        x - s, y - s * 0.6,
        x - s, y + s * 0.2,
        x, y + s * 0.8
      );
    }

    else if (shape === "diamond") {
      maskCtx.moveTo(width / 2, 0);
      maskCtx.lineTo(width, height / 2);
      maskCtx.lineTo(width / 2, height);
      maskCtx.lineTo(0, height / 2);
    }

    else {
      // rectangle (default)
      maskCtx.rect(0, 0, width, height);
    }

    maskCtx.closePath();
    maskCtx.fillStyle = "black";
    maskCtx.fill();

    // Apply mask to QR
    const qrData = ctx.getImageData(0, 0, width, height);
    const maskData = maskCtx.getImageData(0, 0, width, height);

    for (let i = 0; i < qrData.data.length; i += 4) {
      const alpha = maskData.data[i]; // mask is grayscale
      qrData.data[i + 3] = alpha;     // apply mask alpha
    }

    ctx.putImageData(qrData, 0, 0);

    // -----------------------------
    // 1. BRAND → FILL GRADIENT OVERLAY
    // -----------------------------
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, safeFill);
    gradient.addColorStop(1, safeBrand);

    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.28;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    // -----------------------------
    // 2. REMOVE CAPSULE — REPLACED WITH CLEAN TEXT ONLY
    // -----------------------------
    ctx.font = "bold 22px Arial";
    const textWidth = ctx.measureText(text).width;

    // -----------------------------
    // 3. DRAW TEXT ON TOP
    // -----------------------------
    ctx.fillStyle = safeBrand;
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);

  }, [fill, back, brand, text, shape]);

  return (
    <div ref={canvasRef}>
      <QRCodeCanvas
        value={slug || "https://reviewqr.com/preview"}
        size={200}
        bgColor={back}
        fgColor={fill}
        level="H"
        includeMargin={true}
      />
    </div>
  );
}