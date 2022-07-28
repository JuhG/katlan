import { Badge, Button, Group, Space, Title } from "@mantine/core";
import { Gradient } from "components/Gradient";
import dayjs from "dayjs";
import { Favorites, FavoriteState } from "pages";
import { FC } from "react";
import { Item } from "types";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

interface DetailProps {
  item: Item;
  favorites: Favorites;
  setFavoriteState: (item: Item, state?: FavoriteState) => void;
}
export const Detail: FC<DetailProps> = ({ item, favorites, setFavoriteState }) => {
  const itemState = favorites[item.id];
  if (itemState === "nope") {
    return null;
  }

  return (
    <Group direction="column" style={{ height: "100%", paddingBottom: 50 }}>
      <div style={{ flex: 100, overflowY: "auto", paddingBottom: 50 }}>
        <Title order={3}>{item.title}</Title>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <p>
            <span>{dayjs(item.date).tz("Europe/Budapest").format("HH:mm")}</span>
            <span style={{ paddingLeft: 4, paddingRight: 4 }}>-</span>
            <span>
              {dayjs(item.date + item.duration * 60 * 1000)
                .tz("Europe/Budapest")
                .format("HH:mm")}
            </span>
          </p>
          <p>{item.duration} perc</p>
        </div>

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

        <p dangerouslySetInnerHTML={{ __html: item.description }} style={{ marginTop: 16 }} />
      </div>

      <Gradient />

      <Group direction="column" align="center" style={{ width: "100%", flexGrow: 1, justifyContent: "flex-end" }}>
        {itemState && <Button onClick={() => setFavoriteState(item)}>Alapállapot</Button>}
        {itemState !== "must" && (
          <Button color="green" onClick={() => setFavoriteState(item, "must")}>
            Kötelező
          </Button>
        )}
        {itemState !== "maybe" && (
          <Button color="yellow" onClick={() => setFavoriteState(item, "maybe")}>
            Jó lenne
          </Button>
        )}
        <Button color="red" onClick={() => setFavoriteState(item, "nope")}>
          Rejtsd el
        </Button>
      </Group>
    </Group>
  );
};
