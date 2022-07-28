import { Anchor, Divider, Modal, Space, Stack, Title } from "@mantine/core";
import { FC } from "react";

interface InfoProps {
  openInfo: boolean;
  setOpenInfo: React.Dispatch<React.SetStateAction<boolean>>;
}
export const Info: FC<InfoProps> = ({ openInfo, setOpenInfo }) => {
  return (
    <Modal
      title={<Title order={3}>Katlan alternatív műsorfüzet</Title>}
      opened={openInfo}
      onClose={() => setOpenInfo(false)}
      padding="lg"
      size="auto"
      overlayColor="#aaa"
    >
      <Stack spacing="xs">
        <p>
          Ez az oldal egy kísérlet az <b>Ördögkatlan Fesztivál</b> programjainak alternatív módon való prezentálására.
        </p>
        <p>
          Hosszú évek óta a nyár egyik legjobban várt eseménye a katlan, de a műsorfüzet - ennyi helyszínnel és műfajjal
          - bizony kemény dió.
        </p>
        <p>
          Minden alkalommal eljön az a pont, amikor hold-my-beer-es lendülettel megjegyzem, hogy márpedig lehetne ezt
          jobban. Na idén ez megvalósult. Hogy jobb lett-e az erősen kérdéses, de legalább tudok végre aludni.
        </p>
      </Stack>

      <Divider my="sm" />

      <Stack>
        <p>
          <Anchor href="https://ordogkatlan.hu/2022">Hivatalos műsorfüzet</Anchor>
        </p>
        <p>
          <Anchor href="https://github.com/JuhG/katlan">Oldal forráskódja</Anchor>
        </p>
      </Stack>

      <Divider my="sm" />

      <p style={{ fontSize: 12 }}>
        Az oldalnak nincs kapcsolata az Ördögkatlan Fesztivállal. Teljesen független projekt, a látogatók adatai
        semmilyen szinten nincsenek tárolva. Az `https://ordogkatlan.hu` dokumentálatlan, de nyilványos API kapcsolatát
        használja, így a tartalma megegyezik a hivatalos oldaléval. Ha az oldal bárkinek a személyiségi vagy szerzői
        jogát megsérti, kérem a{" "}
        <Anchor style={{ fontSize: 12 }} href="mailto:me@juhg.hu">
          me@juhg.hu
        </Anchor>{" "}
        email címen jelezni.
      </p>

      <Space h="lg" />
      <Space h="lg" />
    </Modal>
  );
};
