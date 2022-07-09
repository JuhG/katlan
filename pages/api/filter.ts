import type { NextApiRequest, NextApiResponse } from "next";
import { Day, Village, Topic, Item, Stage } from "types";
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
  list = list
    .filter((item) => {
      return item.time?.name;
    })
    .map((item) => {
      item.dateInMinutes = new Date("2022 " + item.time?.name).getTime() / 1000 / 60;
      item.id = item.productionId + "_" + item.dateInMinutes;
      return item;
    });

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
  switch (day) {
    case Day.tue: {
      return {
        start: dayjs("2022 aug. 02.").add(3, "hours").unix() / 60,
        end: dayjs("2022 aug. 02.").endOf("day").add(3, "hours").unix() / 60,
      };
    }
    case Day.wed: {
      return {
        start: dayjs("2022 aug. 03.").add(3, "hours").unix() / 60,
        end: dayjs("2022 aug. 03.").endOf("day").add(3, "hours").unix() / 60,
      };
    }
    case Day.thu: {
      return {
        start: dayjs("2022 aug. 04.").add(3, "hours").unix() / 60,
        end: dayjs("2022 aug. 04.").endOf("day").add(3, "hours").unix() / 60,
      };
    }
    case Day.fri: {
      return {
        start: dayjs("2022 aug. 05.").add(3, "hours").unix() / 60,
        end: dayjs("2022 aug. 05.").endOf("day").add(3, "hours").unix() / 60,
      };
    }
    case Day.sat: {
      return {
        start: dayjs("2022 aug. 06.").add(3, "hours").unix() / 60,
        end: dayjs("2022 aug. 06.").endOf("day").add(3, "hours").unix() / 60,
      };
    }
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
