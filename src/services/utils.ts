export function timeago(value: number) {
  let gap = (Date.now() - value) / 1000;
  if (gap < 2) {
    return 'just now';
  } else if (gap < 60) {
    return Math.floor(gap) + 's ago';
  } else if (gap < 3600) {
    return Math.floor(gap / 60) + 'min ago';
  } else if (gap < 3600 * 24) {
    return Math.floor(gap / 3600) + 'h ago';
  } else if (gap < 3600 * 24 * 30) {
    const hours = Math.floor(gap / (3600 * 24));
    return `${hours} day${hours > 1 ? 's' : ''} ago`;
  } else if (gap < 3600 * 24 * 365) {
    const months = Math.floor(gap / (3600 * 24 * 30));
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(gap / (3600 * 24 * 365));
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}
