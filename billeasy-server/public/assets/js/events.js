async function fetchEvents(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/events?${qs}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed');
  return json.data;
}

function renderEvents(items) {
  const list = document.getElementById('event-list');
  const empty = document.getElementById('event-empty');
  list.innerHTML = '';
  if (!items.length) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  items.forEach((ev) => {
    const el = document.createElement('div');
    el.className = 'event-item';
    el.innerHTML = `
      <h3>${ev.title}</h3>
      <div class="event-meta">${new Date(ev.date).toLocaleDateString()} • ${ev.location || 'TBA'}</div>
      <p>${ev.description || ''}</p>
    `;
    list.appendChild(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('event-search');
  const month = document.getElementById('month-filter');

  async function load() {
    const data = await fetchEvents({
      q: search.value,
      month: month.value
    });
    renderEvents(data);
  }

  search.addEventListener('input', load);
  month.addEventListener('change', load);

  load();
});