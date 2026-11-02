// _-prefixed: Docusaurus doesn't turn it into its own /Home route
import HomepageComponent from "@site/src/pages/_Home";
import type { ReactNode } from "react";

export default function Home(): ReactNode {
  return (
    <>
        <HomepageComponent />
    </>
  );
}
