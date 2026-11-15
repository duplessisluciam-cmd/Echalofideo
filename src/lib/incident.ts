// Pure business rules for CU 027 "Reportar incidencia". UI-free so they can be unit tested.

export type ReservationStatus = "confirmada" | "suspendida por disputa";

export const INCIDENT_REASONS = [
  "Equipamiento distinto al checklist",
  "El cocinero no se presentó",
  "Ingredientes distintos a los acordados",
  "Condiciones de higiene",
  "Otro",
] as const;

export type IncidentReason = (typeof INCIDENT_REASONS)[number];

export const CLAIM_NUMBER = "#00087";
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png"];

export interface Incident {
  claimNumber: string;
  status: "en revisión";
  reason: IncidentReason;
  description: string;
  photoCount: number;
}

export interface DemoState {
  reservationStatus: ReservationStatus;
  inServiceWindow: boolean;
  incident: Incident | null;
  payment: "pendiente" | "retenido a favor del cocinero";
}

export const initialState: DemoState = {
  reservationStatus: "confirmada",
  inServiceWindow: true,
  incident: null,
  payment: "pendiente",
};

export interface IncidentDraft {
  reason: string;
  description: string;
  photoCount: number;
}

export type RequiredField = "reason" | "description" | "photos";

/** Returns the required fields that are missing or invalid (motivo, descripción, fotos). */
export function missingFields(draft: IncidentDraft): RequiredField[] {
  const missing: RequiredField[] = [];
  if (!(INCIDENT_REASONS as readonly string[]).includes(draft.reason)) missing.push("reason");
  if (draft.description.trim() === "") missing.push("description");
  if (draft.photoCount < 1) missing.push("photos");
  return missing;
}

export function canReport(state: DemoState): boolean {
  return state.reservationStatus === "confirmada";
}

export function isValidPhoto(file: { type: string; size: number }): boolean {
  return ALLOWED_PHOTO_TYPES.includes(file.type) && file.size <= MAX_PHOTO_BYTES;
}

export type DemoAction =
  | { type: "submit"; draft: IncidentDraft }
  | { type: "toggleWindow" }
  | { type: "reset" };

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "submit": {
      if (!canReport(state) || missingFields(action.draft).length > 0) return state;
      return {
        ...state,
        reservationStatus: "suspendida por disputa",
        payment: "retenido a favor del cocinero",
        incident: {
          claimNumber: CLAIM_NUMBER,
          status: "en revisión",
          reason: action.draft.reason as IncidentReason,
          description: action.draft.description.trim(),
          photoCount: action.draft.photoCount,
        },
      };
    }
    case "toggleWindow":
      return { ...state, inServiceWindow: !state.inServiceWindow };
    case "reset":
      return initialState;
  }
}

export const RESERVATION = {
  id: "#00124",
  client: "Martina",
  cook: "Juan Pérez",
  rating: "★★★★☆",
  cookBookings: 10,
  date: "15/06/2026",
  startTime: "19:00",
  timeRange: "19:00 a 22:00 hs",
  service: "Cena italiana 3 pasos",
  address: "Av. Santa Fe 1234, CABA",
  equipment: ["horno eléctrico", "4 hornallas", "licuadora sí", "heladera sí"],
};
