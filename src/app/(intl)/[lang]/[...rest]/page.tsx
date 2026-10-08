import { notFound } from "next/navigation";

// Always a 404, so there is no instant UI to validate; render on the server for a real 404 status.
export const instant = false;

/**
 * Any /es or /tr address no route handles. Without this, Next answers with the root 404 — English,
 * outside the translated header and footer; throwing here shows the translated not-found instead.
 */
export default function UnknownLocalizedPage() {
  notFound();
}
