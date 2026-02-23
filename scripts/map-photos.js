const fs = require('fs');

const data = JSON.parse(fs.readFileSync('bibai-spots.json', 'utf8'));
const files = fs.readdirSync('public/spots');

const matched = {};
const unmatched = [];

for (const item of [...data.spots, ...data.events]) {
  const id = item.id;
  const matches = files.filter(f => f.replace(/\.(jpg|jpeg|png)$/i, '') === id);
  if (matches.length > 0) {
    matched[id] = matches.map(f => '/spots/' + f);
  } else {
    unmatched.push(id);
  }
}

console.log('=== Matched ===');
for (const [id, photos] of Object.entries(matched)) {
  console.log(id + ' -> ' + photos.join(', '));
}

console.log('\n=== Unmatched (no image) ===');
for (const id of unmatched) {
  console.log(id);
}

const usedSet = new Set();
for (const photos of Object.values(matched)) {
  for (const p of photos) {
    usedSet.add(p.replace('/spots/', ''));
  }
}
const unused = files.filter(f => !usedSet.has(f));
console.log('\n=== Unused image files ===');
for (const f of unused) {
  console.log(f);
}

// Update bibai-spots.json
for (const item of [...data.spots, ...data.events]) {
  if (matched[item.id]) {
    item.photos = matched[item.id];
  }
}

fs.writeFileSync('bibai-spots.json', JSON.stringify(data, null, 2) + '\n');
console.log('\nbibai-spots.json updated!');
