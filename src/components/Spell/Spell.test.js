import Spell from "./Spell";
import PouchDB from "pouchdb-browser";
import dbTest from "utils/db/db-test.json";

jest.genMockFromModule("pouchdb-browser");

const find = jest.fn().mockImplementation(() => {
  return { docs: dbTest.wordDescriptors };
});

const allDocs = jest.fn().mockImplementation(() => {
  return {
    rows: [
      { doc: { word: "foo", phonemics: "foo" } },
      { doc: { word: "bar", phonemics: "bar" } },
    ],
  };
});

const bulkDocs = jest.fn().mockImplementation(() => {
  return Promise.resolve([]);
});

const mockDb = {
  name: "mockDBName",
  allDocs,
  createIndex: jest.fn(),
  find,
  plugin: jest.fn(),
  bulkDocs,
};

PouchDB.mockImplementation(() => mockDb);

jest.mock("pouchdb-browser");

test("spell render", () => {});
