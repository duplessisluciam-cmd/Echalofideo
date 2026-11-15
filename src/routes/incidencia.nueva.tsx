import { createFileRoute, Navigate, useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { AlertTriangle, ImagePlus, X, XCircle } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AppHeader } from "@/components/echalofideo/AppHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDemo } from "@/lib/demo-store";
import { cn } from "@/lib/utils";
import {
  canReport,
  INCIDENT_REASONS,
  isValidPhoto,
  missingFields,
  RESERVATION,
  type RequiredField,
} from "@/lib/incident";

export const Route = createFileRoute("/incidencia/nueva")({
  head: () => ({
    meta: [
      { title: "Nueva incidencia · Echalofideo" },
      { name: "description", content: "Reportá una incidencia durante tu servicio de Echalofideo." },
      { property: "og:title", content: "Nueva incidencia · Echalofideo" },
      { property: "og:description", content: "Reportá una incidencia durante tu servicio de Echalofideo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewIncident,
});

interface Photo {
  id: string;
  file: File;
  url: string;
}

function FieldError({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-sm font-medium text-destructive">
      <XCircle className="h-4 w-4" />
      Completá este campo
    </p>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-foreground">
        {label} <span className="text-destructive">*</span>
      </Label>
      {children}
    </div>
  );
}

// IGU-027-03 · Nueva incidencia (+ IGU-027-05 modal de error)
function NewIncident() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const submittedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [errors, setErrors] = useState<RequiredField[]>([]);
  const [pendingErrors, setPendingErrors] = useState<RequiredField[] | null>(null);

  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  // Clear a field's highlight as soon as it becomes valid.
  useEffect(() => {
    if (errors.length === 0) return;
    const stillMissing = missingFields({ reason, description, photoCount: photos.length });
    const next = errors.filter((f) => stillMissing.includes(f));
    if (next.length !== errors.length) setErrors(next);
  }, [reason, description, photos.length, errors]);

  if (!canReport(state) && !submittedRef.current) {
    return <Navigate to="/reserva" replace />;
  }

  const goBack = () => {
    if (canGoBack) router.history.back();
    else navigate({ to: "/reserva" });
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files);
    const valid = list.filter(isValidPhoto);
    setRejectedCount(list.length - valid.length);
    setPhotos((prev) => [
      ...prev,
      ...valid.map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const submit = () => {
    const draft = { reason, description, photoCount: photos.length };
    const missing = missingFields(draft);
    if (missing.length > 0) {
      setPendingErrors(missing);
      return;
    }
    submittedRef.current = true;
    dispatch({ type: "submit", draft });
    navigate({ to: "/incidencia/registrada", replace: true });
  };

  const has = (f: RequiredField) => errors.includes(f);

  return (
    <>
      <AppHeader onBack={goBack} />
      <main className="flex-1 space-y-5 px-5 pb-24 pt-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Nueva incidencia</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {RESERVATION.id} · {RESERVATION.cook} · {RESERVATION.service}
          </p>
        </div>

        <div
          role="note"
          className="flex gap-3 rounded-2xl border border-warning bg-warning-soft p-4 text-warning-foreground"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-medium leading-relaxed">
            Al enviar, el servicio se suspende y el pago queda retenido hasta que un administrador
            audite el caso
          </p>
        </div>

        <section className="space-y-5 rounded-2xl bg-card p-4 shadow-soft">
          <Field label="Motivo" htmlFor="reason">
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger
                id="reason"
                aria-invalid={has("reason")}
                className={cn(
                  "h-12 rounded-xl text-base",
                  has("reason") && "border-2 border-destructive bg-destructive-soft",
                )}
              >
                <SelectValue placeholder="Seleccioná un motivo" />
              </SelectTrigger>
              <SelectContent>
                {INCIDENT_REASONS.map((r) => (
                  <SelectItem key={r} value={r} className="py-2.5 text-base">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError show={has("reason")} />
          </Field>

          <Field label="Descripción" htmlFor="description">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              aria-invalid={has("description")}
              className={cn(
                "rounded-xl text-base",
                has("description") && "border-2 border-destructive bg-destructive-soft",
              )}
            />
            <FieldError show={has("description")} />
          </Field>

          <Field label="Fotos">
            <div
              className={cn(
                "rounded-xl border border-dashed border-input p-3",
                has("photos") && "border-2 border-solid border-destructive bg-destructive-soft",
              )}
            >
              <div className="flex flex-wrap gap-3">
                {photos.map((p) => (
                  <div key={p.id} className="relative h-20 w-20 overflow-hidden rounded-xl shadow-soft">
                    <img src={p.url} alt={p.file.name} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(p.id)}
                      aria-label={`Quitar ${p.file.name}`}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-foreground/75 text-background"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 min-w-20 flex-col items-center justify-center gap-1 rounded-xl bg-primary-soft px-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent"
                >
                  <ImagePlus className="h-5 w-5" />+ Agregar fotos
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                multiple
                className="hidden"
                aria-label="Fotos"
                onChange={(e) => addFiles(e.target.files)}
              />
              <p
                className={cn(
                  "mt-2 text-xs",
                  rejectedCount > 0 ? "font-medium text-destructive" : "text-muted-foreground",
                )}
              >
                JPG/PNG de hasta 5 MB cada una
              </p>
            </div>
            <FieldError show={has("photos")} />
          </Field>
        </section>

        <div className="space-y-3 pt-1">
          <Button variant="destructive" size="touch" className="w-full font-semibold" onClick={submit}>
            Enviar reporte y suspender servicio
          </Button>
          <Button
            variant="outline"
            size="touch"
            className="w-full"
            onClick={() => navigate({ to: "/reserva" })}
          >
            Cancelar reporte
          </Button>
        </div>
      </main>

      <AlertDialog open={pendingErrors !== null}>
        <AlertDialogContent className="max-w-[calc(100%-2.5rem)] rounded-2xl sm:max-w-sm">
          <AlertDialogHeader className="items-center text-center sm:text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive-soft text-destructive">
              <XCircle className="h-6 w-6" />
            </span>
            <AlertDialogTitle className="sr-only">Mensaje de error</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground">
              Los campos obligatorios no fueron ingresados o son incorrectos. Por favor, intente
              nuevamente
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="h-12 w-full rounded-xl text-base"
              onClick={() => {
                setErrors(pendingErrors ?? []);
                setPendingErrors(null);
              }}
            >
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
