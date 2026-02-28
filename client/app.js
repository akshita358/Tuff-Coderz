(() => {
<<<<<<< HEAD
  const root = document.getElementById('portal-root');
  if (!root) return;

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    children.forEach(c => node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return node;
  }

  const nav = el('nav', { class: 'nav' }, [
    el('div', { class: 'brand', text: 'Attention Bank' }),
    el('ul', { class: 'nav-links' }, [
      el('li', {}, [el('a', { href: './index.html', text: 'Home' })]),
      el('li', {}, [el('a', { href: '#', text: 'About' })]),
    ]),
    el('a', { class: 'cta', href: '#', text: 'Create Account' }),
  ]);

  const hero = el('section', { class: 'portal-hero' }, [
    el('h1', { class: 'portal-title', text: 'ATTENTION BANK PORTAL' }),
    el('p', { class: 'portal-sub', text: 'Direct your priorities, unlock your potential.' }),
  ]);

  const wrap = el('section', { class: 'portal-wrap' }, []);
  const bg = el('div', { class: 'portal-bg' });
  const center = el('div', { class: 'portal-center' });
  const avRing = el('div', { class: 'avatar-ring' }, [el('div', { class: 'avatar' })]);

  const card = el('div', { class: 'portal-card' });
  const head = el('div', { class: 'portal-card-head', text: 'Login to continue your journey.' });
  const form = el('form', { id: 'loginForm', class: 'portal-form' });
  const f1 = el('div', { class: 'field' }, [
    el('input', { id: 'studentName', type: 'text', placeholder: 'Enter your Student Name', required: '' }),
  ]);
  const f2 = el('div', { class: 'field' }, [
    el('input', { id: 'studentEmail', type: 'email', placeholder: 'Enter your University Email or ID', required: '' }),
  ]);
  const f3 = el('div', { class: 'field' }, [
    el('input', { id: 'studentPassword', type: 'password', placeholder: 'Enter your Password', minlength: '6', required: '' }),
  ]);
  const row = el('div', { class: 'form-row' }, [el('a', { href: '#', class: 'link muted', text: 'Forgot Password' })]);
  const oauth = el('div', { class: 'oauth' }, [
    el('button', { type: 'button', id: 'loginGoogle', class: 'oauth-btn google' }, [
      el('img', { class: 'icon-img', src: 'https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png', alt: 'Google' }),
      el('span', { text: 'Continue with Google' }),
    ]),
    el('button', { type: 'button', id: 'loginApple', class: 'oauth-btn apple' }, [
      el('img', { class: 'icon-img', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', alt: 'Apple' }),
      el('span', { text: 'Continue with Apple' }),
    ]),
  ]);
  const submit = el('button', { type: 'submit', class: 'cta primary wide', text: 'LOG IN' });
  const row2 = el('div', { class: 'form-row center muted small' }, [
    el('span', { text: "Don't have an account?" }),
    el('a', { href: '#', class: 'link', text: 'Sign Up' }),
  ]);

  form.append(f1, f2, f3, row, oauth, submit, row2);
  card.append(head, form);
  center.append(avRing, card);
  wrap.append(bg, center);

  root.append(nav, hero, wrap);

  const gBtn = document.getElementById('loginGoogle');
  const aBtn = document.getElementById('loginApple');
  const nameEl = document.getElementById('studentName');
  const emailEl = document.getElementById('studentEmail');
  const passEl = document.getElementById('studentPassword');

  gBtn.addEventListener('click', () => {
    alert('Google OAuth will be connected with backend. Use form login for now.');
  });
  aBtn.addEventListener('click', () => {
    alert('Apple Sign-In will be connected with backend. Use form login for now.');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const pass = passEl.value;
    if (!name || !email || pass.length < 6) {
      alert('Please fill all fields correctly.');
      return;
    }
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    window.location.href = './index.html';
  });
})();

(() => {
=======
  const USER_STORAGE_KEY = 'dashboardUser';
>>>>>>> 17728aa50d402d309368cdde3b64925793f86c95
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

  const defaultUser = {
    name: 'Alex',
    weeklyBudget: 1500,
    pointsUsed: 1180,
    pointsLeft: 320,
    priorities: ['Academics', 'Skill Development', 'Networking'],
    events: [
      { name: 'AI Seminar', duration: 1.5, alignment: 95, category: 'Academics' },
      { name: 'Skill Workshop', duration: 2, alignment: 88, category: 'Skill Development' },
      { name: 'Networking Mixer', duration: 1, alignment: 92, category: 'Networking' },
    ],
    dailyUsage: Array(7).fill(0),
    eventsAttended: [],
  };
  function getUser() {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { ...defaultUser };
  }
  function saveUser(u) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
  }
  let user = getUser();

  const storage = {
    getAllowance() {
      const v = user.weeklyBudget;
      return v ? parseInt(v, 10) : 100;
    },
    setAllowance(v) {
      user.weeklyBudget = v;
      const used = user.pointsUsed || 0;
      user.pointsLeft = Math.max(0, v - used);
      saveUser(user);
    },
    getRemaining() {
      const v = user.pointsLeft;
      return v ? parseInt(v, 10) : storage.getAllowance();
    },
    setRemaining(v) {
      user.pointsLeft = v;
      const allowance = storage.getAllowance();
      user.pointsUsed = Math.max(0, allowance - v);
      saveUser(user);
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
    animateNumber(el.remainingPoints, storage.getRemaining());
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
    if (typeof FullCalendar === 'undefined' || !el.calendar) return;
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
    const remaining = storage.getRemaining();
    if (remaining > v) storage.setRemaining(v);
    animateNumber(el.remainingPoints, storage.getRemaining());
    updatePointsCost();
    renderStats();
    renderOverview();
  });

  el.newWeek.addEventListener('click', () => {
    const allowance = storage.getAllowance();
    storage.setRemaining(allowance);
    animateNumber(el.remainingPoints, allowance);
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
    animateNumber(el.remainingPoints, storage.getRemaining());

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
    user.pointsUsed = used;
    user.pointsLeft = remaining;
    saveUser(user);
    if (el.usedPoints) animateNumber(el.usedPoints, used);
    if (el.pointsLeftDash) animateNumber(el.pointsLeftDash, remaining);
  }

  function parseDate(d) {
    return new Date(d);
  }

  function renderUpcoming() {
    if (!el.upcomingList) return;
    const arr = user.events.slice(0, 4);
    el.upcomingList.innerHTML = '';
    arr.forEach(e => {
      const li = document.createElement('li');
      li.className = 'list-item';
      const title = document.createElement('div');
      title.textContent = e.name;
      if (e.category === user.priorities[0]) title.style.color = 'var(--accent)';
      const duration = document.createElement('div');
      duration.textContent = `${e.duration} hrs`;
      const prog = document.createElement('div');
      prog.innerHTML = `<span class="tag">${e.alignment}%</span>`;
      const btn = document.createElement('button');
      btn.textContent = 'Attend';
      btn.className = 'cta';
      const base = e.duration * 50;
      let finalCost = Math.round(base * (e.alignment / 100));
      const idx = user.priorities.indexOf(e.category);
      if (idx === 0) finalCost = Math.round(finalCost * 0.8);
      else if (idx === 1) finalCost = Math.round(finalCost * 1.0);
      else if (idx === 2) finalCost = Math.round(finalCost * 1.2);
      if (user.pointsLeft < finalCost) btn.disabled = true;
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btn.disabled = true;
        const prev = btn.textContent;
        btn.textContent = 'Attending...';
        setTimeout(() => {
          const remaining = storage.getRemaining();
          if (remaining < finalCost) {
            btn.textContent = prev;
            btn.disabled = true;
            return;
          }
          storage.setRemaining(Math.max(0, remaining - finalCost));
          user.eventsAttended.push({ name: e.name, category: e.category, cost: finalCost });
          const buckets = user.dailyUsage && Array.isArray(user.dailyUsage) ? user.dailyUsage : Array(7).fill(0);
          const today = new Date();
          const idxDay = 6;
          buckets[idxDay] = (buckets[idxDay] || 0) + finalCost;
          user.dailyUsage = buckets;
          saveUser(user);
          renderStats();
          renderOverview(true);
          renderPriorities();
          btn.textContent = 'Attended';
        }, 400);
      });
      li.append(title, duration, prog, btn);
      el.upcomingList.appendChild(li);
    });
  }

  function renderPriorities() {
    if (!el.priorityBars) return;
    const counts = { 'Academics': 0, 'Skill Development': 0, 'Networking': 0 };
    user.eventsAttended.forEach(e => { if (counts[e.category] !== undefined) counts[e.category] += e.cost; });
    const max = Math.max(...Object.values(counts), 1);
    el.priorityBars.innerHTML = '';
    [user.priorities[0], user.priorities[1], user.priorities[2]].forEach(cat => {
      const label = document.createElement('div');
      label.className = 'bar-label';
      label.innerHTML = `<span>${cat}</span><span>${counts[cat]}</span>`;
      const bar = document.createElement('div');
      bar.className = 'bar';
      const fill = document.createElement('div');
      fill.className = 'bar-fill';
      fill.style.width = `${Math.round((counts[cat]/max)*100)}%`;
      fill.style.background = '#f59e0b';
      bar.appendChild(fill);
      el.priorityBars.append(label, bar);
    });
  }

  function animateNumber(node, to) {
    const from = parseInt(node.textContent || '0', 10);
    const start = performance.now();
    const dur = 300;
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const v = Math.round(from + (to - from) * p);
      node.textContent = String(v);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderOverview(animated) {
    if (!el.overviewChart) return;
    const days = 7;
    const w = 360, h = 100, pad = 6;
    const step = (w - pad*2) / (days - 1);
    const series = user.dailyUsage && user.dailyUsage.length === days ? user.dailyUsage.slice() : Array(days).fill(0);
    const max = Math.max(...series, 1);
    function toPoints(mult = 1) {
      return series.map((val, i) => {
        const x = pad + i * step;
        const y = h - pad - Math.round(((val * mult) / max) * (h - pad*2));
        return `${x},${y}`;
      }).join(' ');
    }
    let t = 0;
    function draw() {
      const m = Math.min(1, t);
      const points = toPoints(m);
      el.overviewChart.innerHTML = `<svg width="${w}" height="${h}"><polyline fill="none" stroke="#f59e0b" stroke-width="2" points="${points}"/></svg>`;
      if (m < 1) {
        t += 0.08;
        requestAnimationFrame(draw);
      }
    }
    if (animated) draw();
    else {
      const points = toPoints(1);
      el.overviewChart.innerHTML = `<svg width="${w}" height="${h}"><polyline fill="none" stroke="#f59e0b" stroke-width="2" points="${points}"/></svg>`;
    }
  }

  // Bootstrap
  hydrateState();
  initCalendar();
})(); 
