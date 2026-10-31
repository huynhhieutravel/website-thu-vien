# YEP Indoor & Private Cruise — preview assets

Local preview: http://localhost:4328/yep-private-cruise
Original aviation route: http://localhost:4328/aerive

Generated with the built-in Imagegen tool. Atmospheric illustrations only; the six event photos remain documentary images supplied by the user. No production publishing.

## Generated assets
- public/images/yep-cruise/hero-cabin.webp — desktop hero
- public/images/yep-cruise/hero-cabin-mobile.webp — portrait crop of the generated hero
- public/images/yep-cruise/river-reflections.webp — interlude and closing backdrop

## Hero prompt
Use case: photorealistic-natural. Create a cinematic landscape 16:9 website hero background, no text. View from inside a traditional Vietnamese wooden river dinner cruise boat at night on the Saigon River. Warm reddish teak paneling, subtle antique brass details, broad rectangular open window on RIGHT two thirds, dark river and distant softly illuminated Ho Chi Minh City skyline beyond, warm amber and subdued violet reflections. LEFT third is shadowy teak interior with ample dark negative space for large cream website typography. Camera at seated eye level, atmospheric realistic editorial photography, premium but authentic wood cabin rather than modern yacht. No people, no airplane, no oval aircraft window, no clouds, no logos, no text. Illustrative atmosphere asset, not documentary event photo. Save generated image to disk and return local file path.

## River prompt
Use case: photorealistic-natural. Asset type: wide 16:9 cinematic website background. Primary request: quiet dark Saigon river water at night, close low perspective, most of frame gently rippling deep forest green almost black water, delicate elongated amber gold and muted purple light reflections. Distant soft Ho Chi Minh City city lights only along upper 15 percent, horizon high, realistic editorial photography with tactile water texture and subtle cinematic grain. Elegant atmospheric calm continuation of warm wooden dinner cruise mood. Broad dark negative space across middle left for cream typography. No boats, no people, no words, no logos, no map, no airplanes, no clouds. This is an atmospheric illustrative background, not event documentation. Save on disk.

## Sources
Six WebP files from https://media.fittour.vn/uploads/ copied under public/images/yep-cruise/, retaining original filenames and content.
Local full-character-set Lora and Manrope fonts sourced from Google Fonts (fonts.gstatic.com); serif family internally aliased as Cormorant for page styling.

## Verification
Astro production build successful. Browser checks at desktop and 390px mobile: horizontal overflow absent, content gutter 64px desktop / 24px mobile. Mobile navigation, lightbox next/close, and contact dialog open/close exercised. Contact dialog is a preview handoff to the FIT TOUR website, with no form submission.

## Motion revision
Added window-frame.webp (transparent window foreground) and vessel.webp (transparent illustrative wooden river cruise vessel), generated with built-in Imagegen. Window prompt: frontal symmetrical dark teak cabin wall, brass window frame, fully transparent central opening, warm lamps, no text or people. Vessel prompt: isolated traditional Vietnamese wooden dinner cruise, three decks, arched windows, warm lights, elevated three-quarter view, transparent background, no logos; illustrative rather than exact Indochina Star replica.

ScrollTrigger pins the window scene for 2.8 viewport heights: foreground scales to 5.4 while city scales to 1.15. Second pinned vessel scene enters from below, rotates gently, moves aside, reveals details. Reduced-motion fallback included. Original /aerive remains untouched.
