import { Filter } from "pages";
import React, { FC, useRef } from "react";
import { Location, Program, Range } from "types";

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
      <div>
        {Object.values(Location).map((location) => {
          return (
            <input
              key={location}
              type="checkbox"
              name="location"
              value={location}
              checked={filter.location?.includes(location)}
              onChange={onChange}
            />
          );
        })}
      </div>

      <div>
        {Object.values(Program).map((program) => {
          return (
            <input
              key={program}
              type="checkbox"
              name="program"
              value={program}
              checked={filter.program?.includes(program)}
              onChange={onChange}
            />
          );
        })}
      </div>

      <div>
        {Object.values(Range).map((range) => {
          return (
            <input
              key={range}
              type="radio"
              name="range"
              value={range}
              checked={range === filter.range}
              onChange={onChange}
            />
          );
        })}
      </div>
    </form>
  );
};
