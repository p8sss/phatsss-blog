import type { Roadmap } from "./types";
// .ts paths so the Node test runner can load this list without a bundler
import { backendRoadmap } from "./backend.ts";
import { devopsRoadmap } from "./devops.ts";
import { frontendRoadmap } from "./frontend.ts";

/**
 * Every roadmap on the Learn overview, in reading order: backend first, then
 * frontend, then devops. Add new roadmaps at the end. Keep each roadmap's
 * learn/<id>/_category_.json position in the same order so the sidebar matches.
 */
export const LEARN_ROADMAPS: readonly Roadmap[] = [backendRoadmap, frontendRoadmap, devopsRoadmap];
