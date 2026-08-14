export type SectionData = { _type: string; _key: string } & Record<string, unknown>;

export type Cta = { label: string; href: string; variant?: "primary" | "secondary" | "ghost" };

export type SanityImage = {
	url?: string;
	alt?: string;
	width?: number;
	height?: number;
	lqip?: string;
	crop?: { top: number; right: number; bottom: number; left: number };
	hotspot?: { x: number; y: number; height: number; width: number };
};

export type HomeTab = {
	_key?: string;
	id?: string;
	label: string;
	description?: string;
	image?: SanityImage;
	imageMobile?: SanityImage;
};

export type HomeMediaItem = {
	_key?: string;
	overline?: string;
	label?: string;
	title: string;
	text?: string;
	benefits?: string[];
	image?: SanityImage;
	imageMobile?: SanityImage;
};

export type HomeCase = {
	_key?: string;
	company: string;
	logo?: SanityImage;
	quote: string;
	sourceLabel?: string;
	sourceUrl?: string;
	image?: SanityImage;
	imageMobile?: SanityImage;
};

export type HomeComposition = {
	hero?: {
		title?: string;
		description?: string;
		cta?: Cta;
		proof?: string;
		tabs?: HomeTab[];
	};
	logos?: {
		title?: string;
		items?: { _key?: string; name: string; image?: SanityImage }[];
	};
	journey?: { title?: string; text?: string; steps?: string[] };
	whizz?: { title?: string; text?: string; items?: HomeMediaItem[] };
	stories?: { title?: string; items?: HomeMediaItem[] };
	proof?: {
		title?: string;
		text?: string;
		cases?: HomeCase[];
		metrics?: { _key?: string; value: string; label: string; source?: string; sourceUrl?: string }[];
	};
	integrations?: {
		title?: string;
		text?: string;
		items?: { _key?: string; label: string; detail?: string; logo?: SanityImage }[];
	};
	finalCta?: { title?: string; text?: string; primary?: Cta; secondary?: Cta };
};

export type HomePageData = {
	title: string;
	seo?: import("@/lib/seo").SeoData;
	home?: HomeComposition;
} | null;
