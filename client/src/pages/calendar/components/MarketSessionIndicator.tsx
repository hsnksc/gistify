import { Badge } from "@/components/ui/badge";
import { getCurrentMarketSession } from "../calendar.utils";
import type { AppLanguage } from "@/lib/i18n";

export function MarketSessionIndicator({
  language,
}: {
  language: AppLanguage;
}) {
  const session = getCurrentMarketSession(language);
  return (
    <Badge variant="outline" className={session.className}>
      {session.label}
    </Badge>
  );
}
