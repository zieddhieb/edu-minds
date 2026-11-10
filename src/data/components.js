// Reads components.csv (the single source of truth for components). Edit the CSV, not this file.
import csv from './components.csv?raw';

const clean = (s = '') => s.trim().replace(/^"|"$/g, '');

function parse(text) {
  const [head, ...lines] = text.replace(/^\uFEFF/, '').trim().split(/\r?\n/);
  const sep = head.includes(';') ? ';' : ',';          // Excel (French) saves with ";"
  const keys = head.split(sep).map(clean);
  return lines.filter(Boolean).map((line) => {
    const v = line.split(sep).map(clean);
    const r = Object.fromEntries(keys.map((k, i) => [k, v[i] ?? '']));
    return {
      ref: r.ref,
      name: r.nom,
      category: r.categorie,
      price: Number((r.prix_tnd || '0').replace(',', '.')) || 0,
      photo: (r.photo || '').toLowerCase() === 'yes',            // photo file: public/components/<ref>.jpg
      tps: [1, 2, 3].filter((n) => (r['tp' + n] || '').toLowerCase() === 'yes'),
    };
  });
}

export const COMPONENTS = parse(csv);
export const componentsForLab = (labId) => COMPONENTS.filter((c) => c.tps.includes(labId));
