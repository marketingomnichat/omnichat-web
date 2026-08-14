import { seo } from "./objects/seo";
import { sectionTypes } from "./objects/sections";
import { homeComposition } from "./objects/home-composition";
import { page } from "./documents/page";
import { landingPage } from "./documents/landing-page";
import { post } from "./documents/post";
import { author } from "./documents/author";
import { category } from "./documents/category";
import { siteSettings } from "./documents/site-settings";
import { redirect } from "./documents/redirect";

export const schemaTypes = [seo, homeComposition, ...sectionTypes, page, landingPage, post, author, category, siteSettings, redirect];
