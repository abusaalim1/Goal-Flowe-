import { Goal, Settings } from '../types';

export const exportData = (data: any, format: 'json' | 'csv') => {
  if (format === 'json') {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `goalflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const formatDate = (timestamp?: number) => {
  if (!timestamp) return 'No date set';

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
};

const getStatusLabel = (status: Goal['status']) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export const createEbookHtml = (goals: Goal[], settings: Settings) => {
  const author = escapeHtml(settings.profile?.name || 'Achiever');
  const generatedDate = formatDate(Date.now());
  const sortedGoals = [...goals].sort((a, b) => b.createdDate - a.createdDate);
  const activeGoals = goals.filter((goal) => goal.status === 'active').length;
  const completedGoals = goals.filter((goal) => goal.status === 'completed').length;
  const averageProgress = goals.length
    ? Math.round(goals.reduce((total, goal) => total + goal.progress, 0) / goals.length)
    : 0;
  const totalTasks = goals.reduce((total, goal) => total + goal.subTasks.length, 0);
  const completedTasks = goals.reduce(
    (total, goal) => total + goal.subTasks.filter((task) => task.completed).length,
    0
  );

  const goalChapters = sortedGoals
    .map((goal, index) => {
      const completedSubTasks = goal.subTasks.filter((task) => task.completed).length;
      const notes = goal.notes?.trim()
        ? `<section class="notes"><h4>Reflection Notes</h4><p>${escapeHtml(goal.notes).replace(/\n/g, '<br />')}</p></section>`
        : '';
      const subtasks = goal.subTasks.length
        ? `<ul class="task-list">${goal.subTasks
            .map(
              (task) =>
                `<li><span class="checkbox ${task.completed ? 'done' : ''}">${task.completed ? '✓' : ''}</span><span>${escapeHtml(task.title)}</span></li>`
            )
            .join('')}</ul>`
        : '<p class="muted">No milestones added yet.</p>';

      return `
      <article class="chapter">
        <div class="chapter-kicker">Chapter ${index + 1}</div>
        <div class="chapter-heading">
          <div>
            <h2>${escapeHtml(goal.title)}</h2>
            <p>${escapeHtml(goal.category || 'Personal Growth')} • ${getStatusLabel(goal.status)} • ${goal.priority} priority</p>
          </div>
          <div class="progress-ring" style="--progress:${goal.progress}; --goal-color:${goal.color || '#D4AF37'}">
            <span>${goal.progress}%</span>
          </div>
        </div>
        <p class="description">${escapeHtml(goal.description || 'A meaningful step in your growth story.')}</p>
        <div class="detail-grid">
          <div><span>Created</span><strong>${formatDate(goal.createdDate)}</strong></div>
          <div><span>Due</span><strong>${formatDate(goal.dueDate)}</strong></div>
          <div><span>Milestones</span><strong>${completedSubTasks}/${goal.subTasks.length}</strong></div>
          <div><span>Focus Time</span><strong>${Math.round(goal.timeSpent / 60)}h</strong></div>
        </div>
        <section>
          <h4>Milestone Path</h4>
          ${subtasks}
        </section>
        ${notes}
        ${goal.tags.length ? `<div class="tags">${goal.tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
      </article>
    `;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${author}'s GoalFlow E-Book</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
    :root { color-scheme: light; --ink:#25211b; --muted:#766f63; --gold:#d4af37; --cream:#fff9ea; --rose:#ffe4e1; --paper:#fffdf8; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, system-ui, sans-serif; color: var(--ink); background: radial-gradient(circle at top left, #fff1d6, transparent 32rem), linear-gradient(135deg, #fffdf8 0%, #fff7e8 42%, #ffeef1 100%); }
    .book { max-width: 980px; margin: 0 auto; padding: 56px 24px 80px; }
    .cover { min-height: 760px; display: grid; align-content: center; gap: 34px; padding: 72px; border: 1px solid rgba(132,93,27,.22); border-radius: 42px; background: linear-gradient(145deg, rgba(255,255,255,.92), rgba(255,249,234,.88)), radial-gradient(circle at 85% 15%, rgba(212,175,55,.28), transparent 16rem); box-shadow: 0 30px 90px rgba(76, 52, 16, .16); position: relative; overflow: hidden; }
    .cover:before, .cover:after { content:""; position:absolute; border-radius:999px; filter: blur(2px); opacity:.65; }
    .cover:before { width: 320px; height: 320px; right: -90px; top: -90px; background: #ffd4dc; }
    .cover:after { width: 240px; height: 240px; left: -80px; bottom: -80px; background: #ffe9a6; }
    .cover-content { position: relative; z-index: 1; }
    .eyebrow { color: #9d7818; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; font-size: 13px; }
    h1 { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(54px, 9vw, 104px); line-height: .88; margin: 16px 0 24px; letter-spacing: -0.06em; }
    .subtitle { max-width: 680px; color: var(--muted); font-size: 21px; line-height: 1.7; }
    .author { margin-top: 64px; font-weight: 800; font-size: 18px; }
    .stats { display:grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 28px 0 48px; }
    .stat { background: rgba(255,255,255,.78); border: 1px solid rgba(132,93,27,.16); border-radius: 24px; padding: 22px; box-shadow: 0 16px 40px rgba(76,52,16,.08); }
    .stat strong { display:block; font-size: 32px; }
    .stat span { color: var(--muted); font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
    .toc, .chapter { margin-top: 34px; padding: 46px; border-radius: 34px; background: rgba(255,255,255,.86); border: 1px solid rgba(132,93,27,.14); box-shadow: 0 20px 60px rgba(76,52,16,.10); page-break-inside: avoid; }
    h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 42px; line-height: 1; margin: 0; letter-spacing: -0.03em; }
    .toc ol { padding-left: 26px; color: var(--muted); line-height: 2; font-weight: 600; }
    .chapter { page-break-before: always; }
    .chapter-kicker { color: #9d7818; font-weight: 800; text-transform: uppercase; letter-spacing: .16em; font-size: 12px; margin-bottom: 14px; }
    .chapter-heading { display:flex; justify-content:space-between; gap: 24px; align-items:center; }
    .chapter-heading p, .muted { color: var(--muted); }
    .description { color: #4b4338; font-size: 18px; line-height: 1.75; margin: 28px 0; }
    .progress-ring { width: 96px; height: 96px; border-radius: 50%; display:grid; place-items:center; flex: 0 0 auto; background: conic-gradient(var(--goal-color) calc(var(--progress) * 1%), #f1e8d7 0); position: relative; }
    .progress-ring:after { content:""; position:absolute; inset: 10px; border-radius:50%; background: var(--paper); }
    .progress-ring span { position:relative; z-index:1; font-weight: 900; }
    .detail-grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 28px 0; }
    .detail-grid div { border-radius: 18px; padding: 16px; background: #fff8e8; }
    .detail-grid span { display:block; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; font-weight:800; }
    .detail-grid strong { display:block; margin-top: 6px; font-size: 14px; }
    h4 { margin: 30px 0 14px; font-size: 14px; text-transform: uppercase; letter-spacing: .12em; color:#9d7818; }
    .task-list { list-style:none; padding:0; margin:0; display:grid; gap: 12px; }
    .task-list li { display:flex; gap: 12px; align-items:center; padding: 14px 16px; background:#fffdf8; border: 1px solid #f0e3c8; border-radius: 16px; }
    .checkbox { width: 24px; height: 24px; border-radius: 8px; border: 2px solid #d8c28c; display:grid; place-items:center; color:white; font-weight:900; }
    .checkbox.done { background: #69b184; border-color:#69b184; }
    .notes { padding: 2px 22px 22px; background: linear-gradient(135deg, #fff8e8, #fff3f5); border-left: 5px solid var(--gold); border-radius: 18px; }
    .notes p { line-height: 1.75; color:#4b4338; }
    .tags { display:flex; flex-wrap:wrap; gap: 10px; margin-top: 22px; }
    .tags span { padding: 8px 12px; border-radius: 999px; background:#fff0b8; color:#7a5c0f; font-weight: 800; font-size: 12px; }
    .empty { text-align:center; padding: 80px 24px; color: var(--muted); }
    @media print { body { background: white; } .book { max-width: none; padding: 0; } .cover, .toc, .chapter { box-shadow: none; border-radius: 0; } }
    @media (max-width: 760px) { .cover { padding: 38px; min-height: 620px; } .stats, .detail-grid { grid-template-columns: repeat(2, 1fr); } .chapter-heading { align-items:flex-start; flex-direction:column; } .toc, .chapter { padding: 28px; } }
  </style>
</head>
<body>
  <main class="book">
    <section class="cover">
      <div class="cover-content">
        <div class="eyebrow">GoalFlow AI keepsake edition</div>
        <h1>Your Goal<br />Story</h1>
        <p class="subtitle">A beautifully organized snapshot of the ambitions, milestones, reflections, and momentum that define your current season of growth.</p>
        <div class="author">Prepared for ${author} • ${generatedDate}</div>
      </div>
    </section>
    <section class="stats">
      <div class="stat"><strong>${goals.length}</strong><span>Total goals</span></div>
      <div class="stat"><strong>${activeGoals}</strong><span>Active</span></div>
      <div class="stat"><strong>${completedGoals}</strong><span>Completed</span></div>
      <div class="stat"><strong>${averageProgress}%</strong><span>Avg progress</span></div>
    </section>
    <section class="toc">
      <div class="chapter-kicker">Overview</div>
      <h2>Momentum at a glance</h2>
      <p class="description">Across ${goals.length} goals, you have completed ${completedTasks} of ${totalTasks} milestones. Use this e-book as a printable guide, a reflective journal, or a polished progress report.</p>
      ${sortedGoals.length ? `<ol>${sortedGoals.map((goal) => `<li>${escapeHtml(goal.title)} — ${goal.progress}% complete</li>`).join('')}</ol>` : '<div class="empty">Add goals in GoalFlow AI, then export again to fill these pages with your journey.</div>'}
    </section>
    ${goalChapters}
  </main>
</body>
</html>`;
};

export const downloadEbook = (goals: Goal[], settings: Settings) => {
  const html = createEbookHtml(goals, settings);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `goalflow-ebook-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
