# WWF NGO Site — Backend + Admin + Blog

Express.js server that serves the static website **and** adds:

- **Blog CMS** at `/blog` (public) and `/admin/blogs` (authenticated)
- **Admin dashboard** at `/admin` with login (`/admin/login`)
- **Form storage** — contact messages and newsletter signups saved to MongoDB (no more Formspree)
- **Subscribers CSV export** at `/admin/subscribers.csv`

---

## 1. Local setup

```bash
# From the project root (F:/ngo site)
npm install
cp .env.example .env
# then edit .env with your MongoDB URI and chosen admin creds
```

### MongoDB (free)

Create a free M0 cluster at https://www.mongodb.com/cloud/atlas:

1. Create a cluster (M0 free tier).
2. Create a database user (Security → Database Access).
3. Network Access → allow `0.0.0.0/0` (or Heroku's IPs).
4. Connect → Drivers → copy the connection string and replace `<password>` and database name `wwfngo`.

Paste it into `.env` as `MONGODB_URI=...`.

### Create the admin account

```bash
npm run create-admin
```

This reads `ADMIN_EMAIL` + `ADMIN_PASSWORD` from `.env` and creates/updates the admin user.

### Run locally

```bash
npm start
```

Site: http://localhost:3000
Admin: http://localhost:3000/admin/login

---

## 2. Deploying to Heroku

```bash
# From project root
git init
git add .
git commit -m "Initial commit"

heroku create your-app-name        # or use an existing one
heroku buildpacks:set heroku/nodejs

# Set config vars
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set SESSION_SECRET="$(openssl rand -hex 32)"
heroku config:set ADMIN_EMAIL="you@example.com"
heroku config:set ADMIN_PASSWORD="a-strong-password"
heroku config:set ADMIN_NAME="Your Name"
heroku config:set NODE_ENV="production"
heroku config:set SITE_URL="https://your-app-name.herokuapp.com"

git push heroku main               # or `master`, depending on your default branch

# Create admin after first deploy
heroku run npm run create-admin
```

### Custom domain (wwfngo.org)

```bash
heroku domains:add wwfngo.org
heroku domains:add www.wwfngo.org
# Heroku will give you DNS targets; add those as ANAME/CNAME records at your registrar
```

Then update `SITE_URL`:

```bash
heroku config:set SITE_URL="https://wwfngo.org"
```

---

## 3. Writing blog posts

1. Log in at `/admin/login`.
2. Click **+ New post** (top right) or **Blogs → + New post**.
3. Fill in:
   - **Title** (required)
   - **Slug** (optional — auto-generated from title if blank)
   - **Excerpt** — shows in listings and social cards
   - **Cover image URL** — e.g. `/assets/community.png` or any absolute URL
   - **Tags** — comma-separated
   - **Content** — plain HTML (`<p>`, `<h2>`, `<h3>`, `<ul>`, `<blockquote>`, `<img>`, `<a>`)
   - **Status** — Draft (hidden) or Published (live at `/blog/your-slug`)
4. **Save**. Drafts are editable; published posts go live immediately.

---

## 4. Reading form submissions

- **Admin → Contact Messages** — view, mark-read, delete all contact form submissions
- **Admin → Subscribers** — view all newsletter emails, export as CSV

No third-party service (Formspree, Mailchimp, etc.) is used. All data lives in your own MongoDB.

---

## 5. Project structure

```
F:/ngo site/
├─ server.js                # Express entry
├─ package.json
├─ Procfile                 # Heroku: web: node server.js
├─ .env.example
├─ models/                  # Mongoose schemas
│   ├─ User.js
│   ├─ Blog.js
│   ├─ Contact.js
│   └─ Newsletter.js
├─ routes/
│   ├─ api.js               # POST /api/contact, POST /api/newsletter
│   ├─ blog.js              # GET /blog, /blog/:slug
│   └─ admin.js             # /admin/* (auth-protected)
├─ middleware/
│   └─ auth.js
├─ views/                   # EJS templates for dynamic pages
│   ├─ admin/               # login, dashboard, blog editor, submissions, subscribers
│   ├─ blog/                # listing, single post, 404
│   └─ partials/            # shared nav, footer, head
├─ scripts/
│   ├─ create-admin.js      # seeds/updates admin user from env
│   ├─ apply-a11y.js        # one-time: skip-link + <main> landmark
│   └─ wire-forms-and-nav.js # one-time: swap Formspree → /api + add blog nav
└─ wwf-website/             # the existing static site (served as-is)
    ├─ index.html … etc.
    ├─ css/style.css
    ├─ js/script.js
    ├─ js/forms.js          # fetch-based form submitter
    └─ assets/...
```

---

## 6. Security notes

- Passwords stored as bcrypt hashes (cost factor 12).
- Sessions stored in MongoDB via `connect-mongo`, 14-day TTL, HttpOnly + Secure (prod) + SameSite=Lax cookies.
- Rate limiting: `/api/*` 20 req / 15 min per IP, `/admin/login` 10 req / 15 min per IP.
- Helmet enabled (CSP disabled — Google Analytics/fonts need custom CSP if you want it on).
- Honeypot field `website` on contact + newsletter forms silently drops bot submissions.

## 7. Common operations

```bash
heroku logs --tail                       # live server logs
heroku run node                          # REPL on Heroku
heroku config                            # list all env vars
heroku restart
```

To reset the admin password, just run `npm run create-admin` again with the new `ADMIN_PASSWORD` — it updates the existing user.
