/**
 * Mock data for the Pane mail app. Each block names the endpoint that replaces
 * it — see `app/mail/mail.contract.md`.
 */

import { AV } from "./marketing";

export { AV };

export type Category =
  "Primary" | "Social" | "Promotions" | "Newsletters" | "OTP";

export type Email = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  tag: string;
  unread: boolean;
  category: Category;
};

/** `GET /v1/mailboxes/inbox/threads` */
export const EMAILS: Email[] = [
  {
    id: "thr_01",
    sender: "Maya Lindqvist",
    subject: "Frosted panels for the v3 shell",
    preview: "Pushed the new blur tokens — take a look before standup",
    time: "9:42 AM",
    tag: "Design",
    unread: true,
    category: "Primary",
  },
  {
    id: "thr_02",
    sender: "Notion Workspace",
    subject: "3 pages shared with you",
    preview: "Roadmap Q4, Hiring loop, Brand refresh notes",
    time: "9:08 AM",
    tag: "Team",
    unread: true,
    category: "Primary",
  },
  {
    id: "thr_03",
    sender: "Idris Bello",
    subject: "Re: latency on the sync worker",
    preview: "Down to 120ms after the batching change. Numbers inside",
    time: "8:51 AM",
    tag: "Product",
    unread: true,
    category: "Primary",
  },
  {
    id: "thr_04",
    sender: "Stripe",
    subject: "Your verification code is 418 209",
    preview: "Expires in 10 minutes. Do not share this code.",
    time: "8:44 AM",
    tag: "",
    unread: true,
    category: "OTP",
  },
  {
    id: "thr_05",
    sender: "GitHub",
    subject: "Sign-in code: 902 771",
    preview: "Requested from Stockholm, Chrome on macOS",
    time: "8:31 AM",
    tag: "",
    unread: true,
    category: "OTP",
  },
  {
    id: "thr_06",
    sender: "LinkedIn",
    subject: "Priya and 6 others viewed your profile",
    preview: "See who has been looking this week",
    time: "8:12 AM",
    tag: "",
    unread: true,
    category: "Social",
  },
  {
    id: "thr_07",
    sender: "Clara Osei",
    subject: "Lunch Thursday?",
    preview: "There is a new place by the canal that does proper focaccia",
    time: "8:20 AM",
    tag: "Personal",
    unread: true,
    category: "Primary",
  },
  {
    id: "thr_08",
    sender: "Dribbble",
    subject: "40% off Pro until Friday",
    preview: "Annual plans only. Renews at full price.",
    time: "Yesterday",
    tag: "",
    unread: false,
    category: "Promotions",
  },
  {
    id: "thr_09",
    sender: "Figma",
    subject: "Priya commented on Inbox / List",
    preview: '"Can the unread dot sit tighter to the name?"',
    time: "Yesterday",
    tag: "Design",
    unread: false,
    category: "Social",
  },
  {
    id: "thr_10",
    sender: "Tomás Reyes",
    subject: "Contract renewal — signed",
    preview: "Attached the countersigned copy plus the updated schedule",
    time: "Yesterday",
    tag: "",
    unread: false,
    category: "Primary",
  },
  {
    id: "thr_11",
    sender: "Weekly Digest",
    subject: "What shipped last week",
    preview: "14 merges, 3 releases, and the search rewrite is live",
    time: "Yesterday",
    tag: "Team",
    unread: false,
    category: "Newsletters",
  },
  {
    id: "thr_12",
    sender: "Offscreen Dispatch",
    subject: "Issue 214 — the quiet interface",
    preview: "Long read on restraint in product design",
    time: "Yesterday",
    tag: "",
    unread: false,
    category: "Newsletters",
  },
  {
    id: "thr_13",
    sender: "Anneke Vos",
    subject: "Board deck v6",
    preview: "Slides 8–12 rewritten around the retention story",
    time: "Mon",
    tag: "Product",
    unread: false,
    category: "Primary",
  },
  {
    id: "thr_14",
    sender: "Sam Whitfield",
    subject: "Keys for the studio",
    preview: "Left them with reception, ask for Dina",
    time: "Mon",
    tag: "Personal",
    unread: false,
    category: "Primary",
  },
  {
    id: "thr_15",
    sender: "Muji Online",
    subject: "Autumn restock is live",
    preview: "Free shipping over €60 through Sunday",
    time: "Mon",
    tag: "",
    unread: false,
    category: "Promotions",
  },
  {
    id: "thr_16",
    sender: "Linear",
    subject: "Cycle 24 planning is open",
    preview: "8 issues unassigned in Inbox triage",
    time: "Sun",
    tag: "",
    unread: false,
    category: "Primary",
  },
];

export const TAG_TINT: Record<string, [string, string]> = {
  Team: ["#5b57c8", "rgba(124,126,242,.14)"],
  Design: ["#7c3aed", "rgba(167,139,250,.16)"],
  Product: ["#0e7490", "rgba(103,232,249,.2)"],
  Personal: ["#4f46e5", "rgba(165,180,252,.22)"],
  "": ["transparent", "transparent"],
};

export const CATEGORIES: { label: Category; glyph: string; logo: string }[] = [
  {
    label: "Primary",
    glyph: "✉",
    logo: "linear-gradient(140deg,#7c7ef2,#a78bfa)",
  },
  {
    label: "Social",
    glyph: "◕",
    logo: "linear-gradient(140deg,#7dd3fc,#818cf8)",
  },
  {
    label: "Promotions",
    glyph: "%",
    logo: "linear-gradient(140deg,#c084fc,#f0abfc)",
  },
  {
    label: "Newsletters",
    glyph: "▤",
    logo: "linear-gradient(140deg,#67e8f9,#5eead4)",
  },
  { label: "OTP", glyph: "⌘", logo: "linear-gradient(140deg,#a5b4fc,#8b8cf6)" },
];

/** `GET /v1/mailboxes` */
export const MAILBOXES = [
  { label: "Inbox", glyph: "✉", count: "12" },
  { label: "Starred", glyph: "★", count: "4" },
  { label: "Snoozed", glyph: "◷", count: "" },
  { label: "Sent", glyph: "➤", count: "" },
  { label: "Drafts", glyph: "✎", count: "2" },
  { label: "Archive", glyph: "▤", count: "" },
];

/** The mockup's own screen switcher, kept as real routes. */
export const SCREENS = [
  { href: "/mail", label: "Email list" },
  { href: "/mail/read", label: "Opened email" },
  { href: "/mail/split", label: "List + opened" },
  { href: "/mail/compose", label: "Compose (full)" },
  { href: "/mail/popup", label: "Compose (popup)" },
  { href: "/mail/settings", label: "Settings" },
  { href: "/mail/profile", label: "Profile" },
];

export function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
}

/** `GET /v1/threads/{threadId}` */
export const THREAD_BODY = {
  paragraphs: [
    "Morning — I pushed the new blur tokens to the shared library last night. The panels now sit on three depth levels instead of two, which fixes the flattening we kept seeing on the inbox rows.",
    "The main change: surfaces carry their own tint rather than inheriting from the backdrop. Unread rows read brighter without needing a heavier border, and the list stops looking noisy at density.",
    "Have a look before standup and tell me if the middle layer feels too close to the base. I can pull it back four percent without losing the separation.",
  ],
  signRole: "Product Design",
  files: [
    {
      name: "blur-tokens-v3.json",
      size: "18 KB",
      tint: "linear-gradient(140deg,#a5b4fc,#c4b5fd)",
    },
    {
      name: "panel-depth-study.pdf",
      size: "2.4 MB",
      tint: "linear-gradient(140deg,#7dd3fc,#818cf8)",
    },
  ],
  actions: [
    { glyph: "←", label: "Back" },
    { glyph: "▤", label: "Archive" },
    { glyph: "◷", label: "Snooze" },
    { glyph: "★", label: "Star" },
  ],
};

/** Draft shown in the compose surfaces. `GET /v1/drafts/{draftId}` */
export const DRAFT = {
  to: [{ name: "Maya Lindqvist", avatar: AV[0] }],
  subject: "Re: Frosted panels for the v3 shell",
  paragraphs: [
    "Looks good on my side. The three-level split reads much cleaner at density, and the unread rows finally hold their weight without the heavier border.",
    "One note before standup: the middle layer is close enough to the base that it disappears against the cool part of the gradient. Pulling it back a few percent should be enough.",
  ],
  tools: ["📎", "A", "☺", "🖼", "⋯"],
};

/** `GET /v1/me` */
export const PROFILE = {
  name: "Anneke Vos",
  initials: "AV",
  headline: "anneke@pane.mail · Product design, Stockholm",
  stats: [
    { value: "18,402", label: "Conversations" },
    { value: "5.7 GB", label: "Storage used" },
    { value: "2.4 h", label: "Avg. reply time" },
    { value: "2019", label: "Member since" },
  ],
  details: [
    { k: "Full name", v: "Anneke Vos" },
    { k: "Email", v: "anneke@pane.mail" },
    { k: "Aliases", v: "a.vos@pane.mail, hello@annekevos.se" },
    { k: "Recovery", v: "+46 70 555 01 22" },
    { k: "Language", v: "English (UK)" },
    { k: "Time zone", v: "Europe/Stockholm — CET" },
  ],
  signature: {
    name: "Anneke Vos",
    role: "Product Design · Pane",
    phone: "+46 70 555 01 22",
  },
  storage: { pct: 38, label: "5.7 GB of 15 GB used" },
};

export type ToggleKey =
  | "dark"
  | "threads"
  | "preview"
  | "readReceipts"
  | "desktop"
  | "digest"
  | "sounds"
  | "twoFactor"
  | "autoArchive";

export const DEFAULT_TOGGLES: Record<ToggleKey, boolean> = {
  dark: false,
  threads: true,
  preview: true,
  readReceipts: false,
  desktop: true,
  digest: false,
  sounds: true,
  twoFactor: true,
  autoArchive: false,
};

type SettingRow =
  | { kind: "switch"; key: ToggleKey; label: string; hint: string }
  | { kind: "value"; label: string; hint: string; value: string };

/** `GET /v1/me/settings` */
export const SETTING_GROUPS: { title: string; rows: SettingRow[] }[] = [
  {
    title: "Appearance",
    rows: [
      {
        kind: "switch",
        key: "dark",
        label: "Dark mode",
        hint: "Dim the interface and use a dark palette",
      },
      {
        kind: "value",
        label: "Accent",
        hint: "Highlight colour across the app",
        value: "Iris",
      },
      {
        kind: "value",
        label: "Wallpaper",
        hint: "Backdrop behind the panels",
        value: "Aurora",
      },
    ],
  },
  {
    title: "Inbox",
    rows: [
      {
        kind: "switch",
        key: "threads",
        label: "Conversation view",
        hint: "Group replies into a single thread",
      },
      {
        kind: "switch",
        key: "preview",
        label: "Preview text",
        hint: "Show the first line beside each subject",
      },
      {
        kind: "value",
        label: "Density",
        hint: "Row height in the list",
        value: "Comfortable",
      },
    ],
  },
  {
    title: "Notifications",
    rows: [
      {
        kind: "switch",
        key: "desktop",
        label: "Desktop alerts",
        hint: "Only for Primary and starred senders",
      },
      {
        kind: "switch",
        key: "sounds",
        label: "Sounds",
        hint: "Play a chime on new mail",
      },
      {
        kind: "switch",
        key: "digest",
        label: "Daily digest",
        hint: "One summary at 08:00",
      },
    ],
  },
  {
    title: "Privacy",
    rows: [
      {
        kind: "switch",
        key: "readReceipts",
        label: "Read receipts",
        hint: "Let senders know when you open mail",
      },
      {
        kind: "switch",
        key: "twoFactor",
        label: "Two-factor auth",
        hint: "Required at every new sign-in",
      },
      {
        kind: "value",
        label: "Block list",
        hint: "Senders you never hear from",
        value: "14 senders",
      },
    ],
  },
  {
    title: "Automation",
    rows: [
      {
        kind: "switch",
        key: "autoArchive",
        label: "Auto-archive OTP codes",
        hint: "Remove verification mail after 24 hours",
      },
      {
        kind: "value",
        label: "Filters",
        hint: "Rules applied on delivery",
        value: "9 active",
      },
      {
        kind: "value",
        label: "Signature",
        hint: "Appended to new messages",
        value: "Default",
      },
    ],
  },
];
