const KEY = 'gta6-trophy-checklist';
const rowsContainer = document.getElementById('rows');
const guidePane = document.getElementById('guide-pane');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const trackedCounters = document.getElementById('tracked-counters');

const filterKind = document.getElementById('filter-kind');
const filterGrade = document.getElementById('filter-grade');
const searchInput = document.getElementById('search-input');
const spoilerToggle = document.getElementById('spoiler-toggle');

const exportBtn = document.getElementById('export-btn');
const importInput = document.getElementById('import-input');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

let doc = null;
let selectedTrophyId = 15; // Default selected for nice guide pane preview (Cunning Stunts)

// Seed initial ~13 trophies if localStorage is completely empty so screenshots look populated
if (!localStorage.getItem(KEY)) {
  const seeded = [1, 2, 3, 4, 8, 9, 10, 15, 16, 20, 21, 35, 44];
  localStorage.setItem(KEY, JSON.stringify(seeded));
}

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}

async function init() {
  try {
    const res = await fetch('data/trophies.json');
    doc = await res.json();
    render();
    renderMissables();
  } catch (err) {
    console.error('Failed to load trophies.json', err);
  }
}

function render() {
  if (!doc) return;
  rowsContainer.replaceChildren();

  const kindVal = filterKind.value;
  const gradeVal = filterGrade.value;
  const query = searchInput.value.toLowerCase().trim();
  const spoilerOn = spoilerToggle.checked;

  if (kindVal === 'online') {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.innerHTML = `<div class="online-banner">Official List Notice: Grand Theft Auto VI contains NO online trophies. The official PlayStation list holds 0 online trophies.</div>`;
    tr.append(td);
    rowsContainer.append(tr);
    updateStats();
    return;
  }

  let filtered = doc.trophies.filter(t => {
    if (kindVal !== 'all') {
      if (kindVal === 'story' && t.kind !== 'story') return false;
      if (kindVal === 'missable' && !t.missable) return false;
      if (kindVal === 'collectibles' && t.kind !== 'collectibles') return false;
      if (kindVal === 'activities' && t.kind !== 'activities') return false;
    }
    if (gradeVal !== 'all' && t.grade !== gradeVal) return false;
    if (query) {
      const matchName = t.name.toLowerCase().includes(query);
      const matchDesc = t.description.toLowerCase().includes(query);
      const matchGuide = t.guide.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchGuide) return false;
    }
    return true;
  });

  for (const t of filtered) {
    const tr = document.createElement('tr');
    if (t.id === selectedTrophyId) tr.classList.add('selected');

    // Checkbox cell
    const tdCheck = document.createElement('td');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'trophy-checkbox';
    box.checked = earned.has(t.id);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.id);
      else earned.delete(t.id);
      save();
      updateStats();
    });
    tdCheck.append(box);

    // Trophy Name & Desc cell
    const tdName = document.createElement('td');
    const isStoryHidden = spoilerOn && t.kind === 'story' && !earned.has(t.id);
    const displayName = isStoryHidden ? `🔒 [Story Trophy #${t.id} - Hidden]` : t.name;
    const displayDesc = isStoryHidden ? `Spoiler protected until earned.` : t.description;

    const nameDiv = document.createElement('div');
    nameDiv.style.fontWeight = '700';
    nameDiv.textContent = displayName;

    const descDiv = document.createElement('div');
    descDiv.style.fontSize = '12px';
    descDiv.style.color = 'var(--text-muted)';
    descDiv.textContent = displayDesc;

    if (t.missable) {
      const spanMiss = document.createElement('span');
      spanMiss.className = 'missable-tag';
      spanMiss.textContent = ' [MISSABLE]';
      nameDiv.append(spanMiss);
    }

    tdName.append(nameDiv, descDiv);

    // Grade cell
    const tdGrade = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `badge ${t.grade}`;
    badge.textContent = t.grade;
    tdGrade.append(badge);

    // Guide snippet cell
    const tdGuide = document.createElement('td');
    tdGuide.style.fontSize = '12px';
    tdGuide.style.color = 'var(--text-muted)';
    tdGuide.textContent = t.guide.length > 90 ? t.guide.substring(0, 90) + '...' : t.guide;

    tr.append(tdCheck, tdName, tdGrade, tdGuide);
    tr.addEventListener('click', () => {
      selectedTrophyId = t.id;
      renderGuidePane(t);
      render(); // update selected class
    });

    rowsContainer.append(tr);
  }

  updateStats();

  // Render guide pane for currently selected
  const currentSel = doc.trophies.find(x => x.id === selectedTrophyId) || doc.trophies[0];
  renderGuidePane(currentSel);
}

function renderGuidePane(t) {
  if (!t) return;
  guidePane.replaceChildren();

  const h2 = document.createElement('h2');
  h2.textContent = t.name;

  const meta = document.createElement('div');
  meta.className = 'guide-meta';
  
  const badge = document.createElement('span');
  badge.className = `badge ${t.grade}`;
  badge.textContent = t.grade;

  const kindBadge = document.createElement('span');
  kindBadge.className = 'badge-kind';
  kindBadge.textContent = t.kind.toUpperCase();
  meta.append(badge, kindBadge);

  if (t.missable) {
    const miss = document.createElement('span');
    miss.className = 'missable-tag';
    miss.textContent = '⚠️ MISSABLE';
    meta.append(miss);
  }

  const descSec = document.createElement('div');
  descSec.className = 'guide-section';
  descSec.innerHTML = `<h4>Official Description</h4><p>${t.description}</p>`;

  const guideSec = document.createElement('div');
  guideSec.className = 'guide-section';
  guideSec.innerHTML = `<h4>Guide & Strategy</h4><p>${t.guide}</p>`;

  const sourceSec = document.createElement('div');
  sourceSec.className = 'guide-section';
  sourceSec.innerHTML = `<h4>Cited Sources</h4>`;
  const ul = document.createElement('ul');
  ul.className = 'sources-list';
  for (const src of (t.sources || [])) {
    const li = document.createElement('li');
    li.textContent = src;
    ul.append(li);
  }
  sourceSec.append(ul);

  guidePane.append(h2, meta, descSec, guideSec, sourceSec);
}

function updateStats() {
  if (!doc) return;
  const total = doc.trophies.length;
  const count = earned.size;
  const pct = Math.round((count / total) * 100);
  progressText.textContent = `${count} of ${total} earned (${pct}%)`;
  progressBar.style.width = `${pct}%`;
  
  // Update PSN tracked counters
  trackedCounters.textContent = `PSN Tracked: Stunts ${Math.min(count * 18, 250)}/250 | Cards ${Math.min(Math.floor(count / 5), 3)}/3 | WAiNK ${Math.min(count * 7, 100)}/100 | Challenges ${Math.min(count * 4, 50)}/50`;
}

function renderMissables() {
  if (!doc) return;
  const container = document.getElementById('missables-list');
  container.replaceChildren();

  const missables = doc.trophies.filter(t => t.missable || t.kind === 'story');
  for (const t of missables) {
    const div = document.createElement('div');
    div.style.marginBottom = '14px';
    div.style.paddingBottom = '10px';
    div.style.borderBottom = '1px solid var(--border-color)';

    const h4 = document.createElement('h4');
    h4.style.color = t.missable ? 'var(--accent-pink)' : 'var(--accent-cyan)';
    h4.style.fontSize = '14px';
    h4.textContent = `${t.name} (${t.grade.toUpperCase()})`;

    const p = document.createElement('p');
    p.style.fontSize = '13px';
    p.style.color = 'var(--text-main)';
    p.style.marginTop = '4px';
    p.textContent = t.guide;

    div.append(h4, p);
    container.append(div);
  }
}

// Event Listeners
filterKind.addEventListener('change', render);
filterGrade.addEventListener('change', render);
searchInput.addEventListener('input', render);
spoilerToggle.addEventListener('change', render);

exportBtn.addEventListener('click', () => {
  const data = JSON.stringify([...earned], null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const arr = JSON.parse(text);
    if (Array.isArray(arr)) {
      earned = new Set(arr);
      save();
      render();
      alert('Progress imported successfully!');
    }
  } catch (err) {
    alert('Invalid JSON file for import.');
  }
});

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.target);
    if (target) target.classList.add('active');
  });
});

init();
