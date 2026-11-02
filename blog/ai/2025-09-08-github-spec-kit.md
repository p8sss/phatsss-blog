---
slug: github-spec-kit
date: 2025-09-08
title: GitHub Spec Kit
description: GitHub Spec Kit
authors: phatsss
tags: [github, spec-kit]
language: en
---
This guide will walk you through the process of setting up and using GitHub Spec Kit on a Mac with an Apple silicon chip. Spec Kit is a toolkit for a new approach called Spec-Driven Development (SDD), where you use AI agents to generate code based on a clear specification.

<!-- truncate -->
---

## Prerequisites

Before you begin, ensure your Mac with Apple silicon has the following:

-   **macOS**: A recent version of macOS.
-   **Git**: Git should be installed and configured. You can check by running `git --version` in your terminal.
-   **Python 3.11+**
-   **uv**: This is a fast Python package installer and resolver.
-   **A Coding Agent**: Spec Kit works with various AI coding agents like GitHub Copilot, Claude Code, or Gemini CLI.

---

## Step 1: Install `uv` and Spec Kit

First, you need to install `uv`, which is a prerequisite for Spec Kit. Then, use `uv` to initialize a new project with Spec Kit.

Open your **Terminal** and run the following commands:

1.  **Install uv (if you don't have it):**
    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```
2.  **Initialize a new project with Spec Kit:**
    ```bash
    uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
    ```
    Replace `<PROJECT_NAME>` with the name of your project. This command automatically sets up the project structure with the necessary templates.

---

## Step 2: Create a Specification (`/specify`)

The core of SDD is the specification. This is where you describe what you want to build in a clear and detailed manner. Use the `/specify` command with your AI coding agent (e.g., in a code editor like VS Code or a supported chat interface).

**Example:**
/specify Build a simple web application that tracks a user's daily habits, like "drink water" or "exercise." It should allow the user to add new habits, mark a habit as complete for the day, and view a history of their completed habits.

The AI will then ask clarifying questions and generate a detailed `spec.md` file, which outlines the project's features and requirements.

---

## Step 3: Generate a Technical Plan (`/plan`)

Once the specification is clear, you use the `/plan` command to create a technical implementation plan. This is where you provide details about the technology stack and architecture.

**Example:**
/plan The web app will have a React frontend and a Python backend using Flask. We'll use a local SQLite database for data storage.

The AI will use your input and the existing spec to generate a detailed `plan.md` file, which includes data models, API endpoints, and a high-level architectural overview.

---

## Step 4: Break Down into Tasks (`/tasks`)

The next step is to break down the plan into smaller, actionable tasks. Use the `/tasks` command to generate a checklist of to-dos.

**Example:**
/tasks

The AI will analyze the `plan.md` and generate a `tasks.md` file with a checklist like this:

-   [ ] **Task 1: Set up the project structure** (frontend and backend directories)
-   [ ] **Task 2: Implement the database schema** (SQLite setup and migration)
-   [ ] **Task 3: Create a RESTful API endpoint for habits** (create, read, update)
-   [ ] **Task 4: Build the React component for the main habit dashboard**
-   [ ] **Task 5: Add a history view for completed habits**
-   ...and so on.

---

## Step 5: Implement the Code (`/code`)

With the tasks defined, you can now use the `/code` command to start implementing the code for each task.

**Example:**
Let's say you want to implement Task 2. You would use a command similar to this:
/code Implement the database schema for the habit tracker. The schema should include a habits table with id, name, and completed_at fields.

The AI will use the spec, plan, and task descriptions to write the necessary code snippets or full files for you, which you can then review and commit. This process is repeated for each task until the project is complete.
