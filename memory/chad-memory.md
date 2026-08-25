# Chad memory

## 2026-07-08 - Default social creative format
For image/video prompt requests, default to vertical 9:16 social format for scrolling feeds on TikTok, Instagram, Facebook, and X. Do not default to horizontal 16:9 unless Christian explicitly asks for horizontal, landscape, YouTube-style, or widescreen.

## 2026-08-13 - File placement (shared with Claude)
Follow [context/file-map.md](../context/file-map.md) for where every file goes — it is the one rulebook both Chad and Claude use. Confirmed via codex, no conflicts. Your outputs land in these places, never loose at the top of a folder:
- Product batches → `src/data/batches/...`
- Ingredient and sourcing/company research → `src/data/research/...`
- Candidate lists → named CSVs inside the relevant batch folder under `src/data/batches/...`
- Audit working files → the external `Ingredient Audit by ChatGPT` folder
When a wave's one-off scripts are finished, move them to the nearest `archive/` folder.
