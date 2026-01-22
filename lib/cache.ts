// 简单的内存缓存
interface CacheItem<T> {
  data: T;
  expireAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private pendingRequests = new Map<string, Promise<any>>();

  // 获取缓存
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expireAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  // 设置缓存
  set<T>(key: string, data: T, ttlSeconds: number = 60): void {
    this.cache.set(key, {
      data,
      expireAt: Date.now() + ttlSeconds * 1000,
    });
  }

  // 删除缓存
  delete(key: string): void {
    this.cache.delete(key);
  }

  // 删除匹配的缓存
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  // 清空所有缓存
  clear(): void {
    this.cache.clear();
  }

  // 防止重复请求 - 如果有相同的请求正在进行，等待它完成
  async dedupe<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const pending = this.pendingRequests.get(key);
    if (pending) {
      return pending as Promise<T>;
    }

    const promise = fn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  // 带缓存的请求
  async cached<T>(
    key: string,
    fn: () => Promise<T>,
    ttlSeconds: number = 60
  ): Promise<T> {
    // 先检查缓存
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // 防止重复请求并缓存结果
    return this.dedupe(key, async () => {
      const data = await fn();
      this.set(key, data, ttlSeconds);
      return data;
    });
  }
}

// 全局缓存实例
export const cache = new MemoryCache();

// 缓存时间常量
export const CACHE_TTL = {
  SHORT: 30,      // 30秒 - 频繁变化的数据
  MEDIUM: 60,     // 1分钟 - 一般数据
  LONG: 300,      // 5分钟 - 不常变化的数据
  VERY_LONG: 600, // 10分钟 - 几乎不变的数据
};
