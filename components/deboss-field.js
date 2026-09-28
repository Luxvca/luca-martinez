/** Inside signed-distance branch, in supersampled pixels. No noise or surface texture. */
export function insideDistance(alpha, width, height) {
    const d = new Float32Array(width * height);
    for (let i = 0; i < d.length; i++)
        d[i] = alpha[i * 4 + 3] < 128 ? 0 : 1e6;
    const diagonal = Math.SQRT2;
    for (let y = 1; y < height - 1; y++)
        for (let x = 1; x < width - 1; x++) {
            const i = y * width + x;
            d[i] = Math.min(d[i], d[i - 1] + 1, d[i - width] + 1, d[i - width - 1] + diagonal, d[i - width + 1] + diagonal);
        }
    for (let y = height - 2; y > 0; y--)
        for (let x = width - 2; x > 0; x--) {
            const i = y * width + x;
            d[i] = Math.min(d[i], d[i + 1] + 1, d[i + width] + 1, d[i + width - 1] + diagonal, d[i + width + 1] + diagonal);
        }
    for (let i = 0; i < d.length; i++)
        d[i] = Math.max(0, d[i] - 0.5);
    return d;
}
export function blurField(source, width, height, sigma) {
    const radius = Math.ceil(sigma * 3);
    const kernel = Array.from({ length: radius * 2 + 1 }, (_, i) => Math.exp(-0.5 * ((i - radius) / sigma) ** 2));
    const total = kernel.reduce((a, b) => a + b, 0);
    const temp = new Float32Array(source.length), result = new Float32Array(source.length);
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
            for (let k = -radius; k <= radius; k++)
                temp[y * width + x] += source[y * width + Math.max(0, Math.min(width - 1, x + k))] * kernel[k + radius] / total;
        }
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
            for (let k = -radius; k <= radius; k++)
                result[y * width + x] += temp[Math.max(0, Math.min(height - 1, y + k)) * width + x] * kernel[k + radius] / total;
        }
    return result;
}
export function makeDepthField(alpha, width, height, scale, wall, softness = 0.7) {
    const distance = insideDistance(alpha, width, height);
    const halfWidth = distance.slice();
    // Follow distance ascent to the local medial ridge. Descending buckets avoid an
    // O(n log n) pixel sort while preserving each narrow stroke's own radius.
    const buckets = [];
    for (let i = 0; i < distance.length; i++)
        if (distance[i] > 0) {
            const bucket = Math.ceil(distance[i] * 16);
            (buckets[bucket] ??= []).push(i);
        }
    const offsets = [-width - 1, -width, -width + 1, -1, 1, width - 1, width, width + 1];
    for (let b = buckets.length - 1; b >= 0; b--)
        for (const i of buckets[b] ?? []) {
            let next = i;
            for (const offset of offsets)
                if (distance[i + offset] > distance[next])
                    next = i + offset;
            halfWidth[i] = halfWidth[next];
        }
    const depth = new Float32Array(distance.length);
    for (let i = 0; i < depth.length; i++) {
        if (distance[i] <= 0)
            continue;
        const wallPx = Math.max(0.01, Math.min(wall * scale, halfWidth[i] * 0.45));
        const t = Math.min(1, distance[i] / wallPx);
        depth[i] = t * t * t * (t * (t * 6 - 15) + 10);
    }
    const rounded = blurField(depth, width, height, scale * Math.max(0.1, softness));
    const broad = blurField(depth, width, height, scale * 1.2);
    const pixels = new Uint8Array(depth.length * 4);
    for (let i = 0; i < depth.length; i++) {
        // Round the rim, then ease into a narrow full-depth floor;
        // globally blurring this thin mask would erase the floor again.
        const floor = Math.min(1, Math.max(0, (distance[i] / Math.max(halfWidth[i], 0.01) - 0.45) / 0.35));
        const blend = floor * floor * (3 - 2 * floor);
        pixels[i * 4] = Math.round(255 * (rounded[i] * (1 - blend) + depth[i] * blend));
        pixels[i * 4 + 1] = Math.round(255 * broad[i]);
        pixels[i * 4 + 2] = alpha[i * 4 + 3];
        pixels[i * 4 + 3] = 255;
    }
    return pixels;
}
