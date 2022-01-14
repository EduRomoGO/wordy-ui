import React from "react";
import Spell from "./Spell";
import AppProviders from "components/providers/AppProviders";
import App from "App";
import PouchDB from "pouchdb-browser";
import dbTest from "utils/db/db-test.json";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
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
  render(
    <AppProviders>
      <App />
    </AppProviders>
  );

  const username = "benita";
  const password = "88888888";

  await waitFor(() => {
    screen.getByLabelText(/username/i);

    // once the login is successful, then the loading spinner disappears and
    // we render the username.
    // 🐨 assert that the username is on the screen
    // expect(usernameOnScreen).toBeInTheDocument();

    // const boton = screen.queryByRole("button", {
    //   name: /sign in/i,
    // });
    // console.log(
    //   "🚀 ~ file: Spell.test.js ~ line 71 ~ test ~ boton",
    //   boton.innerHTML
    // );
    // expect(screen.getByText(/username/i)).toBeInTheDocument();
    // expect(
    //   screen.queryByText(/database is fully loaded! 🎉🎉/i)
    // ).not.toBeInTheDocument();
    // expect(
    // screen.getByRole("tab", {
    //   name: /create account/i,
    // })
    // ).toBeInTheDocument();
    // screen.debug();
  });

  const usernameElement = screen.getByLabelText(/username/i);
  expect(usernameElement).toBeInTheDocument();
  const passwordElement = screen.getByLabelText("Password");
  expect(passwordElement).toBeInTheDocument();
  const signInButton = screen.getByRole("button", { name: /sign in/i });
  expect(signInButton).toBeInTheDocument();

  userEvent.type(usernameElement, username);
  expect(usernameElement.value).toEqual("benita");
  userEvent.type(passwordElement, password);
  expect(passwordElement.value).toEqual("88888888");

  // await act(async () => {
  //   await userEvent.click(signInButton);
  //   expect(signInButton.disabled).toEqual(true);
  // });

  // await waitFor(() => {
  //   screen.getByLabelText(/username/i);
  //   screen.debug();
  // }, 10000);

  // await waitFor(() => {
  //   screen.getByText(/database is fully loaded! 🎉🎉/i);
  //   // const usernameOnScreen = screen.getByRole("heading", {
  //   //   name: /hello/i,
  //   // });

  //   //   screen.debug();
  //   //   console.log(usernameOnScreen.innerHTML);
  // });

  // await waitForElementToBeRemoved(() => screen.getAllByLabelText(/username/i));
});
