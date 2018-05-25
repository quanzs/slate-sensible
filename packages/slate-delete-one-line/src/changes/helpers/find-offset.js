// @flow

export default function findOffset(
    offset: number,
    callback: number => boolean
) {
    if (offset < 2) return offset;
    let left = 0;
    let mid = Math.floor(offset / 2);
    let right = offset;
    if (callback(left)) return left;
    const result = right;

    while (mid !== result && mid !== left) {
        if (callback(mid)) {
            right = mid;
            mid = Math.floor((left + right) / 2);
        } else {
            left = mid;
            mid = Math.floor((left + right) / 2);
        }
    }

    return right;
}
