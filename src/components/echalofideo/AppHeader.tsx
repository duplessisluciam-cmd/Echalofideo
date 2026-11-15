import { ArrowLeft, ChefHat, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader({ onBack }: { onBack?: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
      {onBack ? (
        <Button variant="ghost" size="touchIcon" onClick={onBack} aria-label="Volver">
          <ArrowLeft className="!size-5" />
        </Button>
      ) : null}
      <div className="flex flex-1 items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ChefHat className="h-4 w-4" />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-foreground">Echalofideo</span>
      </div>
      <Button variant="soft" size="sm" className="rounded-full px-3">
        <UserRound />
        Perfil
      </Button>
    </header>
  );
}
