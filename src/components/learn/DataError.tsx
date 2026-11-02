import type { JSX } from "react";
import { Card } from "@/components/glass/card";

/** Shown in place of a flow or comparison whose data fails validation. */
export function DataError({ message, errors }: { readonly message: string; readonly errors: readonly string[] }): JSX.Element {
  return (
    <Card material="solid" className="my-6 gap-2 border-destructive/40 px-4">
      <p className="!m-0 font-semibold text-destructive-ink">{message}</p>
      <ul className="!m-0 !pl-5 text-sm text-muted-foreground">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </Card>
  );
}
