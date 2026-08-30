import { MESSAGES, messageCounts } from "@/lib/data/messages";
import type { Message } from "@/lib/data/messages";

export type { Message };
import type { MessageState } from "@/lib/enums";
import { RANGE_MS, type Range } from "@/lib/ranges";

/**
 * The seam. Returns fixtures today; the backend lands behind this signature
 * without a call site changing (ADR-0008).
 */
export const listMessages = async (opts: {
  range: Range;
  state?: MessageState;
}): Promise<Message[]> => {
  const since = Date.now() - RANGE_MS[opts.range];
  return MESSAGES.filter(
    (m) =>
      new Date(m.sent_at).getTime() >= since &&
      (!opts.state || m.state === opts.state),
  );
};

export const getMessageCounts = async (): Promise<
  Record<MessageState, number>
> => messageCounts();

export { messageDetail as getMessageDetail } from "@/lib/mock/console";
