const fs = require('fs');
const pages = ['recovery', 'environment', 'map', 'disaster', 'capsule', 'wellness', 'model', 'device', 'lab', 'settings'];
pages.forEach(p => {
  fs.mkdirSync(`src/app/${p}`, { recursive: true });
  fs.writeFileSync(`src/app/${p}/page.tsx`, `export default function Page() {\n  return (\n    <div className="max-w-4xl mx-auto py-12">\n      <h1 className="text-3xl font-bold text-slate-900 mb-4">${p.toUpperCase()}</h1>\n      <p className="text-slate-600">This is a placeholder for the ${p} interface.</p>\n    </div>\n  );\n}`);
});
console.log('Pages generated');
