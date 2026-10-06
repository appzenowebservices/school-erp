// utils/sessionCache.ts
import CryptoJS from "crypto-js";

const SESSION_KEY = process.env.NEXT_PUBLIC_SESSION_SECRET || "infoEIGHT@369";

type CacheOptions = {
  encrypt?: boolean; // default false
};

function safeStorage() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage;
}

export function setSessionCache(key: string, value: any, options: CacheOptions = {}) {
  try {
    const storage = safeStorage();
    if (!storage) return; // SSR safe

    const json = JSON.stringify(value);

    if (options.encrypt) {
      const encrypted = CryptoJS.AES.encrypt(json, SESSION_KEY).toString();
      // console.log("SessionCache:setted ----------------- ",);

      storage.setItem(key, encrypted);
    } else {
      // console.log("SessionCache:setted ----------------- ",);

      storage.setItem(key, json);
    }
  } catch (err) {
    console.error("SessionCache: Failed to set", key, err);
  }
}

export function getSessionCache<T = any>(key: string, options: CacheOptions = {}): T | null {
  try {
    const storage = safeStorage();
    if (!storage) return null;

    const item = storage.getItem(key);
    if (!item) return null;

    if (options.encrypt) {
      const bytes = CryptoJS.AES.decrypt(item, SESSION_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as T;
    }

    return JSON.parse(item) as T;
  } catch (err) {
    console.error("SessionCache: Failed to get", key, err);
    return null;
  }
}

export function removeSessionCache(key: string) {
  try {
    const storage = safeStorage();
    if (!storage) return;
    storage.removeItem(key);
  } catch (err) {
    console.error("SessionCache: Failed to remove", key, err);
  }
}

export function clearSessionCache() {
  try {
    const storage = safeStorage();
    if (!storage) return;
    storage.clear();
  } catch (err) {
    console.error("SessionCache: Failed to clear all", err);
  }
}
