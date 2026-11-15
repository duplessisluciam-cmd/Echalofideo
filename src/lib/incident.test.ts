import { describe, expect, it } from "vitest";
import {
  canReport,
  demoReducer,
  initialState,
  isValidPhoto,
  missingFields,
} from "./incident";

const complete = { reason: "Condiciones de higiene", description: "Cocina sucia", photoCount: 1 };

describe("CU 027 reglas de negocio", () => {
  it("motivo, descripción y foto son obligatorios", () => {
    expect(missingFields({ reason: "", description: "  ", photoCount: 0 })).toEqual([
      "reason",
      "description",
      "photos",
    ]);
  });

  it("marca solo el campo faltante", () => {
    expect(missingFields({ ...complete, photoCount: 0 })).toEqual(["photos"]);
  });

  it("con campos faltantes no se registra nada", () => {
    const next = demoReducer(initialState, { type: "submit", draft: { ...complete, description: "" } });
    expect(next).toBe(initialState);
  });

  it("al registrar: en revisión, reserva suspendida, cobro retenido, reclamo #00087", () => {
    const next = demoReducer(initialState, { type: "submit", draft: complete });
    expect(next.incident?.status).toBe("en revisión");
    expect(next.incident?.claimNumber).toBe("#00087");
    expect(next.reservationStatus).toBe("suspendida por disputa");
    expect(next.payment).toBe("retenido a favor del cocinero");
  });

  it("una reserva suspendida por disputa no se puede volver a reportar", () => {
    const suspended = demoReducer(initialState, { type: "submit", draft: complete });
    expect(canReport(suspended)).toBe(false);
    expect(demoReducer(suspended, { type: "submit", draft: complete })).toBe(suspended);
  });

  it("fotos: solo JPG/PNG de hasta 5 MB", () => {
    expect(isValidPhoto({ type: "image/png", size: 5 * 1024 * 1024 })).toBe(true);
    expect(isValidPhoto({ type: "image/jpeg", size: 5 * 1024 * 1024 + 1 })).toBe(false);
    expect(isValidPhoto({ type: "image/gif", size: 100 })).toBe(false);
  });

  it("reiniciar demo vuelve al estado inicial", () => {
    const suspended = demoReducer(initialState, { type: "submit", draft: complete });
    expect(demoReducer(suspended, { type: "reset" })).toEqual(initialState);
  });
});
