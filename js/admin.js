// Local editor for public/data/projects-status.json. This page can't write
// to the server — it downloads an updated file that then gets committed and
// pushed to actually change what visitors see.
const PROJECTS = [
  { id: 'lavender-refreshments', title: 'Lavender Refreshments' },
  { id: 'jordyns-bakes', title: "Jordyn's Bakes" },
  { id: 'tic-tac-toe', title: 'Tic-Tac-Toe' },
  { id: 'inspiration', title: 'Inspiration' },
  { id: 'ticket-pricing', title: 'Ticket Pricing' },
];

const STATUS_URL = '/data/projects-status.json';

const listEl = document.getElementById('projectList');
const downloadBtn = document.getElementById('downloadBtn');
const statusMsg = document.getElementById('statusMsg');

let currentStatus = {};

function render() {
  listEl.innerHTML = '';
  PROJECTS.forEach(({ id, title }) => {
    const row = document.createElement('label');
    row.className = 'project-row';

    const titleEl = document.createElement('span');
    titleEl.className = 'project-row-title';
    titleEl.textContent = title;

    const toggle = document.createElement('span');
    toggle.className = 'project-row-toggle';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.id = id;
    checkbox.checked = currentStatus[id] === 'in-progress';

    const toggleLabel = document.createElement('span');
    toggleLabel.textContent = 'In Progress';

    toggle.append(checkbox, toggleLabel);
    row.append(titleEl, toggle);
    listEl.appendChild(row);
  });
}

async function loadStatus() {
  try {
    const res = await fetch(STATUS_URL, { cache: 'no-store' });
    currentStatus = res.ok ? await res.json() : {};
  } catch {
    currentStatus = {};
  }
  render();
}

listEl.addEventListener('change', (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (!checkbox) return;
  currentStatus[checkbox.dataset.id] = checkbox.checked ? 'in-progress' : 'live';
  statusMsg.textContent = 'Unsaved changes — click Download to export.';
});

downloadBtn.addEventListener('click', () => {
  const json = `${JSON.stringify(currentStatus, null, 2)}\n`;
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'projects-status.json';
  link.click();

  URL.revokeObjectURL(url);
  statusMsg.textContent =
    'Downloaded. Replace public/data/projects-status.json with this file, then commit and push to publish.';
});

loadStatus();
