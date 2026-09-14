# Patient portal demo script (meeting)

Use this as a spoken guide. Pause where people ask questions. Everything below is the **patient** experience only (`patient@demo.com` / `Password123`).

---

## Before you share your screen

Close extra tabs. Zoom the browser so text reads comfortably for people on video. If someone joins late, give them thirty seconds: “We’re in the BHG patient portal demo account.”

---

## 1. Sign in

**Open the app.** You’ll see the login screen with BHG branding.

**What to say:**  
“This is how a patient lands: email and password, same flow they’d know from banking or other portals. For today we’re using a sandbox patient, Sarah Jenkins.”

Sign in with **`patient@demo.com`** and **`Password123`**.

**What to say:**  
“Behind the scenes this ties to our demo identity; in production this would be your health system’s auth.”

---

## 2. The shell (every screen uses this)

Point at the **left rail**.

**What to say:**  
“You’ve got two buckets: **Main** for day‑to‑day care, and **Account** for money, long‑view timeline, profile, and preferences. That keeps ‘clinical stuff’ and ‘account stuff’ mentally separate.”

Point at the **top bar**: logo, page title, subtitle.

**What to say:**  
“The header tells you where you are without hunting.”

Click the **avatar** (SJ) once.

**What to say:**  
“Quick path into profile‑style settings from anywhere.”

(Optional) Mention the **floating assistant** bottom‑right when it appears:  
“That’s our in‑app assistant; we’ll come back to it at the end.”

---

## 3. Dashboard (home)

You land on **Dashboard**.

**What to say:**  
“This is Sarah’s home base. We greet her by name and show **care at a glance**: visits already completed, what’s scheduled next, meds, messages, trackers, records, and statements. The numbers are big on purpose so someone anxious can scan in two seconds.”

Walk the **cards** in order (you don’t have to read every number aloud):

- **Visits**  
  **Say:** “These are **past** encounters we’ve documented. Different from what’s coming up.”

- **Appointments**  
  **Say:** “This is the **forward‑looking** calendar: what’s booked next. I’ll show the full page in a minute.”

- **Medications**  
  **Say:** “Active meds at a glance; detail lives on the Medications screen.”

- **Messages**  
  **Say:** “Secure messaging with the care team, not texting.”

- **Trackers**  
  **Say:** “Trends for things like blood pressure and glucose, useful between visits.”

- **My Records**  
  **Say:** “One hub for documents and clinical snapshots: labs, allergies, immunizations, all of it.”

- **Statements**  
  **Say:** “Financial side: what they owe, what insurance covered, statements they can download.”

Scroll to the **Care journey** strip.

**What to say:**  
“If someone wants the story over time, not just tiles, we send them here: labs, billing touches, appointments on one timeline.”

Use **Book appointment** or **Message care team** if you want to show shortcuts (they jump to real pages).

---

## 4. Visits

Go to **Visits** in the sidebar.

**What to say:**  
“This is **history**: where she went, who she saw, what was discussed. Good for ‘what did we decide last time?’ Not where you book the next slot.”

Open one card if you want; scroll through **visit notes** and **what we discussed**.

**Say:** “In real life this pulls from visit documentation; here it’s representative content.”

---

## 5. Appointments

Go to **Appointments**.

**What to say:**  
“Everything **scheduled ahead**: date, time, telehealth vs in person, prep notes if there are any.”

Click an appointment to open the **detail modal**.

**Say:**  
“They can see provider, specialty, location or video, and cancel or reschedule requests here in the demo.” Close without drama.

Click **Book** / **Book new appointment** (wording may vary).

**Say:**  
“We kept scheduling in a **wizard**: specialty, provider, then slot. That mirrors how call centers and apps usually work, without dumping fifty fields on one screen.”

Walk through **specialty → provider → date/time**, then confirm.

**Say:**  
“You’ll see a confirmation state and a toast; in production the real scheduling rules engine sits behind this.”

---

## 6. Medications

Go to **Medications**.

**What to say:**  
“Clean table: name, strength, how often, active vs not. We’re careful with language: we tell people to talk to the team before changing anything.”

Point at the line about **refills** at the bottom.

**Say:**  
“If they need a refill or pharmacy help, we point them to **Messages** or **My Records → Refills** instead of pretending they can change meds here blindly.”

---

## 7. Messages

Go to **Messages**.

**What to say:**  
“This is the **secure inbox**: threads with cardiology, billing, whoever’s in the demo list.”

Click another thread, type a short reply, send.

**Say:**  
“Typical pattern: I send something, I get an acknowledgement so it doesn’t feel like a black hole.”

If there’s a **callback** or phone affordance, hit it once.

**Say:**  
“Some people still want a phone touch; we stub that with feedback so they know the request landed.”

---

## 8. Trackers

Go to **Trackers**.

**What to say:**  
“We’re looking at **trends**, not single numbers in isolation: blood pressure over months, fasting glucose as bars. Disclaimer on screen says demo data so nobody treats this like a device feed.”

Point at the **AI summary** card at the top.

**Say:**  
“We generate plain language off the same series you’re seeing in the charts: direction of BP, glucose, and how it relates to the conditions listed below. It’s educational copy, not a diagnosis.”

Scroll to **Condition focus**.

**Say:**  
“These chips tie back to problems on her chart with a simple status: managed, monitoring, improving. Helps the story hang together.”

---

## 9. My Records (this one deserves a slow pass)

Go to **My Records**.

**What to say:**  
“This is the **health hub**. Top area is the document list: labs, imaging, visit summaries, filtered with chips and search.”

Click a **lab** record.

**Say:**  
“When you open a lab, you get structured results, reference ranges, and a readable summary.”

Find **Generate AI Summary** (or Show/Hide) for labs.

**Say:**  
“For appropriate results we offer an optional plain‑language layer. They expand it when they want it; we still log that they viewed it in a serious deployment.”

Close the panel.

Now use the **horizontal hub tabs** (below the search row).

**What to say:**  
“Same page, different lenses:”

- **Vitals**  
  **Say:** “Recent measurements in one place.”

- **Allergies**  
  **Say:** “Reaction and severity at a glance.”

- **Problems / Conditions**  
  **Say:** “Problem list with rough timelines.”

- **Immunizations**  
  **Say:** “Vaccine history style rows.”

- **Lab Results** (if separate from main list in your build)  
  **Say:** “Another path into labs if they’re tab‑driven.”

- **Messages** (clinical messages in hub)  
  **Say:** “Short clinical communications tied to care, distinct from the full Messages inbox.”

- **PHR**  
  **Say:** “Personal health record fields: lifestyle, sleep, preferences. Self‑reported.”

Point at the **AI summary** on PHR.

**Say:**  
“We summarize those lifestyle lines together with conditions so it reads like a paragraph a nurse might say out loud, still with a demo disclaimer.”

- **Health Access Documents**  
  **Say:** “Consents and legal‑style documents on file.”

- **Education**  
  **Say:** “Leaflets and topics we’ve assigned.”

- **Refills**  
  **Say:** “Refill requests and status if they’re tracking pharmacy workflows.”

---

## 10. Access log

Go to **Access log**.

**What to say:**  
“This answers ‘who looked at my chart in **this portal**?’ Each row is a view event: who, what document, when, and whether it looked like mobile or browser.”

Point at the **notice** banner if expanded.

**Say:**  
“We’re honest that other systems might log separately; this is transparency inside BHG.”

Point at **AI summary**.

**Say:**  
“It narrates patterns: how many events, what kinds of documents, mobile vs web mix. Again, demo language.”

---

## 11. Insurance

Go to **Insurance**.

**What to say:**  
“Plan identity: payer, member ID, deductibles and out‑of‑pocket where we show progress bars. We also tie **claims‑style language** to what they’ll see on statements.”

If you show buttons into statements:

**Say:**  
“If something doesn’t match their EOB, we route them to **Statements** instead of arguing in place.”

---

## 12. Symptom check

Go to **Symptom check**.

**What to say:**  
“This is **guided triage**, not diagnosis. We bucket symptoms into emergency vs moderate vs mild style tiers so people get a sane default next step.”

Complete one quick path or stop halfway.

**Say:**  
“We repeat clearly: if it’s a real emergency, call emergency services. This supports navigation, not replacement for judgment.”

---

## 13. Notifications

Go to **Notifications**.

**What to say:**  
“System and clinical pings in one feed: labs ready, appointment changes, billing, whatever we emit. Filters help when the list gets long.”

Toggle **unread only** if you want.

**Say:**  
“Mark read or clear down so the badge isn’t lying.”

---

## 14. Statements

Go to **Statements** (under Account).

**What to say:**  
“This is the money story: balance due, what insurance already paid, and statement periods.”

Walk the **tabs** (often something like overview / all statements / payment history — follow what’s on screen).

**Say:**  
“You can open a statement, see line items with billed vs insurance vs patient share, and grab a PDF.”

Click **Make a Payment**.

**Say:**  
“We walk amount, method, review, confirmation. Toast tells them it went through in the demo.”

Close modals cleanly.

---

## 15. Care Journey

Go to **Care Journey**.

**What to say:**  
“If the dashboard cards felt too ‘now,’ this is **longitudinal**: appointments, reports, billing events, messages, prescriptions on a single timeline with filters.”

Click a filter chip.

**Say:**  
“Someone preparing for a specialist visit can scroll only billing or only labs.”

---

## 16. Profile

Go to **Profile & Preferences**.

**What to say:**  
“Demographics, contact, emergency contact, insurance snapshot for Sarah. Edit mode shows how updates would work; we toast on save in the demo.”

---

## 17. Settings

Go to **Settings**.

**What to say:**  
“Notifications, security toggles, privacy preferences, language and theme. Nothing flashy: it should feel like any mature consumer app.”

Fire **save** or a password reset stub if you want to show feedback.

---

## 18. Floating assistant (wrap‑up)

Open the **assistant** bubble.

**What to say:**  
“Same session: they can ask about labs, symptoms, billing, booking, without leaving the page. Starters are there for shy users.”

Send something benign like **Show my latest lab reports** or **Book an appointment**.

**Say:**  
“It routes to demo logic and can open flows like booking or triage. We position it as **first stop**, not the only stop.”

---

## 19. Sign out

Scroll the sidebar to **Sign Out**.

**What to say:**  
“Clean exit; session ends at the login screen. That’s the full loop.”

---

## Optional notes (only if asked)

- **Admin-only tools:** There is a separate **Audit & Activity** area for hospital admins; it’s not on the patient menu. Patients see **Access log** instead for transparency.

- **Help Center:** A help route exists in the app shell, but this patient menu doesn’t link to it in the current build. If stakeholders ask, call it “on the roadmap for surfacing” or wire it later.

- **Demo vs production:** Say once upfront: “Data and integrations are mocked or sandboxed; behavior is representative.”

---

## Closing line you can reuse

**Say:**  
“That’s the patient portal end to end: clinical history and scheduling, messaging and education, trends and PHR, transparency on access and money, plus guardrails so nobody confuses education for medical orders. Happy to dive deeper anywhere.”
