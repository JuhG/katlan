import { Button, Group, Popover } from "@mantine/core";
import { Favorites, FavoriteState } from "pages";
import { FC, useState } from "react";
import { useLongPress } from "react-use";
import { Item } from "types";

const getBackground = (itemState: FavoriteState) => {
  switch (itemState) {
    case "must": {
      return "green";
    }
    case "maybe": {
      return "yellow";
    }
    default: {
      return "white";
    }
  }
};

interface BoxProps {
  startOfDay: number;
  item: Item;
  setShowOverlay: (open: boolean) => void;
  favorites: Favorites;
  setFavorites: React.Dispatch<React.SetStateAction<Favorites | undefined>>;
}
export const Box: FC<BoxProps> = ({ item, startOfDay, setShowOverlay, favorites, setFavorites }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const setOverlayState = (state: boolean) => {
    setPopoverOpen(state);
    setShowOverlay(state);
  };
  const longPressEvent = useLongPress(() => setOverlayState(true));

  const itemState = favorites[item.id];
  if (itemState === "nope") {
    return null;
  }

  const setFavoriteState = (state?: FavoriteState) => {
    setFavorites((favs) => {
      if (!favs) {
        favs = {};
      }
      if (state) {
        favs[item.id] = state;
      } else {
        delete favs[item.id];
      }
      return favs;
    });
    setOverlayState(false);
  };

  return (
    <li
      {...longPressEvent}
      style={{
        listStyle: "none",
        position: "absolute",
        left: 0,
        top: (item.relativeDateInMinutes - startOfDay) * 2,
        padding: 4,
      }}
    >
      <Popover
        opened={popoverOpen}
        onClose={() => setOverlayState(false)}
        position="bottom"
        target={
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: getBackground(itemState),
              border: "1px solid gray",
              height: popoverOpen ? "auto" : item.duration * 2,
              minHeight: popoverOpen ? item.duration * 2 : "",
              transform: popoverOpen ? "scale(1.05)" : "",
              transition: "transform 400ms",
              overflow: "hidden",
              zIndex: popoverOpen ? 2 : "",
              width: 272,
            }}
          >
            <div style={{ padding: 8, flex: 1, minHeight: 0 }}>
              <p
                style={{
                  marginBottom: 16,
                }}
              >
                {item.title}
              </p>
              <p dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>
            <div
              style={{
                padding: 8,
                background: getBackground(itemState),
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p>{item.time?.name}</p>
              <p>{item.duration} perc</p>
            </div>
          </div>
        }
      >
        <Group direction="column">
          {itemState && <Button onClick={() => setFavoriteState()}>Alapállapot</Button>}
          {itemState !== "must" && (
            <Button color="green" onClick={() => setFavoriteState("must")}>
              Kötelező
            </Button>
          )}
          {itemState !== "maybe" && (
            <Button color="yellow" onClick={() => setFavoriteState("maybe")}>
              Jó lenne
            </Button>
          )}
          <Button color="red" onClick={() => setFavoriteState("nope")}>
            Rejtsd el
          </Button>
        </Group>
      </Popover>
    </li>
  );
};
