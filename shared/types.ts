export type SectionData = { _type: string; _key: string } & Record<string, unknown>;

export type Cta = { label: string; href: string; variant?: "primary" | "secondary" | "ghost" };
