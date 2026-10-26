import React, { JSX } from 'react';
import styles from "./styles.module.css";
import CardPreview from './CardPreview';
import { translate } from "@docusaurus/Translate";

export default function Hero(): JSX.Element {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {translate({ id: "hero.title", message: "I'm" })}&nbsp;
          <span className={`${styles.highlight} ${styles.sunset}`}>
            @phatsss
          </span>
          ,<br />
          {translate({ id: "hero.position", message: "Software Developer" })}
        </h1>
        <p className={styles.heroDescription}>
          {translate({ id: "hero.description" })}
        </p>
        {/* <div className={styles.buttonContainer}>
          <button className={styles.primaryButton}>
            Portfolio
          </button>
          <button className={styles.secondaryButton}>
            Contact Me
          </button>
        </div> */}
      </div>
      <div className={styles.heroImageContainer}>
        <CardPreview>
          <div className={styles.avatarWrapper}>
            <img
              src="./img/phatsss-logo.svg"
              alt="Developer Avatar"
              className={styles.avatar}
            />
          </div>
        </CardPreview>
      </div>
    </section>
  );
}