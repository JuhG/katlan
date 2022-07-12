import { Button, Divider, Modal, Space, Title } from "@mantine/core";
import { Favorites } from "pages";
import { FC } from "react";
import { Item } from "types";

interface HiddenProps {
  hidden: Item[];
  openHidden: boolean;
  setOpenHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setFavorites: React.Dispatch<React.SetStateAction<Favorites | undefined>>;
}
export const Hidden: FC<HiddenProps> = ({ hidden, openHidden, setOpenHidden, setFavorites }) => {
  return (
    <Modal
      title={<Title order={2}>Rejtett programok</Title>}
      opened={openHidden}
      onClose={() => setOpenHidden(false)}
      padding="lg"
      size="auto"
      overlayColor="#aaa"
    >
      <ul>
        {hidden.map((item) => {
          return (
            <li key={item.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <p>{item.title}</p>
                  <p>
                    <span>{item.village?.name}</span>
                    <span style={{ marginLeft: 8, marginRight: 8 }}>/</span>
                    <span>{item.stage?.name}</span>
                  </p>
                  <p>
                    <span>{item.time?.name}</span>
                    <span style={{ marginLeft: 8, marginRight: 8 }}>/</span>
                    <span>{item.duration} perc</span>
                  </p>
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
              </div>

              <Divider my="sm" />
            </li>
          );
        })}
        <Space h="lg" />
      </ul>
    </Modal>
  );
};
