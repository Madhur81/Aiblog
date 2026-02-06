# context.md — Aiblog (Full details)

> Project: **Aiblog** — AI-enabled full-stack blog platform (MERN + Google Gemini + ImageKit)

---

Figma public link (view only):
https://www.figma.com/design/DxxQDkTzd9avXdSbzOKbJ9/QuickBlog?node-id=0-1&t=OEzn4Y0oMf1TeFaf-1

## 1. Project overview

Aiblog is a full-stack blog application built with **MongoDB, Express, React, Node.js (MERN)**. It includes an admin dashboard to create, edit, publish, and manage posts and comments. The app integrates an AI content generator (Google Gemini) to assist or auto-generate blog content and ImageKit for image uploads/hosting. The user (you) will provide design images/screenshots; developer should replicate the provided UI exactly and ask for any API keys needed.

**Primary goals:**

* Build a production-ready, deployable blog app named **Aiblog**.
* Provide a responsive public blog (list, single post, author pages, search, categories).
* Provide an admin panel for CRUD on posts, categories, comments, and settings.
* Integrate AI to generate blog title, outline, and body drafts.
* Use ImageKit for secure image uploads and CDN delivery.
* Deploy frontend (Vercel) and backend (recommended: Render / Railway / Vercel Serverless functions), and host DB (MongoDB Atlas).

---

## 2. Core features (minimum viable product - MVP)

**Public site (client):**

* Home / latest posts list with pagination
* Post detail page with images, author, publish date, tags
* Category and author filtering
* Full-text search (title/body)
* Commenting (optionally public or only via admin moderation)
* Responsive design for mobile/desktop

**Admin dashboard:**

* Login / authentication for admin (JWT)
* Dashboard overview (posts count, comments, drafts)
* Create post (title, slug, category, tags, rich text editor, feature image)
* Edit / Delete post
* Manage categories and tags
* Manage comments (approve/delete)
* Generate post content with AI (title, outline, full draft) with editable output
* Upload images (ImageKit integration) and insert in posts

**Extras (nice-to-have):**

* Autosave drafts
* WYSIWYG editor (TipTap or React Quill)
* Scheduled publishing
* SEO meta fields (title, description, canonical URL)
* Social sharing previews

---

## 3. Tech stack & tools

* Frontend: React (Vite or Create React App); React Router; Tailwind CSS (optional) or plain CSS as requested
* Backend: Node.js + Express
* Database: MongoDB (MongoDB Atlas recommended)
* Authentication: JWT (access + refresh optional)
* AI: Google Gemini API (backend server calls) — use server-side so keys are not exposed
* Images: ImageKit (client upload with signed URL or server-side upload)
* Deployment: Frontend to Vercel; Backend to Render/Railway/Vercel serverless
* Environment/config: .env for secrets (MONGODB_URI, JWT_SECRET, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT, GEMINI_API_KEY or GOOGLE_API_KEY)

---

## 4. Data model

*Removed by owner.* The developer is free to design the database schema, collections, and document shapes as they see fit during implementation. Please document the chosen schema and reasoning in the project's README so future maintainers understand the design.

---

## 5. API endpoints (recommended)

**Auth**

* `POST /api/auth/login` — returns JWT
* `POST /api/auth/register` (optional)

**Posts**

* `GET /api/posts` — list (query: page, q, category, tag)
* `GET /api/posts/:slug` — single post
* `POST /api/posts` — create (admin)
* `PUT /api/posts/:id` — update (admin)
* `DELETE /api/posts/:id` — delete (admin)

**Images**

* `POST /api/uploads/image` — (signed upload or server-side forward to ImageKit)

**Comments**

* `POST /api/posts/:id/comments` — submit comment
* `GET /api/posts/:id/comments` — list comments
* `PUT /api/comments/:id/approve` — admin approve

**AI (server-side)**

* `POST /api/ai/generate` — params: `{ mode: 'title'|'outline'|'body', topic, tone, length }` — backend calls Google Gemini and returns generated text

---

## 6. AI integration details (Google Gemini)

**High-level approach:**

* All calls to the AI API must be performed on the backend. The backend keeps the API key in environment variables and enforces rate limiting and prompt safety.
* Provide a set of safe, structured prompts/templates to generate: title, outline (section headings), and body draft.

**Example prompt templates (server-side):**

* Title: "Write 8 catchy blog post titles about: {{topic}} for audience {{audience}}. Keep titles under 12 words."
* Outline: "Generate a detailed blog post outline with 6 sections for the title: {{title}}. Each section should be 1 sentence describing what to write."
* Body: "Write a conversational blog post of ~{{word_count}} words for developers about: {{title}} and follow the outline: {{outline}}. Include code blocks where relevant and an intro + conclusion."

**Safety & quality:**

* Sanitize user inputs to avoid prompt injection.
* Let admin edit and approve generated content before publishing.

---

## 7. Image upload flow (ImageKit)

Two recommended flows:

**Client direct upload (recommended for performance)**

1. Frontend requests an upload signature from backend: `GET /api/uploads/sign`.
2. Backend returns a signed token (using IMAGEKIT_PRIVATE_KEY).
3. Frontend uploads directly to ImageKit using their SDK with the signed token.
4. ImageKit returns a file URL which is saved in the post document.

**Server-side upload (simpler)**

1. Frontend uploads image to backend endpoint `POST /api/uploads/image` (multipart/form-data).
2. Backend forwards the image to ImageKit using their server SDK and returns the file URL.

**Env vars for ImageKit**

* IMAGEKIT_PUBLIC_KEY
* IMAGEKIT_PRIVATE_KEY
* IMAGEKIT_URL_ENDPOINT

---

## 8. Authentication & Security

* Use bcrypt to hash passwords.
* Use JWT (expires in e.g. 7d) for admin sessions.
* Protect admin routes with middleware verifying JWT and role.
* Rate limit AI endpoints to avoid runaway API usage.
* Validate all payloads (express-validator or Joi).
* Store secrets in environment variables (never commit `.env`).

---

## 9. Frontend components & pages (suggested)

**Public**

* Home (post list) — components: PostCard, Pagination, SearchBar
* Post Page — PostContent, Comments, RelatedPosts
* Category Page — filtered list
* About / Contact (optional)

**Admin**

* Login
* Dashboard (metrics)
* PostsList (with filters: published/draft)
* PostEditor (title, body editor, AI generate modal, image upload)
* Categories management
* Comments moderation

---

## 10. Project structure

*Removed by owner.* The developer will choose the project folder structure, build tooling, and file layout that best fits their implementation approach. Ensure the chosen structure is documented in the README and is easy to follow for handover.

---

## 11. Dev setup & quick commands

**Prereqs:** Node 18+, npm or yarn, MongoDB Atlas account, ImageKit account, Google Gemini API access (or other AI provider).

**Local dev**

* `cd server` -> `npm install` -> `npm run dev` (uses nodemon)
* `cd client` -> `npm install` -> `npm run dev` (Vite or CRA start)

**Environment variables (.env.example)**

```
MONGODB_URI=
JWT_SECRET=
PORT=5000
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
GEMINI_API_KEY=
```

---

## 12. Deployment notes

* Frontend: push to Vercel (set `NEXT_PUBLIC_` env vars if using Next; for CRA/Vite set build envs). Use the site name Aiblog in metadata.
* Backend: Deploy to Render, Railway, or Vercel serverless functions. Configure CORS to allow frontend origin.
* DB: MongoDB Atlas connection string in production environment settings.
* AI keys & ImageKit keys should be set in the server's environment variables.

---

## 13. Testing & Acceptance criteria

**Acceptance tests for "done"**

* Public site lists posts and displays a single post with images.
* Admin can login, create, edit, delete posts.
* Image upload stores and returns usable image URLs served by ImageKit CDN.
* AI generation endpoint returns usable content which can be edited and then saved as a post.
* Site deploys to Vercel (client) and backend is reachable from client.

**Basic QA checklist**

* Mobile responsive checks
* Broken link checks
* Form validation checks
* Security: no API keys exposed in client bundle

---

## 14. What developer (antigravity) must ask from you

When starting, developer should request these assets/values (do **not** proceed without final confirmation):

1. Design images/screenshots (you said you'll provide them) — label each image with page name.
2. MongoDB connection string for production or Atlas access (or developer can use a dev DB and ask you to set production string later).
3. ImageKit keys (PUBLIC + PRIVATE + URL_ENDPOINT) or permission to create account.
4. Google Gemini API key (or instructions which AI provider to use). If you don't want to share keys, developer should set up stub/mock generation and provide instructions to plug the key.
5. Site name: **Aiblog** (confirmed).
6. Any branding assets: logo, color hex, favicon.

---

# Quick start prompt (to send to "antigravity")

> Use this exact prompt to give to the developer/assistant named *antigravity*. It contains the full brief, expectations, milestones, and acceptance criteria. Ask for any missing API keys before building. Keep all naming as **Aiblog**.

**Prompt for antigravity**

"Hello Antigravity — brief: build a production-ready full-stack blog app called **Aiblog** that matches the UI screenshots I will provide. Use MongoDB, Express, React, Node (MERN). Integrate ImageKit for image uploads and Google Gemini (server-side) for AI-powered blog generation. Follow these instructions precisely:

1. **Deliverables & priorities**

   * **MVP (deliver first):** Public blog list, post detail, admin login, admin CRUD for posts, image upload (ImageKit), AI generate feature (title/outline/body) reachable from the post editor.
   * **Polish (after MVP):** Pagination, search, categories, comments moderation, SEO meta fields, responsive design.
   * Provide a clean GitHub repo with two folders: `client/` and `server/`. Include README and .env.example.

2. **Design & assets**

   * I will provide screenshots/images for: Home, Post page, Admin Posts list, Admin Post Editor. Recreate layout and spacing to match exactly.
   * Use the site name **Aiblog** everywhere (title, meta tags, header). Use any placeholder logo until I provide the real one.

3. **APIs & keys**

   * Before calling any third-party API, request these keys from me: MongoDB connection string (if production), ImageKit public/private keys + url endpoint, Google Gemini API key. If I don’t provide Gemini key, implement a server-side mock that returns a plausible draft and clearly label where to plug real key.

4. **AI behavior**

   * Provide server endpoint `POST /api/ai/generate` with modes `'title'|'outline'|'body'`. Use structured prompts (title -> outline -> body). Ensure generated content is editable in the admin editor before saving.
   * Implement server-side rate limiting for the AI endpoint.

5. **Image uploads**

   * Implement signed direct uploads to ImageKit (preferred). Provide fallback server-side upload endpoint.

6. **Auth & security**

   * Implement JWT-based auth for admin. Protect admin routes. Hash passwords with bcrypt.
   * Do not expose any private keys in client code. Use environment variables.

7. **Database & models**

   * Use collections: users, posts, comments, settings (as documented). Provide a seed script to insert an admin user and a few sample posts.

8. **Dev & run commands**

   * Provide exact commands to run client and server in dev and production build commands. Provide `npm run dev` for both.

9. **Testing & QA**

   * Check mobile responsiveness for breakpoints: 320px, 768px, 1024px.
   * Verify image URLs load from ImageKit and AI endpoint returns well formatted text.

10. **Milestones & timeline** (deliverables only; ask me if timeline needed)

* Milestone 1: Repo skeleton + auth + DB models + basic posts CRUD.
* Milestone 2: Client post listing + post detail + admin post editor + image upload.
* Milestone 3: AI integration + comment moderation + deployment config.
* Final: Deploy frontend to Vercel and backend to Render/Railway. Provide steps to set production env vars.

11. **Acceptance criteria**

* I can log in as admin and create a post with an image and an AI-generated draft, edit it, save it as published, and see it on the public site.
* No API keys are visible in client bundles.

12. **When you need anything from me**

* Ask for ImageKit keys, Gemini key, production Mongo URI, logo, and page images. Do not continue to production deploy without my confirmation.

Build everything under the project name **Aiblog** and push commits frequently with clear messages. If anything is ambiguous, ask me a single clarifying question — otherwise implement sensible defaults and note them in the README."

---

## 15. Final notes to developer/helpful tips

* Keep AI calls server-side for security and cost control.
* Use environment variable names as listed so I can plug them into Vercel/Render easily.
* Keep the codebase simple and well-documented so I (or another developer) can maintain it.

---

*End of context.md*

## 16. Design assets & filename rules (IMPORTANT — read before starting)

1. **Assets package & screenshots**

   * You (the project owner) will provide:

     * A Google Drive / Dropbox link with all screenshots (named by page).
     * A zip file named `Aiblog-Assets.zip` containing images, icons, and other assets.
   * Developer must use these provided assets as the single source of truth for visuals.

2. **Rename / branding rule (mandatory)**

   * The assets ZIP may contain files or image names that reference **Quickblog** or other previous project names. **Do not** use or display the name "Quickblog" anywhere in the project (UI, metadata, filenames, commit messages, or docs).
   * When saving or referencing any asset that contains the string `quickblog`, `Quickblog`, `quick-blog`, or similar, rename it to use the project name **Aiblog**. Example: `quickblog_logo.png` → `aiblog_logo.png`.
   * In any place where a legacy path or file mentions `D:\Aiblog\context.md` or similar local paths, do **not** use that path in the repository or deployment. Use relative project paths (e.g. `/assets/images/aiblog_logo.png`) and the canonical project name **Aiblog** everywhere.

3. **What to include in commits & repo**

   * Before committing any asset or file, scan filenames and file contents for the strings `quickblog` (case-insensitive) and replace them with `aiblog` (all lowercase is fine for filenames). For displayed text (UI or metadata), use **Aiblog** (capital A) consistently.
   * Add a short `scripts/rename-assets.sh` or README note describing the renaming step you performed so maintainers know you intentionally removed references to Quickblog.

4. **How we will deliver assets (recommended)**

   * Upload `Aiblog-Assets.zip` to Google Drive and set **Anyone with link → Viewer**.
   * Place the screenshots in a folder named `design-screenshots/` and name them as described earlier (e.g., `01-home-desktop.png`).
   * Share both links (Drive zip + screenshot folder) with the developer.

5. **If you (developer) find any Quickblog strings during development**

   * Immediately create a small utility commit that renames occurrences and documents the changes in the commit message: `chore: replace quickblog -> aiblog in assets and metadata`.
   * Notify the project owner in the PR description which files were changed.

6. **Final QA step (before merge/deploy)**

   * Run `grep -Rni "quickblog" .` in the repo root to confirm there are no remaining occurrences.
   * Confirm the public site header, title tag, sitemap, and all admin pages display **Aiblog** only.

---

*Note:* These rules are non-negotiable — they are needed to ensure brand consistency and avoid accidentally leaking references to the tutorial or other projects.
