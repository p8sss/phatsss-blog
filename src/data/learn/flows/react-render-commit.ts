import type { FlowDefinition } from "../../../lib/flow/types";

/** Frontend roadmap → Learn a Framework. */
export const reactRenderCommit: FlowDefinition = {
  id: "react-render-commit",
  title: "One click, from setState to pixels",
  actors: [
    { id: "browser", label: "Browser", sublabel: "events, paint", kind: "client", col: 0, row: 0 },
    { id: "component", label: "Component", sublabel: "Counter()", kind: "service", col: 1, row: 0 },
    { id: "react", label: "React", sublabel: "fiber tree", kind: "server", col: 1, row: 1 },
    { id: "dom", label: "DOM", sublabel: "real nodes", kind: "database", col: 0, row: 1 },
  ],
  steps: [
    {
      id: "click",
      from: "browser",
      to: "component",
      title: "A click runs the handler",
      payload: "onClick(event)",
      detail: "React dispatches the browser's click event to your onClick prop.",
    },
    {
      id: "set-state",
      from: "component",
      to: "react",
      title: "setState queues an update",
      payload: "setCount(c => c + 1)",
      detail:
        "The update goes into a queue on the component's fiber, and React schedules a render. count does not change yet. Every update from the same event is batched into one render.",
    },
    {
      id: "render",
      from: "react",
      to: "component",
      title: "Render: React calls your component",
      payload: "Counter() → count is 1",
      detail:
        "React processes the queue, so useState now returns 1. It calls the component that changed and its children. Rendering must be pure, because React may call it more than once.",
    },
    {
      id: "jsx",
      from: "component",
      to: "react",
      title: "The component returns new elements",
      payload: "<button>Count: 1</button>",
      variant: "response",
      detail: "JSX is plain objects describing the UI. Nothing on screen has changed yet.",
    },
    {
      id: "reconcile",
      from: "react",
      title: "Reconcile with the previous tree",
      payload: "same type, text 0 → 1",
      detail:
        "React compares the new elements with the last render. The same type in the same position keeps its DOM node and state. A different type remounts, and keys match up list items.",
    },
    {
      id: "changes",
      from: "react",
      title: "Collect the changes",
      payload: "1 text update",
      detail:
        "The result is the smallest set of DOM changes. Because nothing is visible yet, React can pause or throw away this work, for example when a more urgent update interrupts a transition.",
    },
    {
      id: "commit",
      from: "react",
      to: "dom",
      title: "Commit: apply the DOM changes",
      payload: 'textContent = "Count: 1"',
      detail:
        "The commit phase writes every change in one synchronous pass. It cannot be interrupted, so the user never sees half an update.",
    },
    {
      id: "layout",
      from: "react",
      to: "component",
      title: "Attach refs, run layout effects",
      payload: "useLayoutEffect(…)",
      detail:
        "React sets refs, then runs useLayoutEffect callbacks before the browser paints. Measuring the DOM here avoids a visible flicker, but slow code here delays the frame.",
    },
    {
      id: "effect",
      from: "react",
      to: "component",
      title: "Run passive effects",
      payload: "useEffect(…)",
      detail:
        "useEffect callbacks run after the commit. For a click like this one, React may run them before the browser paints, so the event system sees their result. Effects not caused by an interaction usually run after paint.",
    },
    {
      id: "paint",
      from: "dom",
      to: "browser",
      title: "The browser paints",
      payload: "style, layout, paint",
      detail:
        "Only now do pixels change. React calls this painting, to keep it apart from its own word, rendering.",
    },
  ],
};
