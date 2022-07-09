import { Form } from "components/Form";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { Village, Topic, Day, Item, Stage } from "types";
import { Drawer, Overlay } from "@mantine/core";
import { Paper, Group, Button, Space, Popover } from "@mantine/core";
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

  useEffect(() => {
    // @ts-ignore
    const query = new URLSearchParams(filter);
    console.log(filter, query.toString());
    fetch("/api/filter?" + query)
      .then((r) => r.json())
      .then((r) => setList(r));
  }, [filter]);

  // find the first program of the day
  // show an extra 30 minutes of padding before
  const cutoff =
    list.reduce((smallest, current) => {
      return Math.min(smallest, current.relativeDateInMinutes);
    }, Infinity) - 30;

  const endOfDay =
    list.reduce((biggest, current) => {
      return Math.max(biggest, current.relativeDateInMinutes + current.duration);
    }, 0) -
    cutoff +
    60;

  const groups = groupByVillageAndStage(list);

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
                  return <Box key={item.id} item={item} cutoff={cutoff} setShowOverlay={setShowOverlay} />;
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
          <Button variant="outline">Rejtett</Button>
          <Button onClick={() => setOpen((value) => !value)}>Filter</Button>
        </Group>
      </Paper>
    </div>
  );
};

export default Home;
