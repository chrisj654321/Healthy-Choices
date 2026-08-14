const fs = require('fs');
const https = require('https');
const path = require('path');
const { spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

const projectDir = path.join(__dirname, '..', '..');
const outDir = path.join(projectDir, 'marketing', 'video-projects', 'convenience-cost');
const rawDir = path.join(outDir, 'raw');
const output = path.join(outDir, 'shelf-expose-convenience-cost-rough-cut.mp4');

const clips = [
  {
    id: '01-mom-cooking',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_3G8W5jOzaaHVa1eBggalsnWPVpj/hf_20260715_233142_e46ce8a4-d77e-404e-b105-3ed2a465cff4.mp4',
  },
  {
    id: '02-phone-fear',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_3G8W5jOzaaHVa1eBggalsnWPVpj/hf_20260715_234834_5d684ead-e550-4e8c-a50d-5166e8a6520d.mp4',
  },
  {
    id: '03-mom-serves-daughter',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_3G8W5jOzaaHVa1eBggalsnWPVpj/hf_20260715_235037_59039834-ac88-4257-a58d-8280c878396b.mp4',
  },
  {
    id: '04-beach-wedding',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_3G8W5jOzaaHVa1eBggalsnWPVpj/hf_20260716_000458_eddf7940-7f00-473b-9bba-9e46422d8293.mp4',
  },
  {
    id: '05-pregnancy-disappointment',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_3G8W5jOzaaHVa1eBggalsnWPVpj/hf_20260716_003640_481d2042-ad07-4913-9e01-f13fdb8a0ba0.mp4',
  },
  {
    id: '06-doctor-consultation',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_3G8W5jOzaaHVa1eBggalsnWPVpj/hf_20260716_010803_7a21884c-79b3-4ccb-8855-58902c38d3b3.mp4',
  },
  {
    id: '07-daughter-calls-mom',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_3G8W5jOzaaHVa1eBggalsnWPVpj/hf_20260716_013056_1d63d9e2-435a-487c-ac40-cb890d944aed.mp4',
  },
  {
    id: '08-flashback-phone-reveal',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_3G8W5jOzaaHVa1eBggalsnWPVpj/hf_20260716_015251_8a1b00ac-c4fe-4f34-a965-1dd8c7e8a648.mp4',
  },
  {
    id: '09-final-cta',
    url: 'https://d8j0ntlcm91z4.cloudfront.net/user_3G8W5jOzaaHVa1eBggalsnWPVpj/hf_20260715_235037_59039834-ac88-4257-a58d-8280c878396b.mp4',
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function download(url, destination) {
  if (fs.existsSync(destination)) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https
      .get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          file.close();
          fs.unlinkSync(destination);
          download(response.headers.location, destination).then(resolve, reject);
          return;
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(destination);
          reject(new Error(`Download failed ${response.statusCode}: ${url}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      })
      .on('error', (error) => {
        file.close();
        if (fs.existsSync(destination)) fs.unlinkSync(destination);
        reject(error);
      });
  });
}

function escapeText(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');
}

function drawText(input, text, y, size, options = {}) {
  const {
    enable = null,
    color = 'white',
    box = true,
    boxColor = 'black@0.55',
    lineSpacing = 10,
  } = options;
  const parts = [
    `drawtext=text='${escapeText(text)}'`,
    `fontfile=C\\:/Windows/Fonts/arial.ttf`,
    `x=(w-text_w)/2`,
    `y=${y}`,
    `fontsize=${size}`,
    `fontcolor=${color}`,
    `line_spacing=${lineSpacing}`,
    `shadowcolor=black@0.7`,
    `shadowx=2`,
    `shadowy=2`,
  ];
  if (box) {
    parts.push(`box=1`, `boxcolor=${boxColor}`, `boxborderw=18`);
  }
  if (enable) parts.push(`enable='${enable.replace(/,/g, '\\,')}'`);
  return `${input}${parts.join(':')}`;
}

async function main() {
  ensureDir(rawDir);

  for (const clip of clips) {
    const destination = path.join(rawDir, `${clip.id}.mp4`);
    process.stdout.write(`Downloading ${clip.id}...\n`);
    await download(clip.url, destination);
    clip.path = destination;
  }

  const args = [];
  for (const clip of clips) args.push('-i', clip.path);

  const filters = [];
  clips.forEach((clip, index) => {
    let chain = `[${index}:v]scale=480:854:force_original_aspect_ratio=decrease,pad=480:854:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30,format=yuv420p`;

    if (clip.id === '09-final-cta') {
      chain = drawText(chain + ',', 'Don’t trade their future', 'h*0.16', 34, {
        enable: 'between(t,0,2.2)',
        box: false,
      });
      chain = drawText(chain + ',', 'for convenience.', 'h*0.25', 34, {
        enable: 'between(t,1.2,3.4)',
        box: false,
      });
      chain = drawText(chain + ',', 'Comment HEALTH for Part 2.', 'h*0.72', 28, {
        enable: 'between(t,3.0,5.2)',
        boxColor: 'black@0.48',
      });
    }

    filters.push(`${chain}[v${index}]`);
  });

  const concatInputs = clips.map((_, index) => `[v${index}]`).join('');
  filters.push(`${concatInputs}concat=n=${clips.length}:v=1:a=0[outv]`);

  args.push(
    '-filter_complex',
    filters.join(';'),
    '-map',
    '[outv]',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '20',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-y',
    output,
  );

  process.stdout.write('Assembling rough cut...\n');
  const result = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`FFmpeg failed with exit code ${result.status}`);
  }

  process.stdout.write(`Done: ${output}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
