// REMOVE the extra one-liner handler (it’s redundant)
// document.addEventListener('DOMContentLoaded',()=>{const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();});

// Basic interactivity: theme toggle and mobile menu
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const menuToggle = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');
  if (menuToggle && links) {
    menuToggle.addEventListener('click', () => {
      const open = links.style.display === 'block';
      links.style.display = open ? 'none' : 'block';
      menuToggle.setAttribute('aria-expanded', String(!open));
    });
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      if (isDark) {
        document.documentElement.style.setProperty('--bg', '#0b0f17');
        document.documentElement.style.setProperty('--fg', '#e5e7eb');
      } else {
        document.documentElement.style.setProperty('--bg', '#ffffff');
        document.documentElement.style.setProperty('--fg', '#111111');
      }
    });
  }

  // INSERT: Clickable KPIs -> show details in a modal (with API fetch + fallback)
  function openModal(title, htmlContent) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '1000';

    // Create modal box
    const box = document.createElement('div');
    box.style.background = 'var(--bg)';
    box.style.color = 'var(--fg)';
    box.style.maxWidth = '720px';
    box.style.width = '90%';
    box.style.borderRadius = '12px';
    box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    box.style.overflow = 'hidden';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.padding = '12px 16px';
    header.style.borderBottom = '1px solid #e5e7eb';

    const h = document.createElement('h3');
    h.textContent = title;
    h.style.margin = '0';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.border = 'none';
    closeBtn.style.background = 'transparent';
    closeBtn.style.fontSize = '1.1rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.setAttribute('aria-label', 'Close');

    closeBtn.addEventListener('click', () => document.body.removeChild(overlay));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) document.body.removeChild(overlay);
    });

    const content = document.createElement('div');
    content.style.padding = '16px';
    content.innerHTML = htmlContent;

    header.appendChild(h);
    header.appendChild(closeBtn);
    box.appendChild(header);
    box.appendChild(content);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function addClick(ids, handler) {
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.cursor = 'pointer';
      if (el) el.addEventListener('click', handler);
    });
  }

  function fmt(n) {
    return new Intl.NumberFormat('en-IN').format(n);
  }

  async function showNewUsers() {
    try {
      const res = await fetch('/api/users?recent=true');
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data) && json.data.length) {
        const rows = json.data.map(u => `
          <tr>
            <td>${u.name || u.username || '—'}</td>
            <td>${u.email || '—'}</td>
            <td>${new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
          </tr>`).join('');
        openModal('New Users', `
          <p>Recent signups:</p>
          <div style="overflow:auto">
            <table style="width:100%; border-collapse:collapse">
              <thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `);
        return;
      }
      throw new Error('Empty list');
    } catch {
      // Fallback demo data
      const sample = [
        { name: 'Aarav Sharma', email: 'aarav@example.com', createdAt: Date.now() - 86400000 },
        { name: 'Priya Patel', email: 'priya@example.com', createdAt: Date.now() - 2 * 86400000 },
        { name: 'Rahul Verma', email: 'rahul@example.com', createdAt: Date.now() - 3 * 86400000 }
      ];
      const rows = sample.map(u => `
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${new Date(u.createdAt).toLocaleDateString()}</td>
        </tr>`).join('');
      openModal('New Users (demo)', `
        <p>Showing sample users because the API is unavailable.</p>
        <div style="overflow:auto">
          <table style="width:100%; border-collapse:collapse">
            <thead><tr><th>Name</th><th>Email</th><th>Joined</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `);
    }
  }

  async function showWebTraffic() {
    try {
      const res = await fetch('/api/traffic');
      const json = await res.json();
      const d = json.data || {};
      const last7 = d.last7Days || d.last7 || d.series || [];
      if (Array.isArray(last7) && last7.length) {
        const rows = last7.map(day => `
          <tr>
            <td>${day.date ? new Date(day.date).toLocaleDateString() : '—'}</td>
            <td style="text-align:right">${fmt(day.visits ?? day.pageViews ?? day.count ?? 0)}</td>
          </tr>`).join('');
        openModal('Web Traffic', `
          <p>Last 7 days visits:</p>
          <table style="width:100%; border-collapse:collapse">
            <thead><tr><th>Date</th><th style="text-align:right">Visits</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        `);
        return;
      }
      throw new Error('Empty series');
    } catch {
      // Fallback demo series
      const today = new Date();
      const sample = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        return { date: d, visits: 500 + Math.round(Math.random() * 1500) };
      }).reverse();
      const rows = sample.map(day => `
        <tr>
          <td>${day.date.toLocaleDateString()}</td>
          <td style="text-align:right">${fmt(day.visits)}</td>
        </tr>`).join('');
      openModal('Web Traffic (demo)', `
        <p>Showing sample traffic because the API is unavailable.</p>
        <table style="width:100%; border-collapse:collapse">
          <thead><tr><th>Date</th><th style="text-align:right">Visits</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `);
    }
  }

  async function showSupportIssues() {
    try {
      const res = await fetch('/api/issues?status=open');
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data) && json.data.length) {
        const rows = json.data.map(issue => `
          <tr>
            <td>#${issue.key || issue.id || '—'}</td>
            <td>${issue.title || issue.summary || '—'}</td>
            <td>${issue.priority || '—'}</td>
            <td>${issue.assignee || 'Unassigned'}</td>
          </tr>`).join('');
        openModal('Open Support Issues', `
          <p>Currently open:</p>
          <div style="overflow:auto">
            <table style="width:100%; border-collapse:collapse">
              <thead><tr><th>ID</th><th>Title</th><th>Priority</th><th>Assignee</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `);
        return;
      }
      throw new Error('Empty issues');
    } catch {
      // Fallback demo issues
      const sample = [
        { id: 'SUP-101', title: 'Payment failure on checkout', priority: 'High', assignee: 'N/A' },
        { id: 'SUP-102', title: 'Image not loading on product page', priority: 'Medium', assignee: 'N/A' },
        { id: 'SUP-103', title: 'Unable to reset password', priority: 'Low', assignee: 'N/A' }
      ];
      const rows = sample.map(issue => `
        <tr>
          <td>#${issue.id}</td>
          <td>${issue.title}</td>
          <td>${issue.priority}</td>
          <td>${issue.assignee}</td>
        </tr>`).join('');
      openModal('Open Support Issues (demo)', `
        <p>Showing sample issues because the API is unavailable.</p>
        <div style="overflow:auto">
          <table style="width:100%; border-collapse:collapse">
            <thead><tr><th>ID</th><th>Title</th><th>Priority</th><th>Assignee</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      `);
    }
  }

  // Attach click handlers to both KPI spans and dashboard cards if present
  addClick(['kpi-new-users', 'card-new-users'], showNewUsers);
  addClick(['kpi-web-traffic', 'card-web-traffic'], showWebTraffic);
  addClick(['kpi-open-issues', 'card-support-issues', 'card-open-issues'], showSupportIssues);
});