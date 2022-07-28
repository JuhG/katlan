import { Form } from "components/Form";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { Village, Topic, Day, Item, Stage, ID } from "types";
import { Drawer, Title } from "@mantine/core";
import { Paper, Group, Button, Space, Divider, Modal } from "@mantine/core";
import { Calendar } from "components/Calendar";
import { Hidden } from "components/Hidden";
import { Info } from "components/Info";

export interface Filter {
  day: Day;
  topic?: Topic[];
  village?: Village[];
}

export type FavoriteState = "must" | "maybe" | "nope" | undefined;
export type Favorites = Record<ID, FavoriteState>;

const Home: NextPage = () => {
  const [filter, setFilter] = useLocalStorage<Filter>("DD_KATLAN_FILTER", {
    day: Day.tue,
    topic: Object.values(Topic),
    village: Object.values(Village),
  });
  const [list, setList] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<Favorites>("DD_KATLAN_FAVORITES", {});
  const [openHidden, setOpenHidden] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  useEffect(() => {
    // @ts-ignore
    const query = new URLSearchParams(filter);
    fetch("/api/filter?" + query)
      .then((r) => r.json())
      .then((r) => setList(r));
  }, [filter]);

  const hidden = !favorites
    ? []
    : list.filter((item) => {
        return favorites[item.id] === "nope";
      });
  const visible = !favorites
    ? list
    : list.filter((item) => {
        return favorites[item.id] !== "nope";
      });

  return (
    <>
      <Calendar list={visible} favorites={favorites as Favorites} setFavorites={setFavorites} />

      <Drawer
        title={<Title order={2}>Szűrés</Title>}
        position="bottom"
        opened={open}
        onClose={() => setOpen(false)}
        padding="lg"
        size="auto"
        overlayColor="#aaa"
      >
        <Form filter={filter as Filter} setFilter={setFilter} />
        <Space h="lg" />
        <Space h="lg" />
        <Space h="lg" />
        <Space h="lg" />
      </Drawer>

      <Hidden hidden={hidden} openHidden={openHidden} setOpenHidden={setOpenHidden} setFavorites={setFavorites} />

      <Info openInfo={openInfo} setOpenInfo={setOpenInfo} />

      <Paper
        style={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          background: "white",
          zIndex: 301,
        }}
        shadow="xl"
        p="md"
        withBorder
      >
        <Group position="apart">
          <Button variant="outline" onClick={() => setOpenInfo((value) => !value)}>
            ?
          </Button>
          {hidden.length > 0 && (
            <Button variant="outline" onClick={() => setOpenHidden((value) => !value)}>
              Rejtett
            </Button>
          )}
          <Button onClick={() => setOpen((value) => !value)}>Szűrés</Button>
        </Group>
      </Paper>
    </>
  );
};

export default Home;
