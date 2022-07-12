import type { NextApiRequest, NextApiResponse } from "next";
import { Day, Village, Topic, Item, Stage } from "types";
import dayjs from "dayjs";

const getUrl = (host?: string) => {
  if (!host) {
    return;
  }
  const protocol = host.includes("localhost") || host.includes("192.168.") ? "http://" : "https://";
  return protocol + host;
};

const normalizeQueryValue = (value: string | string[] | undefined): any[] | undefined => {
  if (typeof value === "string") {
    return value.split(",");
  }
  return value;
};

const arrayUniqueByKey = (array: any[], key: string) => [...new Map(array.map((item) => [item[key], item])).values()];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(getUrl(req.headers.host) + "/api");
  if (!response.ok) {
    res.status(response.status).end();
    return;
  }

  const data = await response.json();
  let list: Item[] = data.data.centerpiece;
  list = list
    .filter((item) => {
      return item.time?.name;
    })
    .map((item) => {
      item.dateInMinutes = new Date("2022 " + item.time?.name).getTime() / 1000 / 60;
      item.id = item.productionId + "_" + item.dateInMinutes;
      return item;
    });
  list = arrayUniqueByKey(list, "id");

  list = filterByVillage(list, normalizeQueryValue(req.query.village));
  list = filterByTopic(list, normalizeQueryValue(req.query.topic));
  list = filterByDay(list, req.query.day as Day);
  // TODO: remove unnecessary data
  res.json(list);
}

const filterByVillage = (list: Item[], villages: Village[] | undefined) => {
  if (!villages) {
    return list;
  }
  return list.filter((item) => {
    if (!item.village) {
      return false;
    }
    return villages.some((village) => village === item.village?.name);
  });
};

const filterByTopic = (list: Item[], topics: Topic[] | undefined) => {
  if (!topics) {
    return list;
  }
  return list.filter((item) => {
    if (!item.labels) {
      return true;
    }
    return topics.some((topic) => {
      const labelNames = item.labels?.map((label) => label.name);
      return labelNames?.includes(topic);
    });
  });
};

const getDateForDay = (
  day: Day
): {
  start: number;
  end: number;
} => {
  const getStartAndEndOfDay = (dayString: string) => ({
    start: dayjs(dayString).add(3, "hours").unix() / 60,
    end: dayjs(dayString).endOf("day").add(3, "hours").unix() / 60,
  });
  switch (day) {
    case Day.tue:
      return getStartAndEndOfDay("2022 aug. 02.");
    case Day.wed:
      return getStartAndEndOfDay("2022 aug. 03.");
    case Day.thu:
      return getStartAndEndOfDay("2022 aug. 04.");
    case Day.fri:
      return getStartAndEndOfDay("2022 aug. 05.");
    case Day.sat:
      return getStartAndEndOfDay("2022 aug. 06.");
    case Day.sun:
      return getStartAndEndOfDay("2022 aug. 07.");
  }
};

const filterByDay = (list: Item[], day: Day) => {
  const { start, end } = getDateForDay(day);
  return list
    .filter((item) => {
      return start < item.dateInMinutes && item.dateInMinutes <= end;
    })
    .map((item) => {
      item.relativeDateInMinutes = item.dateInMinutes - start;
      return item;
    });
};
