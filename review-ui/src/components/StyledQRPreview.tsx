
import type { CSSProperties } from "react";
import { QRCodeCanvas } from "qrcode.react";

export type QRShape =
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

function getShapeStyle(shape: QRShape): CSSProperties {
  switch (shape) {
    case "circle":
      return { borderRadius: "50%" };
    case "heart":
      return {
        borderRadius: "35% 35% 45% 45%",
        clipPath:
          "polygon(50% 95%, 8% 58%, 3% 40%, 12% 22%, 30% 16%, 50% 33%, 70% 16%, 88% 22%, 97% 40%, 92% 58%)",
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
          "polygon(50% 0%, 62% 34%, 98% 35%, 70% 57%, 80% 95%, 50% 74%, 20% 95%, 30% 57%, 2% 35%, 38% 34%)",
      };
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
  const normalizedSize = Math.max(4, Math.min(20, Number(size) || 10));
  const displaySize = Math.round(160 + ((normalizedSize - 4) / 16) * 100);
  const quietZone = Math.max(0, Math.min(10, Number(border) || 0));
  const qrValue = slug
    ? `https://reviewqrapi.onrender.com/r/${slug}`
    : "https://reviewqrapi.onrender.com/r/preview";

  const frameStyle = getShapeStyle(shape);

  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-3">
      <div className="relative flex w-full max-w-[320px] items-center justify-center p-3">
        {/* Decorative frame: kept separate so it cannot crop the QR. */}
        <div
          aria-hidden="true"
          className="absolute inset-2"
          style={{
            ...frameStyle,
            backgroundColor: brand || fill,
          }}
        />

        {/* The QR stays square and has a contrasting quiet zone. */}
        <div
          className="relative z-10 max-w-full"
          style={{
            padding: Math.max(8, quietZone * 2),
            backgroundColor: back,
            borderRadius: shape === "circle" || shape === "squircle" ? 8 : 2,
          }}
        >
          <QRCodeCanvas
            key={`${qrValue}-${fill}-${back}-${displaySize}-${quietZone}`}
            value={qrValue}
            size={displaySize}
            bgColor={back}
            fgColor={fill}
            level="H"
            marginSize={quietZone}
            style={{
              display: "block",
              width: "100%",
              maxWidth: displaySize,
              height: "auto",
            }}
          />
        </div>
      </div>

      {text.trim() && (
        <p
          className="max-w-full break-words text-center text-sm font-semibold"
          style={{ color: brand }}
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
