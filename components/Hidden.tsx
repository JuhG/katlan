import { Button, Divider, Modal, Space } from "@mantine/core";
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
      title={<h2>Rejtett programok</h2>}
      opened={openHidden}
      onClose={() => setOpenHidden(false)}
      padding="lg"
      size="auto"
      overlayColor="#aaa"
    >
      {!hidden.length ? (
        <p>Még nincs egy program sem elrejtve!</p>
      ) : (
        <ul>
          {hidden.map((item) => {
            return (
              <>
                <li key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <p>{item.title}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <p>{item.village?.name}</p>
                      <span>/</span>
                      <p>{item.stage?.name}</p>
                    </div>
                    <p>{item.time?.name}</p>
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
                </li>
                <Divider my="sm" />
              </>
            );
          })}
          <Space h="lg" />
        </ul>
      )}
    </Modal>
  );
};
