import { kpisForRange as _kpisForRange, type Kpi } from "@/lib/data/metrics";
import type { Range } from "@/lib/ranges";

export type { Kpi };

export const getMetrics = async (opts: { range: Range }): Promise<Kpi[]> =>
  _kpisForRange(opts.range);
