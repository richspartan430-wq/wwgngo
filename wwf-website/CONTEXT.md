# Waste Pickers Welfare Foundation — Website Context

> **Last Updated:** April 22, 2026  
> This document provides comprehensive context for AI agents and developers working on the WWF website.

---

## Organization Overview

**Full Name:** Waste Pickers Welfare Foundation  
**Short Name:** WWF (used internally only — client prefers full name in UI)  
**Founded:** 2014 (informal work started 2008)  
**Registration:** Trust Registration Act 1860, No. 1690, dated 26 May 2014  
**Location:** B-12A Gali No 2 East Nathu Colony, Shahdara, Delhi - 110093  
**Contact:** Virender Kumar (Secretary) — +91-9968125328, +91-9211997720  
**Email:** Bali.charan@gmail.com  
**Founder:** Late Shri Bali Charan (1969–2024)  

### Legal Credentials
| Credential | Value |
|---|---|
| PAN | AAATW4653R |
| 80G Certificate | AAATW4653R24DL02 |
| 12A Certificate | AAATW4653R24DL01 |
| DARPAN / NITI AAYOG | DL/20190246760 |
| CSR (E-ANUDAN) | CSR00037186 |
| CSR-1 | DL/00027665 |
| Bank | Axis Bank, A/c 2401248559732610, IFSC: AUBL0002485 |

### Programs (6)
1. **Child Education** — Community Learning Centres, 500+ children served
2. **Healthcare** — Monthly camps with Max Foundation & CII, 4000+ served
3. **Women Empowerment** — Self-Help Groups, stitching/tailoring training, 200+ women
4. **Drug Abuse Prevention** — Counseling, awareness campaigns
5. **Community Development** — Advocacy, identity cards, government scheme access
6. **Skill Development** — Vocational training for youth/adults

---

## Website Architecture

### Tech Stack
- **HTML5** — Static pages, no framework
- **CSS3** — Vanilla CSS with custom design system (`css/style.css`)
- **JavaScript** — Vanilla JS (`js/script.js`)
- **Fonts** — Google Fonts: Poppins (headings) + Open Sans (body)
- **No build step** — Open `index.html` directly in browser

### Design System
```
Colors:
  --primary-blue:    #0D47A1
  --primary-green:   #43A047
  --accent-orange:   #FB8C00
  --accent-gold:     #FFD54F
  --bg-light:        #F5F5F5
  --text-dark:       #2D3436
  --text-light:      #636E72

Typography:
  Headings: 'Poppins', sans-serif (600-700 weight)
  Body:     'Open Sans', sans-serif (400-500 weight)

Border Radius: 8px (sm), 12px (default), 20px (lg)
```

### Page Structure

| File | Purpose | Key Sections |
|---|---|---|
| `index.html` | Home — landing page | Hero, Carousel, About snippet, Founder tribute, Trust badges, Mission/Vision, Programs overview, Testimonials, Gallery preview, Partners, CTA |
| `about.html` | About the organization | Who We Are, Journey timeline, Vision/Mission, Founder profile, Team, Core values, Legal info |
| `programs.html` | Detailed program descriptions | 6 program cards with impact stats |
| `gallery.html` | Photo gallery with filters | Masonry grid, category filter tabs (All/Education/Health/Women/Community/Distribution), Lightbox modal |
| `annual-reports.html` | PDF annual reports | Report cards with download links to 3 PDFs |
| `get-involved.html` | Donations & volunteering | Bank details, volunteer roles, CSR partnerships, in-kind donations |
| `contact.html` | Contact form & info | Contact form, contact details, Google Maps embed, FAQ accordion |

### Navigation Order (all pages)
```
HOME | ABOUT US | OUR WORK | GALLERY | ANNUAL REPORTS | GET INVOLVED | CONTACT | [Donate Now]
```

### Shared Components
- **Navbar:** Fixed, glassmorphism, scrolled state, mobile hamburger menu
- **Footer:** 4-column grid (About, Quick Links, Contact, Legal/Newsletter)
- **Floating buttons:** WhatsApp chat + Scroll-to-top
- **Animations:** Intersection Observer for fade-in, counter animation for stats

---

## Assets & Images

### Directory: `assets/`
Existing images extracted from annual reports + design assets:
- `founder.png` — Founder photo (used in hero, about, home)
- `father_photo.jpg` — Hero background
- `community-gathering.png`, `community.png`, `health.png`, `education.png`, `students.png`, `village.png`
- `data-achievement.png`, `data-referral.png` — Infographic data
- Various `img_p*_Image*.jpg` — Annual report extractions
- 3 Annual Report PDFs

### Directory: `../new images/` (23 renamed screenshots)
Organized photos referenced from gallery and homepage carousel:

| Category | Images |
|---|---|
| **Education** | `aarogyam_project_classroom_poster.png`, `aarogyam_project_children_learning.png`, `aarogyam_project_kids_participating.png`, `aarogyam_project_study_session.png`, `aarogyam_project_collage.png`, `ngo_worker_speaking_to_kids.png` |
| **Health & Awareness** | `solid_waste_management_roundtable_group.png`, `solid_waste_management_banner.png`, `health_cards_distribution_women_collage.png`, `profiling_camp_candle_gathering_collage.png`, `profiling_camp_distribution_collage.png` |
| **Women Empowerment** | `women_community_session_seated.png`, `ngo_presentation_women_group.png`, `awareness_meeting_namaste_scheme.png`, `women_learning_about_welfare_schemes.png`, `community_discussion_shg_schemes.png` |
| **Community** | `community_awareness_meeting_group.png`, `community_meeting_blurry.png`, `indoor_community_classroom.png` |
| **Distribution** | `community_distribution_crowd.png`, `distribution_truck_gathering.png`, `ngo_distribution_man_pointing.png`, `wastepickers_welfare_foundation_distribution.png` |

> **Note:** Images in `new images/` are referenced via `../new images/filename.png` from the `wwf-website/` directory. For production deployment, these should be copied into `assets/` and paths updated.

---

## JavaScript Features (`js/script.js`)

| Feature | Description |
|---|---|
| Mobile menu | `toggleMenu()` — hamburger menu toggle |
| Navbar scroll | Adds `.scrolled` class after 50px scroll |
| Scroll animations | IntersectionObserver on cards, grid items, timeline |
| Counter animation | Animates stat numbers on scroll into view |
| Scroll-to-top | Shows/hides button at 400px scroll |
| FAQ accordion | Click-to-expand FAQ items |
| **Image carousel** | Auto-play (5s), prev/next buttons, dot indicators, touch swipe support, pause on hover |
| **Gallery filters** | Category tabs filter gallery masonry items with show/hide animation |
| **Lightbox modal** | Click-to-open image viewer, keyboard navigation (Escape/Arrow keys), prev/next buttons |

---

## Branding Notes

- **Client preference:** Use full name "Waste Pickers Welfare Foundation" everywhere in UI — not "WWF" abbreviation
- **Logo text in navbar:** `Waste Pickers` (blue) + `Welfare Foundation` (green)
- **Footer heading:** "Waste Pickers Welfare Foundation" (no "WWF -" prefix)
- **Copyright:** "© 2026 Waste Pickers Welfare Foundation. All Rights Reserved."

---

## Deployment Notes

- Static site — can be deployed to any static hosting (Netlify, Vercel, GitHub Pages, etc.)
- No server-side dependencies
- Contact form currently has `action="#"` — needs backend integration
- Newsletter form has `onsubmit="return false;"` — needs backend integration
- Google Maps iframe uses a placeholder embed URL — verify for production
- Annual report PDFs are stored in `assets/` folder
- Image paths from `../new images/` should be moved to `assets/` for clean deployment

---

## Recent Changes (April 2026)

1. ✅ Renamed 23 screenshot images with descriptive filenames
2. ✅ Created `gallery.html` — full gallery page with masonry layout, 5 category filters, lightbox modal
3. ✅ Added image carousel to home page — 6 slides with auto-play, dots, captions
4. ✅ Updated branding: "WWF Foundation" → "Waste Pickers Welfare Foundation" across all pages
5. ✅ Added GALLERY link to navigation on all 7 pages
6. ✅ Updated footer quick links to include Gallery on all pages
7. ✅ Updated home page gallery preview with curated new images
8. ✅ Created this CONTEXT.md file for AI agent reference
