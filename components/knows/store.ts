export const initialDataAtom = atom([
  "some",
  "data",
  "I will probably rewrite this as objects instead of strings",
]);

export const queriesAtom = atom<string[]>([]);
export const addQueryAtom = atom(null, (_get, set, newQuery: string) => {
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
export const removeQueryAtom = atom(null, (_get, set, removedQuery: string) => {
  set(queriesAtom, (prev) =>
    prev.filter((value) => value.toLowerCase() != removedQuery.toLowerCase())
  );
});

export const filteredDataAtom = atom((get) => {
  return get(queriesAtom)
    .map((serachItem) => {
      return get(initialDataAtom).filter(
        (item) => item.toLowerCase() == serachItem.toLowerCase()
      );
    })
    .flat();
});

import { atom } from "jotai";
