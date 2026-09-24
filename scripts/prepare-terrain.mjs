// Génère le relief local de Los Santos depuis une carte d'altitude publique (MIT).
// À exécuter uniquement pour régénérer les données, pas au démarrage du site.
import { writeFile, mkdir } from 'node:fs/promises';

const source = 'https://media.githubusercontent.com/media/Andreas1331/ragemp-gtav-heightmap/main/data_file/GTAV_HeightMap_Data.data';
const detail = process.argv.includes('--detail');
const bounds = detail ? { minX: -200, maxX: 800, minY: -1100, maxY: -100, step: 2 } : { minX: -800, maxX: 1400, minY: -1700, maxY: 500, step: 5 };
const sourceWidth = 8400;
const firstByte = (bounds.minY + 4300) * sourceWidth * 4;
const lastByte = ((bounds.maxY + 4300 + 1) * sourceWidth * 4) - 1;
const response = await fetch(source, { headers: { Range: `bytes=${firstByte}-${lastByte}` } });
if (response.status !== 206) {
  await response.body?.cancel();
  throw new Error(`La source doit accepter un téléchargement partiel (réponse ${response.status}).`);
}
const bytes = await response.arrayBuffer();
const data = new DataView(bytes);
const columns = (bounds.maxX - bounds.minX) / bounds.step + 1;
const rows = (bounds.maxY - bounds.minY) / bounds.step + 1;
const heights = new Uint16Array(columns * rows);
for (let row = 0; row < rows; row++) {
  for (let column = 0; column < columns; column++) {
    const x = bounds.minX + column * bounds.step;
    const y = bounds.maxY - row * bounds.step;
    const index = ((y - bounds.minY) * sourceWidth + x + 4100) * 4;
    const height = data.getFloat32(index, true);
    heights[row * columns + column] = Math.round(Math.min(1000, Math.max(0, Number.isFinite(height) ? height : 0)) * 10);
  }
}
await mkdir('public/map', { recursive: true });
await writeFile(`public/map/${detail ? 'pillbox-detail' : 'pillbox-heights'}.bin`, Buffer.from(heights.buffer));
await writeFile(`public/map/${detail ? 'detail' : 'terrain'}.json`, JSON.stringify({ ...bounds, columns, rows, encoding:'uint16-le', heightScale:0.1, source, license:'MIT', attribution:'Copyright (c) 2022 -Andreas' }, null, 2));
console.log(JSON.stringify({ samples: heights.length, bytes: heights.byteLength, bounds }));
