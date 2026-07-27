export const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY ?? "";
export const BUILDER_MODEL = "landing-page";
export const hasBuilderConfig = BUILDER_API_KEY.length > 0;
