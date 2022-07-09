import { Button, Group, Popover } from "@mantine/core";
import { FC, useState } from "react";
import { useLongPress } from "react-use";
import { Item } from "types";

interface BoxProps {
  cutoff: number;
  item: Item;
  setShowOverlay: (open: boolean) => void;
}
export const Box: FC<BoxProps> = ({ item, cutoff, setShowOverlay }) => {
  console.log(item);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const longPressEvent = useLongPress(() => {
    setPopoverOpen(true);
    setShowOverlay(true);
  });

  return (
    <li
      {...longPressEvent}
      style={{
        listStyle: "none",
        position: "absolute",
        left: 0,
        top: (item.relativeDateInMinutes - cutoff) * 2,
        padding: 4,
      }}
    >
      <Popover
        opened={popoverOpen}
        onClose={() => {
          setPopoverOpen(false);
          setShowOverlay(false);
        }}
        position="bottom"
        target={
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "white",
              border: "1px solid gray",
              height: popoverOpen ? "auto" : item.duration * 2,
              minHeight: popoverOpen ? item.duration * 2 : "",
              transform: popoverOpen ? "scale(1.05)" : "",
              transition: "transform 400ms",
              overflow: "hidden",
              zIndex: popoverOpen ? 2 : "",
              width: 272,
            }}
          >
            <div style={{ padding: 8, flex: 1, minHeight: 0 }}>
              <p
                style={{
                  marginBottom: 16,
                }}
              >
                {item.title}
              </p>
              <p dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>
            <div
              style={{
                padding: 8,
                background: "white",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <p>{item.time?.name}</p>
              <p>{item.duration} perc</p>
            </div>
          </div>
        }
      >
        <Group direction="column">
          <Button color="green">Kötelező</Button>
          <Button color="yellow">Jó lenne</Button>
          <Button color="red">Rejtsd el</Button>
        </Group>
      </Popover>
    </li>
  );
};
