import type { FlowDefinition } from "../../../lib/flow/types";

/** AI Engineer roadmap → Ollama. */
export const ollamaLocal: FlowDefinition = {
  id: "ollama-local",
  title: "ollama run, from first pull to a streamed answer",
  actors: [
    { id: "cli", label: "ollama CLI", sublabel: "your terminal", kind: "client", col: 0, row: 0 },
    { id: "server", label: "ollama serve", sublabel: "127.0.0.1:11434", kind: "server", col: 1, row: 0 },
    { id: "registry", label: "Registry", sublabel: "ollama.com", kind: "external", col: 2, row: 0 },
    { id: "disk", label: "Model store", sublabel: "~/.ollama/models", kind: "database", col: 1, row: 1 },
    { id: "runner", label: "Runner", sublabel: "GPU or CPU", kind: "model", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "show",
      from: "cli",
      to: "server",
      title: "Ask the server about the model",
      payload: "POST /api/show gemma4",
      detail:
        "The CLI is only a client. All the work happens in a local server that listens on port 11434, the same API your own code can call.",
    },
    {
      id: "missing",
      from: "server",
      to: "cli",
      title: "Not on this machine yet",
      payload: "404 model not found",
      variant: "response",
      detail: "If the model is already downloaded, the next four steps are skipped.",
    },
    {
      id: "pull",
      from: "cli",
      to: "server",
      title: "Pull it",
      payload: "POST /api/pull gemma4",
      detail: "A name without a tag means the latest tag, the same convention as container images.",
    },
    {
      id: "manifest",
      from: "server",
      to: "registry",
      title: "Fetch the manifest",
      payload: "GET manifest gemma4:latest",
      detail: "A model is packaged like a container image: a manifest that lists layers by their sha256 digest.",
    },
    {
      id: "layers",
      from: "registry",
      to: "server",
      title: "Get the layer list",
      payload: "weights, template, params",
      variant: "response",
      detail:
        "The big layer is the weights in GGUF format, usually quantized to fewer bits per weight. Small layers hold the chat template, default parameters and licence.",
    },
    {
      id: "blobs",
      from: "server",
      to: "disk",
      title: "Download and verify the blobs",
      payload: "blobs/sha256-… (gigabytes)",
      detail:
        "Each blob is checked against its digest and stored once. Two tags that share a layer share the file on disk.",
    },
    {
      id: "load",
      from: "cli",
      to: "server",
      title: "Ask for the model to be loaded",
      payload: "POST /api/generate, no prompt",
      detail: "In interactive mode, an empty generate request loads the model before you type anything.",
    },
    {
      id: "fit",
      from: "server",
      title: "Plan where the layers go",
      payload: "fits in VRAM? else split",
      detail:
        "The scheduler estimates memory for the weights and the context. Layers that do not fit on the GPU run on the CPU, which is much slower.",
    },
    {
      id: "spawn",
      from: "server",
      to: "runner",
      title: "Start a runner process",
      payload: "model path + num_ctx",
      detail:
        "Inference runs in a separate runner process. GGUF models are served by llama.cpp's llama-server. The context length is fixed when the model loads, so changing it means a reload.",
    },
    {
      id: "weights",
      from: "disk",
      to: "runner",
      title: "Load the weights",
      payload: "read GGUF tensors",
      detail: "This is the slow part of a cold start. Once loaded, the model stays in memory for 5 minutes after its last use by default.",
    },
    {
      id: "chat",
      from: "cli",
      to: "server",
      title: "Send your message",
      payload: "POST /api/chat",
      detail: "Streaming is on by default. The CLI keeps the conversation and resends it on every turn.",
    },
    {
      id: "template",
      from: "server",
      to: "runner",
      title: "Apply the chat template",
      payload: "messages → model's prompt format",
      detail:
        "Each model family expects its own special tokens around roles. The template from the manifest renders them, then the runner tokenizes and generates.",
    },
    {
      id: "tokens",
      from: "runner",
      to: "server",
      title: "Generate token by token",
      payload: "\"The\" \" sky\" \" is\" …",
      variant: "response",
      detail: "Each sampled token comes back as soon as it is ready. Speed depends mostly on memory bandwidth, not raw compute.",
    },
    {
      id: "ndjson",
      from: "server",
      to: "cli",
      title: "Stream newline-delimited JSON",
      payload: "{\"message\":…,\"done\":false}",
      variant: "response",
      detail:
        "Each line is one JSON object with the next piece of text. The last line has done set to true and includes token counts and timings.",
    },
  ],
};
