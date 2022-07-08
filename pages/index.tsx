import { Form } from "components/Form";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "utils/useLocalStorage";
import { Location, Program, Range, Item } from "types";

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

  useEffect(() => {
    // @ts-ignore
    const query = new URLSearchParams(filter);
    // console.log(filter, query.toString());
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

      <div
        style={{
          width: "100%",
          background: "white",
          position: "fixed",
          bottom: 0,
        }}
      >
        <Form filter={filter} setFilter={setFilter} />
      </div>
    </div>
  );
};

export default Home;
