import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Error } from "components/lib";

function ErrorFallback({ error, resetErrorBoundary }) {
  return <Error resetHandler={resetErrorBoundary} error={error} />;
}

export default function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
}
