import { Badge } from "@/components/ui/badge";
import type { ReservationStatus } from "@/lib/incident";
import { capitalize } from "@/lib/utils";

export function ReservationBadge({
  status,
  onBanner = false,
}: {
  status: ReservationStatus;
  onBanner?: boolean;
}) {
  const variant = onBanner ? "onBanner" : status === "confirmada" ? "confirmed" : "disputed";
  return <Badge variant={variant}>{capitalize(status)}</Badge>;
}
