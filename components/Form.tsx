import { Filter } from "pages";
import React, { FC, useRef } from "react";
import { Location, Program, Range } from "types";
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
      range: data.get("range") as Range,
      program: data.getAll("program") as Program[],
      location: data.getAll("location") as Location[],
    });
  }, [setFilter]);

  return (
    <form ref={formRef}>
      <Group spacing="xl">
        <CheckboxGroup label={<h3>Helyszín</h3>} value={filter.location} onChange={onChange}>
          {Object.values(Location).map((location) => {
            return <Checkbox label={location} key={location} name="location" value={location} />;
          })}
        </CheckboxGroup>

        <CheckboxGroup label={<h3>Műfaj</h3>} value={filter.program} onChange={onChange}>
          {Object.values(Program).map((program) => {
            return <Checkbox label={program} key={program} name="program" value={program} />;
          })}
        </CheckboxGroup>

        <RadioGroup label={<h3>Idősáv</h3>} name="range" value={filter.range} onChange={onChange}>
          {Object.values(Range).map((range) => {
            return <Radio label={range} key={range} value={range} />;
          })}
        </RadioGroup>
      </Group>
    </form>
  );
};
