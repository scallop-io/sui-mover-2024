import {
  normalizeSuiAddress,
  normalizeStructTag,
  isValidSuiAddress,
} from "@mysten/sui/utils";
import { toast, type ToastContent, type ToastOptions } from "react-toastify";
import type { StateStorage } from "zustand/middleware";

const ELLIPSIS = "\u{2026}";

export const shortenAddress = (address: string, start = 4, end = 4) => {
  address = isValidSuiAddress(address)
    ? normalizeSuiAddress(address ?? "")
    : address;

  return `${address.slice(0, start)}${ELLIPSIS}${address.slice(-end)}`;
};

export const shortenStruct = (type: string, start = 3, end = 9) => {
  type = normalizeStructTag(type);

  return `${type.slice(0, start)}${ELLIPSIS}${type.slice(-end)}`;
};

export const shortenDigest = (digest: string, start = 4, end = 4) => {
  return `${digest.slice(0, start)}${ELLIPSIS}${digest.slice(-end)}`;
};

export const createInMemoryStore = (): StateStorage => {
  const store = new Map();
  return {
    getItem(key: string) {
      return store.get(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
  };
};

export const sleep = (timeout: number): Promise<void> => {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, timeout);
  });
};

export const notify = <T>(
  content: ToastContent<T>,
  options: ToastOptions<T>,
) => {
  toast(content, {
    style: {
      backgroundColor: "#1E232C",
      color: "white",
      fontWeight: "bold",
      border: "1px solid var(--blue-10)",
      padding: "5px",
      borderRadius: "10px",
    },
    ...options,
  });
};
