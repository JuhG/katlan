import { Filter } from "pages";
import React, { FC, useRef } from "react";
import { Village, Topic, Day } from "types";
import { Group, CheckboxGroup, Checkbox, RadioGroup, Radio } from "@mantine/core";

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
        <CheckboxGroup label={<h3>Helyszín</h3>} value={filter.village} onChange={onChange}>
          {Object.values(Village).map((village) => {
            return <Checkbox label={village} key={village} name="village" value={village} />;
          })}
        </CheckboxGroup>

        <CheckboxGroup label={<h3>Műfaj</h3>} value={filter.topic} onChange={onChange}>
          {Object.values(Topic).map((topic) => {
            return <Checkbox label={topic} key={topic} name="topic" value={topic} />;
          })}
        </CheckboxGroup>

        <RadioGroup label={<h3>Idősáv</h3>} name="day" value={filter.day} onChange={onChange}>
          {Object.values(Day).map((day) => {
            return <Radio label={day} key={day} value={day} />;
          })}
        </RadioGroup>
      </Group>
    </form>
  );
};
