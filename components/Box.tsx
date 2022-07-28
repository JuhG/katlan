import { Badge, useMantineTheme } from "@mantine/core";
import { Gradient } from "components/Gradient";
import dayjs from "dayjs";
import { Favorites } from "pages";
import { FC } from "react";
import { Item } from "types";

export const SCALE_MINUTES_TO_PIXELS = 3.8;

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
          boxShadow: "0 4px 12px rgba(0, 0, 0, .12)",
        }}
      >
        <div style={{ padding: 6, flex: 1, minHeight: 0 }}>
          <p style={{ lineHeight: 1.4 }}>{item.title}</p>
          <ul style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
            {item.labels
              // @ts-ignore
              ?.filter((label) => label.name !== "2022")
              .map((label) => {
                return (
                  <li key={label.name}>
                    <Badge>{label.name}</Badge>
                  </li>
                );
              })}
          </ul>

          <img
            style={{ marginTop: 16 }}
            src={
              item.thumbnail.mobile.includes("http")
                ? item.thumbnail.mobile
                : `https://ordogkatlan.hu${item.thumbnail.mobile}`
            }
            loading="lazy"
            alt={item.title}
          />
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
          <p>
            <span>{dayjs(item.date).locale("hu").format("HH:mm")}</span>
            <span style={{ paddingLeft: 4, paddingRight: 4 }}>-</span>
            <span>
              {dayjs(item.date + item.duration * 60 * 1000)
                .locale("hu")
                .format("HH:mm")}
            </span>
          </p>
          <p>{item.duration} perc</p>
        </div>
      </div>
    </li>
  );
};
