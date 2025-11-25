# Industry Research Report: Speaking the Language

**Date:** 2025-11-24
**Prepared by:** Analyst (Mary)
**Focus:** Vertical-specific terminology and workflows for Trades and Clinics.

---

## Executive Summary

**Headline:** One Platform, Two Languages.
**Key Insight:** The underlying "Event Backbone" is identical (Request -> Service -> Payment), but the *interface language* must be radically different to build trust. A Plumber will not use an app that says "Patient Intake".

---

## 1. Service Trades (The "Job" Model)

**Core Entity:** The "Job" (often linked to a "Property").
**Critical Terminology:**
*   **Dispatch:** The act of assigning a tech to a time slot *and* a location.
*   **Rough-in:** The initial installation phase (hidden work).
*   **Flat Rate vs. T&M:**
    *   *Flat Rate:* "Price Book" model. Predictable, higher margin if efficient.
    *   *Time & Materials:* "Hourly" model. Lower risk, but harder to scale.
    *   *Implication:* Xentri's quoting engine must support both "Catalog Items" (Flat Rate) and "Labor + Parts" (T&M).

**The "Happy Path" Workflow:**
1.  **Emergency Call:** "My pipe is bursting!"
2.  **Dispatch:** "Sending Joe, ETA 20 mins." (Speed is the product).
3.  **On-Site:** Tech arrives, assesses, gives **Flat Rate Quote** (via iPad).
4.  **Approval:** Customer signs on glass.
5.  **Work:** Tech fixes it.
6.  **Payment:** Credit card swipe on site.

---

## 2. Clinics / Wellness (The "Appointment" Model)

**Core Entity:** The "Encounter" (linked to a "Patient").
**Critical Terminology:**
*   **Intake:** The digital paperwork *before* the visit (History, Consent, Insurance).
*   **SOAP Note:** The legal standard for documentation.
    *   **S**ubjective: "My back hurts."
    *   **O**bjective: "Range of motion limited to 45 degrees."
    *   **A**ssessment: "Muscle strain."
    *   **P**lan: "Ice and rest."
*   **Superbill:** The receipt used for insurance reimbursement (Out-of-Network).

**The "Happy Path" Workflow:**
1.  **Booking:** Patient books online (Self-Service).
2.  **Intake:** Auto-email with "Digital Forms" (Must be HIPAA compliant).
3.  **Visit:** Therapist reviews forms, treats patient.
4.  **Documentation:** Therapist writes **SOAP Note** (often the "Open Loop" that causes anxiety).
5.  **Payment:** Card on file charged.

---

## 3. The "Translation Layer" Strategy

**Objective:** Build *one* backend, serve *two* frontends.

| Generic Concept | Trade Term | Clinic Term |
| :--- | :--- | :--- |
| **Entity** | Customer / Property | Patient |
| **Unit of Work** | Job / Work Order | Appointment / Encounter |
| **Pre-Work** | Estimate / Quote | Intake Form |
| **Record** | Service Report | SOAP Note |
| **Money** | Invoice | Superbill / Co-pay |

**Xentri's Edge:**
*   **Trades:** We win on "Flat Rate Quoting" + "Dispatch Speed".
*   **Clinics:** We win on "Automated Intake" + "AI SOAP Notes" (Voice-to-Text).

---

**Sources:**
-   *HVAC/Plumbing Glossaries (Flat Rate vs T&M)*
-   *Therapy/Chiro Glossaries (SOAP Notes, Superbills)*
-   *Workflow Diagrams for Dispatch vs. Patient Intake*
