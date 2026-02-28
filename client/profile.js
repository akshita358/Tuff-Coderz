(() => {
  const key = 'dashboardUser';
  function getUser() {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }
  function animate(node, to) {
    const from = parseInt(node.textContent || '0', 10) || 0;
    const start = performance.now();
    const dur = 300;
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      node.textContent = String(Math.round(from + (to - from) * p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const el = {
    name: document.getElementById('profileName'),
    email: document.getElementById('profileEmail'),
    budget: document.getElementById('profileBudget'),
    used: document.getElementById('profileUsed'),
    left: document.getElementById('profileLeft'),
    priorities: document.getElementById('profilePriorities'),
    activity: document.getElementById('profileActivity'),
  };
  const user = getUser() || {
    name: localStorage.getItem('userName') || '—',
    weeklyBudget: 100,
    pointsUsed: 0,
    pointsLeft: 100,
    priorities: ['Academics', 'Skill Development', 'Networking'],
    eventsAttended: [],
  };
  el.name.textContent = user.name || '—';
  el.email.textContent = localStorage.getItem('userEmail') || '—';
  animate(el.budget, user.weeklyBudget || 0);
  animate(el.used, user.pointsUsed || 0);
  animate(el.left, user.pointsLeft || 0);
  el.priorities.innerHTML = '';
  user.priorities.forEach((p, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${p}`;
    el.priorities.appendChild(li);
  });
})();

