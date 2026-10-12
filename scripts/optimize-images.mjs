#!/usr/bin/env node
/**
 * Photo pipeline: reads data/photos.json, grades every photo the same way and writes
 *   public/img/<id>.jpg        master, max 2400 px (next/image serves AVIF/WebP from it)
 *   data/photos.meta.json      width, height and a tiny blur placeholder per photo
 *
 * The grade fixes what the source photos share (flash, blue-white walls, flat light):
 * warm white balance, highlights pulled down to the site's paper tone, soft blacks,
 * a little less saturation. Grain is added in CSS, not baked in (it compresses badly).
 *
 *   node scripts/optimize-images.mjs            only missing or changed photos
 *   node scripts/optimize-images.mjs --force    everything
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = path.resolve(import.meta.dirname, "..")
const SRC = path.join(root, "public/images")
const OUT = path.join(root, "public/img")
const MAX = 2400
const force = process.argv.includes("--force")

/** out = a·in + b per channel (R, G, B): warm, highlights to paper (#F3EDE3-ish), lifted blacks. */
const GRADE = { a: [0.93, 0.9, 0.84], b: [12, 11, 10] }

async function newer(src, out) {
  try {
    const [s, o] = await Promise.all([stat(src), stat(out)])
    return s.mtimeMs > o.mtimeMs
  } catch {
    return true
  }
}

function graded(file) {
  return sharp(file)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .linear(GRADE.a, GRADE.b)
    .modulate({ saturation: 0.86 })
    .gamma(2.2, 2.35) // a touch deeper mid-tones: the flash flattens them
}

const { photos } = JSON.parse(await readFile(path.join(root, "data/photos.json"), "utf8"))
await mkdir(OUT, { recursive: true })

let metaOld = {}
try {
  metaOld = JSON.parse(await readFile(path.join(root, "data/photos.meta.json"), "utf8"))
} catch {}

const meta = {}
let done = 0
for (const p of photos) {
  const src = path.join(SRC, p.file)
  const out = path.join(OUT, `${p.id}.jpg`)
  if (force || !metaOld[p.id] || (await newer(src, out))) {
    await graded(src).jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(out)
    done++
  }
  const m = await sharp(out).metadata()
  const blur = await sharp(out).resize(16, 16, { fit: "inside" }).jpeg({ quality: 50 }).toBuffer()
  meta[p.id] = {
    src: `/img/${p.id}.jpg`,
    width: m.width,
    height: m.height,
    blur: `data:image/jpeg;base64,${blur.toString("base64")}`,
  }
}

await writeFile(path.join(root, "data/photos.meta.json"), JSON.stringify(meta, null, 2) + "\n")
let total = 0
for (const p of photos) total += (await stat(path.join(OUT, `${p.id}.jpg`))).size
console.log(`${photos.length} photos (${done} written), ${(total / 1e6).toFixed(1)} Mo in public/img`)
