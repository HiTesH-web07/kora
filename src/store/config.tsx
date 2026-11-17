"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { PublicSettings } from "@/lib/settings";

const Ctx = createContext<PublicSettings>({ whatsappNumber: "", instagramUrl: "", location: "", hours: "" });
export const ConfigProvider = ({ value, children }: { value: PublicSettings; children: ReactNode }) => <Ctx.Provider value={value}>{children}</Ctx.Provider>;
export const useConfig = () => useContext(Ctx);
