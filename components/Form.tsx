import { Filter } from "pages";
import React, { FC, useRef } from "react";
import { Village, Topic, Day } from "types";
import { Group, CheckboxGroup, Checkbox, RadioGroup, Radio, Title, SegmentedControl } from "@mantine/core";

const getDayName = (day: Day) => {
  switch (day) {
    case Day.tue:
      return "K";
    case Day.wed:
      return "Sze";
    case Day.thu:
      return "Cs";
    case Day.fri:
      return "P";
    case Day.sat:
      return "Szo";
    case Day.sun:
      return "V";
  }
};

interface FormProps {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}
export const Form: FC<FormProps> = ({ filter, setFilter }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const onChange = React.useCallback(() => {
    if (!formRef.current) {
      return;
    }
    const data = new FormData(formRef.current);
    setFilter({
      day: data.get("day") as Day,
      topic: data.getAll("topic") as Topic[],
      village: data.getAll("village") as Village[],
    });
  }, [setFilter]);

  return (
    <form ref={formRef}>
      <Group spacing="xl">
        <CheckboxGroup label={<Title order={3}>Helyszín</Title>} value={filter.village} onChange={onChange}>
          {Object.values(Village).map((village) => {
            return <Checkbox label={village} key={village} name="village" value={village} />;
          })}
        </CheckboxGroup>

        <CheckboxGroup label={<Title order={3}>Műfaj</Title>} value={filter.topic} onChange={onChange}>
          {Object.values(Topic).map((topic) => {
            return <Checkbox label={topic} key={topic} name="topic" value={topic} />;
          })}
        </CheckboxGroup>

        <Title order={3}>Nap</Title>
        <SegmentedControl
          name="day"
          data={Object.values(Day).map((day) => {
            return {
              value: day,
              label: getDayName(day),
            };
          })}
          value={filter.day}
          onChange={onChange}
        />
      </Group>
    </form>
  );
};
