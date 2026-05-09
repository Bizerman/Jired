const CACHE_PREFIX = 'jired_groupcache_'; // префикс для ключей

export const getCachedGroups = (hash) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + hash);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const setCachedGroups = (hash, groups) => {
  try {
    localStorage.setItem(CACHE_PREFIX + hash, JSON.stringify(groups));
  } catch (e) {
    // localStorage может быть переполнен – игнорируем
  }
};

export const clearCachedGroups = (hash) => {
  localStorage.removeItem(CACHE_PREFIX + hash);
};

export const clearAllCache = () => {
  Object.keys(localStorage)
    .filter(key => key.startsWith(CACHE_PREFIX))
    .forEach(key => localStorage.removeItem(key));
};