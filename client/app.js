(() => {
  const PRIORITY_WEIGHTS = {
    5: 0.5,
    4: 0.4,
    3: 0.3,
    2: 0.2,
    1: 0.1,
  };
  const PRIORITY_COLORS = {
    5: '#d32f2f',
    4: '#f57c00',
    3: '#fbc02d',
    2: '#388e3c',
    1: '#1976d2',
  };

  const el = {
    weeklyAllowance: document.getElementById('weeklyAllowance'),
    saveAllowance: document.getElementById('saveAllowance'),
    newWeek: document.getElementById('newWeek'),
    remainingPoints: document.getElementById('remainingPoints'),
    legend: document.getElementById('legend'),
    connectGoogle: document.getElementById('connectGoogle'),
    eventForm: document.getElementById('eventForm'),
    title: document.getElementById('title'),
    date: document.getElementById('date'),
    start: document.getElementById('start'),
    end: document.getElementById('end'),
    priority: document.getElementById('priority'),
    pointsCost: document.getElementById('pointsCost'),
    calendar: document.getElementById('calendar'),
    heroCTA: document.getElementById('heroCTA'),
    usedPoints: document.getElementById('usedPoints'),
    pointsLeftDash: document.getElementById('pointsLeftDash'),
    upcomingList: document.getElementById('upcomingList'),
    priorityBars: document.getElementById('priorityBars'),
    overviewChart: document.getElementById('overviewChart'),
  };

  const storage = {
    getAllowance() {
      const v = localStorage.getItem('weeklyAllowance');
      return v ? parseInt(v, 10) : 100;
    },
    setAllowance(v) {
      localStorage.setItem('weeklyAllowance', String(v));
    },
    getRemaining() {
      const v = localStorage.getItem('remainingPoints');
      return v ? parseInt(v, 10) : storage.getAllowance();
    },
    setRemaining(v) {
      localStorage.setItem('remainingPoints', String(v));
    },
    getEvents() {
      const v = localStorage.getItem('events');
      return v ? JSON.parse(v) : [];
    },
    setEvents(events) {
      localStorage.setItem('events', JSON.stringify(events));
    },
  };

  function computeCost(priority, allowance) {
    const weight = PRIORITY_WEIGHTS[priority] || 0.3;
    return Math.max(1, Math.ceil(allowance * weight));
  }

  function updatePointsCost() {
    const allowance = parseInt(el.weeklyAllowance.value || '0', 10);
    const priority = parseInt(el.priority.value || '3', 10);
    const cost = computeCost(priority, allowance);
    el.pointsCost.textContent = String(cost);
  }

  function renderLegend() {
    el.legend.innerHTML = '';
    [5, 4, 3, 2, 1].forEach(p => {
      const li = document.createElement('li');
      const sw = document.createElement('span');
      sw.className = 'swatch';
      sw.style.background = PRIORITY_COLORS[p];
      li.appendChild(sw);
      li.appendChild(document.createTextNode(`Priority ${p}`));
      el.legend.appendChild(li);
    });
  }

  function hydrateState() {
    const allowance = storage.getAllowance();
    el.weeklyAllowance.value = String(allowance);
    el.remainingPoints.textContent = String(storage.getRemaining());
    updatePointsCost();
    renderLegend();
    renderStats();
    renderUpcoming();
    renderPriorities();
    renderOverview();
  }

  // Calendar setup
  let calendar;
  function initCalendar() {
    calendar = new FullCalendar.Calendar(el.calendar, {
      initialView: 'dayGridMonth',
      height: 'auto',
      selectable: true,
      events: storage.getEvents().map(e => ({
        ...e,
        backgroundColor: PRIORITY_COLORS[e.extendedProps.priority],
        borderColor: PRIORITY_COLORS[e.extendedProps.priority],
      })),
      eventDidMount: info => {
        info.el.title = `${info.event.title} • priority ${info.event.extendedProps.priority} • cost ${info.event.extendedProps.cost}`;
      },
    });
    calendar.render();
  }

  function saveCalendarEvents() {
    const events = calendar.getEvents().map(ev => {
      return {
        id: ev.id,
        title: ev.title,
        start: ev.startStr,
        end: ev.endStr,
        allDay: ev.allDay,
        extendedProps: ev.extendedProps,
      };
    });
    storage.setEvents(events);
  }

  // Handlers
  el.saveAllowance.addEventListener('click', () => {
    const v = parseInt(el.weeklyAllowance.value || '0', 10);
    if (Number.isNaN(v) || v < 10) {
      alert('Weekly allowance must be at least 10');
      return;
    }
    storage.setAllowance(v);
    // Recalculate remaining if it exceeded new allowance
    const remaining = storage.getRemaining();
    if (remaining > v) storage.setRemaining(v);
    el.remainingPoints.textContent = String(storage.getRemaining());
    updatePointsCost();
    renderStats();
    renderOverview();
  });

  el.newWeek.addEventListener('click', () => {
    const allowance = storage.getAllowance();
    storage.setRemaining(allowance);
    el.remainingPoints.textContent = String(allowance);
    alert('New week started. Remaining points reset to weekly allowance.');
    renderStats();
    renderOverview();
  });

  el.priority.addEventListener('change', updatePointsCost);
  el.weeklyAllowance.addEventListener('input', updatePointsCost);

  el.eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = el.title.value.trim();
    const date = el.date.value;
    const start = el.start.value;
    const end = el.end.value;
    const priority = parseInt(el.priority.value, 10);
    const allowance = storage.getAllowance();
    const cost = computeCost(priority, allowance);
    const remaining = storage.getRemaining();

    if (!title || !date || !start || !end) {
      alert('Please fill in all event fields');
      return;
    }
    if (remaining < cost) {
      alert(`Insufficient points. Required: ${cost}, remaining: ${remaining}`);
      return;
    }

    const startISO = `${date}T${start}`;
    const endISO = `${date}T${end}`;

    const event = {
      id: String(Date.now()),
      title,
      start: startISO,
      end: endISO,
      allDay: false,
      extendedProps: { priority, cost },
    };
    calendar.addEvent({
      ...event,
      backgroundColor: PRIORITY_COLORS[priority],
      borderColor: PRIORITY_COLORS[priority],
    });
    saveCalendarEvents();

    storage.setRemaining(remaining - cost);
    el.remainingPoints.textContent = String(storage.getRemaining());

    e.target.reset();
    updatePointsCost();
    renderStats();
    renderUpcoming();
    renderPriorities();
    renderOverview();
  });

  el.connectGoogle.addEventListener('click', () => {
    alert('Google Calendar integration will require OAuth setup.\nWe will add this next with a backend to securely handle tokens.');
  });

  function renderStats() {
    const allowance = storage.getAllowance();
    const remaining = storage.getRemaining();
    const used = Math.max(0, allowance - remaining);
    if (el.usedPoints) el.usedPoints.textContent = String(used);
    if (el.pointsLeftDash) el.pointsLeftDash.textContent = String(remaining);
  }

  function parseDate(d) {
    return new Date(d);
  }

  function renderUpcoming() {
    if (!el.upcomingList) return;
    const now = new Date();
    const arr = storage.getEvents()
      .map(e => ({ ...e, startDate: parseDate(e.start) }))
      .filter(e => e.startDate >= now)
      .sort((a, b) => a.startDate - b.startDate)
      .slice(0, 4);
    el.upcomingList.innerHTML = '';
    arr.forEach(e => {
      const li = document.createElement('li');
      li.className = 'list-item';
      const title = document.createElement('div');
      title.textContent = e.title;
      const duration = document.createElement('div');
      const start = parseDate(e.start);
      const end = e.end ? parseDate(e.end) : start;
      const hrs = Math.max(1, Math.round((end - start) / (1000 * 60 * 60)));
      duration.textContent = `${hrs} hrs`;
      const prog = document.createElement('div');
      const percent = Math.min(100, Math.round((e.extendedProps.cost / storage.getAllowance()) * 100));
      prog.innerHTML = `<span class="tag">${percent}%</span>`;
      const btn = document.createElement('button');
      btn.textContent = 'Attend';
      btn.className = 'cta';
      btn.addEventListener('click', () => {
        alert('Already in calendar; manage participation via points and events form below.');
      });
      li.append(title, duration, prog, btn);
      el.upcomingList.appendChild(li);
    });
  }

  function renderPriorities() {
    if (!el.priorityBars) return;
    const events = storage.getEvents();
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    events.forEach(e => { counts[e.extendedProps.priority]++; });
    const max = Math.max(...Object.values(counts), 1);
    el.priorityBars.innerHTML = '';
    [5,4,3,2,1].forEach(p => {
      const label = document.createElement('div');
      label.className = 'bar-label';
      label.innerHTML = `<span>Priority ${p}</span><span>${counts[p]}</span>`;
      const bar = document.createElement('div');
      bar.className = 'bar';
      const fill = document.createElement('div');
      fill.className = 'bar-fill';
      fill.style.width = `${Math.round((counts[p]/max)*100)}%`;
      fill.style.background = PRIORITY_COLORS[p];
      bar.appendChild(fill);
      el.priorityBars.append(label, bar);
    });
  }

  function renderOverview() {
    if (!el.overviewChart) return;
    const days = 7;
    const today = new Date();
    const buckets = Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (days - 1 - i));
      d.setHours(0,0,0,0);
      return { date: d, value: 0 };
    });
    const events = storage.getEvents();
    events.forEach(e => {
      const d = parseDate(e.start);
      d.setHours(0,0,0,0);
      const idx = buckets.findIndex(b => b.date.getTime() === d.getTime());
      if (idx >= 0) buckets[idx].value += e.extendedProps.cost;
    });
    const max = Math.max(...buckets.map(b => b.value), 1);
    const w = 360, h = 100, pad = 6;
    const step = (w - pad*2) / (days - 1);
    const points = buckets.map((b, i) => {
      const x = pad + i * step;
      const y = h - pad - Math.round((b.value / max) * (h - pad*2));
      return `${x},${y}`;
    }).join(' ');
    el.overviewChart.innerHTML = `<svg width="${w}" height="${h}"><polyline fill="none" stroke="#f59e0b" stroke-width="2" points="${points}"/></svg>`;
  }

  // Bootstrap
  hydrateState();
  initCalendar();
})(); 
