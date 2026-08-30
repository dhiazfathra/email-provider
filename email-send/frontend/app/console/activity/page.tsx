import { getMessageCounts, listMessages } from "@/lib/api/messages";
import { DEFAULT_RANGE } from "@/lib/ranges";
import { ActivityClient } from "./activity-client";

export default async function ConsoleActivity() {
  const [messages, counts] = await Promise.all([
    listMessages({ range: DEFAULT_RANGE }),
    getMessageCounts(),
  ]);
  return <ActivityClient messages={messages} counts={counts} />;
}
