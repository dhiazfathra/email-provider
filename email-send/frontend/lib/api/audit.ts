import { AUDIT_DESCRIPTIONS, AUDIT_ENTRIES } from "@/lib/data/audit";
import type { AuditCategory } from "@/lib/enums";

export const listAudit = async (opts?: { category?: AuditCategory }) =>
  AUDIT_ENTRIES.filter((a) => !opts?.category || a.category === opts.category);

export const getAuditDescriptions = async () => AUDIT_DESCRIPTIONS;
