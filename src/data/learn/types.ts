/**
 * The learning index borrows roadmap.sh's taxonomy (roadmap → section → topic)
 * but only lists topics picked for this site, each in the format that fits it.
 */

/** flow: "what happens when…" questions. compare: picking between tools. reading: neither, so link out. */
export type TopicFormat = "flow" | "compare" | "reading";

export interface LearnTopic {
  readonly id: string;
  readonly title: string;
  /** The question the topic answers, phrased the way the flow or table answers it. */
  readonly question: string;
  readonly format: TopicFormat;
  /** Site path once the topic is published; absent while planned or for reading topics. */
  readonly to?: string;
  /**
   * Id of the roadmap whose page this topic borrows, such as Security listing
   * Backend's JWT page. The page lives in that roadmap's folder.
   */
  readonly crossListFrom?: string;
}

export interface RoadmapSection {
  readonly id: string;
  /** Section name as it appears on roadmap.sh. */
  readonly title: string;
  readonly topics: readonly LearnTopic[];
}

export interface Roadmap {
  readonly id: string;
  readonly title: string;
  readonly href: string;
  readonly sections: readonly RoadmapSection[];
}
