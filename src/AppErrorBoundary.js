import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "reactstrap";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <Button color="primary" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  );
}

export default function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
}
