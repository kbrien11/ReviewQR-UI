import { useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function StyledQRPreview({ fill, back, brand, text }) {
  const canvasRef = useRef(null);
   // SAFETY FALLBACKS
   const safeFill = fill || brand;   // if fill is "", use brand
   const safeBack = back || "#FFFFFF";
   const safeBrand = brand || safeFill;

  useEffect(() => {
    const baseCanvas = canvasRef.current?.querySelector("canvas");
    if (!baseCanvas) return;

    const qr = baseCanvas;
    const ctx = qr.getContext("2d");
    const { width, height } = qr;

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
    // 2. CAPSULE BEHIND TEXT
    // -----------------------------
    ctx.font = "bold 22px Arial";
    const textWidth = ctx.measureText(text).width;
    const padding = 14;
    const capsuleW = textWidth + padding * 2;
    const capsuleH = 36;

    const capsuleX = (width - capsuleW) / 2;
    const capsuleY = (height - capsuleH) / 2;

    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.beginPath();
    const r = 18;
    ctx.moveTo(capsuleX + r, capsuleY);
    ctx.lineTo(capsuleX + capsuleW - r, capsuleY);
    ctx.quadraticCurveTo(capsuleX + capsuleW, capsuleY, capsuleX + capsuleW, capsuleY + r);
    ctx.lineTo(capsuleX + capsuleW, capsuleY + capsuleH - r);
    ctx.quadraticCurveTo(capsuleX + capsuleW, capsuleY + capsuleH, capsuleX + capsuleW - r, capsuleY + capsuleH);
    ctx.lineTo(capsuleX + r, capsuleY + capsuleH);
    ctx.quadraticCurveTo(capsuleX, capsuleY + capsuleH, capsuleX, capsuleY + capsuleH - r);
    ctx.lineTo(capsuleX, capsuleY + r);
    ctx.quadraticCurveTo(capsuleX, capsuleY, capsuleX + r, capsuleY);
    ctx.fill();

    // -----------------------------
    // 3. BOLD TEXT ON TOP
    // -----------------------------
    ctx.fillStyle = safeBrand;
    ctx.font = "bold 22px Arial";
    ctx.fillText(text, (width - textWidth) / 2, capsuleY + 25);
  }, [fill, back, brand, text]);

  return (
    <div ref={canvasRef}>
      <QRCodeCanvas
        value="https://reviewqr.com/preview"
        size={200}
        bgColor={back}
        fgColor={fill}
        level="H"
        includeMargin={true}
      />
    </div>
  );
}