import { useEffect, useState } from 'react';
import { describeError } from '../api/ApiError';

export type ResourceState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; message: string };

export interface Resource<T> {
  state: ResourceState<T>;
  reload: () => void;
}

/** Carga un recurso al montar, cancela al desmontar y permite reintentar. `loader` debe ser una función estable (de módulo). */
export function useResource<T>(loader: (signal: AbortSignal) => Promise<T>): Resource<T> {
  const [state, setState] = useState<ResourceState<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    loader(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ status: 'ready', data });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setState({ status: 'error', message: describeError(error) });
      });
    return () => controller.abort();
  }, [loader, attempt]);

  function reload(): void {
    setState({ status: 'loading' });
    setAttempt((current) => current + 1);
  }

  return { state, reload };
}
