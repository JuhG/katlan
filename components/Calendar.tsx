import { Drawer, useMantineTheme } from "@mantine/core";
import { Box, SCALE_MINUTES_TO_PIXELS } from "components/Box";
import { Detail } from "components/Detail";
import { Favorites, FavoriteState } from "pages";
import { FC, useState } from "react";
import { Item, Stage, Village } from "types";

const PADDING = 30;

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

interface CalendarProps {
  list: Item[];
  favorites: Favorites;
  setFavorites: React.Dispatch<React.SetStateAction<Favorites | undefined>>;
}
export const Calendar: FC<CalendarProps> = ({ list, favorites, setFavorites }) => {
  const theme = useMantineTheme();
  const [detailId, setDetailId] = useState<string | null>(null);

  // find the first program of the day
  // show an extra 30 minutes of padding before
  const startOfDay =
    list.reduce((smallest, current) => {
      return Math.min(smallest, current.relativeDateInMinutes);
    }, Infinity) -
    PADDING / 2;
  const endOfDay =
    list.reduce((biggest, current) => {
      return Math.max(biggest, current.relativeDateInMinutes + current.duration);
    }, 0) -
    startOfDay +
    PADDING * 2;

  const groups = groupByVillageAndStage(list);

  const detail = list.find((item) => item.id === detailId);

  const setFavoriteState = (item: Item, state?: FavoriteState) => {
    setFavorites((favs) => {
      if (!favs) {
        favs = {};
      }
      if (state) {
        favs[item.id] = state;
      } else {
        delete favs[item.id];
      }
      return favs;
    });
    setDetailId(null);
  };

  return (
    <>
      <Drawer
        opened={detailId !== null}
        onClose={() => setDetailId(null)}
        position="right"
        padding="md"
        size="80%"
        zIndex={301}
      >
        {detail && <Detail item={detail} favorites={favorites} setFavoriteState={setFavoriteState} />}
      </Drawer>

      <ul
        style={{
          display: "flex",
          overflow: "auto",
          width: "100vw",
          height: "100%",
          scrollSnapType: "x mandatory",
          paddingLeft: 8,
          paddingRight: 8,
          gap: 8,
        }}
      >
        {groups.map((group) => {
          return (
            <li
              key={group.stage}
              style={{
                position: "relative",
                scrollSnapAlign: "start",
                background: theme.colors.gray[3],
                paddingLeft: 8,
                paddingRight: 8,
                flex: "0 0 280px",
                width: 280,
                height: endOfDay * SCALE_MINUTES_TO_PIXELS,
              }}
            >
              <div
                style={{
                  position: "sticky",
                  top: 8,
                  zIndex: 1,
                  padding: 8,
                  borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(0, 0, 0, .16)",
                  background: "#ffefd5",
                  color: "#e71a30",
                  fontWeight: 800,
                }}
              >
                <p>{group.village}</p>
                <p>{group.stage}</p>
              </div>
              <ul style={{ position: "relative" }}>
                {group.list.map((item) => {
                  return (
                    <Box
                      key={item.id}
                      item={item}
                      startOfDay={startOfDay}
                      favorites={favorites as Favorites}
                      setDetailId={setDetailId}
                    />
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </>
  );
};
