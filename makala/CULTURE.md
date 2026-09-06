# Makala — Writing Culture & Voice Guide

> This file exists so that **any future agent** who adds or edits blog articles
> keeps the same soul, voice, and quality. Read it fully before touching anything
> under `/makala/`. It is a contract, not a suggestion.

## What this blog is

`/makala/` is an open tech notebook and knowledge space by **Watu Lab** — a
community of independent developers, not a company. It is written in **Swahili**
(with English tech terms left in English) for curious young Tanzanians / East Africans
who love tech. It is not a company press release, corporate PR, or textbook. It is
fellow developers and big brothers/sisters sharing real engineering lessons with humility.

> **Golden Rule: Show, don't tell.** The brotherhood, care, and simplicity must be
> **experienced** when reading the articles, never bragged about as a headline or slogan.

## The voice (non-negotiable)

- **First person.** The writer says "nimeona", "najua", "ngoja nikueleze".
- **Direct address without cheesy confessions.** Talk TO the reader naturally ("wewe", "unapojenga", "hebu fikiria"). Do NOT use overt cheesy vocatives like "ndugu yangu!", "rafiki yangu!", "kama kaka/dada yako", or "kutoka moyoni". The brotherhood and care must be **experienced** through clear teaching, practical empathy, and encouragement — never confessed or preachy.
- **Warm and enthusiastic.** Genuine excitement about the topic. It should feel
  like chatting, not lecturing.
- **Entertaining, not robotic.** Use everyday analogies (restaurant, street-food
  mama, calculator for a mathematician), short punchy sentences, and a
  conversational rhythm. Never read like auto-generated or translated text.
- **Honest about difficulty but always encouraging.** It is fine to say
  "sehemu hii inahitaji subira" — then immediately hand them the way through it.
- **Zero negativity / fear-mongering.** Problems may exist, but always frame them
  through a positive lens of opportunity. E.g. never "AI itachukua kazi zako" —
  instead "AI ni zana yako; watu wanaoijua wataongoza." No doom, no dread.
- **Never condescending.** The reader is smart and curious. Explain clearly, but
  never talk down.

## Language rules

- Base language: **Swahili**.
- **English tech terms stay English** on (at least) first mention: SSR, ISR,
  framework, AI, database, server, CDN, portfolio, etc. Avoid forcing deep or
  obscure Swahili translations for technical words — clarity wins.
- Keep Swahili natural and warm, the way it is actually spoken, not stiff formal
  Swahili.
- Tech **accuracy is a hard requirement**. The voice may be casual, but the facts
  must be correct. Never sacrifice truth for a fun line.

## Structure & formatting

- Every article needs a personal opening hook, then a clear path through the
  topic, and a **heartfelt closing** that encourages the reader to keep going.
- Break content with `h2`/`h3` headings. Use short paragraphs (2–4 lines max).
- Use lists, tables, code blocks, and callouts (`.callout`) freely to keep it
  scannable.
- Write **~1000–1600 words** per article (roughly 8–10 minute read). Depth is
  welcome, but never padding.
- Author byline is always **"Watu Lab Team"** — never an individual name.

## Style lexicon

| Say | Don't say |
|---|---|
| Siri ndogo | (in general) |
| Habari njema | — |
| Neno la mwisho | Conclusion |
| Endelea kujifunza, endelea kujenga | Stay tuned |

(These are flavour suggestions, not strict rules — but keep the warmth.)

## SEO requirements (do not skip)

Every new article page **must** include:

1. `title` + `meta name="description"` (Swahili, describes value, under ~160 chars).
2. `<link rel="canonical">` pointing to the clean URL (`https://watulab.com/makala/<slug>/`).
3. Open Graph + Twitter meta (image: `https://watulab.com/assets/logo.jpeg`).
4. `BlogPosting` JSON-LD (headline, description, author/publisher = Watu Lab
   Organization, `datePublished`/`dateModified`, `inLanguage: "sw"`).
5. Author meta line shows: category badge, "Watu Lab Team", date, reading time.

## Adding a new article — checklist

1. Create folder `makala/<kebab-case-slug>/` and copy the structure of an
   existing article's `index.html` (it is the template).
2. Update: `<title>`, meta description, canonical, OG/Twitter, JSON-LD
   (`datePublished` = today), heading, meta line, and full content.
3. Wire related-article links at the bottom to other recent articles.
4. Add a card to `makala/index.html` in the `#post-grid` — set correct
   `data-category` (one of `web`, `kazi`, `ai`) and a rich lowercase
   `data-searchtext` (title + keywords + category, Swahili + English) so search
   works.
5. Add the article URL to `sitemap.xml`.
6. Optionally bump the matching `BlogPosting` entry in the listing page's
   JSON-LD so the blog listing stays accurate.

### Categories

- `web` → badge "Mbinu za Mtandao" (`badge-web`)
- `kazi` → badge "Elimu & Kazi" (`badge-kazi`)
- `ai` → badge "AI & Mustakabali" (`badge-ai`)

Only reuse an existing category unless a genuinely new one is needed (then update
the chips row + CSS badge colour in `styles.css` as well).

## Site design rules

- Blog uses `makala/styles.css` + `makala/script.js` shared by listing and
  articles. Keep them dependency-free and static (GitHub Pages; no build step).
- Do not restyle the site or redesign pages as part of content work.
- Keep links `/makala/...` clean-URL style (folder + `index.html`).

## Remember

Readers come here to **learn something cool without feeling dumb**, and to feel
that someone believes in them. If an article does that, it is on culture. If it
reads like a dry tech manual, a press release, or a fear-driven doomsday piece —
rewrite it.
