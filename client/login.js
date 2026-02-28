(() => {
  const form = document.getElementById('loginForm');
  const nameEl = document.getElementById('studentName');
  const emailEl = document.getElementById('studentEmail');
  const passEl = document.getElementById('studentPassword');
  const gBtn = document.getElementById('loginGoogle');
  const aBtn = document.getElementById('loginApple');
  const card = document.querySelector('.portal-card');
  let errorEl = document.getElementById('loginError');
  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.id = 'loginError';
    errorEl.className = 'small';
    errorEl.style.color = '#fca5a5';
    errorEl.style.marginTop = '8px';
    errorEl.style.textAlign = 'center';
    form.appendChild(errorEl);
  }
  function shake() {
    if (!card) return;
    const seq = [-8, 8, -6, 6, -4, 4, 0];
    let i = 0;
    function step() {
      card.style.transform = `translateX(${seq[i]}px)`;
      i++;
      if (i < seq.length) setTimeout(step, 40);
      else setTimeout(() => { card.style.transform = ''; }, 60);
    }
    step();
  }
  function getUser() {
    const raw = localStorage.getItem('dashboardUser');
    return raw ? JSON.parse(raw) : null;
  }
  function saveUser(u) {
    localStorage.setItem('dashboardUser', JSON.stringify(u));
  }
  function setLoggedIn() {
    localStorage.setItem('isLoggedIn', 'true');
  }
  function clearError() {
    errorEl.textContent = '';
  }
  function showError(msg) {
    errorEl.textContent = msg;
    shake();
  }
  function validEmail(v) {
    return v.includes('@');
  }
  function oauthLogin(provider) {
    const user = {
      name: nameEl.value.trim() || 'Alex',
      email: emailEl.value.trim() || (provider === 'google' ? 'alex@university.edu' : 'alex@apple.edu'),
      password: 'oauth',
      weeklyBudget: 1500,
      pointsUsed: 0,
      pointsLeft: 1500,
      priorities: ['Academics', 'Skill Development', 'Networking'],
      events: [
        { name: 'AI Seminar', duration: 1.5, alignment: 95, category: 'Academics' },
        { name: 'Skill Workshop', duration: 2, alignment: 88, category: 'Skill Development' },
        { name: 'Networking Mixer', duration: 1, alignment: 92, category: 'Networking' },
      ],
      dailyUsage: Array(7).fill(0),
      eventsAttended: [],
    };
    saveUser(user);
    setLoggedIn();
    window.location.href = './index.html';
  }
  gBtn.addEventListener('click', () => oauthLogin('google'));
  aBtn.addEventListener('click', () => oauthLogin('apple'));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const pass = passEl.value;
    if (!name || !email || !pass) {
      showError('Please fill all fields.');
      return;
    }
    if (!validEmail(email)) {
      showError('Enter a valid email.');
      return;
    }
    if (pass.length < 6) {
      showError('Password must be at least 6 characters.');
      return;
    }
    const user = getUser();
    if (!user) {
      showError('User not found.');
      return;
    }
    if (String(user.email).toLowerCase() === email.toLowerCase() && String(user.password) === pass) {
      setLoggedIn();
      window.location.href = './index.html';
      return;
    }
    showError('Invalid credentials.');
  });
  window.logout = function () {
    localStorage.removeItem('isLoggedIn');
    window.location.href = './login.html';
  };
})();

