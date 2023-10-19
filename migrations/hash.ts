import { sha512 } from '@noble/hashes/sha512';

export function create32BitsHash(
    input: Buffer | string,
    slice?: number,
): number[] {
    const hash = create32BitsHashString(input, slice);
    return Buffer.from(hash, 'utf8').toJSON().data;
}

/**
 * 计算hash
 * @param input
 * @param slice
 */
export function create32BitsHashString(
    input: Buffer | string,
    slice = 32,
): string {
    const hash = sha512(input).slice(0, slice / 2);

    return Buffer.from(hash).toString('hex');
}
