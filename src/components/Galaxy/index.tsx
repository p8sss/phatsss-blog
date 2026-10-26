import React, { type JSX } from "react";
import { Aurora } from "@/components/glass/aurora";
import styles from "./starfield.module.css";

/**
 * Site-wide backdrop: glasscn's drifting aurora tinted as nebulae, plus a
 * starfield that fades in for dark mode (driven by --starfield-opacity).
 * Both layers are fixed behind the page and animate transform/opacity only.
 */
export default function Galaxy(): JSX.Element {
  return (
    <>
      <Aurora />
      <div className={styles.starfield} aria-hidden="true">
        <div className={`${styles.layer} ${styles.far}`} />
        <div className={`${styles.layer} ${styles.near}`} />
      </div>
    </>
  );
}
