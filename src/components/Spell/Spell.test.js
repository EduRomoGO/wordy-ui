import React from "react";
import AppProviders from "components/providers/AppProviders";
import App from "App";
import PouchDB from "pouchdb-browser";
import dbTest from "utils/db/db-test.json";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withAuthenticator } from "@aws-amplify/ui-react";

jest.genMockFromModule("@aws-amplify/ui-react");
withAuthenticator.mockImplementation(() => <App />);
jest.mock("@aws-amplify/ui-react");

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
  close: jest.fn(),
  find,
  bulkDocs,
  plugin: jest.fn(),
};

PouchDB.mockImplementation(() => mockDb);

jest.mock("pouchdb-browser");

test("component Spell render", async () => {
  const { container } = render(
    <AppProviders>
      <App />
    </AppProviders>
  );

  await waitFor(() => {
    expect(
      screen.getByText(/database is fully loaded! 🎉🎉/i)
    ).toBeInTheDocument();
  });

  const spellButton = screen.getByRole("link", {
    name: /spell/i,
  });
  expect(spellButton).toBeInTheDocument();
  userEvent.click(spellButton);

  await waitForElementToBeRemoved(() => screen.getByText(/loading.../i));
  expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();

  expect(
    container.querySelector(".spell-component-wrapper")
  ).toBeInTheDocument();
});

test("component Phonemes render", async () => {
  const { container } = render(
    <AppProviders>
      <App />
    </AppProviders>
  );

  await waitFor(() => {
    expect(
      screen.getByText(/database is fully loaded! 🎉🎉/i)
    ).toBeInTheDocument();
  });

  const phonemesButton = screen.getByRole("link", {
    name: /phonemes/i,
  });
  expect(phonemesButton).toBeInTheDocument();
  userEvent.click(phonemesButton);

  await waitForElementToBeRemoved(() => screen.getByText(/loading.../i));
  expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();

  expect(
    container.querySelector(".phonemes-component-wrapper")
  ).toBeInTheDocument();
});

test("component Words render", async () => {
  const { container } = render(
    <AppProviders>
      <App />
    </AppProviders>
  );

  await waitFor(() => {
    expect(
      screen.getByText(/database is fully loaded! 🎉🎉/i)
    ).toBeInTheDocument();
  });

  const wordsButton = screen.getByRole("link", {
    name: /words/i,
  });
  expect(wordsButton).toBeInTheDocument();
  userEvent.click(wordsButton);

  await waitForElementToBeRemoved(() => screen.getByText(/loading.../i));
  expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();

  expect(container.querySelector(".css-10zpvm2-Words")).toBeInTheDocument();
});
