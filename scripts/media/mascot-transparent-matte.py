#!/usr/bin/env python
"""
mascot-transparent-matte.py

Recover a true alpha matte for the Specs mascot animation clips using
two-background difference matting.

We have each approved clip rendered on a cream background (the master) and the
same clip run through Higgsfield's background remover, which returns the subject
composited on OPAQUE BLACK (H.264 can't carry alpha). Colour-keying the black
fails because Specs has near-black eyes and a dark lens rim. But with the SAME
animation on two known backgrounds we can solve alpha exactly:

    master = F*a + bg_cream*(1-a)      nobg = F*a  (over black)
    => (1-a) = (master - nobg) / bg_cream
    => straight foreground  F = nobg / a

This preserves his dark eyes/rim AND the semi-transparent glass highlights, with
clean anti-aliased edges and no fringe.

Usage:
    python mascot-transparent-matte.py <master_frames_dir> <nobg_frames_dir> <out_rgba_dir>

Frames are matched by sorted filename; the shorter count wins. Driven per-clip
by the surrounding shell pipeline (ffmpeg extracts frames, this mattes them,
ffmpeg re-encodes to VP9/yuva420p WebM).
"""
import sys
import os
import glob
import numpy as np
from PIL import Image


def _load_rgb(path):
    return np.asarray(Image.open(path).convert('RGB')).astype(np.float64)


def matte_pair(master_path, nobg_path):
    M = _load_rgb(master_path)
    N = _load_rgb(nobg_path)
    if N.shape != M.shape:
        N = np.asarray(
            Image.fromarray(N.astype(np.uint8)).resize((M.shape[1], M.shape[0]))
        ).astype(np.float64)
    # cream background = median of a 6px border ring of the master frame
    border = np.concatenate([
        M[:6, :, :].reshape(-1, 3), M[-6:, :, :].reshape(-1, 3),
        M[:, :6, :].reshape(-1, 3), M[:, -6:, :].reshape(-1, 3)])
    bg = np.median(border, axis=0)
    one_minus_a = np.clip((M - N) / bg[None, None, :], 0.0, 1.0)
    a = np.clip(1.0 - one_minus_a.mean(axis=2), 0.0, 1.0)
    # clean compression noise: floor + ceiling, keep the edge ramp between
    a = np.where(a < 0.08, 0.0, a)
    a = np.where(a > 0.92, 1.0, a)
    # straight (un-premultiplied) colour, floored to avoid noise blow-up
    af = np.clip(a, 0.10, 1.0)[:, :, None]
    F = np.clip(N / af, 0, 255)
    out = np.dstack([F, a * 255.0]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


def main():
    master_dir, nobg_dir, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
    os.makedirs(out_dir, exist_ok=True)
    masters = sorted(glob.glob(os.path.join(master_dir, '*.png')))
    nobgs = sorted(glob.glob(os.path.join(nobg_dir, '*.png')))
    n = min(len(masters), len(nobgs))
    if n == 0:
        print('no frames found', file=sys.stderr)
        sys.exit(1)
    for i in range(n):
        rgba = matte_pair(masters[i], nobgs[i])
        rgba.save(os.path.join(out_dir, '%04d.png' % (i + 1)))
    print('matted %d frames -> %s' % (n, out_dir))


if __name__ == '__main__':
    main()
