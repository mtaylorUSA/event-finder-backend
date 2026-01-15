# SESSION STARTUP CHECKLIST v0.1

---

## Purpose
     * This checklist ensures that new AI chat sessions begin work aligned with the established image generation program.
     * It prevents re-derivation of rules, stylistic drift, and unsafe or unintended outputs.
     * This checklist must be followed before producing images, documentation updates, or integration guidance.

---

## Step 1: Acknowledge the Source of Truth
     * Treat the Program Documentation as authoritative.
     * All defined domains, modifiers, constraints, and non-goals are binding.
     * Do not override or reinterpret established rules unless explicitly instructed to refine them.

---

## Step 2: Identify the Task Type
     * Determine which of the following the user is requesting:
          ** Image generation
          ** Visual rule or taxonomy refinement
          ** Program Documentation update
          ** Integration or automation guidance
     * Do not mix task types in a single response unless explicitly requested.

---

## Step 3: Extract Allowed Inputs
     * Identify only the following inputs from the user:
          ** Topic(s)
          ** Country or region(s), if specified
          ** Explicit modifiers, if provided
     * Ignore:
          ** Ad-hoc stylistic micromanagement unless it results in a new rule
          ** Requests that conflict with documented non-goals
          ** Implicit assumptions not stated by the user

---

## Step 4: Select Visual Domains and Modifiers
     * Select:
          ** One primary visual domain
          ** Optional secondary domains
          ** Zero or more modifiers
     * Apply precedence rules:
          ** Primary domain controls the physical environment
          ** Secondary domains act as overlays or constraints
     * Do not expose domain-selection reasoning unless asked.

---

## Step 5: Apply Global Constraints
     * Enforce all global rules, including but not limited to:
          ** Non-goals (no realism, no literal events, no cinematic drama)
          ** Political and safety constraints
          ** Icon budget (no more than one explicit symbolic icon per image)
          ** Governance overlay rules (background, symbolic, non-dominant)
     * If a request violates constraints, adjust output silently or explain the conflict.

---

## Step 6: Produce the Requested Output
     * Generate the requested artifact using established rules only.
     * Possible outputs include:
          ** Images
          ** Documentation diffs or new Markdown files
          ** Integration-ready guidance (no implementation code unless requested)
     * Do not invent new visual rules during output generation.

---

## Operating Principles
     * Consistency is preferred over novelty.
     * Abstraction is intentional.
     * Symbolism must be controlled and hierarchical.
     * When uncertain, default to restraint.

---

## Versioning
     * This checklist should be updated only when:
          ** Core workflow steps change
          ** Automation requirements evolve
     * Minor stylistic preferences do not require checklist updates.

---
