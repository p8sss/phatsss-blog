import React, { JSX } from 'react';
import styles from "./styles.module.css";
import CardPreview from './CardPreview';
import { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";

import { Button } from "@/components/glass/button";
import { ArrowRight01Icon } from "@/components/ui/icons";

export default function Hero(): JSX.Element {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {translate({ id: "hero.title", message: "I'm" })}&nbsp;
          {/* nowrap: the comma never wraps away from the handle */}
          <span className="whitespace-nowrap">
            <span className={`${styles.highlight} ${styles.sunset}`}>@phatsss</span>,
          </span>
          <br />
          {translate({ id: "hero.position", message: "Software Developer" })}
        </h1>
        <p className={styles.heroDescription}>
          {translate({ id: "hero.description" })}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="prominent" size="lg" className={styles.ctaPrimary}>
            <Link to="/blog">
              {translate({ id: "hero.cta.blog", message: "Read the blog" })}
              <ArrowRight01Icon size={18} data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="glass" size="lg">
            <Link to="#portfolio">
              {translate({ id: "hero.cta.work", message: "View my work" })}
            </Link>
          </Button>
        </div>
      </div>
      <div className={styles.heroImageContainer}>
        <CardPreview>
          <div className={styles.avatarWrapper}>
            <img
              src="./img/phatsss-logo.svg"
              alt="Developer Avatar"
              width={300}
              height={300}
              className={styles.avatar}
            />
          </div>
        </CardPreview>
      </div>
    </section>
  );
}