import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, CalendarClock, ChefHat, MapPin, UtensilsCrossed, Check } from "lucide-react";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/echalofideo/AppHeader";
import { ReservationBadge } from "@/components/echalofideo/ReservationBadge";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo-store";
import { capitalize } from "@/lib/utils";
import { canReport, RESERVATION } from "@/lib/incident";

export const Route = createFileRoute("/reserva")({
  head: () => ({
    meta: [
      { title: "Reserva #00124 · Echalofideo" },
      { name: "description", content: "Detalles de tu reserva con el cocinero en Echalofideo." },
      { property: "og:title", content: "Reserva #00124 · Echalofideo" },
      { property: "og:description", content: "Detalles de tu reserva con el cocinero en Echalofideo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReservationDetails,
});

function Row({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <div className="text-[15px] leading-snug text-foreground">{children}</div>
    </li>
  );
}

// IGU-027-02 · Detalles de reserva
function ReservationDetails() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const reportable = canReport(state);
  const back = () => navigate({ to: "/" });

  return (
    <>
      <AppHeader onBack={back} />
      <main className="flex-1 space-y-5 px-5 pb-24 pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight">Reserva {RESERVATION.id}</h1>
          <ReservationBadge status={state.reservationStatus} />
        </div>

        <section className="rounded-2xl bg-card px-4 shadow-soft">
          <ul className="divide-y divide-border">
            <Row icon={<ChefHat />}>
              <span className="font-semibold">{RESERVATION.cook}</span>{" "}
              <span className="text-primary">{RESERVATION.rating}</span>{" "}
              <span className="text-muted-foreground">({RESERVATION.cookBookings} reservas)</span>
            </Row>
            <Row icon={<CalendarClock />}>
              {RESERVATION.date} · {RESERVATION.startTime} hs
            </Row>
            <Row icon={<UtensilsCrossed />}>{RESERVATION.service}</Row>
            <Row icon={<MapPin />}>{RESERVATION.address}</Row>
          </ul>
        </section>

        <section className="rounded-2xl bg-card p-4 shadow-soft">
          <h2 className="text-base font-bold">Equipo que declaraste</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {RESERVATION.equipment.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm text-foreground"
              >
                <Check className="h-4 w-4 shrink-0 text-success" />
                {capitalize(item)}
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-3 pt-2">
          {reportable ? (
            <Button asChild variant="cta" size="touch" className="w-full">
              <Link to="/incidencia/nueva">
                <AlertTriangle />
                Reportar incidencia
              </Link>
            </Button>
          ) : (
            <Button variant="cta" size="touch" className="w-full" disabled>
              <AlertTriangle />
              Reportar incidencia
            </Button>
          )}
          <Button variant="outline" size="touch" className="w-full" onClick={back}>
            Volver
          </Button>
        </div>
      </main>
    </>
  );
}
