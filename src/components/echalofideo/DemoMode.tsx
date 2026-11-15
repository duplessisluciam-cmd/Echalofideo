import { FlaskConical, RotateCcw } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDemo } from "@/lib/demo-store";

/** Demo-only control, outside the main design, to simulate the service window and reset. */
export function DemoMode() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Modo demo"
          title="Modo demo"
          className="fixed bottom-3 right-3 z-30 rounded-full bg-card/90 text-muted-foreground opacity-60 shadow-soft backdrop-blur hover:opacity-100"
        >
          <FlaskConical />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 rounded-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Modo demo
        </p>
        <div className="flex items-center justify-between gap-3 py-2">
          <Label htmlFor="window-toggle" className="text-sm">
            Simular franja horaria on/off
          </Label>
          <Switch
            id="window-toggle"
            checked={state.inServiceWindow}
            onCheckedChange={() => dispatch({ type: "toggleWindow" })}
          />
        </div>
        <Button
          variant="outline"
          className="mt-2 w-full"
          onClick={() => {
            dispatch({ type: "reset" });
            navigate({ to: "/" });
          }}
        >
          <RotateCcw />
          Reiniciar demo
        </Button>
      </PopoverContent>
    </Popover>
  );
}
