
import { QRCodeCanvas } from "qrcode.react";

type QRShape =
  | "rectangle"
  | "circle"
  | "heart"
  | "diamond"
  | "squircle"
  | "hexagon"
  | "star";

type StyledQRPreviewProps = {
  fill?: string;
  back?: string;
  brand?: string;
  text?: string;
  size?: number;
  border?: number;
  slug?: string;
  shape?: QRShape;
};

const MIN_BOX_SIZE = 4;
const MAX_BOX_SIZE = 20;
const MIN_DISPLAY_SIZE = 160;
const MAX_DISPLAY_SIZE = 320;

function getDisplaySize(boxSize: number): number {
  const normalized =
    (boxSize - MIN_BOX_SIZE) / (MAX_BOX_SIZE - MIN_BOX_SIZE);

  return Math.round(
    MIN_DISPLAY_SIZE +
      Math.max(0, Math.min(1, normalized)) *
        (MAX_DISPLAY_SIZE - MIN_DISPLAY_SIZE)
  );
}

function getShapeStyle(shape: QRShape): React.CSSProperties {
  switch (shape) {
    case "circle":
      return { clipPath: "circle(50% at 50% 50%)" };

    case "heart":
      return {
        clipPath:
          "path('M 160 285 C 140 265 20 180 20 95 C 20 20 110 5 160 75 C 210 5 300 20 300 95 C 300 180 180 265 160 285 Z')",
      };

    case "diamond":
      return {
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
      };

    case "squircle":
      return { borderRadius: "30%" };

    case "hexagon":
      return {
        clipPath:
          "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      };

    case "star":
      return {
        clipPath:
          "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 94%, 50% 72%, 21% 94%, 32% 57%, 2% 35%, 39% 35%)",
      };

    case "rectangle":
    default:
      return { borderRadius: "12px" };
  }
}

export default function StyledQRPreview({
  fill = "#000000",
  back = "#FFFFFF",
  brand = "#000000",
  text = "",
  size = 10,
  border = 4,
  slug,
  shape = "rectangle",
}: StyledQRPreviewProps) {
  const displaySize = getDisplaySize(size);
  const safeFill = fill || brand || "#000000";
  const safeBack = back || "#FFFFFF";

  const qrValue =
    slug || "https://reviewqr.com/preview";

  // Keep the QR square and intact for scanning.
  // The selected shape is applied to the decorative backing.
  const shapeStyle = getShapeStyle(shape);

  const padding = Math.max(0, Math.min(10, border)) * 2;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex items-center justify-center transition-all duration-200"
        style={{
          ...shapeStyle,
          width: displaySize + padding * 2 + 24,
          height: displaySize + padding * 2 + 24,
          backgroundColor: brand || safeFill,
          padding: 12,
          boxSizing: "border-box",
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            backgroundColor: safeBack,
            padding,
            borderRadius: shape === "circle" ? "4px" : "6px",
            boxSizing: "content-box",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <QRCodeCanvas
            value={qrValue}
            size={displaySize}
            bgColor={safeBack}
            fgColor={safeFill}
            level="H"
            includeMargin={true}
            style={{
              display: "block",
              width: displaySize,
              height: displaySize,
              maxWidth: "100%",
              imageRendering: "pixelated",
            }}
          />
        </div>
      </div>

      {text.trim() && (
        <p
          className="max-w-full break-words text-center text-sm font-semibold"
          style={{ color: brand || safeFill }}
        >
          {text}
        </p>
      )}

      <p className="text-xs text-gray-500">
        {shape.charAt(0).toUpperCase() + shape.slice(1)} · {displaySize}px
      </p>
    </div>
  );
}
