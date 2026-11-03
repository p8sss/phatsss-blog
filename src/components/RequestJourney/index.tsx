import { useCallback, useState, type JSX } from "react";
import { translate } from "@docusaurus/Translate";
import { GlobeIcon } from "@/components/ui/icons";
import { JOURNEY_STAGES } from "@/data/home/request-journey";
import SectionHeading from "../SectionHeading";
import { JourneyPlayer } from "./JourneyPlayer";

/**
 * Home page section: how a web page view and an app call travel through a
 * system as it grows from one server to an enterprise setup, one stage at a time.
 */
export default function RequestJourney(): JSX.Element {
  const [index, setIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const select = useCallback((target: number) => {
    setAutoAdvance(false);
    setIndex(target);
  }, []);
  const advance = useCallback(() => setIndex((current) => (current + 1) % JOURNEY_STAGES.length), []);
  const stopAutoAdvance = useCallback(() => setAutoAdvance(false), []);

  return (
    <section className="mx-auto w-full max-w-5xl py-20 sm:px-6">
      <SectionHeading
        eyebrow={
          <>
            <GlobeIcon size={14} /> {translate({ id: "journey.eyebrow", message: "Request Journey" })}
          </>
        }
        title={translate({ id: "journey.title", message: "From one server to enterprise scale" })}
        description={translate({
          id: "journey.description",
          message:
            "Follow one server-rendered page view and one app call through five stages of growth. Each stage adds traffic until something breaks, and the next stage fixes it, security included.",
        })}
      />
      <JourneyPlayer
        stages={JOURNEY_STAGES}
        index={index}
        autoAdvance={autoAdvance}
        onSelect={select}
        onAdvance={advance}
        onInteract={stopAutoAdvance}
      />
    </section>
  );
}
