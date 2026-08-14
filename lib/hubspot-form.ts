export function buildHubSpotPayload(
  formData: FormData,
  pageUri: string,
  pageName: string,
) {
  const fields = [...formData.entries()]
    .filter(([name, value]) => {
      return !name.startsWith("_") && typeof value === "string";
    })
    .map(([name, value]) => ({ name, value: String(value) }));
  return { fields, context: { pageUri, pageName } };
}

export function isSafeFormAction(action: string) {
  return /^(https:\/\/|\/(?!\/))/.test(action);
}
