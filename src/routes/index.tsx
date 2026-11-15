import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CalendarClock, ChefHat, Eye, MessageCircle, Search } from "lucide-react";
import { AppHeader } from "@/components/echalofideo/AppHeader";
import { KitchenIcon } from "@/components/echalofideo/KitchenIcon";
import { ReservationBadge } from "@/components/echalofideo/ReservationBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/demo-store";
import { canReport, RESERVATION } from "@/lib/incident";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Panel del cliente · Echalofideo" },
      { name: "description", content: "Tu panel de Echalofideo: servicio en curso y reservas." },
      { property: "og:title", content: "Panel del cliente · Echalofideo" },
      { property: "og:description", content: "Tu panel de Echalofideo: servicio en curso y reservas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ClientPanel,
});

// Reservas finalizadas de ejemplo (solo visuales, sin funcionalidad).
const PAST_RESERVATIONS = [
  { id: "#00118", cook: "María González", service: "Menú de pastas caseras", date: "02/06/2026", rating: "★★★★★" },
  { id: "#00109", cook: "Carlos Rodríguez", service: "Parrilla para 6 personas", date: "21/05/2026", rating: "★★★★☆" },
  { id: "#00097", cook: "Lucía Fernández", service: "Cena vegetariana 3 pasos", date: "08/05/2026", rating: "★★★★★" },
];

// IGU-027-01 · Panel del cliente
function ClientPanel() {
  const { state } = useDemo();
  const reportable = canReport(state);

  return (
    <>
      <AppHeader />
      <main className="flex-1 px-5 pb-24 pt-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Hola, {RESERVATION.client}
        </h1>

        {state.inServiceWindow ? (
          <section className="mt-6 overflow-hidden rounded-2xl bg-banner p-5 text-primary-foreground shadow-lift">
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                <KitchenIcon className="h-5 w-5" />
              </span>
              <ReservationBadge status={state.reservationStatus} onBanner />
            </div>
            <p className="mt-4 text-lg font-semibold leading-snug">
              <span className="font-extrabold">Servicio en curso</span>
              {` · ${RESERVATION.timeRange} · ${RESERVATION.service}`}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Button asChild variant="bannerGhost" size="touch">
                <Link to="/reserva">
                  <Eye />
                  Ver detalles
                </Link>
              </Button>
              {reportable ? (
                <Button asChild variant="bannerSolid" size="touch">
                  <Link to="/incidencia/nueva">
                    <AlertTriangle />
                    Reportar incidencia
                  </Link>
                </Button>
              ) : (
                <Button variant="bannerSolid" size="touch" disabled>
                  <AlertTriangle />
                  Reportar incidencia
                </Button>
              )}
            </div>
          </section>
        ) : null}

        <section className="mt-8">
          <h2 className="text-lg font-bold tracking-tight text-foreground">Reservas finalizadas</h2>
          <ul className="mt-3 space-y-3">
            {PAST_RESERVATIONS.map((r) => (
              <li key={r.id} className="rounded-2xl bg-card p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <ChefHat className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold leading-snug text-foreground">{r.cook}</p>
                      <p className="text-sm text-muted-foreground">{r.service}</p>
                    </div>
                  </div>
                  <Badge variant="confirmed">Finalizada</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarClock className="h-4 w-4" />
                    {r.date}
                  </span>
                  <span className="text-primary">{r.rating}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 flex flex-col gap-3">
          <Button variant="cta" size="touch" className="w-full">
            <Search />
            Buscar cocineros
          </Button>
          <Button variant="outline" size="touch" className="w-full">
            <MessageCircle />
            Mensajes
          </Button>
        </div>
      </main>
    </>
  );
}
