The most important point: **our risk & audit products are used by multiple practitioner personas (risk managers, IT/cyber teams, internal auditors, compliance / legal, and executives) who follow fairly repeatable end‑to‑end workflows: identify/prioritize risk, plan work, execute assessments/audits, remediate, and report to leadership.** Below is a concise map of those users and their journeys, based only on the internal material you’ve got access to.

---

#### 1. Who are the main users?

From the enablement and persona docs, we can infer several core personas across the Risk & Audit portfolio. I’ll list them with which product(s) they primarily touch and their high‑level goals.

**Enterprise / AI Risk Essentials (early‑stage ERM)**  
AI Risk Essentials is explicitly “built for organizations with little or no formal risk program—like small teams, general counsels, lone risk managers, or compliance officers still relying on spreadsheets.”  

Primary users:

- **Lone / small‑team Risk Manager or ERM Manager**  
  - Often in small to mid‑size orgs, not large complex enterprises.  
  - Goal: stand up a structured ERM process quickly, centralize risk registers, and get a basic view of top risks without heavy configuration or long implementation.  

- **General Counsel / Chief Legal Officer / Compliance Officer**  
  - Where no dedicated risk team exists, they effectively “own” risk and need a light‑weight way to structure, document, and track risk/controls.  

- **Executive stakeholders (CFO, CRO, CAE, COO)**  
  - They consume outputs: dashboards, heatmaps, and summary risk views, rather than configuring the tool daily.  

**IT Risk Management (ITRM)**  
ITRM “centralizes and automates your IT and cybersecurity risk program” and integrates with security tools.  

Primary users:

- **CISO / Head of Information Security**  
  - Owns IT & cyber risk program and needs consolidated visibility, ability to report cyber risk to execs and the board, and show alignment to frameworks.  

- **IT Risk Manager / Cyber Risk Analyst / Security Architect**  
  - Perform day‑to‑day assessments, track vulnerabilities, map controls to risks, manage issues, and work with IT owners on remediation.  

- **Internal Audit team**  
  - Consumes IT risk outputs to scope / prioritize audits, and sometimes runs IT‑focused audits inside the same platform or tightly connected tools.  

**Internal Audit Management / Audit & Controls**  
Internal Audit Management “empowers organizations to centralize their audit and risk programs, automate workflows, and integrate advanced analytics… with a single platform.”  

Primary users:

- **Chief Audit Executive (CAE) / Head of Internal Audit**  
  - Owns the annual audit plan, needs oversight of audit status, resource utilization, and board‑ready reporting on assurance and control health.  

- **Audit Managers & Senior Auditors**  
  - Build and manage the audit plan, scope engagements, assign work, review workpapers, manage issues and follow‑up, and curate reporting.  

- **Staff Auditors / Data Analysts**  
  - Execute fieldwork, testing, evidence collection, and analytics (e.g., where integrated with ACL Analytics).  

**Cross‑cutting / leadership personas**

Across the Risk & Audit BU, typical buyers and key influencers include:

- **CRO / Director of Risk / Group Risk & Assurance / Operational Risk Manager** for broader risk programs.  
- **CFO / CAE** as primary mid‑market buyers for ERM‑type solutions.  
- **Board members & Board Committees (especially Risk & Audit Committee)** who primarily consume dashboards and reports to oversee risk, not operate the tooling.  

---

#### 2. User journeys: what they actually do, end‑to‑end

Below I’ve distilled the journeys the docs imply, without inventing UI details. Think of these as workflow “arcs” across our apps.

---

##### A. AI Risk Essentials – early‑stage ERM journey

AI Risk Essentials is framed as moving teams “from manual, fragmented processes to a more structured and collaborative approach,” and “from spreadsheets to strategic risk insights — powered by AI, delivered in 7 days.”  

Core journey for a small risk team / GC / lone risk manager:

1. **Set up a basic risk program**

   - Import or build a centralized risk register in the platform, instead of maintaining scattered spreadsheets.  
   - Configure basic risk categories, risk owners, and maybe some controls at a simple level (no heavy customization implied).  

2. **Identify and assess risks**

   - Use **guided workflows** to capture risks from different stakeholders (operations, finance, customer service, brand, etc.).  
   - Leverage **AI‑driven benchmarking using SEC 10‑K data** to sense‑check or surface additional relevant risks and severity levels.  

3. **Prioritize and visualize**

   - Generate **interactive risk heatmaps** that show likelihood/impact and help move from awareness to prioritization.  
   - Centralize risk views so executives can quickly see “top risks” and how they’re trending.  

4. **Plan & track mitigation**

   - Define mitigation actions and assign owners, deadlines, and status to move beyond pure documentation to active remediation.  

5. **Report to leadership**

   - Use dashboards and visuals (heatmaps, summaries) for conversations with executives and boards; the docs emphasize enabling “a more structured and collaborative approach” and “executive visibility,” though they don’t detail the specific report templates.  

Key experience themes: very fast onboarding, minimal configuration, heavy use of guidance and AI suggestions so non‑specialists can still run an ERM‑like process.  

---

##### B. IT Risk Management – cyber & IT risk journey

ITRM “replaces time‑consuming manual processes with a scalable cloud platform,” integrating with security tools and giving “real‑time insights.”  

Core journey for CISO / IT risk team:

1. **Consolidate IT risk & control data**

   - Replace ad‑hoc spreadsheet tracking with a centralized IT/cyber risk register and control library.  
   - Integrate with “leading security tools” (e.g., scanners, SIEM, etc.) to pull in technical signals automatically, reducing manual input.  

2. **Assess cyber risk**

   - Conduct structured risk assessments (e.g., asset‑based or process‑based) using repeatable workflows instead of email/Excel.  
   - Use external data (like the case with Moody’s Benchmarking Data) to benchmark risk posture and contextualize internal findings.  

3. **Prioritize vulnerabilities / issues**

   - Manage a centralized view of vulnerabilities and issues generated from integrated tools and assessments, with risk ratings and owners.  
   - The Risk & Audit roadmap references “AI‑supported asset prioritization” and “auto‑flag critical issues and suggest remediation” for cyber use cases, indicating future or in‑progress UX that auto‑surfaces high‑risk assets and recommended actions.  

4. **Drive remediation & continuous monitoring**

   - Assign and track remediation tasks to IT owners, moving from sporadic follow‑ups to workflow‑based, auditable remediation.  
   - The roadmap mentions “Agentic Continuous Compliance Monitoring” and “Identify and automatically remediate critical control failures in real time,” implying a journey where the system not only detects failures but triggers workflows to fix them.  

5. **Communicate risk to executives and the board**

   - Provide dashboards and summarized risk views to non‑technical leaders, supporting “cybersecurity dashboards and board reporting,” as exemplified in the case study where a client uses Diligent Risk Management for this purpose.  

Key experience themes: centralization, automation via integrations, and the roadmap shift toward AI‑driven prioritization and near‑real‑time monitoring of controls.  

---

##### C. Internal Audit Management – audit & controls journey

Internal Audit Management centralizes “audit and risk programs,” turning “manual tasks into strategic, data‑driven assurance” and is used alongside ACL Analytics in some customers.  

Core journey for CAE / audit team:

1. **Plan the audit program**

   - Build/maintain the annual or rolling audit plan within the platform instead of spreadsheets.  
   - Prioritize audits based on risk data (from ERM, IT risk, or other inputs), resources, and regulatory requirements (implied by “cover more risk areas… without adding resources”).  

2. **Scope individual audits**

   - Define objectives, scope, processes, and entities in the tool and design testing strategies; the OKR deck explicitly references core journeys for “audit planning (Q2)” and “audit execution scenarios (Q4).”  

3. **Execute audits (fieldwork)**

   - Document procedures, perform tests, attach evidence, and leverage data analytics (via ACL Analytics) to automate parts of testing.  
   - A telecom case study notes that moving from “scattered spreadsheets to an integrated solution using Diligent Internal Audit and ACL Analytics” reduced the audit cycle by ~30 days, showing a journey from manual, disjointed workpapers to integrated, automated testing and centralized documentation.  

4. **Manage findings and action plans**

   - Record issues, assign management action plans, track due dates and remediation progress in a single system.  

5. **Report to executives / audit committee**

   - Generate consolidated reports on audit status, findings, and thematic risks for leadership; the positioning talks about “deliver faster and more defensible insights, and raise leadership confidence,” which points to structured, repeatable reporting outputs.  

6. **Continuous improvement / efficiency**

   - Product OKRs explicitly target reducing “number of clicks in executing core use cases within the internal controls, audit planning and audit execution scenarios… by at least 50%,” indicating a focus on streamlining these journey steps end‑to‑end.  

Key experience themes: everything in one auditable system of record, heavy emphasis on cycle‑time reduction and analytic‑driven testing, plus UX efficiency improvements for core audit tasks.  

---

#### 3. Cross‑product journeys and the “GRC Operating System”

The vision work describes an “agent layer” that orchestrates workflows “across our products and customer workplace tools,” rather than replacing existing apps.  

This implies future or emerging journeys like:

- **Risk‑to‑Audit journey**

  - Risk manager identifies a high‑risk area in ERM / AI Risk Essentials.  
  - Workflow automatically proposes an internal audit engagement, pulls relevant context into Internal Audit Management, and assigns an owner.  

- **Cyber‑to‑Controls journey**

  - ITRM flags a high‑risk asset or control failure.  
  - An agent‑driven workflow notifies appropriate owners via Teams/Slack/email and guides them through remediation steps, with status fed back to the risk register and dashboards.  

- **Persona‑centric “workflow bundles”**

  - The operating system concept calls out packaging “core workflows per persona, creating complete role solutions” (e.g., CAE bundle, CISO bundle, Risk Manager bundle), so that a user doesn’t just use a product, they use a curated set of cross‑app workflows tailored to their role.  

These are more roadmap/vision than fully‑documented, live journeys, but they show where the UX is heading: from app‑specific, siloed journeys to cross‑product, persona‑centric flows.

---

#### 4. What’s *not* clearly documented

There are a few gaps or ambiguities in the materials:

- Exact **screen‑level flows** (e.g., which page first, which button next) for each persona are not spelled out in these docs.  
- We don’t have a consolidated “user journey map” diagram across all Risk & Audit products; instead, the journeys are implied via product descriptions, case studies, OKRs, and roadmap bullets.  
- Detailed **board‑level journey** (e.g., how a board member logs in, views risk dashboards, and drills through) is not explicitly covered here; only that leadership and board reporting is an outcome of the practitioner journeys.  

