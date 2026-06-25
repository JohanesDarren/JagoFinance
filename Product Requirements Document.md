# **Product Requirements Document (PRD) — Jago Finance (Web App)**

## **Document Info**

| Field | Value |
| :---- | :---- |
| **Project Name** | Jago Finance: AI-Powered Startup Finance Dashboard |
| **Version** | v4.0 (Final Comprehensive Edition) |
| **Status** | Approved |
| **Author** | Full-Stack Developer (Vibe Coding) |
| **Team** | JagoAI Core Team |
| **Created** | 25/06/2026 |
| **Last Updated** | 25/06/2026 |
| **Target Launch** | 25/08/2026 |

## **1\. Overview**

### **1.1 Problem Statement**

Tracking company expenses and generating financial outcome reports requires massive amounts of time and manual effort. At the end of every month, finance teams or founders waste days chasing down lost receipts, manually deciphering crumpled paper, and typing data into complex Excel spreadsheets just to understand where the company's money went. This delayed reporting makes real-time cash flow visibility impossible and drains morale.

**Core Pain Points:**

* **The Reporting Nightmare:** Building end-of-month spending reports is incredibly tedious, stressful, and prone to human error.  
* **Data Entry Bottlenecks:** Finance admins must manually type out merchant names, dates, and amounts from blurry receipt photos sent via WhatsApp or email.  
* **Delayed Visibility:** Because reporting takes so much effort, founders only see their financial status weeks after the money has already been spent, preventing proactive decision-making.

### **1.2 Proposed Solution**

We are building the **Jago Finance Web Dashboard** — an all-in-one web-based financial application designed to automate expense tracking and reporting for startups. By utilizing **Hermes AI**, the app instantly extracts data from uploaded receipts, auto-categorizes the expense, and updates the company's central cash ledger in real-time. This effectively generates reports with zero manual data entry. The entire backend relies on **Supabase** for robust, real-time database management and authentication.

### **1.3 Value Proposition**

| For | Who | We offer | Unlike | Because |
| :---- | :---- | :---- | :---- | :---- |
| Startup Founders & Operations Managers | Are exhausted by the time and effort required to compile monthly financial outcome reports | A real-time web dashboard that uses AI to automatically parse receipts and build instant ledgers | Google Sheets or Expensify which still require tedious setups or manual corrections | Jago Finance uses custom Hermes AI to read receipts and instantly updates the Supabase ledger, making reporting automatic and effortless. |

### **1.4 Competitive Landscape**

| Competitor | Their Strengths | Their Weaknesses | Our Differentiation |
| :---- | :---- | :---- | :---- |
| **Enterprise Accounting (e.g., Xero)** | Comprehensive tax reporting, automated bank reconciliations. | Too complex for small startups, expensive licensing, lacks a built-in custom AI receipt scanner. | **AI-First & Startup-Focused.** We eliminate data entry friction entirely for fast-moving teams. |
| **Expensify** | Great mobile app, standard OCR capabilities. | Generic OCR struggles with local Indonesian receipts or slang; complex approval routing. | **Hermes AI Contextual Engine.** Our custom AI understands local context, slang, and specific startup categories flawlessly. |
| **Google Forms \+ Excel Sheets** | Free, highly customizable, and familiar. | Requires immense manual effort to compile and format into a readable outcome report. | **Total Automation.** The moment a receipt is uploaded, the AI builds the report in real-time. |

**Positioning Statement:**

"Jago Finance is the financial operations dashboard for startup teams who want instant, effortless expense reporting powered by Hermes AI, unlike traditional spreadsheets or complex enterprise software that steal your weekends with tedious manual data entry."

### **1.5 Monetization Model**

**Business Model:** SaaS Subscription (Freemium)

| Tier | Price | Features Included | Limitations |
| :---- | :---- | :---- | :---- |
| **Free** | $0 | Basic dashboard, manual cash ledger entries, basic reporting | Max 3 team members, No Hermes AI Scanner, max 100 transactions/mo |
| **Pro \[PAID\]** | $15 / month | All Free features \+ **Hermes AI Receipt Scanner**, automated Reimburse flow | Max 15 team members, 1,000 AI scans/mo |
| **Enterprise** | Custom | Multi-division support, custom API webhooks, dedicated support | Unlimited |

**Revenue Assumptions:**

* Target MRR Month 6: $5,000  
* Target paying customers Month 3: 100 startups  
* Expected Free-to-Paid conversion: 8%

**Feature Gating Notes:**

* The Hermes AI scanner drag-and-drop zone will be visible to Free users but locked behind a "Pro Upgrade" modal to drive conversions. \[PAID\] tag applies to all Hermes integration endpoints.

### **1.6 Assumptions**

| ID | Assumption | Impact if Wrong | Verification Method |
| :---- | :---- | :---- | :---- |
| A-01 | Users prefer a Web Dashboard (Desktop) for B2B financial operations over a mobile app. | If field employees need to submit via mobile, the UX will suffer. | Ensure Tailwind CSS is strictly mobile-responsive. |
| A-02 | The **Hermes AI** API can reliably process images and return structured JSON schemas accurately. | Reports will be incorrectly categorized, frustrating the admin. | Await Hermes API documentation and test with 100 sample receipts. |
| A-03 | Supabase row-level security (RLS) is sufficient to isolate data between different startup accounts. | Data leakage between companies could occur. | Strict RLS policy review before production launch. |
| A-04 | Our target market (Indonesian startups) is willing to pay $15/month for automated reporting. | We may struggle to convert free users to paid. | Beta testing and early bird pricing feedback. |

## **2\. Goals & Success Metrics**

### **2.1 Goals (In Scope)**

* \[x\] Eliminate manual data entry by using Hermes AI to extract receipt data in \< 5 seconds.  
* \[x\] Provide an always-up-to-date Dashboard that acts as a real-time financial outcome report.  
* \[x\] Leverage Supabase for seamless Authentication, Database, Row Level Security, and Storage.  
* \[x\] Implement a frictionless Reimbursement approval flow.

### **2.2 Non-Goals (Out of Scope)**

* Developing native mobile applications (Android/iOS) — this version is strictly Web-Based Responsive.  
* Direct Bank Transfer API integrations (automatically disbursing funds to bank accounts is delayed to Phase 2).  
* Multi-currency conversions (MVP will operate entirely in IDR / local currency).

### **2.3 MVP Boundary**

#### **INCLUDED in MVP (Must be completed before launch):**

| Feature | Reason for Inclusion |
| :---- | :---- |
| **Supabase Authentication** | Primary gate; without it, data cannot be secured or separated by company. |
| **Hermes AI Receipt Scanner** | The core value proposition solving the data-entry reporting problem. |
| **Real-time Cash Ledger Dashboard** | Replaces the need to build end-of-month Excel reports. |
| **Pro Upgrade Paywall** | Required to validate the business model and generate revenue. |

#### **EXCLUDED from MVP (Postponed to later iterations):**

| Feature | Reason for Delay | Target Phase |
| :---- | :---- | :---- |
| **Payment Gateway Integration (Payouts)** | Too complex for initial release; admins will manually transfer funds outside the app. | Phase 2 |
| **Dark Mode UI** | Nice-to-have, but does not solve the core reporting problem. | Phase 2 |
| **Export to PDF/Excel** | Users can view real-time data on the dashboard; exports add unnecessary scope. | Phase 2 |

### **2.4 Product Metrics (Business KPI)**

| Metric | Baseline | Target (30 days) | Target (90 days) | Measurement Method |
| :---- | :---- | :---- | :---- | :---- |
| Monthly Active Startups (Organizations) | 0 | 50 | 200 | Supabase Auth active sessions |
| Receipt Scan Volume | 0 | 500 scans | 5,000 scans | Database transaction count |
| Time spent on reporting | 3 days/mo | \< 1 hour/mo | \< 1 hour/mo | User interviews |
| Free-to-Paid Conversion | 0% | \> 3% | \> 8% | Stripe/Payment Dashboard |
| Activation Rate (Uploaded 1st receipt) | 0% | \> 40% | \> 60% | PostHog / Analytics |

### **2.5 Technical Metrics (Engineering KPI)**

| Metric | Target | Measurement Method |
| :---- | :---- | :---- |
| Hermes AI Extraction Time | \< 5.0 seconds | Network tab / Edge Function Logs |
| Web Dashboard Load Time | \< 1.5 seconds | Lighthouse score |
| Supabase DB Query Time (p95) | \< 150ms | Supabase Dashboard metrics |
| Edge Function Error Rate | \< 0.5% | Sentry monitoring |
| Frontend Test Coverage | \> 70% | Jest / React Testing Library |

## **3\. User & Stakeholder**

### **3.1 Target Users**

#### **Persona 1: Sarah, Finance / Operations Manager**

Name         : Sarah  
Age          : 28 years old  
Role         : Operations Manager at a growing startup  
Tech Savvy   : Medium-High  
Goals        : Wants to generate accurate financial outcome reports for the CEO without spending her entire Friday typing data into Excel.  
Frustrations : Hates playing detective at the end of the month, trying to decipher blurry receipt photos and figure out which budget category they belong to.  
Device       : Desktop / Laptop (Google Chrome)  
Context      : Accesses Jago Finance every afternoon to clear the backlog of uploaded receipts and ensure the dashboard is clean.

#### **Persona 2: Alex, Startup Founder & CEO**

Name         : Alex  
Age          : 32 years old  
Role         : Founder / CEO  
Tech Savvy   : High  
Goals        : Needs real-time visibility into the company's remaining cash runway and biggest spending categories.  
Frustrations : Currently has to wait until the 5th of every month for the finance team to finish manual reporting before making hiring or spending decisions.  
Device       : iPad / Laptop  
Context      : Glances at the Jago Finance Dashboard during strategy meetings to check the burn rate.

### **3.2 Stakeholders**

| Role | Name/Team | Interest |
| :---- | :---- | :---- |
| Product Owner | Founder / PM | Product direction, feature prioritization, revenue generation. |
| Tech Lead | AI Full Stack Architect | Supabase schema design, Hermes AI prompt engineering. |
| Developer | Front-End Dev | Translating UI to React/Tailwind, connecting Supabase JS. |
| Investors | VC Board | Monitoring MRR growth and user retention. |

### **3.3 RACI Matrix**

| Activity | Product Owner | Tech Lead | Developer | Designer | QA |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Defining requirements | A | C | C | I | I |
| MVP scope prioritization | A | C | I | I | I |
| Supabase schema decisions | C | A | C | I | I |
| Hermes AI integration logic | C | A | R | I | I |
| React UI Implementation | I | C | A | R | I |
| QA & Testing flows | I | C | C | I | A |
| Production Deployment | A | C | R | I | C |

## **4\. Features & Requirements**

### **4.1 Feature Priority (MoSCoW)**

| Priority | Label | Meaning |
| :---- | :---- | :---- |
| P0 | **Must Have** | Required for MVP launch. |
| P1 | **Should Have** | Important, but MVP can survive without it. |
| P2 | **Could Have** | Nice to have, moved to backlog. |
| P3 | **Won't Have** | Skipped for this phase. |

### **4.2 Feature List**

| ID | Feature | Priority | Tier | Status | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- |
| F-01 | Supabase Auth (Login/Register) | P0 | Free | Todo | Email/Password, tied to Company |
| F-02 | Real-time Report Dashboard | P0 | Free | Todo | Live charts showing burn rate |
| F-03 | Hermes AI Receipt Scanner | P0 | Pro | Todo | \[PAID\] Core feature |
| F-04 | Reimbursement Approval Flow | P0 | Free | Todo | Submit, Review, Approve |
| F-05 | Manual Ledger Entry | P1 | Free | Todo | For non-receipt expenses |
| F-06 | Pro Upgrade Paywall UI | P0 | \- | Todo | Drives revenue |
| F-07 | CSV Report Export | P2 | Pro | Backlog | Postponed to Phase 2 |

### **4.3 Functional Requirements**

#### **F-01: Supabase Authentication**

**Description:** Users register and log in, ensuring data is strictly siloed per company using Row Level Security (RLS).

**Requirements:**

* \[ \] Users can sign up with Email/Password.  
* \[ \] Upon registration, a company record is created, and the user is linked via company\_id.  
* \[ \] Supabase session persists using local storage.

**Acceptance Criteria:**

Scenario: Secure Login  
  GIVEN the user has an active account  
  WHEN the user enters their credentials  
  THEN they are authenticated via Supabase  
  AND redirected to the Dashboard populated only with their company\_id's data.

#### **F-03: Hermes AI Receipt Scanner \[PAID\]**

**Description:** Users upload a receipt image. The app sends it to Hermes AI, which extracts the data and drafts a ledger entry.

**Requirements:**

* \[ \] The UI provides a drag-and-drop zone accepting .jpg, .png, and .pdf uploads (max 5MB).  
* \[ \] Image is uploaded to Supabase Storage in a private bucket.  
* \[ \] A Supabase Edge Function (or direct client call) triggers the Hermes AI API with the image URL.  
* \[ \] Hermes AI must return structured JSON: { merchant, date, category, amount, notes }.  
* \[ \] A form pre-fills with the AI data, allowing the user to review/edit before saving to PostgreSQL.

**Acceptance Criteria:**

Scenario: Successful AI receipt scan  
  GIVEN the user is on a Pro tier  
  WHEN the user uploads a valid coffee receipt image  
  THEN a loading state appears indicating "Hermes is scanning..."  
  AND within 5 seconds, a form appears pre-filled with the merchant name, correct amount, and category  
  AND the user clicks "Save" to commit it to the real-time ledger.

#### **F-04: Reimbursement Approval Flow**

**Description:** Employees can submit expenses that require admin approval before deducting from the cash balance.

**Requirements:**

* \[ \] Employees submit expenses; status defaults to pending.  
* \[ \] Admins view a list of pending transactions.  
* \[ \] Admin clicks "Approve", status changes to approved, and dashboard metrics instantly update.

### **4.4 Non-Functional Requirements**

| Category | Requirement | Target | Priority |
| :---- | :---- | :---- | :---- |
| **Performance** | Dashboard render time | \< 1.5s | P0 |
| **Performance** | Hermes AI extraction speed | \< 5.0s | P0 |
| **Security** | Row Level Security (RLS) | Strictly enforced per company\_id | P0 |
| **Security** | Storage Bucket Privacy | Receipts are not publicly accessible | P0 |
| **Compatibility** | Web Browsers | Chrome, Safari, Edge, Firefox (Modern) | P0 |
| **Responsiveness** | UI Layout | Mobile, Tablet, and Desktop via Tailwind | P0 |

## **5\. User Stories**

### **Epic 1: Effortless Data Entry & Reporting**

| ID | User Story | Priority | Story Points |
| :---- | :---- | :---- | :---- |
| US-01 | As an **employee**, I want to **upload a photo of my receipt** so that **I don't have to manually type the details to get reimbursed.** | P0 | 5 |
| US-02 | As a **finance admin**, I want **Hermes AI to auto-categorize expenses** so that **I don't have to guess where the money went at the end of the month.** | P0 | 8 |
| US-03 | As a **finance admin**, I want to **edit the AI's extracted data before saving** so that **I can correct any rare hallucinations or adjust descriptions.** | P0 | 3 |

### **Epic 2: Real-time Cash Visibility**

| ID | User Story | Priority | Story Points |
| :---- | :---- | :---- | :---- |
| US-04 | As a **founder**, I want to **see a real-time cash balance dashboard** so that **I know my exact runway without asking the finance team.** | P0 | 3 |
| US-05 | As an **admin**, I want to **click "Approve" on an expense and have it auto-deduct from the ledger** so that **the outcome report is built automatically.** | P0 | 5 |
| US-06 | As a **founder**, I want to **see a chart of my spending categories** so that **I know where the company is burning the most cash.** | P1 | 3 |

## **6\. Technical Architecture**

**Note for AI Context:** This project strictly uses a serverless frontend architecture communicating directly with Supabase BaaS. We do not use Node.js/Express.

### **6.1 Tech Stack**

| Layer | Technology | Version | Notes |
| :---- | :---- | :---- | :---- |
| **Frontend UI** | React \+ Vite | 18.x | Fast build, functional components, hooks. |
| **Styling** | Tailwind CSS | 3.x | Utility-first, responsive layouts. |
| **Backend / BaaS** | Supabase | Latest | PostgreSQL, Auth, Storage, Edge Functions. |
| **AI Engine** | Hermes AI API | Custom | LLM for receipt extraction (structured output). |
| **State Mgmt** | Zustand / Context | \- | Lightweight global state for user session. |
| **Icons** | Lucide React | Latest | Clean, modern iconography. |

### **6.2 System Architecture**

\+-------------------------------------------------------------+  
|                        CLIENT LAYER                         |  
|                 React Web App (Browser)                     |  
|           (Tailwind CSS, Zustand, Supabase JS)              |  
\+---------------------+-------------------------------+-------+  
                      | HTTPS / WebSocket             | HTTPS  
\+---------------------v-----------------------+  \+----v-------+  
|                 SUPABASE (BaaS)             |  | Hermes AI  |  
| \- Auth (JWT Management)                     |  | API        |  
| \- PostgREST (Auto-generated APIs)           |  | (OCR &     |  
| \- Storage (Private Buckets)                 |  | Extraction)|  
| \- Row Level Security (Data Isolation)       |  \+------------+  
\+---------------------------------------------+

### **6.3 Database Schema (Supabase PostgreSQL)**

#### **Design Decisions:**

* **Tenant Isolation:** Every table uses company\_id. RLS policies strictly verify auth.uid() against this.  
* **Soft Deletes:** Optional, but we will use standard deletes for MVP simplicity, heavily relying on RLS to prevent unauthorized drops.

#### **DDL Schema:**

\-- TABLE: companies  
CREATE TABLE companies (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    name VARCHAR(255) NOT NULL,  
    subscription\_tier VARCHAR(50) DEFAULT 'free',  
    current\_balance DECIMAL(15, 2\) DEFAULT 0.00,  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  
);

\-- TABLE: profiles (Extends Supabase auth.users)  
CREATE TABLE profiles (  
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,  
    company\_id UUID REFERENCES companies(id) ON DELETE CASCADE,  
    full\_name VARCHAR(255),  
    role VARCHAR(50) DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  
);

\-- TABLE: transactions  
CREATE TABLE transactions (  
    id UUID PRIMARY KEY DEFAULT gen\_random\_uuid(),  
    company\_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,  
    user\_id UUID REFERENCES profiles(id),  
    merchant VARCHAR(255) NOT NULL,  
    category VARCHAR(100) NOT NULL,  
    amount DECIMAL(15, 2\) NOT NULL,  
    type VARCHAR(50) CHECK (type IN ('income', 'expense', 'reimburse')),  
    status VARCHAR(50) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),  
    receipt\_url TEXT,  
    notes TEXT,  
    created\_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  
);

\-- ROW LEVEL SECURITY (RLS) POLICIES  
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;  
CREATE POLICY "Isolate transactions per company"   
ON transactions FOR ALL  
USING (company\_id \= (SELECT company\_id FROM profiles WHERE id \= auth.uid()));

### **6.4 API Contract (Hermes & Supabase)**

#### **Supabase Data Fetching (Client-Side Example)**

We rely on @supabase/supabase-js instead of custom REST endpoints.

// Fetching approved transactions for the dashboard  
const { data, error } \= await supabase  
  .from('transactions')  
  .select('\*')  
  .eq('status', 'approved')  
  .order('created\_at', { ascending: false });

#### **Hermes AI Endpoint Specification**

**Description:** The React app sends the image payload to Hermes for structured extraction.

**Endpoint:** \[PENDING HERMES API URL\]

**Method:** POST

**Headers:**

* Authorization: Bearer \[HERMES\_API\_KEY\]  
* Content-Type: application/json

**Request Body:**

{  
  "image\_base64": "data:image/jpeg;base64,/9j/4AAQSk...",  
  "prompt": "Extract the receipt details into the following JSON schema."  
}

**Expected Response 200 OK:**

{  
  "status": "success",  
  "data": {  
    "merchant": "Kopi Kenangan",  
    "date": "2026-06-25",  
    "category": "Operasional",  
    "amount": 45000,  
    "notes": "Es Kopi Susu Mantan x2"  
  }  
}

### **6.5 Project Structure (React/Vite)**

jago-finance-web/  
├── public/                    
├── src/  
│   ├── assets/              \# Images, SVGs  
│   ├── components/          \# Reusable UI (Buttons, Modals, Cards)  
│   ├── pages/               \# Screen Views (Dashboard, Login, Scanner)  
│   ├── lib/                   
│   │   ├── supabase.js      \# Supabase client initialization  
│   │   └── hermesApi.js     \# Fetch wrappers for AI logic  
│   ├── store/               \# Zustand state stores  
│   ├── App.jsx              \# Main router and layout wrapper  
│   └── main.jsx             \# React DOM entry  
├── .env.local               \# SUPABASE\_URL, SUPABASE\_ANON\_KEY  
├── tailwind.config.js         
├── vite.config.js             
└── package.json

## **7\. Coding Standards**

### **7.1 General Principles**

* **Functional React:** Strictly use React Hooks (useState, useEffect). No class components.  
* **Single Source of Truth:** Supabase is the master database. Zustand manages lightweight UI states (modals, auth sessions).  
* **Vibe Coding Flow:** Prefer building complete features in isolated components rather than splitting too deeply into micro-files initially.

### **7.2 Styling (Tailwind CSS)**

* Avoid custom CSS files. Use Tailwind utility classes directly in the className props.  
* **Theme Colors:**  
  * Primary: slate-900 (\#0f172a)  
  * Accent: blue-600 (\#2563eb)  
  * Danger (Reject): red-500  
  * Success (Approve): emerald-500

## **8\. Testing Strategy**

* **Manual E2E Testing:** Given the rapid vibe-coding methodology, testing will be primarily manual verification of critical paths:  
  1. Register/Login.  
  2. Upload Receipt \-\> Hermes Extraction \-\> Review Form \-\> Save.  
  3. Verify Dashboard updates accurately.  
* **Hermes Prompt Testing:** The custom Hermes prompt must be tested against 20 highly diverse Indonesian receipts (blurry, crumpled, faded) before freezing the prompt template.

## **9\. Logging, Monitoring & Error Handling**

* **AI Fallbacks:** If Hermes API times out (\> 10s) or fails to parse, the UI MUST gracefully fall back to a manual entry form with an error toast: *"AI Scanner unavailable. Please enter details manually."*  
* **Auth Errors:** Catch Supabase auth errors (e.g., "Invalid login credentials") and display them via clean UI Toast notifications, not browser alerts.  
* **Console Warnings:** Remove console.log containing base64 images or sensitive data in production builds.

## **10\. Data Privacy & Compliance**

* **Storage Security:** Receipts uploaded to Supabase Storage must be strictly in **private buckets**. Only authenticated users belonging to the company\_id linked to the receipt should be able to download/view the file via signed URLs.  
* **UU PDP Compliance (Indonesia):** Users have the right to request deletion of their company data. A "Delete Account & Data" button must be present in settings, triggering an edge function that wipes their company schema.  
* **Data Minimization:** Do not pass unnecessary user data (like passwords or emails) to the Hermes API. Only send the raw receipt image.

## **11\. UI/UX Requirements**

### **11.1 Screen List**

| ID | Screen | Persona | Priority | Notes |
| :---- | :---- | :---- | :---- | :---- |
| S-01 | Auth (Login/Register) | All | P0 | Clean, centered card. Email/Pass. |
| S-02 | Dashboard Home | Admin | P0 | Top cards: Total Balance, Month Spend. Recharts Bar Chart for categories. |
| S-03 | Ledger / Transactions | All | P0 | Data table with filters (Pending, Approved). |
| S-04 | Hermes Scanner Modal | All | P0 | Drag & drop zone. Smooth loading skeleton during AI extraction. |
| S-05 | Settings / Paywall | Admin | P1 | Manage team, view Pro subscription status. |

### **11.2 Design Concept**

* **Vibe:** Modern SaaS, "Stripe-like". Lots of whitespace, rounded corners (rounded-xl), soft shadows (shadow-sm), and clean typography (Inter or standard sans-serif).  
* **Navigation:** A sleek left-hand sidebar for desktop, converting to a bottom tab bar or hamburger menu on mobile.

## **12\. Sprint Planning & Timeline**

### **12.1 Phases / Milestones**

| Phase | Milestone | Duration | Target Date |
| :---- | :---- | :---- | :---- |
| **Sprint 1** | Supabase Setup (Auth, Database, RLS) & Basic React Dashboard Layout | 1 Week | Day 7 |
| **Sprint 2** | Hermes AI API Integration & Receipt upload flow | 1 Week | Day 14 |
| **Sprint 3** | Reimbursement Approval logic, Charts, & Paywall UI | 1 Week | Day 21 |
| **Sprint 4** | Beta Testing, Bug Fixing, Vercel Deployment | 1 Week | Day 28 |

## **13\. Dependencies**

### **13.1 External Dependencies**

| Dependency | Provider | Status | Risk | Mitigation |
| :---- | :---- | :---- | :---- | :---- |
| Supabase Project | Supabase | Todo | Low | Easy self-service setup. |
| **Hermes AI API Key** | Internal AI Team | Pending | **High** | Blocked on API specs. Dev can build UI using mock JSON responses first. |
| Payment Links | Stripe/Midtrans | Todo | Medium | Can launch MVP as free, add gating shortly after. |

## **14\. Risks & Mitigations**

| ID | Risk | Likelihood | Impact | Mitigation |
| :---- | :---- | :---- | :---- | :---- |
| R-01 | **Hermes AI hallucinating amounts (e.g., confusing 1.000 with 1000).** | Medium | Critical | Always force a human-in-the-loop review form before saving AI data to the ledger. |
| R-02 | **Supabase RLS is configured incorrectly.** | Low | Critical | Perform strict security audits simulating malicious users trying to query other companies' IDs. |
| R-03 | **Images too large for Hermes API.** | High | Medium | Implement client-side image compression (Canvas resize) before converting to Base64/uploading. |

## **15\. Definition of Done (DoD)**

* \[ \] User can successfully register and log into an isolated Supabase tenant.  
* \[ \] User can drag-and-drop a receipt image, and Hermes AI successfully populates the review form within 5 seconds.  
* \[ \] Saving an approved transaction instantly updates the real-time cash balance and charts on the Dashboard.  
* \[ \] UI is fully responsive and looks professional on both Desktop and Mobile browsers.  
* \[ \] No .env secrets (like Supabase Service Role keys) are exposed in the client-side code bundle.

## **16\. Open Questions**

| ID | Question | Status |
| :---- | :---- | :---- |
| Q-01 | What is the exact base URL and authentication header format for the custom Hermes API? | Open |
| Q-02 | Do we need to retain the original receipt images forever, or auto-delete after 1 year to save storage costs? | Open |

## **17\. Changelog**

| Version | Date | Changes | Author |
| :---- | :---- | :---- | :---- |
| v3.0 | 25/06/2026 | Initial Web App & Reporting Pivot | Full-Stack Dev |
| v4.0 | 25/06/2026 | Full comprehensive rewrite for React \+ Supabase \+ Hermes | Full-Stack Dev |

## **18\. Appendix**

### **18.1 Glossary**

| Term | Definition |
| :---- | :---- |
| **RLS** | Row Level Security (PostgreSQL feature to restrict data access per user). |
| **BaaS** | Backend as a Service (e.g., Supabase, Firebase). |
| **OCR** | Optical Character Recognition (Extracting text from images). |
| **Hallucination** | When an AI confidently returns incorrect or fabricated data. |

### **18.2 References**

* [Supabase React Documentation](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)  
* [Tailwind CSS Documentation](https://tailwindcss.com/docs)  
* [UU PDP Indonesia (Data Privacy)](https://kominfo.go.id)

**AI Context Note — READ BEFORE GENERATING CODE:**

This document is the single source of truth for the Jago Finance project.

When generating code, strictly adhere to:

* **Section 6.1:** React (Functional), Tailwind CSS, Supabase JS Client.  
* **Section 6.3:** Match all queries to the PostgreSQL schema and company\_id.  
* **Section 7.1:** Emphasize clean, modern UI components.  
* **Section 10:** Never expose Supabase service keys in the frontend.

Proceed with single-file generation strategies for React components unless specified otherwise.