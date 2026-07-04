export function parseWorksCount(response) {
  try {
    return response?.['activities-summary']?.works?.group?.length ?? 0;
  } catch {
    return 0;
  }
}
