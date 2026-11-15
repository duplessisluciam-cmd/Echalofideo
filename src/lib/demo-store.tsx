import { createContext, useContext, useReducer, type ReactNode } from "react";
import { demoReducer, initialState, type DemoAction, type DemoState } from "./incident";

const DemoContext = createContext<{ state: DemoState; dispatch: (a: DemoAction) => void } | null>(
  null,
);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, initialState);
  return <DemoContext.Provider value={{ state, dispatch }}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside DemoProvider");
  return ctx;
}
