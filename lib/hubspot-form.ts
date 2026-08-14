export function buildHubSpotPayload(
  formData: FormData,
  pageUri: string,
  pageName: string,
) {
  const fields = [...formData.entries()]
    .filter(([, v]) => typeof v === "string")
    .map(([name, value]) => ({ name, value: String(value) }));
  return { fields, context: { pageUri, pageName } };
}

export function isSafeFormAction(action: string) {
  return /^(https:\/\/|\/(?!\/))/.test(action);
}
