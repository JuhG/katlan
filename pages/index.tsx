import { Form } from "components/Form";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "utils/useLocalStorage";
import { Location, Program, Range, Item } from "types";
import { Drawer } from "@mantine/core";
import { Paper, Group, Button, Space } from "@mantine/core";

export interface Filter {
  range: Range;
  program?: Program[];
  location?: Location[];
}

const Home: NextPage = () => {
  const [filter, setFilter] = useLocalStorage<Filter>("DD_KATLAN_FILTER", {
    range: Range.all,
    program: Object.values(Program),
    location: Object.values(Location),
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

  return (
    <div>
      <h1>{list.length}</h1>
      {list.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}

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
