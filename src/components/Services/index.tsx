import { JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { Layers02Icon } from "@/components/ui/icons";
import SectionHeading from "../SectionHeading";
import { ServiceCard } from "./ServiceCard";
import { SERVICES } from "./services";

export default function Services(): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-5xl px-0 py-14 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={
          <>
            <Layers02Icon size={14} /> {translate({ id: "service.title" })}
          </>
        }
        title={translate({ id: "service.title" })}
        description={translate({ id: "service.description" })}
      />

      {/* phones: compact rows · sm: 2 columns · lg: bento, the first service a 2×2 feature */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {SERVICES.map((service, index) => (
          <ServiceCard key={service.title} service={service} position={index + 1} featured={index === 0} />
        ))}
      </div>
    </section>
  );
}
