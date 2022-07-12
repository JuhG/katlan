import { useMantineTheme } from "@mantine/core";
import { Gradient } from "components/Gradient";
import { Favorites } from "pages";
import { FC } from "react";
import { Item } from "types";

export const SCALE_MINUTES_TO_PIXELS = 2.7;

interface BoxProps {
  startOfDay: number;
  item: Item;
  favorites: Favorites;
  setDetailId: React.Dispatch<React.SetStateAction<string | null>>;
}
export const Box: FC<BoxProps> = ({ item, startOfDay, favorites, setDetailId }) => {
  const theme = useMantineTheme();

  const itemState = favorites[item.id];
  if (itemState === "nope") {
    return null;
  }

  const getBackground = () => {
    switch (itemState) {
      case "must": {
        return theme.colors.green[3];
      }
      case "maybe": {
        return theme.colors.yellow[3];
      }
      default: {
        return "white";
      }
    }
  };

  return (
    <li
      onClick={() => setDetailId(item.id)}
      style={{
        listStyle: "none",
        position: "absolute",
        left: 0,
        top: (item.relativeDateInMinutes - startOfDay) * SCALE_MINUTES_TO_PIXELS,
        padding: 4,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: getBackground(),
          border: "1px solid rgba(0, 0, 0, .08)",
          height: item.duration * SCALE_MINUTES_TO_PIXELS - 4,
          overflow: "hidden",
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0, 0, 0, .16)",
        }}
      >
        <div style={{ padding: 6, flex: 1, minHeight: 0 }}>
          <p style={{ lineHeight: 1.4 }}>{item.title}</p>
        </div>

        <Gradient height={20} color={getBackground()} />

        <div
          style={{
            padding: 6,
            background: getBackground(),
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p>{item.time?.name}</p>
          <p>{item.duration} perc</p>
        </div>
      </div>
    </li>
  );
};
