import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {videoSubmissionItems} from '../video-submission.mjs';
const root = new URL('../', import.meta.url);
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

// Category tiles are the map: they remain visible before videos are delivered.
export function visibleCategories(catalog) {
  return catalog.categories;
}
export function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="パンくず">${items.map((item, i) => `${i ? '<span aria-hidden="true">›</span>' : ''}${item.href ? `<a href="${escape(item.href)}">${escape(item.title)}</a>` : `<span aria-current="page">${escape(item.title)}</span>`}`).join('')}</nav>`;
}
export function shellPage(title, crumbs, parent, body) {
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} | Lr</title>
  <link rel="stylesheet" href="../assets/learning.css">
</head>
<body>
  <header><div><p>Lr · 講師向け</p><h1>${escape(title)}</h1></div></header>
  <main>
    ${breadcrumbs(crumbs)}
    ${parent ? `<a class="back" href="${escape(parent.href)}">← ${escape(parent.title)}へ</a>` : ''}
    ${body}
  </main>
  <footer>ダンススクールLr</footer>
</body>
</html>
`;
}
export function detailPage(theme, category, body, script) {
  const page = shellPage(theme.title,
    [{title:'Lrの基本',href:'index.html'},{title:category.title,href:`${category.id}.html`},{title:theme.title}],
    {title:category.title,href:`${category.id}.html`},
    body + `<a class="back bottom-back" href="${escape(category.id)}.html">← ${escape(category.title)}へ</a>`);
  return script ? page.replace('</body>',`<script type="module" src="${escape(script)}"></script>\n</body>`) : page;
}
export function systemGuideDialog(prefix) {
  return `<dialog class="system-guide-dialog" id="system-guide-dialog" aria-labelledby="system-guide-title"><h2 id="system-guide-title">基本システム</h2><video controls playsinline preload="metadata" poster="${prefix}assets/lr-system-guide.png" aria-label="Lr基本システム説明動画"><source src="${prefix}videos/lr-system-guide.mp4" type="video/mp4"></video><form method="dialog"><button>閉じる</button></form></dialog>`;
}
export function withSystemGuide(html, prefix) {
  return html.replace('</head>',`<link rel="stylesheet" href="${prefix}assets/system-guide.css">\n</head>`).replace('</body>',`${systemGuideDialog(prefix)}<script type="module" src="${prefix}assets/system-guide.mjs"></script>\n</body>`);
}
export async function buildLearning() {
  const catalog = JSON.parse(await readFile(new URL('content/learning-catalog.json',root),'utf8'));
  const portal = JSON.parse(await readFile(new URL('portal-data.json',root),'utf8'));
  const entries = [
    {title:'Lrの基本',icon:'🎓',href:'../basics/index.html',color:'teal'},
    {title:'レッスン後にやること',icon:'🔥',href:'after-lesson.html',color:'red'},
    {title:'よくある質問（FAQ）',icon:'❓',href:'faq.html',color:'blue'},
    {title:'申請関係',icon:'📝',href:'apply.html',color:'purple'}
  ];
  const tiles = entries.map(e => `<a class="category-tile tile-${escape(e.color)}" href="${escape(e.href)}"><span class="tile-icon" aria-hidden="true">${e.icon}</span><span>${escape(e.title)}</span></a>`).join('');
  const top = shellPage('Lr 講師ポータル', [{title:'ポータル'}], null,
    `<nav class="tile-grid" aria-label="新ポータルの入口">${tiles}</nav>`);
  await writeFile(new URL('new/index.html',root),top);
  const categories = visibleCategories(catalog);
  const body = categories.length ? `<nav class="tile-grid" aria-label="Lrの基本のカテゴリ">${categories.map(c => `<a class="category-tile tile-${escape(c.color)}" href="${escape(c.id)}.html"><span class="tile-icon" aria-hidden="true">${escape(c.icon)}</span><span>${escape(c.title)}</span></a>`).join('')}</nav>` : '<p class="muted">公開中のカテゴリはありません。</p>';
  await writeFile(new URL('basics/index.html',root), withSystemGuide(shellPage('🎓 Lrの基本', [{title:'ポータル',href:'../new/index.html'},{title:'Lrの基本'}],{title:'ポータル',href:'../new/index.html'},'<button class="system-guide-banner" type="button" data-system-guide aria-haspopup="dialog">▶ 基本システム <small>1分23秒</small></button>'+body),'../'));
  for (const category of catalog.categories) {
    const themes = catalog.themes.filter(t => t.category === category.id && t.ready === true);
    const body = themes.length ? `<nav class="tile-grid" aria-label="${escape(category.title)}のテーマ">${themes.map(t => `<a class="theme-tile" href="${escape(t.id)}.html"><img src="${escape(t.poster)}" alt="" width="120" height="68"><span><span class="tile-title">${escape(t.title)}</span><span class="duration">▶ ${escape(t.duration)}</span></span></a>`).join('')}</nav>` : '';
    const preview = category.preview ? `<p class="pending-topics">予告：${escape(category.preview)}</p>` : '';
    await writeFile(new URL(`basics/${category.id}.html`,root),shellPage(category.title,[{title:'Lrの基本',href:'index.html'},{title:category.title}],{title:'Lrの基本',href:'index.html'},body + preview));
  }
  // Reuse existing destinations; only local routing pages are new.
  for (const [id, categoryId, title] of [['after-lesson','today','レッスン後にやること'],['apply','apply','申請関係']]) {
    const source = portal.categories.find(c => c.id === categoryId);
    const items = videoSubmissionItems(source.items,portal.videoSubmission)
      .filter(item => item.id !== 't-3'); // Old instructions stay on the old portal only.
    const list = items.map(item => `<a class="route-tile" href="${item.id === 't-1' ? escape(item.url) : item.url.startsWith('./basics/') ? '../'+item.url.slice(2) : `action-${escape(item.id)}.html`}">${item.icon ? `<span class="route-icon" style="background:${escape(item.badgeColor)}" aria-hidden="true">${escape(item.icon)}</span>` : ''}<span>${escape(item.title)}</span></a>`).join('');
    await writeFile(new URL(`new/${id}.html`,root),shellPage(title,[{title:'ポータル',href:'index.html'},{title}],{title:'ポータル',href:'index.html'},`<nav class="tile-grid" aria-label="${title}の操作">${list}</nav>`));
    for (const item of items.filter(i => !i.url.startsWith('./basics/'))) {
      const action = `<p class="lead">${escape(item.desc || '')}</p><a class="action" href="${escape(item.url)}">${escape(item.title)}を開く →</a><a class="back bottom-back" href="${id}.html">← ${title}へ</a>`;
      await writeFile(new URL(`new/action-${item.id}.html`,root),shellPage(item.title,[{title:'ポータル',href:'index.html'},{title,href:`${id}.html`},{title:item.title}],{title,href:`${id}.html`},action));
    }
  }
  await writeFile(new URL('new/faq.html',root),shellPage('よくある質問（FAQ）',[{title:'ポータル',href:'index.html'},{title:'よくある質問（FAQ）'}],{title:'ポータル',href:'index.html'},'<a class="action" href="https://syoshinsya-dance-school-web.github.io/lr-faq/">よくある質問（FAQ）を開く →</a>'));
  for (const theme of catalog.themes.filter(t => t.ready === true)) {
    const category = catalog.categories.find(c => c.id === theme.category);
    const detailBody = await readFile(new URL(`content/${theme.id}-body.html`,root),'utf8');
    const detail = detailPage(theme,category,detailBody,theme.id === 'nippo-taiken' ? '../assets/daily-report.mjs' : null);
    await writeFile(new URL(`basics/${theme.id}.html`,root),detail);
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildLearning();
