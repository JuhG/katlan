import { FC } from "react";

interface GradientProps {
  color?: string;
  position?: string;
  height?: number | string;
}
export const Gradient: FC<GradientProps> = ({ color = "white", position = "bottom", height = 100 }) => {
  return (
    <div
      style={{
        height: 1,
        width: "100%",
        position: "relative",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          [position]: 0,
          height,
          width: "100%",
          background: `linear-gradient(to ${position}, transparent, ${color})`,
        }}
      ></div>
    </div>
  );
};
