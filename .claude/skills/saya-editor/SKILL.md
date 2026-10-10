---
name: saya-editor
description: "saya_editor" — مونتاج فيديوهات سايا (صانعة المحتوى) بستايلها الخاص. Saya's own editing style, built by analysing several reference videos the user provides. Use when the user asks to edit/montage a video "بستايل سايا" / "saya_editor" / "saya editor" / "مونتاج سايا". STATUS: style not defined yet — waiting for reference videos.
---

# saya_editor — ستايل سايا

> **House rules first:** read `CLAUDE.md` at the repo root. They apply to this
> style and override it: footage colour barely changed (`HOUSE_GRADE`), house
> font Tahrir Bold for Arabic (`withHouseFont()` + `houseFontLoaded`), and the
> spoken caption word in light blue (`HOUSE_ACTIVE_WORD` via `KaraokeText`).

## Status

**The style is not defined yet.** The user will send several reference videos.
Until the sections below are filled in, do not edit a video with this skill;
tell the user (in Arabic) that the style is still being built.

## How the style gets built (from the reference videos)

1. Put each reference in `reference/` (keep only stills, not full videos):
   extract frames every ~0.5 s plus scene-change frames
   (`ffmpeg -vf "select='gt(scene,0.3)'"`), and note durations, cut rate and
   audio (music, SFX, silence cutting).
2. For every reference, note: caption layout (position, size, words per
   screen, animation, emphasis), typography, colour of graphics, B-roll /
   inserts / icons, zooms and transitions, pacing, sound design, intro/outro.
3. Keep what the references **share** — that is Saya's style. Where they
   differ, pick one and record why. Never copy a reference's footage grade.
4. Fill in **Principles**, **Tokens** and **Workflow** below, build reusable
   components in `video/src/styles/saya/` (tokens take `grade` from
   `HOUSE_GRADE`, fonts via `withHouseFont()`), and check them with a few
   stills only — no demo edit unless the user asks.

## Principles

_(to be filled from the references)_

## Tokens

_(to be filled: fonts, sizes, colours, caption position, motion timings)_

## Workflow for a new video

_(to be filled once the components exist)_
