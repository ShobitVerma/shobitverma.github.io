# Shobit Verma — academic portfolio

## Stewart joystick project page

`projects/joystick.html` is the full visual case study, with page-specific styling in `projects/joystick.css` and interactions in `projects/joystick.js`. It includes a responsive contents sidebar, four component hotspots, nine original design views, fabrication and assembly photographs, the original hardware video, an image dialog, and interactive explanations of neural-network stages and control flow. The shared header, theme preference, and return-to-project browsing context remain supported.

The mechanical account follows the supplied UG thesis and presentation, checked against the earlier portfolio. Kinematics and control follow only the text of *Forward Kinematics Solution of a 6-DOF All-Revolute Parallel Manipulator Using Neural Network* (DOI: 10.1142/S0219876225500549), credited to Ashish Siddharth, Himanshu Varshney, and Arun Dayal Udai. The paper's 6-RSS model and results are explicitly distinguished from Shobit's potentiometer-based mechanical prototype; no images were extracted from that paper.

Local documents and unchanged source media are in `assets/projects/joystick/`. `source-map.json` records the original filenames, Drive IDs, presentation slides, and content references. The supplied report identifies UK registered design 6552818, registered on 11 September 2026 and granted on 23 September 2026. This work is prepared locally and has not been published.

A responsive, buildless portfolio using HTML, CSS, and JavaScript. It retains the compact academic layout, Georgia headings, original color palette, and fixed left sidebar. Main content centers in the available space beside the sidebar on large screens.

## Source

The website resume is `Shobit_Verma_Resume.pdf`, updated from the latest file supplied in Downloads. Both the view and download links use this file.

The supplied 24-page `Portfolio_ Shobit Verma.pdf` is a secondary reference for project development and imagery. Page 19 explicitly limits Shobit's ultrasound-robot contribution to mechanical design and assembly, excluding circuits and code; the experience and project entries reflect that distinction. Five original project images are extracted into `assets/projects/` from pages 4, 9, 12, 18, and 21. They appear in the project explorer and accessible image gallery.

The website includes:
- B.Tech. Mechanical Engineering, IIT (ISM) Dhanbad, May 2025.
- Four experience records, arranged by most recent start date: SLB, National Taiwan University, IIT (ISM) Dhanbad, and IISc.
- Twelve engineering projects, with the resume's technical descriptions.
- Two upcoming research papers with complete titles and original author order.
- Six international patent records marked Granted and three Indian patent records marked Filed, with the original inventor order, IDs, and descriptions.
- All listed awards, exam achievements, technical skills, leadership activities, and contact details.

Paper venues, publication dates, project dates, and patent filing dates are omitted where not supplied. No publication is presented as published or accepted. The resume's `example.com/paper1` and `example.com/paper2` sample URLs are omitted. Google Scholar, ORCID, and GitHub links are omitted because the resume supplies none. The initials in the sidebar are an intentional monogram, not a photo placeholder.

## Preview

Open `index.html` in a browser, or run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Maintain

Update content in `index.html` and styling in `style.css`. The mobile menu, active navigation, reading progress, combined project search/category filters, separate patent expand-all controls, saved light/dark theme, cursor interactions, scroll reveals, email copy action, image gallery, and current copyright year are handled in `script.js`. Press `/` outside an input to focus project search. Use the arrow keys to browse the image gallery and Escape to close it. Filtered project links reveal the linked record automatically; patent links open their technical descriptions.

Full technical descriptions, experience responsibilities, skills, publication summaries, and patent descriptions remain in the HTML and use native disclosure controls. Awards have a separate, always-visible list. Without JavaScript, all records and disclosures remain accessible; image links open the original asset. Search and other JavaScript controls are hidden in that mode. Clipboard copying provides a browser fallback and an explicit status message if copying is unavailable.

External LinkedIn, portfolio, and official patent-record links come from the resume. Indian patent links open the Indian IP portal, matching the supplied source, rather than claiming a record-specific URL.

## GitHub Pages

All local asset paths are relative. The site works at a domain root or repository subpath with no build dependencies. `.nojekyll` is retained. Nothing has been published or configured for deployment.

## Section order and interactions

About, Engineering Projects, Research & Professional Experience, International Patents, Domestic Patents (Filed), Awards, Education, Contact. Upcoming papers remain in an expandable block under Experience; technical skills and leadership remain under Education. About has no research-background disclosure, shortcut links, or featured-work block.

Projects use a responsive masonry layout with All, International patents, Domestic patents, Robotics, and Design filters, combined with search. Patent categories overlap the technical categories. The header includes View resume, Contact, and an accessible theme switch. Theme preference persists when browser storage is available; otherwise the system preference applies. Cursor effects only run for fine pointers, leave the normal cursor visible, and disable for reduced motion. Scroll reveals also respect reduced motion and leave content visible without JavaScript.

The IIT (ISM) logo is downloaded from its official website. The displayed SLB, NTU, and IISc logos are extracted unchanged from page 2 of the supplied old portfolio. All displayed logos are stored in `assets/logos/`; the downloaded SLB anniversary SVG is also retained.

Logo sources: [SLB](https://www.slb.com/-/media/images/logo/rgb_slb_100_logo_tm_reduced_blue.svg), [IIT (ISM)](https://www.iitism.ac.in/storage/files/small-logo.png).

## Latest content refinements

Upcoming Papers now has its own section and navigation entry, immediately after Experience. Awards follow the supplied eight-bullet screenshot, with the exam scores combined into one entry. Location fields, the external portfolio link, the top sidebar wordmark, and the sidebar footer copy are removed. Institutional names remain accurate.

The compliant chair is removed from the project explorer; its documented IISc research contribution remains in Experience. There are 11 project cards. The borehole compass is included in the domestic patent project filter as requested; no patent number or new patent record has been invented. MedTech includes respiratory simulation, surgical needle insertion, remote ultrasound, and the grip strength analyser.

Engineering vector illustrations are native SVG, including an animated linkage illustration and schematic motifs in project cards without photos. SVG symbols are embedded in the HTML so they work when opening the page directly as well as through GitHub Pages. Reduced-motion settings disable decorative animation.

## Research introduction and academic links

About includes a source-based research summary for NTU, IIT (ISM), and IISc, with the ultrasound contribution limited to mechanical design and assembly. Its decorative graphic is removed, and the header has no subtitle. Upcoming Papers follows Domestic Patents in both the document and navigation. The Bachelor thesis project filter selects the Stewart-Gough joystick project. Search uses the concise label "Search projects"; JEE is bold in Awards.

Professor and laboratory names link throughout the content. Official references: [Ping-Lang Yen](https://www.bime.ntu.edu.tw/English/News_Photo_Content_n_100917_s_104178.html), [Arun Dayal Udai](https://www.iitism.ac.in/faculty-details?faculty=arunudai), [G. K. Ananthasuresh](https://mecheng.iisc.ac.in/suresh/), [IIT (ISM) laboratory section](https://people.iitism.ac.in/~arunudai/#lab), and [IISc laboratories](https://mecheng.iisc.ac.in/laboratories/). The RMML destination is the university-listed [lab website](https://rmml.bime.ntu.edu.tw/); that server timed out during verification.

Additional animations include staggered content reveals, project-filter transitions, image zoom, card border sweeps, button feedback, theme-icon rotation, institution-logo hover, disclosure entry, gallery entry, and contact-arrow movement. Reduced-motion settings suppress these animations.

## Compact header and About

The main header contains only Contact, View resume, and the theme button, with reduced vertical padding. About is condensed into one research-and-career paragraph, retains the professor/lab links, abbreviates the degree to BTech, and highlights May 2025. Detailed project and experience records remain in their own sections.

## Professor emphasis and filter order

About uses unhighlighted IIT Dhanbad for both institute mentions. All linked professor names are highlighted. G. K. Ananthasuresh links to the official Mechanical Engineering faculty profile at https://mecheng.iisc.ac.in/project/g-k-ananthasuresh/; M2D2 Lab links to https://mecheng.iisc.ac.in/suresh/. Bachelor thesis precedes MedTech in the project filters.

## Color institution logos

Experience uses locally stored color branding: NTU's gold-and-maroon emblem, IISc's multicolor brand identity, SLB's blue wordmark, and IIT Dhanbad's official blue seal. Original assets remain available in the project.

Sources: [NTU emblem](https://www.ntu.edu.tw/english/about/emblem.html), [IISc brand identity](https://www.iisc.ac.in/iiscs-new-brand-identity/), [SLB](https://www.slb.com/), [IIT Dhanbad seal](https://www.iitism.ac.in/storage/files/small-logo.png). SLB's official white SVG artwork is rendered in #0014dc, the blue used by its official blue logo asset; its shape is unchanged. Images are loaded locally for GitHub Pages compatibility.

## IISc crest correction

The displayed IISc image is the blue traditional seal/crest, extracted unchanged from page 2 of the institute's official [brand identity document](https://www.iisc.ac.in/wp-content/uploads/2019/08/Press-note-on-IIScs-brand-identity.pdf), and stored locally as `assets/logos/iisc-seal-blue.png`. This replaces the abstract multicolor mark in the experience card.

## Reference color palette

The latest palette follows the supplied teal/coral reference with blue and gold accents. About uses a compact teal gradient panel, with uniform peach text emphasis and no highlight backgrounds. The sidebar monogram, active navigation, filter chips, project categories, experience borders, patents, papers, awards, contact area, reading progress, text selection, and scrollbars use the coordinated palette. The dark theme uses equivalent colors with lighter text accents. Content, section order, links, and the fixed sidebar structure are preserved.

## Uniform green correction

About has a plain background again. All interface accents use the same green, including headings, text emphasis, project filters, vector motifs, borders, buttons, awards, navigation, scrollbars, and reading progress. Pale green and neutral surfaces replace the multicolor backgrounds. Official organization logos retain their original colors.

## Playful project interactions

Random project clears search and filters, opens a different project, and focuses its technical description. Project cards respond gently to pointer movement, and engineering SVG illustrations animate on hover. Buttons provide brief ripple feedback. Effects respect reduced-motion preferences and retain the uniform green palette and plain About section.

## Copper contrast accent

Green remains the primary color. A warm copper secondary accent distinguishes patent labels and status badges, domestic patents, thesis and MedTech filters, selected project graphics, awards, and contact details. Dark mode uses lighter copper for readability. About retains its plain background and green emphasis.

## Blue contrast accent

The secondary copper accent has been replaced with blue: #285eb2 in light mode and #9bbfff in dark mode, with matching pale backgrounds. Green remains the primary color and About stays plain.

## Plum accent with green projects

The secondary accent is now plum (#78518c light, #d0abe6 dark) outside Projects. The entire project explorer retains uniform green cards, filters, graphics, and controls in both themes.

## Consistent section palettes

Each section now uses one accent for its headings, links, highlights, controls, badges, and accent borders. Projects, Experience, Education, Awards, and About retain green. Patent sections, Upcoming Papers, and Contact use a related muted ocean teal (#386879 light, #a0c6d2 dark) with matching subtle backgrounds. Body text and neutral borders retain readable neutral colors; official logos and project photos retain their source colors.

## Shared headings and side accents

All main section headings use primary green. Section heading bars, Experience card borders, patent and paper borders, Contact borders, and the active navigation stripe consistently use the secondary ocean teal. Both colors adapt to dark mode.

## Green-only palette

All interface accents now use the primary green, including headings, links, filters, badges, graphics, side bars, and card borders. Light and dark themes use matching pale green surfaces. Official logos and project photographs retain their original colors.

## Visible project descriptions

Project cards display their full descriptions beneath each title, using matching patent descriptions where available and preserving documented contributions. The Explore technical work disclosures are removed. Patent shortcuts remain available, and random discovery focuses the selected project title.

## Compact project summaries

Each project now has a concise, similarly sized summary in a consistent three-line space. Patent shortcuts specify UK Patent ID or Indian Patent ID, using the existing verified record numbers. Full patent descriptions remain in the patent sections.

## Expanded technical summaries

Project descriptions now have a consistent five-line space. Summaries include concrete design details and methods, including the respiratory platform's 340+ components and 108 bearings, and the harvesting tool's governing equations derived from trigonometric equations for 40 parameters, as clarified by the user. Patent labels and the green palette are retained.

## Reload position

Reloads clear the current section fragment and start at the top, preventing browser scroll restoration from reopening the page midway. Normal section links continue to work.

## Project reading order

Projects use a two-column grid filled left to right: bachelor-thesis Stewart joystick, respiratory Stewart robot, harvesting tool, RCM needle insertion, grip analyser, LHD, slurry agitator, self-balancing bike, gait mechanism, aseptic ultrasound, and borehole compass. Mobile uses the same sequence in one column.

## Widescreen project media

All eleven project media frames use responsive 16:9 proportions, including vector illustrations. Photos fit without cropping; new 16:9 photos fill the frame. The image gallery continues to show original assets.

## Individual project pages

Each of the eleven cards links through its title and View project button to a separate HTML page in projects/. These pages share project.css and project.js, retain the green palette and saved theme, and include existing project content, media, patent references where available, and previous/next navigation. Image-gallery links on the home page remain available. Each project page can now be edited individually; all paths remain relative for GitHub Pages. Nothing has been published.

## Entire-card navigation

Each project card is covered by its native project link, including its image and description. Patent buttons remain independently clickable. View project buttons and View image labels are removed. Keyboard users can focus the project title link or its separate patent link; cards also work without JavaScript.

## Sidebar portrait

The SV monogram is replaced by `assets/shobit-verma-green.png`, edited with the built-in imagegen tool from `C:/Users/shobi/Downloads/pic 1 (4).JPG`. The original photo is retained unchanged.

Final edit prompt: "Edit target: the supplied portrait photograph of Shobit Verma. Change ONLY the plain cream background to a soft pale green-teal tint, similar to #dceee7, that complements an academic website using deep teal #08746d. Preserve the person exactly: same identity, facial features, skin tone, expression, glasses, beard, hair, black shirt, pose, lighting and original square framing. Keep natural fine hair edges. Photorealistic background color replacement only. No text, no graphics, no added objects, no retouching of face."

## Prioritized random project button

Open random project includes monochrome sparkles and navigates directly to one of six pages: harvesting, bachelor-thesis Stewart joystick, respiratory Stewart platform, RCM needle insertion, borehole compass, or grip analyser. Their relative selection weights are 4:3:2:1:1:1, matching the requested priority tiers. No other project is eligible.

## Equal random-project priority tiers

The first three featured projects have equal weight 3; RCM needle insertion, borehole compass, and grip analyser have equal weight 2. The button has no sparkles and gently drifts along a randomized, looping path. Reduced-motion preferences disable the drift.

## Equal odds and stronger button motion

All six eligible projects now have equal selection probability. Open random project includes its arrow again and drifts up to 8px horizontally and 5px vertically on an eight-second loop. Reduced-motion settings still disable movement.

## Project header controls

All project headers show Contact, View patent or View report, Home, and the theme switch. Back to projects remains on the left. View patent opens the matching record in the main page; View report for ultrasound and borehole compass opens the supplied original project reference PDF stored at assets/reports/project-reference.pdf. Home opens index.html without a fragment, at the top.
