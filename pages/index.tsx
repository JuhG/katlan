import { Form } from "components/Form";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "utils/useLocalStorage";
import { Village, Topic, Day, Item, Stage } from "types";
import { Drawer } from "@mantine/core";
import { Paper, Group, Button, Space, Card, Stack } from "@mantine/core";

export interface Filter {
  day: Day;
  topic?: Topic[];
  village?: Village[];
}

const Home: NextPage = () => {
  const [filter, setFilter] = useLocalStorage<Filter>("DD_KATLAN_FILTER", {
    day: Day.tue,
    topic: Object.values(Topic),
    village: Object.values(Village),
  });
  const [list, setList] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);

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

  return (
    <div>
      <h1>{list.length}</h1>

      <ul style={{ position: "relative", background: "green", width: "100%", height: 2200 }}>
        {list.map((item) => {
          console.log(item);
          return (
            <li
              key={item.id}
              style={{
                listStyle: "none",
                position: "absolute",
                left: 0,
                top: (item.relativeDateInMinutes - cutoff) * 2,
                width: "100%",
                padding: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "white",
                  border: "1px solid gray",
                  minHeight: item.duration * 2,
                  padding: 8,
                }}
              >
                <p style={{ flex: 1 }}>{item.title}</p>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>{item.time?.name}</p>
                  <p>{item.duration} perc</p>
                </div>
              </div>
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
        <Form filter={filter} setFilter={setFilter} />
        <Space h="lg" />
      </Drawer>

      <Paper
        style={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          background: "white",
        }}
        shadow="xl"
        p="md"
        withBorder
      >
        <Group position="apart">
          <Button variant="outline">?</Button>
          <Button variant="outline">Rejtett</Button>
          <Button onClick={() => setOpen(true)}>Filter</Button>
        </Group>
      </Paper>
    </div>
  );
};

export default Home;
