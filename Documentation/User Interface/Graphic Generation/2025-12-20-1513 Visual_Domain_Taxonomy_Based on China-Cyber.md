
# VISUAL DOMAIN TAXONOMY
---

# DOCUMENT PURPOSE
     * This section defines the authoritative Visual Domain Taxonomy for automated image generation.
     * It is derived directly from the canonical China/Cyber reference image.
     * It ensures stylistic consistency, controlled flexibility, and prevents cinematic or narrative drift.
     * All automated image generation must conform to these rules unless explicitly overridden by documented updates.

---

# CANONICAL STYLE ANCHOR
     * Editorial Abstract – Institutional Systems
     * This is the root visual domain.
     * All other visual domains inherit from this anchor.

     * Core Intent:
          ** Represent systems, governance, control, and strategic forces
          ** Avoid depiction of specific events, moments, or stories

     * Non‑Negotiable Properties:
          ** Abstract
          ** Symbolic
          ** Institutional
          ** Non‑narrative
          ** Non‑emotive
          ** Atemporal

     * Any image implying when something happened violates this domain.

---

# ABSTRACTION AXIS (PRIMARY CONTROL)
     * Abstraction Level (0–100):
          ** 75–90: Canonical (China/Cyber reference)
          ** 65–75: Controlled symbolic realism (acceptable variation)
          ** Below 65: Literal or scene‑based depiction (forbidden)

     * Rules:
          ** No physical environments
          ** No realistic depth or camera perspective
          ** Objects must function as symbols, not literal depictions

---

# NARRATIVE SUPPRESSION RULES
     * Narrative Energy (0–100):
          ** 0–20: Static, institutional (canonical)
          ** 20–30: Conceptual tension (allowed)
          ** Above 30: Story, conflict moment, or sequence (forbidden)

     * Hard Constraints:
          ** No before/after framing
          ** No confrontation staging
          ** No implied outcomes
          ** No cause‑and‑effect visuals

     * Cracks, explosions, ruptures, or motion imply narrative and are disallowed.

---

# CINEMATIC SUPPRESSION RULES
     * Cinematic Intensity (0–100):
          ** 0–25: Editorial illustration (canonical)
          ** 25–35: Poster‑like contrast (allowed)
          ** Above 35: Cinematic or film‑still style (forbidden)

     * Disallowed Techniques:
          ** Volumetric lighting
          ** Explosions, sparks, fire
          ** Motion blur
          ** Photorealistic rendering
          ** Atmospheric smoke or debris

---

# SYMBOLIC LANGUAGE RULES
     * Icon Budget:
          ** One dominant symbol
          ** Up to three secondary supporting symbols

     * Dominant Symbol Examples:
          ** Lock
          ** Shield
          ** Node
          ** Abstract structure
          ** Central geometric form

     * Supporting Symbol Examples:
          ** Stars
          ** Circuitry
          ** Grids
          ** Data lines
          ** Static silhouettes

     * Rules:
          ** No text
          ** No logos
          ** No numbers
          ** No official seals or emblems

---

# NATIONAL & MILITARY REPRESENTATION
     * Explicitly Allowed:
          ** National flags and colors
          ** Government buildings
          ** Military hardware

     * Representation Constraints:
          ** Must be static
          ** Must be non‑operational
          ** Must be integrated into abstraction
          ** Must not dominate composition

     * Forbidden:
          ** Weapons firing
          ** Active combat
          ** Tactical scenes
          ** Battlefields

     * Military hardware may appear as a symbol, not as part of an action scene.

---

# COMPOSITION & STRUCTURE
     * Canonical Composition:
          ** Central or near‑central anchor
          ** Layered abstract background
          ** Balanced asymmetry
          ** No horizon line
          ** No ground/sky separation

     * Scale Rules:
          ** Anchor occupies ~25–40% of frame
          ** Supporting elements remain subordinate
          ** Must remain legible at 80px thumbnail width

---

# COLOR & MATERIAL SYSTEM
     * Color Logic:
          ** Warm hues: authority, governance
          ** Cool hues: digital systems
          ** High contrast without dramatic lighting

     * Surface Treatment:
          ** Subtle grain
          ** Poster‑style texture
          ** Digital patterning

     * Disallowed:
          ** Glossy realism
          ** Heavy grunge
          ** Photographic textures

---

# EMOTIONAL GOVERNANCE
     * Allowed Tone:
          ** Neutral
          ** Serious
          ** Analytical
          ** Institutional

     * Forbidden Tone:
          ** Fear
          ** Anger
          ** Triumph
          ** Urgency
          ** Crisis framing

     * Images should communicate policy and systems, not threat or spectacle.

---

# CANONICAL DEFAULT GENERATION PROFILE
     * Default Settings:
          ** visual_domain: editorial_abstract_institutional
          ** abstraction_level: 80
          ** narrative_energy: 15
          ** cinematic_intensity: 25
          ** action_state: static_only
          ** symbol_density: medium
          ** icon_budget: 1 + ≤3
          ** national_symbols: allowed
          ** military_hardware: allowed (symbolic, static)
          ** text: forbidden
          ** people: forbidden

---

# GOVERNANCE NOTE
     * This taxonomy is authoritative.
     * Any deviation requires an explicit documented update.
     * Consistency and restraint are preferred over novelty.
