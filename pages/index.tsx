import { Form } from "components/Form";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { Village, Topic, Day, Item, Stage, ID } from "types";
import { Drawer, Overlay } from "@mantine/core";
import { Paper, Group, Button, Space, Divider, Modal } from "@mantine/core";
import { Box } from "components/Box";

export interface Filter {
  day: Day;
  topic?: Topic[];
  village?: Village[];
}

interface Group {
  village: Village;
  stage: Stage;
  list: Item[];
}

export type FavoriteState = "must" | "maybe" | "nope" | undefined;
export type Favorites = Record<ID, FavoriteState>;

const groupByVillageAndStage = (list: Item[]): Group[] => {
  const groups = list.reduce<Record<Stage, Group>>((groups, item) => {
    if (!item.stage?.name || !item.village?.name) {
      return groups;
    }
    if (!groups[item.stage.name]) {
      groups[item.stage.name] = {
        village: item.village.name,
        stage: item.stage.name,
        list: [],
      };
    }
    groups[item.stage.name].list.push(item);
    return groups;
  }, {} as any);
  return Object.values(groups);
};

const Home: NextPage = () => {
  const [filter, setFilter] = useLocalStorage<Filter>("DD_KATLAN_FILTER", {
    day: Day.tue,
    topic: Object.values(Topic),
    village: Object.values(Village),
  });
  const [list, setList] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<Favorites>("DD_KATLAN_FAVORITES", {});
  const [openHidden, setOpenHidden] = useState(false);

  useEffect(() => {
    // @ts-ignore
    const query = new URLSearchParams(filter);
    console.log(filter, query.toString());
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

  // find the first program of the day
  // show an extra 30 minutes of padding before
  const cutoff =
    visible.reduce((smallest, current) => {
      return Math.min(smallest, current.relativeDateInMinutes);
    }, Infinity) - 30;

  const endOfDay =
    visible.reduce((biggest, current) => {
      return Math.max(biggest, current.relativeDateInMinutes + current.duration);
    }, 0) -
    cutoff +
    60;

  const groups = groupByVillageAndStage(visible);

  return (
    <div>
      {showOverlay && <Overlay zIndex="1" opacity="0.6" color="#000" />}
      <ul
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          height: "100vh",
          background: "lightgray",
        }}
      >
        {groups.map((group) => {
          return (
            <li
              key={group.stage}
              style={{
                position: "relative",
                scrollSnapAlign: "start",
              }}
            >
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  background: "white",
                }}
              >
                <h2>{group.village}</h2>
                <h2>{group.stage}</h2>
              </div>
              <ul
                style={{
                  width: 280,
                  position: "relative",
                  height: endOfDay * 2,
                }}
              >
                {group.list.map((item) => {
                  return (
                    <Box
                      key={item.id}
                      item={item}
                      cutoff={cutoff}
                      setShowOverlay={setShowOverlay}
                      favorites={favorites as Favorites}
                      setFavorites={setFavorites}
                    />
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>

      <Drawer
        title={<h2>Filter</h2>}
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

      <Modal
        title={<h2>Rejtett programok</h2>}
        opened={openHidden}
        onClose={() => setOpenHidden(false)}
        padding="lg"
        size="auto"
        overlayColor="#aaa"
      >
        {!hidden.length ? (
          <p>Még nincs egy program sem elrejtve!</p>
        ) : (
          <ul>
            {hidden.map((item) => {
              return (
                <>
                  <li key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <div>
                      <p>{item.title}</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <p>{item.village?.name}</p>
                        <span>/</span>
                        <p>{item.stage?.name}</p>
                      </div>
                      <p>{item.time?.name}</p>
                    </div>
                    <Button
                      onClick={() => {
                        setFavorites((favs) => {
                          if (!favs) {
                            favs = {};
                          }
                          delete favs[item.id];
                          return favs;
                        });
                      }}
                    >
                      Vissza
                    </Button>
                  </li>
                  <Divider my="sm" />
                </>
              );
            })}
            <Space h="lg" />
          </ul>
        )}
      </Modal>

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
          <Button variant="outline">?</Button>
          <Button variant="outline" onClick={() => setOpenHidden((value) => !value)}>
            Rejtett
          </Button>
          <Button onClick={() => setOpen((value) => !value)}>Filter</Button>
        </Group>
      </Paper>
    </div>
  );
};

export default Home;
