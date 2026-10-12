# L.M. Résidence — Refonte du style (brief pour Rudo)

Repo : `fpswagg/lm-residence` (Next.js 15, React 19, Tailwind 4, shadcn/Radix). Branche de travail : `feat/refonte-style` (ne pas toucher `main` avant validation du owner).
Objectif du owner : **le style doit s'améliorer considérablement**. Niveau visé : site de type Awwwards (scroll cinématique, GSAP, touche 3D/WebGL), pas un thème bois/or avec dégradés. Prends ton temps, livre par phases, montre des captures à chaque phase.

## 1. Constat (état actuel)

- Visuel : fond brun foncé + or (#2d1f15 / #cd9a51), dégradés + blobs flous, cartes à bordure `border-2`, icônes lucide, boutons `rounded-lg` génériques. Ça fait « template IA ». Aucune hiérarchie typographique forte, aucune animation scroll, aucune identité.
- Pages : `/` (hero + 3 cartes + CTA), `/logements`, `/services`, `/galerie`, `/a-propos`, `/contact`, `/reservation`, `/politiques`, `/admin` (page de dev). Tout en `"use client"`, données dans `data/*.json`.
- Techno : aucune lib d'animation. `next/image` avec `images.unoptimized: true`.
- **Photos : 76 JPG bruts de 2,5 Mo (154 Mo dans `public/images`), non optimisés.** Qualité amateur : éclairage plat, flash, angles larges, couloirs vides, murs blancs, aucune cohérence de cadrage. Voir §4, c'est LE sujet clé : le design doit être fort *malgré* ces photos.
- Dette : `fs` et `path` listés en dépendances (à retirer), `typescript.ignoreBuildErrors: true`, `/api/admin/seed` + `/admin` publics (inutiles), nom incohérent dans `images.json` (légendes « camilla » vs studios Jean-Philippe / Alain-Christophe…), téléphone placeholder `+237 XXX XXX XXX`, `NEXT_PUBLIC_BASE_URL` requis par le sitemap.
- `lm-residence-dispo` (autre repo) = petit gestionnaire de disponibilités (Prisma/Postgres). **Hors périmètre** sauf si le front doit lire la dispo ; garder le contrat `/api/logements`.

## 2. Direction artistique

**Concept : « une maison, quatre portes ».** Une résidence privée à Yaoundé, chaleureuse, discrète, plus maison d'hôtes de caractère que palace. Éditorial, grand format, calme, avec du mouvement précis.

- **Palette** (remplacer le brun/or saturé) : papier `#F3EDE3`, ébène `#15110D`, laiton `#B58A45` (accent rare), sauge `#7A9278` (secondaire), terre cuite `#A8553A` (micro-accent). Alterner sections claires / sombres. Plus de dégradés décoratifs ni de blobs.
- **Typo** : display serif contrasté en très grand (Fraunces, Instrument Serif ou Cormorant — via `next/font`, variable) + sans neutre (Geist/Inter) petit, en capitales espacées pour les labels. Titres 8–14 vw sur desktop, mots coupés en lignes avec reveal. Numérotation éditoriale 01–04.
- **Grille** : marges larges, colonnes asymétriques, images qui débordent, texte qui chevauche l'image. Beaucoup d'air. Zéro carte « icône + titre + texte » en 3 colonnes.
- **Détails** : curseur custom (desktop), boutons magnétiques, soulignements animés, préloader avec monogramme LM, grain léger, transitions de page.

## 3. Mouvement et 3D (stack proposée)

- `gsap` + `ScrollTrigger` (+ `@gsap/react`, `useGSAP`), `lenis` pour le scroll lissé branché sur ScrollTrigger. `SplitText` est gratuit depuis GSAP 3.13 (sinon split maison).
- **Hero** : plein écran, mot « L.M. » géant, image en `clip-path` qui s'ouvre au chargement, parallaxe lente. Signature WebGL **optionnelle et légère** : `three` (ou `ogl`) avec un shader de distorsion/déplacement sur l'image hero et au survol dans la galerie ; fallback image statique si mobile / `prefers-reduced-motion` / pas de WebGL. Charger en lazy (`next/dynamic`, `ssr:false`).
- **Section « Une journée à L.M. »** : section épinglée, la couleur de fond et la lumière passent matin → midi → soir → nuit au scroll (day/night comme ERA Residence), textes qui défilent (petit-déjeuner du chef, chauffeur, sécurité DAK de nuit…). C'est ça qui vend les services, pas des icônes.
- **Les 4 logements** : scroll horizontal épinglé (ou liste verticale géante avec image qui suit le curseur), numéros 01–04, prix/surface/capacité en détails typographiques, page détail par studio (`/logements/[slug]`) avec galerie plein écran et transition partagée.
- **Galerie** : mur masonry avec reveal au scroll, lightbox plein écran (drag, clavier), filtres par pièce, légendes correctes.
- **Marquee** de mots-clés (Sécurité 24/7 · Cuisinier · Chauffeur · Climatisation…), compteurs, texte qui se révèle mot à mot.
- **Perf/accessibilité** : 60 fps mobile, LCP < 2,5 s, JS animation chargé par route, `prefers-reduced-motion` respecté partout (pas d'animation, contenu visible), focus visibles, contraste AA, `lang="fr"`, navigation clavier, alt corrects. Désactiver Lenis et WebGL sur appareils faibles.
- Garder le site **utilisable sans JS** pour le contenu (SSR) : ne pas cacher le texte tant que GSAP n'a pas chargé sans fallback.

## 4. Photos : stratégie (essentiel)

Les photos actuelles ne porteront pas un site « luxe » telles quelles.

1. **Pipeline** : script `scripts/optimize-images.mjs` (sharp) : max 2400 px, AVIF + WebP + JPEG, placeholders blur, sortie dans `public/img/`. Réactiver l'optimisation `next/image` (retirer `unoptimized`), `sizes` corrects. Objectif : ≤ 25 Mo au total, ≤ 250 Ko par image affichée.
2. **Curation** : choisir 8–12 meilleures images par studio, écarter couloirs vides, flash, doublons (les logements.json répètent même DSC_0188 deux fois). Dresser un tableau `data/photos.json` (fichier, pièce, studio, note, focal point pour le recadrage).
3. **Traitement homogène** : étalonnage commun (balance des blancs chaude, contraste doux, grain), recadrages serrés sur les détails (boiseries, fauteuil, baignoire, balcon) plutôt que les plans larges. Voir aussi `public/images/ai_enchanced/` et `facebook/`.
4. **Mise en scène** : images toujours cadrées dans des formes éditoriales (arches, portrait étroit, masques), jamais pleine largeur brute sauf les 2–3 meilleures. Typographie et mouvement portent l'impression de qualité.
5. **À recommander au owner** : un vrai shooting photo/vidéo (lumière du matin, 15 images + 20 s de vidéo ambiance pour le hero). Le design doit prévoir l'emplacement d'une vidéo hero en boucle (webm/mp4 léger) qui remplace l'image dès qu'elle existe.

## 5. Références à étudier (inspiration, pas copie)

- Awwwards Site of the Day, résidence / immobilier : **Sobha Privy Collection** (WebGL, Three.js, galeries 3D, zoom au scroll), **ERA Residence** (Webflow+GSAP, préloader, scroll horizontal, bascule jour/nuit), **Realevate**.
- Hôtel : **Velaa Private Island**, **Villa Aurelia**, **Vander Hotel**, **White Desert** (Next.js + GSAP), **Le Saint Georges**, **KUBE Saint-Tropez**. Liste : https://www.awwwards.com/websites/hotel/ et https://www.awwwards.com/websites/real-estate/
- Collections techniques : https://www.awwwards.com/awwwards/collections/ (chercher « scroll », « WebGL », « storytelling »), https://www.awwwards.com/inspiration/ (Hotel Odisej, KVS Studio pour Lenis + GSAP + Three).
- Docs : gsap.com/docs/v3/Plugins/ScrollTrigger, lenis (darkroomengineering), tympanus.net/codrops (tutoriels shaders/transitions d'images).
- Regarde le HTML/JS de 4–5 de ces sites pour comprendre découpage, easing (`power3.out`, `expo.inOut`), durées (0,8–1,4 s) et séquençage.

## 6. À ne pas casser

- Formulaires contact et réservation (`/api/contact`, `/api/reservations`, nodemailer, env `MAILER_USER/PASS/RECEIVER`). Valider côté client **et** serveur (zod déjà là), états succès/erreur beaux, honeypot anti-spam. Corriger le template mail (le `${telephone&&...}` peut afficher `undefined`/`false`).
- `/api/logements`, sitemap, robots, keywords SEO (`data/keywords.json`), métadonnées, icône. Ajouter OG image, données structurées (`LodgingBusiness` / `Accommodation`), `NEXT_PUBLIC_BASE_URL`.
- Données dans `data/*.json` : on les garde comme source de vérité (ajouter `slug`, `highlights`, `photos`).
- Supprimer `/admin` et `/api/admin/seed`, retirer `fs`/`path` des dépendances, remettre `ignoreBuildErrors` à false et corriger les erreurs de type.
- Un bouton WhatsApp flottant (numéro à demander au owner) serait très utile au Cameroun ; prévoir l'emplacement.

## 7. Livraison par phases

1. **Fondations** : tokens/couleurs/typo, Lenis + GSAP, pipeline images, nav + footer neufs, préloader, transitions de page.
2. **Accueil** : hero, manifeste, journée à L.M., logements, galerie aperçu, CTA. Captures desktop + mobile.
3. **Logements + pages détail**, **Services**, **Galerie**.
4. **À propos, Contact, Réservation (flow en étapes : dates → studio → coordonnées), Politiques**.
5. **Polish** : perf (Lighthouse mobile ≥ 90), a11y, reduced-motion, tests sur vrai mobile, OG, sitemap.

À chaque phase : commit sur `feat/refonte-style`, `next build` sans erreur, déployer en *preview* Vercel et envoyer le lien au owner. Ne pas fusionner dans `main` sans son feu vert.

## 8. Questions ouvertes pour le owner

- Où est déployé le site aujourd'hui ? (`lm-residence.com` ne répond pas côté DNS ; projet Vercel non lié sur le serveur.)
- Téléphone / WhatsApp réel, adresse exacte, Facebook/Instagram, nom exact des studios (légendes « Camilla » dans `images.json`).
- Tarifs : 40 000 FCFA par nuit ? afficher ou « sur demande » ?
- Veut-il un shooting photo ? Veut-il EN en plus du FR ?
- Niveau de 3D souhaité : subtil (shader sur les images) ou démonstratif (scène Three.js plein écran) ?
