import { Button, Group, Space, Title } from "@mantine/core";
import { Gradient } from "components/Gradient";
import { Favorites, FavoriteState } from "pages";
import { FC } from "react";
import { Item } from "types";

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
        <p dangerouslySetInnerHTML={{ __html: item.description }} />
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
