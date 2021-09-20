import { IndexedDBProps } from "react-indexed-db";

export const DBConfig: IndexedDBProps = {
  name: "wordsDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "words",
      storeConfig: { keyPath: "word", autoIncrement: true },
      storeSchema: [
        { name: "word", keypath: "word", options: { unique: true } },
      ],
    },
  ],
};
