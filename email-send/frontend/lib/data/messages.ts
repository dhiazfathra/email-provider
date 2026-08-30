import { type MessageState, type Stream } from "@/lib/enums";

export type Message = {
  id: string;
  to: string;
  subject: string;
  stream: Stream;
  state: MessageState;
  /** ISO-8601. Formatting happens at the render site (D11). */
  sent_at: string;
};

export const MESSAGES: readonly Message[] = [
  {
    id: "msg_01J8K2QF7ZP",
    to: "ana.ferreira@northloop.io",
    subject: "Your Harbor receipt #48213",
    stream: "transactional",
    state: "delivered",
    sent_at: "2026-08-30T09:41:02Z",
  },
  {
    id: "msg_01J8K2QF3XA",
    to: "dev+ci@bridgeworks.dev",
    subject: "Reset your password",
    stream: "transactional",
    state: "delivered",
    sent_at: "2026-08-30T09:40:58Z",
  },
  {
    id: "msg_01J8K2QDR1M",
    to: "t.okonkwo@lattice.co",
    subject: "Invite to the Atlas workspace",
    stream: "transactional",
    state: "delivered",
    sent_at: "2026-08-30T09:40:31Z",
  },
  {
    id: "msg_01J8K2QBB9C",
    to: "billing@vantage-group.com",
    subject: "Invoice AUG-2026 is ready",
    stream: "transactional",
    state: "delivered",
    sent_at: "2026-08-30T09:39:47Z",
  },
  {
    id: "msg_01J8K2Q8W4E",
    to: "nils@havnfoto.no",
    subject: "Weekly digest — 12 new items",
    stream: "bulk",
    state: "bounced",
    sent_at: "2026-08-30T09:39:12Z",
  },
  {
    id: "msg_01J8K2Q6T2H",
    to: "s.rahman@pixelforge.studio",
    subject: "Your export finished",
    stream: "notifications",
    state: "delivered",
    sent_at: "2026-08-30T09:38:55Z",
  },
  {
    id: "msg_01J8K2Q4K7R",
    to: "no-reply-test@mailsink.dev",
    subject: "Verification code 448 201",
    stream: "transactional",
    state: "deferred",
    sent_at: "2026-08-30T09:38:20Z",
  },
  {
    id: "msg_01J8K2Q1N8D",
    to: "claire@meridian.partners",
    subject: "Seat added to your plan",
    stream: "notifications",
    state: "delivered",
    sent_at: "2026-08-30T09:37:44Z",
  },
  {
    id: "msg_01J8K2PXZ3V",
    to: "ops@sunfleet.se",
    subject: "Fleet report for 28 August",
    stream: "bulk",
    state: "delivered",
    sent_at: "2026-08-30T09:37:09Z",
  },
  {
    id: "msg_01J8K2PVQ6B",
    to: "h.tanaka@kotomi.jp",
    subject: "Your Harbor receipt #48212",
    stream: "transactional",
    state: "delivered",
    sent_at: "2026-08-30T09:36:31Z",
  },
];

/** D14 — derived, never stored. */
export const messageCounts = (): Record<MessageState, number> =>
  MESSAGES.reduce(
    (acc, m) => ({ ...acc, [m.state]: (acc[m.state] ?? 0) + 1 }),
    {} as Record<MessageState, number>,
  );
