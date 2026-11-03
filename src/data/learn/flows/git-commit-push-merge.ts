import type { FlowDefinition } from "../../../lib/flow/types";

/** Frontend roadmap → Version Control. */
export const gitCommitPushMerge: FlowDefinition = {
  id: "git-commit-push-merge",
  title: "A change from git add to a merged pull request",
  actors: [
    { id: "worktree", label: "Working tree", sublabel: "your files", kind: "client", col: 0, row: 0 },
    { id: "index", label: "Index", sublabel: "staging area", kind: "cache", col: 1, row: 0 },
    { id: "objects", label: "Object store", sublabel: ".git/objects", kind: "database", col: 1, row: 1 },
    { id: "remote", label: "Remote", sublabel: "GitHub or GitLab", kind: "server", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "blob",
      from: "worktree",
      to: "objects",
      title: "git add hashes the file into a blob",
      payload: "blob 3b18e5",
      detail:
        "Git compresses the file's content and stores it under a hash of a short header plus that content. The same content always gets the same hash, so identical files are stored once.",
    },
    {
      id: "stage",
      from: "worktree",
      to: "index",
      title: "Record the blob in the index",
      payload: "src/app.js → 3b18e5",
      detail:
        "The index is the draft of your next commit. It lists every tracked path with the hash of its blob.",
    },
    {
      id: "tree",
      from: "index",
      to: "objects",
      title: "git commit writes trees",
      payload: "tree 9c1d2a",
      detail:
        "Git turns the index into one tree object per directory. A tree lists names, file modes and hashes. Unchanged files reuse their existing blobs, so a full snapshot stays cheap.",
    },
    {
      id: "commit",
      from: "objects",
      title: "Write the commit object",
      payload: "commit a1f9e0",
      detail:
        "The commit points at the top tree and at its parent commit, plus author, committer and message. Its hash covers all of that, so rewriting any commit changes every hash after it.",
    },
    {
      id: "move-branch",
      from: "objects",
      title: "Move the branch forward",
      payload: "fix-login → a1f9e0",
      detail:
        "A branch is only a name that holds one commit hash. Committing moves the current branch to the new commit. HEAD records which branch you are on.",
    },
    {
      id: "connect",
      from: "objects",
      to: "remote",
      title: "git push opens a connection",
      payload: "git push origin fix-login",
      detail:
        "Git starts send-pack locally, which talks to receive-pack on the server over SSH or HTTPS.",
    },
    {
      id: "advertise",
      from: "remote",
      to: "objects",
      title: "The remote lists its refs",
      payload: "refs/heads/main 7d3c41",
      variant: "response",
      detail:
        "The server sends every branch it has and the commit each one points at. Your Git compares that with local history to work out what the server is missing.",
    },
    {
      id: "update",
      from: "objects",
      to: "remote",
      title: "Ask to create or move a ref",
      payload: "000000 → a1f9e0 fix-login",
      detail:
        "Each line names a ref with its old and new hash. All zeros means the branch is new. Git refuses to move an existing branch unless the new commit descends from the old one, or you force the push.",
    },
    {
      id: "pack",
      from: "objects",
      to: "remote",
      title: "Send only the missing objects",
      payload: "packfile: 4 objects",
      detail:
        "One packfile carries the new commit, the root and src trees, and the blob. Objects the server already has are never sent again, because the hashes identify them.",
    },
    {
      id: "accept",
      from: "remote",
      title: "Unpack, check and update the ref",
      payload: "unpack ok",
      detail:
        "The server checks the objects, runs its hooks and branch protection rules, then points fix-login at a1f9e0.",
    },
    {
      id: "accepted",
      from: "remote",
      to: "objects",
      title: "Report the result",
      payload: "ok refs/heads/fix-login",
      variant: "response",
      detail: "Your Git also moves origin/fix-login, its local record of where the remote branch now points.",
    },
    {
      id: "merge",
      from: "remote",
      title: "Merge the pull request",
      payload: "commit 5e2b77, 2 parents",
      detail:
        "A merge commit has two parents: the tip of main and the tip of your branch. main then moves to it. Squash and rebase merges write new commits with one parent instead.",
    },
    {
      id: "fetch",
      from: "remote",
      to: "objects",
      title: "Fetch the merge back",
      payload: "origin/main → 5e2b77",
      variant: "response",
      detail:
        "Your local main does not move on its own. git fetch downloads the merge commit and moves origin/main. Running git pull on main also moves your local main to it.",
    },
  ],
};
