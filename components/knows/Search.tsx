const initialDataAtom = atom([
  "some",
  "data",
  "I will probably rewrite this as objects instead of strings",
]);

const queriesAtom = atom<string[]>([]);
const addQueryAtom = atom(null, (_get, set, newQuery: string) => {
  set(queriesAtom, (prevQueries) => {
    // if queries already has this new query or the new query is empty, don't add it
    if (
      prevQueries.some(
        (item) =>
          item.toLowerCase() == newQuery.toLowerCase() && newQuery.length > 0
      )
    ) {
      return prevQueries;
    } else {
      return [...prevQueries, newQuery];
    }
  });
});
const removeQueryAtom = atom(null, (_get, set, removedQuery: string) => {
  set(queriesAtom, (prev) =>
    prev.filter((value) => value.toLowerCase() != removedQuery.toLowerCase())
  );
});

const filteredDataAtom = atom((get) => {
  return get(queriesAtom)
    .map((serachItem) => {
      return get(initialDataAtom).filter(
        (item) => item.toLowerCase() == serachItem.toLowerCase()
      );
    })
    .flat();
});

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
import { atom, useAtom } from "jotai";
