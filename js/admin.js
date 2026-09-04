// Local editor for public/data/projects-status.json. This page can't write
// to the server — it downloads an updated file that then gets committed and
// pushed to actually change what visitors see.
//
// Access is gated by a password checked server-side, in api/admin-login.js
// (see _session.js) — the password itself never reaches this file or the
// browser.
const PROJECTS = [
  { id: 'lavender-refreshments', title: 'Lavender Refreshments' },
  { id: 'jordyns-bakes', title: "Jordyn's Bakes" },
  { id: 'set-it-up', title: 'Set It Up' },
  { id: 'tic-tac-toe', title: 'Tic-Tac-Toe vs. Robot' },
  { id: 'inspiration', title: 'Inspiration' },
  { id: 'gunita', title: 'Gunita' },
];

const STATUS_URL = '/data/projects-status.json';

const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const adminPanel = document.getElementById('adminPanel');
const listEl = document.getElementById('projectList');
const downloadBtn = document.getElementById('downloadBtn');
const signOutBtn = document.getElementById('signOutBtn');
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

function showPanel() {
  loginForm.hidden = true;
  adminPanel.hidden = false;
  loadStatus();
}

function showLogin() {
  adminPanel.hidden = true;
  loginForm.hidden = false;
  passwordInput.value = '';
  passwordInput.focus();
}

async function checkSession() {
  try {
    const res = await fetch('/api/admin-check', { cache: 'no-store' });
    const data = await res.json();
    if (data.authenticated) {
      showPanel();
      return;
    }
  } catch {
    // Treat a network/API error the same as "not signed in".
  }
  showLogin();
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.hidden = true;

  try {
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput.value }),
    });

    if (res.ok) {
      showPanel();
      return;
    }

    const data = await res.json().catch(() => ({}));
    loginError.textContent = data.error || 'Sign-in failed.';
  } catch {
    loginError.textContent = 'Sign-in failed — check your connection and try again.';
  }
  loginError.hidden = false;
});

signOutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/admin-logout', { method: 'POST' });
  } catch {
    // Cookie may already be gone — show the login form regardless.
  }
  showLogin();
});

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

checkSession();
