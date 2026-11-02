import { getOrganisations, yearsOfExperience } from "@/components/WorkExperience/experience";
import { toYearMonth } from "@/lib/month-range";
import { useToday } from "@/hooks/use-today";

/** Whole years of professional work, from the timeline data — "{years}+ years" copy. */
export function useExperienceYears(): number {
  return yearsOfExperience(getOrganisations(), toYearMonth(useToday()));
}
