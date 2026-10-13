# Andrii Teslia — Portfolio

Portfolio site: a horizontal film-strip home page and four case-study pages. Plain HTML, CSS and JavaScript: no build step and no dependencies, so it runs as-is on GitHub Pages.

## Structure

```
New Portfolio/
├── index.html                 Home page: horizontal film strip
├── medpal.html                Case study 01
├── predatorfest.html          Case study 02
├── rentflow.html              Case study 03
├── tim.html                   Case study 04
├── favicon.png
├── README.md
├── .gitignore
└── assets/
    ├── css/
    │   ├── style.css          Home page styles; colours and fonts are tokens at the top (:root)
    │   └── case.css           Case study styles (same tokens)
    ├── js/
    │   ├── main.js            Home: scrolling, reveals, parallax, cursor, logo effects, cover loader
    │   └── case.js            Case pages: reveals, section index, lightbox, gallery, image placeholders
    ├── cv/
    │   └── andrii-teslia-cv.pdf   Opened by the "View / Download CV" buttons
    └── img/
        ├── floaters/          Tool logos: claude.png, gpt.png, gemini.png, figma.png
        ├── medpal/            MedPal images
        ├── pfl/               Predator Fest League images
        ├── rentflow/          RentFlow images
        └── tim/               TIM images
```

## Project images

Copy the four image folders from the old site into `assets/img/` (same folder names: `medpal`, `pfl`, `rentflow`, `tim`). The case pages expect these files:

| Folder | Files |
|---|---|
| `medpal/` | hero-banner, solution-pillars, screens-onboarding, screens-dashboard, screens-health-score, screens-trends, screens-experts, screens-chat, screens-journal (all `.png`) |
| `pfl/` | hero-banner, problem-before, fests-screens, tabs, screens-web-desktop, screens-tg-mini-app (all `.png`) |
| `rentflow/` | hero-banner, value-exchange-diagram, swot-analysis, wireframes-overview, typography-system, colors-palette, ui-kit-components, screens-onboarding-1/2, screens-search-1/2, screens-tenant-account-1/2, screens-property-1/2, screens-roles-investor, screens-roles-agent, deliveries-figma-1…4 (all `.png`) |
| `tim/` | hero-banner, design-process, discover-interviews, discover-pain-gain, define-ia, ideation-concepts, design-authorization, design-registration, design-timo-flow, design-components, design-styles-left, design-styles-right, design-system (`.png`); prototype-a/b/c (`.gif`) |

If a file is missing, the page shows a striped placeholder with the exact path it expects, so you can see at a glance what still needs adding.

**Home page covers.** Each coloured block on the home page shows `assets/img/<project>/cover.webp`, a lightweight copy of that project's `hero-banner.png` (about 30–130 KB instead of up to 6 MB), so it appears instantly while scrolling. To use a different picture on the home page, replace `cover.webp` with your own image (around 1800 px wide, WebP or JPG) and keep the same name, or change the `src` of the `<img class="cover">` in `index.html`.

Keep images under ~500 KB where possible (export at 80% quality or use WebP) so the pages stay fast.

## Editing content

| What | Where |
|---|---|
| Name, position, intro text | `index.html`, section `intro` |
| Project titles, tags, numbers, links | `index.html`, sections with `class="panel project"` |
| Experience timeline | `index.html`, section `path` |
| Skills and tools | `index.html`, section `kit` |
| Email and social links | `index.html`, section `contact`; footer of each case page |
| Case study text | `medpal.html`, `predatorfest.html`, `rentflow.html`, `tim.html` |
| Case accent colour | `style="--c:…"` on `<body>` of each case page |
| Accent colour, fonts | `assets/css/style.css`, `:root` at the top |
| Rotating role titles | `assets/js/main.js`, `roles=[...]` |

Links from a case page back to the home page use `index.html#medpal` (and so on), which opens the strip at that project.

## Run locally

Opening `index.html` directly works. For behaviour identical to the live site, serve the folder:

```
cd "New Portfolio"
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Publish on GitHub Pages

1. Push this folder to a GitHub repository (the files above at the repository root).
2. In the repository: **Settings → Pages → Build and deployment → Deploy from a branch**, pick `main` and `/ (root)`.
3. For the custom domain, enter `andriiteslia.com` under **Custom domain**. GitHub creates a `CNAME` file for you.
