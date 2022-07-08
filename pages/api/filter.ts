import type { NextApiRequest, NextApiResponse } from "next";
import { Range, Location, Program, Item } from "types";
import dayjs from "dayjs";

const getUrl = (host?: string) => {
  if (!host) {
    return;
  }
  const protocol = host.includes("localhost") ? "http://" : "https://";
  return protocol + host;
};

const normalizeQueryValue = (value: string | string[] | undefined): any[] | undefined => {
  if (typeof value === "string") {
    return value.split(",");
  }
  return value;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(getUrl(req.headers.host) + "/api");
  if (!response.ok) {
    res.status(response.status).end();
    return;
  }

  const data = await response.json();
  let list: Item[] = data.data.centerpiece;
  list = list.map((item, index) => {
    item.id = index;
    return item;
  });

  list = filterByLocation(list, normalizeQueryValue(req.query.location));
  list = filterByProgram(list, normalizeQueryValue(req.query.program));
  list = filterByRange(list, req.query.range as Range);
  res.json(list);
}

const filterByLocation = (list: Item[], locations: Location[] | undefined) => {
  if (!locations) {
    return list;
  }
  return list.filter((item) => {
    if (!item.village) {
      return true;
    }
    return locations.some((location) => location === item.village?.name);
  });
};

const filterByProgram = (list: Item[], programs: Program[] | undefined) => {
  if (!programs) {
    return list;
  }
  return list.filter((item) => {
    if (!item.labels) {
      return true;
    }
    return programs.some((program) => {
      const labelNames = item.labels?.map((label) => label.name);
      return labelNames?.includes(program);
    });
  });
};

const parseDate = (item: Item) => {
  return new Date("2022 " + item.time?.name).getTime() / 1000;
};

const getDateForRange = (range: Range): number => {
  switch (range) {
    case Range.three: {
      return dayjs().add(3, "hours").unix();
    }
    case Range.today: {
      return dayjs().endOf("day").unix();
    }
    case Range.tomorrow: {
      return dayjs().add(1, "day").endOf("day").unix();
    }
    default: {
      return 0;
    }
  }
};

const filterByRange = (list: Item[], range: Range) => {
  if (range === Range.all) {
    return list;
  }
  const rangeDate = getDateForRange(range);
  return list.filter((item) => {
    const date = parseDate(item);
    return date < rangeDate;
  });
};
