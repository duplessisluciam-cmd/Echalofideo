import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { BellRing, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/echalofideo/AppHeader";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo-store";
import { capitalize } from "@/lib/utils";

export const Route = createFileRoute("/incidencia/registrada")({
  head: () => ({
    meta: [
      { title: "Incidencia registrada · Echalofideo" },
      { name: "description", content: "Confirmación y número de reclamo de tu incidencia." },
      { property: "og:title", content: "Incidencia registrada · Echalofideo" },
      { property: "og:description", content: "Confirmación y número de reclamo de tu incidencia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: IncidentRegistered,
});

function Item({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-[15px] font-semibold text-foreground">{children}</dd>
    </div>
  );
}

// IGU-027-04 · Incidencia registrada
function IncidentRegistered() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const toPanel = () => navigate({ to: "/" });

  if (!state.incident) return <Navigate to="/" replace />;

  return (
    <>
      <AppHeader onBack={toPanel} />
      <main className="flex flex-1 flex-col px-5 pb-24 pt-10">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-20 w-20 animate-pop-in items-center justify-center rounded-full bg-success text-success-foreground shadow-soft">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight">
            Listo, se registró la incidencia
          </h1>
        </div>

        <dl className="mt-8 divide-y divide-border rounded-2xl bg-card px-4 shadow-soft">
          <Item label="N° de reclamo">
            <span className="text-lg text-success">{state.incident.claimNumber}</span>
          </Item>
          <Item label="Reserva">{capitalize(state.reservationStatus)}</Item>
          <Item label="Cobro">{capitalize(state.payment)}</Item>
          <Item label="Estado de incidencia">{capitalize(state.incident.status)}</Item>
        </dl>

        <p className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-success-soft px-4 py-3 text-sm font-medium text-foreground">
          <BellRing className="h-4 w-4 text-success" />
          Se avisó al administrador y al cocinero
        </p>

        <Button variant="cta" size="touch" className="mt-8 w-full" onClick={toPanel}>
          Ir al panel
        </Button>
      </main>
    </>
  );
}
