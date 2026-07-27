import { seo } from "./objects/seo";
import { sectionTypes } from "./objects/sections";
import { page } from "./documents/page";
import { post } from "./documents/post";
import { author } from "./documents/author";
import { category } from "./documents/category";
import { siteSettings } from "./documents/site-settings";
import { redirect } from "./documents/redirect";

export const schemaTypes = [seo, ...sectionTypes, page, post, author, category, siteSettings, redirect];
