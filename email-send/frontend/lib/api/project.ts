import { PROJECT } from "@/lib/data/project";
import { NAV, PAGE_META, STREAMS, REPUTATION } from "@/lib/mock/console";
import { TEMPLATES } from "@/lib/data/templates";
import { DOMAINS } from "@/lib/data/domains";
import { SUPPRESSIONS } from "@/lib/data/suppressions";

export const getProject = async () => PROJECT;
export const getNav = async () => NAV;
export const getPageMeta = async () => PAGE_META;
export const getStreams = async () => STREAMS;
export const getReputation = async () => REPUTATION;

export const getNavBadges = async (): Promise<Record<string, number>> => ({
  "/console/templates": TEMPLATES.length,
  "/console/domains": DOMAINS.length,
  "/console/suppressions": SUPPRESSIONS.length,
});
