import { getAuditDescriptions, listAudit } from "@/lib/api/audit";
import { ACTIVITY_RETENTION_DAYS } from "@/lib/limits";
import { AuditClient } from "./audit-client";

export default async function ConsoleAudit() {
  const [entries, descriptions] = await Promise.all([
    listAudit(),
    getAuditDescriptions(),
  ]);
  return (
    <AuditClient
      entries={entries}
      descriptions={descriptions}
      retentionDays={ACTIVITY_RETENTION_DAYS}
    />
  );
}
