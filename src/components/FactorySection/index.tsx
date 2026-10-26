import { JSX, lazy, Suspense } from "react";
import { translate } from "@docusaurus/Translate";
import { SparklesIcon } from "@/components/ui/icons";
import SectionHeading from "../SectionHeading";

const FactoryCanvas = lazy(() => import("./FactoryCanvas"));

function FactoryFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full border border-white/10 bg-white/5">
        <SparklesIcon size={22} className="text-slate-300" />
      </div>
    </div>
  );
}

export default function FactorySection(): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20">
      <SectionHeading
        eyebrow={
          <>
            <SparklesIcon size={14} /> Code Factory
          </>
        }
        title={translate({
          id: "factory.title",
          message: "Where ideas are manufactured",
        })}
        description={translate({
          id: "factory.description",
          message:
            "A live 3D view of the machinery behind the blog — conveyor, robotic arm, and laser sensor, all rendering right in your browser.",
        })}
      />

      <div className="relative h-[400px] overflow-hidden rounded-2xl border border-border/50 shadow-xl md:h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0a0e1c] to-purple-950" />
        <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_30%,rgba(79,70,229,0.25),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.2),transparent_45%)]" />

        <Suspense fallback={<FactoryFallback />}>
          <FactoryCanvas />
        </Suspense>

        <div className="pointer-events-none absolute inset-x-0 top-4 flex flex-wrap justify-center gap-2 px-4">
          {["Conveyor", "Robot Arm", "Laser Sensor"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100 backdrop-blur-sm">
              {label}
            </span>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <span className="rounded-full bg-black/30 px-3 py-1 text-[11px] text-slate-300 backdrop-blur-sm">
            Drag to orbit · auto-rotating
          </span>
        </div>
      </div>
    </section>
  );
}
