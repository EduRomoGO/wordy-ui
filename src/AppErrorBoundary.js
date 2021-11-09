import React from "react";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export default function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // TODO: Vaciar la base de datos?? Bueno, depende de cual sea el error
        // - si es un error de que no se puede acceder a la base de datos, recargar
        // la pagina
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
