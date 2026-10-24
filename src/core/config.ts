const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawBaseUrl) {
  throw new Error(
    'Falta VITE_API_BASE_URL. Copia .env.example a .env y define la URL del backend.',
  );
}

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');
export const REQUEST_TIMEOUT_MS = 15_000;
