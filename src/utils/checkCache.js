function checkCache(client) {
    (function check(allCache) {
        if (!allCache) return;
        for (const cache of Object.values(allCache)) {
            for (let cachedIndex = cache.length - 1; cachedIndex >= 0; cachedIndex--) {
                const cached = cache[cachedIndex];
                if (Date.now() >= cached.expiryDate) cache.splice(cachedIndex, 1);
                if (cached._cache) return check(cached._cache);
            }
        }
    })(client._cache);
}

module.exports = checkCache;