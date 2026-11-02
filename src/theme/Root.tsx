import React, { type ReactNode } from "react";
import "@fontsource-variable/nunito";
import Galaxy from "@/components/Galaxy";

/** App-wide wrapper: loads the self-hosted Nunito and mounts the galaxy backdrop once. */
export default function Root({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      <Galaxy />
      {children}
    </>
  );
}
