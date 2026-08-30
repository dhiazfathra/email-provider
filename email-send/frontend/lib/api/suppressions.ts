import { SUPPRESSIONS, suppressStats } from "@/lib/data/suppressions";

export const listSuppressions = async () => SUPPRESSIONS;
export const getSuppressStats = async () => suppressStats();
