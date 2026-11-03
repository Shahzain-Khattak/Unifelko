# UNIFELKO Private Limited — Website

**Different Needs. One Reliable Partner.**

A static, multi-page website for UNIFELKO, presented as an international business and
service facilitation company that connects buyers, sellers and dealers with independent
third-party service providers.

---

## 1. Files

```
index.html          Home — hero, who we are, services, process, partnership CTA
about.html          Introduction, vision, mission, values, business approach
services.html       4 service categories, each with its own enquiry option
how-it-works.html   The 5-step process, expectations, FAQ
partnerships.html   For service providers, businesses and independent professionals
contact.html        Contact details, WhatsApp, enquiry form
css/styles.css      All styling and the design system
js/script.js        Menu, scroll effects, form validation, service pre-selection
Logo.jpg            Your logo (used in the header and as the favicon)
README.md           This file
```

No build step, no dependencies, no framework. Open `index.html` in any browser.

---

## 2. Preview locally

Just double-click `index.html`.

Or serve it (avoids any browser `file://` restrictions):

```powershell
cd "C:\Users\Arena Multimedia\Desktop\car selling"
npx serve .
# or: python -m http.server 8000
```

---

## 3. ⚠️ Replace the placeholder contact details before going live

These are **placeholders** and appear across all 6 pages plus `js/script.js`.

| What | Placeholder value | Appears |
|---|---|---|
| Email | `info@unifelko.com` | 23 times in 7 files |
| Phone (displayed) | `+91 98765 43210` | 6 pages |
| Phone (dial link) | `+919876543210` | 6 pages |
| WhatsApp number | `919876543210` | 6 pages (10 links) |
| Office address | `Office address to be confirmed` | 6 pages |

Run these from the project folder to replace everything at once (edit the values first):

```powershell
$root = "C:\Users\Arena Multimedia\Desktop\car selling"
$files = Get-ChildItem $root -Recurse -Include *.html,*.js -File

foreach ($f in $files) {
  $c = Get-Content $f.FullName -Raw
  $c = $c -replace 'info@unifelko\.com',   'YOUR@EMAIL.COM'
  $c = $c -replace '\+91 98765 43210',     '+00 00000 00000'
  $c = $c -replace 'tel:\+919876543210',   'tel:+00000000000'
  $c = $c -replace 'wa\.me/919876543210',  'wa.me/YOURNUMBER'
  $c = $c -replace 'Office address to be confirmed', 'Your real office address'
  Set-Content -Path $f.FullName -Value $c -Encoding UTF8
}
```

Notes:
- WhatsApp links look like `https://wa.me/<countrycode><number>` — e.g. for `+44 7700 900123`
  use `wa.me/447700900123` (no `+`, no spaces).
- The `data-mailto="info@unifelko.com"` attribute on the form in `contact.html` is what
  receives enquiries — don't miss it (the script above catches it).
- Search the project for `98765` afterwards to confirm nothing was missed.

---

## 4. The enquiry form (important)

The site is static and has **no server**, so the form does two things:

1. Validates the fields in the browser.
2. Opens the visitor's mail app with a pre-filled message addressed to your email.

If a visitor has no mail client configured, the on-screen message tells them to email you
directly — so nothing is silently lost.

**To make it submit without a mail client**, replace the block marked
`/* --- SUBMIT HANDLER --- */` in `js/script.js` with a `fetch()` to a form endpoint.
Any of these work with this exact markup (fields are `name`, `email`, `phone`,
`service`, `message`):

- **Formspree** — `fetch('https://formspree.io/f/XXXXXXX', {method:'POST', body:new FormData(form), headers:{'Accept':'application/json'}})`
- **Netlify Forms** — add `netlify` attribute to `<form>` (works only on Netlify hosting)
- **Web3Forms / Getform / your own API**

The form already prevents default submission and shows a status message, so swapping the
handler is a small, contained change.

---

## 5. Design system

Colours sampled directly from `Logo.jpg`:

| Token | Value | Use |
|---|---|---|
| Deep green | `#002A17` | Dark sections, headings, primary buttons |
| Gold | `#CDA34D` | Accents, eyebrow labels, gradients |
| Gold light | `#E8C877` | Gradient highlight, text on dark |
| Gold deep | `#A97C1F` | Small text/labels on white |
| Navy | `#1C2E52` | Secondary brand colour |
| Off-white | `#F6F8F5` | Alternating section background |

- Headings: **Poppins** · Body: **Inter** (loaded from Google Fonts, with system fallbacks
  so the site still looks right offline)
- Layout container: 1160px, breakpoints at 1080 / 960 / 760 / 480 px
- The gold arc motif in the hero echoes the arc in your logo

To change the palette, edit the `:root` block at the top of `css/styles.css`.

---

## 6. Adding or editing content

- **Navigation / footer** — the same markup is repeated in all 6 pages. If you add a page,
  copy the `<header>` and `<footer>` from any existing page and change `aria-current="page"`.
- **Service categories** — `services.html`. Each section has `id="automotive|property|business|other"`;
  the enquiry buttons link to `contact.html?service=<value>`, and `<option value>` in
  `contact.html` must match that value.
- **FAQ** — plain `<details>` blocks in `how-it-works.html`; add more by copying one.
- **Logo** — replace `Logo.jpg` keeping the same filename (or update every `<img src>`).

---

## 7. Content notes

- **Tagline:** the site uses *"Different Needs. One Reliable Partner."* as written in your
  brief, while your logo file reads *"DIFFERENT NEEDS. ONE PARTNER."* Tell me which you
  prefer and I'll align them.
- **No unverified claims.** The copy deliberately avoids international legal teams, escrow,
  verified global networks, guaranteed results, fixed response times and invented statistics —
  since none of those are established. Where useful, the site says the opposite plainly
  (providers are independent, terms are agreed directly with them, availability varies).
  If any of those arrangements *do* become real, the copy can be updated to say so.
- **Trust section wording** ("We understand first", "We stay involved", etc.) describes your
  process, not third-party endorsements.

---

## 8. Deploying

Upload the folder as-is to any static host:

- **Netlify** — drag the folder onto app.netlify.com/drop
- **Vercel** — `vercel .`
- **GitHub Pages** — push and enable Pages
- **cPanel / Hostinger** — copy everything into `public_html`

Domain email (e.g. `hello@yourdomain.com`) should be set up with your host or Google
Workspace separately — the site only links to it.
