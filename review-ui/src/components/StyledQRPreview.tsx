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

  const safeFill = fill || brand;
  const safeBack = back || "#FFFFFF";
  const safeBrand = brand || safeFill;

  useEffect(() => {
    const baseCanvas = canvasRef.current?.querySelector("canvas");
    if (!baseCanvas) return;

    let tries = 0;

    function waitForQR() {
      const ctx = baseCanvas.getContext("2d");
      const { width, height } = baseCanvas;

      if (!width || !height) return;

      const sample = ctx.getImageData(0, 0, width, height).data;
      const hasPixels = sample.some(v => v !== 0);

      if (hasPixels) {
        applyStyling(baseCanvas);
      } else if (tries < 10) {
        tries++;
        requestAnimationFrame(waitForQR);
      }
    }

    waitForQR();
  }, [
    safeFill,
    safeBack,
    safeBrand,
    text,
    shape,
    slug,
    size,
    border
  ]);

  function applyStyling(qr) {
    const ctx = qr.getContext("2d");
    const { width, height } = qr;
    if (!width || !height) return;

    // 1. Copy QR into temp canvas
    const temp = document.createElement("canvas");
    temp.width = width;
    temp.height = height;
    const tctx = temp.getContext("2d");
    tctx.drawImage(qr, 0, 0);

    // 2. Clear original canvas (make it transparent)
    ctx.clearRect(0, 0, width, height);

    // 3. Build mask
    const mask = document.createElement("canvas");
    mask.width = width;
    mask.height = height;
    const mctx = mask.getContext("2d");

    mctx.beginPath();

    if (shape === "circle") {
      mctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
    }

    else if (shape === "heart") {
      const x = width / 2;
      const y = height / 2;
      const s = width * 0.28;

      mctx.moveTo(x, y + s * 0.8);
      mctx.bezierCurveTo(
        x + s, y + s * 0.2,
        x + s, y - s * 0.6,
        x, y - s * 0.2
      );
      mctx.bezierCurveTo(
        x - s, y - s * 0.6,
        x - s, y + s * 0.2,
        x, y + s * 0.8
      );
    }

    else if (shape === "diamond") {
      mctx.moveTo(width / 2, 0);
      mctx.lineTo(width, height / 2);
      mctx.lineTo(width / 2, height);
      mctx.lineTo(0, height / 2);
    }

    else if (shape === "squircle") {
      const r = width * 0.25;
      mctx.moveTo(r, 0);
      mctx.lineTo(width - r, 0);
      mctx.quadraticCurveTo(width, 0, width, r);
      mctx.lineTo(width, height - r);
      mctx.quadraticCurveTo(width, height, width - r, height);
      mctx.lineTo(r, height);
      mctx.quadraticCurveTo(0, height, 0, height - r);
      mctx.lineTo(0, r);
      mctx.quadraticCurveTo(0, 0, r, 0);
    }

    else if (shape === "hexagon") {
      const cx = width / 2;
      const cy = height / 2;
      const r = width * 0.5;

      mctx.moveTo(cx, cy - r);
      for (let i = 1; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        mctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      }
    }

    else if (shape === "star") {
      const cx = width / 2;
      const cy = height / 2;
      const spikes = 5;
      const outer = width * 0.48;
      const inner = width * 0.20;

      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;

      mctx.moveTo(cx, cy - outer);

      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outer;
        y = cy + Math.sin(rot) * outer;
        mctx.lineTo(x, y);
        rot += Math.PI / spikes;

        x = cx + Math.cos(rot) * inner;
        y = cy + Math.sin(rot) * inner;
        mctx.lineTo(x, y);
        rot += Math.PI / spikes;
      }
    }

    else {
      mctx.rect(0, 0, width, height);
    }

    mctx.closePath();
    mctx.fillStyle = "black";
    mctx.fill();

    // 4. Apply mask to temp QR pixels
    const qrData = tctx.getImageData(0, 0, width, height);
    const maskData = mctx.getImageData(0, 0, width, height);

    for (let i = 0; i < qrData.data.length; i += 4) {
      qrData.data[i + 3] = maskData.data[i]; // alpha = mask
    }

    // 5. Draw masked QR back onto original canvas
    ctx.putImageData(qrData, 0, 0);

    // 6. Gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, safeFill);
    gradient.addColorStop(1, safeBrand);

    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.28;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    // 7. Center text
    ctx.fillStyle = safeBrand;
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
  }

  return (
    <div ref={canvasRef}>
      <QRCodeCanvas
        key={`${slug}-${safeFill}-${safeBack}-${shape}`}
        value={slug || "https://reviewqr.com/preview"}
        size={200}
        bgColor={safeBack}
        fgColor={safeFill}
        level="H"
        includeMargin={true}
      />
    </div>
  );
}