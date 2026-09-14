import { ZodError } from "zod";
import { ActionError } from "@/lib/auth";

export type ActionResult<T = undefined> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function success<T>(data: T, message?: string): ActionResult<T> {
  return { ok: true, data, message };
}

export function failure(error: unknown, fallback = "Something went wrong. Please try again."): ActionResult<never> {
  if (error instanceof ZodError) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of error.issues) {
      const key = issue.path.join(".") || "form";
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: error.issues[0]?.message ?? "Please check the form.", fieldErrors };
  }
  if (error instanceof ActionError) {
    return { ok: false, error: error.message };
  }
  const code = (error as { code?: string })?.code;
  if (code === "23505") {
    return { ok: false, error: "That slug is already in use. Please choose another one." };
  }
  console.error("[action]", error);
  return { ok: false, error: fallback };
}
