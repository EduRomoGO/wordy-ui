import React from "react";
import { DatabaseProvider } from "components/providers/DatabaseProvider";
import { DatabaseLoadStatusProvider } from "components/providers/DatabaseLoadStatusProvider";

export default function AppProviders({ children }) {
  return (
    <DatabaseProvider>
      <DatabaseLoadStatusProvider>{children}</DatabaseLoadStatusProvider>
    </DatabaseProvider>
  );
}
