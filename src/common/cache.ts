export class Cache<K, V> {
    protected readonly cache: Map<K, V> = new Map();
    
    add(key: K, value: V): void {
        this.cache.set(key, value);
    }

    get(key: K): V | undefined {
        return this.cache.get(key);
    }
}