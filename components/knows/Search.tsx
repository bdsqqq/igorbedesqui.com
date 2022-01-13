export const Search = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [initialData] = useAtom(initialDataAtom);
  const [queries] = useAtom(queriesAtom);
  const [filteredData] = useAtom(filteredDataAtom);
  const [, addQuery] = useAtom(addQueryAtom);
  const [, removeQuery] = useAtom(removeQueryAtom);

  return (
    <>
      <form
        onSubmit={(e) => {
          if (inputRef.current) {
            if (inputRef.current.value) {
              addQuery(inputRef.current.value);
            }
          }
          e.preventDefault();
        }}
      >
        <label htmlFor="serachBox">SearchBox</label>
        <input
          autoComplete="off"
          spellCheck="false"
          ref={inputRef}
          id="serachBox"
          type="text"
        />
        <button>Submit</button>
      </form>

      <ul>
        {queries?.map((item) => (
          <li key={item}>
            {item}{" "}
            <button
              onClick={() => {
                removeQuery(item);
              }}
            >
              remove
            </button>
          </li>
        ))}
      </ul>

      <br />
      <br />
      <br />
      <h6>FilteredData</h6>
      <ul>{filteredData && filteredData.map((t) => <li key={t}>{t}</li>)}</ul>

      <br />
      <br />
      <br />
      <h6>All tech</h6>
      <ul>
        {initialData.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </>
  );
};

import { useRef } from "react";
import { useAtom } from "jotai";

import {
  initialDataAtom,
  queriesAtom,
  addQueryAtom,
  removeQueryAtom,
  filteredDataAtom,
} from "./store";
