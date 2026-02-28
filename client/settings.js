(() => {
  const STORAGE_KEY = 'settings';

  const defaultSettings = {
    name: '',
    email: '',
    weeklyBudget: 100,
    priorities: ['Academics', 'Skill', 'Networking'],
    autoAdjust: true,
    notifications: {
      emailReminders: true,
      eventAlerts: false,
      weeklySummary: true,
    },
    twoFactor: false,
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function getSaved() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : deepClone(defaultSettings);
  }
  function saveToStorage(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  const els = {
    nameInput: document.getElementById('nameInput'),
    emailInput: document.getElementById('emailInput'),
    nameError: document.getElementById('nameError'),
    emailError: document.getElementById('emailError'),
    budgetSlider: document.getElementById('budgetSlider'),
    budgetValue: document.getElementById('budgetValue'),
    priorityTags: document.getElementById('priorityTags'),
    autoAdjust: document.getElementById('autoAdjust'),
    autoAdjustLabel: document.getElementById('autoAdjustLabel'),

    toggleEmailReminders: document.getElementById('toggleEmailReminders'),
    labelEmailReminders: document.getElementById('labelEmailReminders'),
    toggleEventAlerts: document.getElementById('toggleEventAlerts'),
    labelEventAlerts: document.getElementById('labelEventAlerts'),
    toggleWeeklySummary: document.getElementById('toggleWeeklySummary'),
    labelWeeklySummary: document.getElementById('labelWeeklySummary'),

    toggleTwoFactor: document.getElementById('toggleTwoFactor'),
    labelTwoFactor: document.getElementById('labelTwoFactor'),

    saveBtn: document.getElementById('saveBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    toast: document.getElementById('toast'),

    changePasswordBtn: document.getElementById('changePasswordBtn'),
    passwordModal: document.getElementById('passwordModal'),
    passwordForm: document.getElementById('passwordForm'),
    closePassModal: document.getElementById('closePassModal'),
    submitPassModal: document.getElementById('submitPassModal'),
    currentPass: document.getElementById('currentPass'),
    newPass: document.getElementById('newPass'),
    confirmPass: document.getElementById('confirmPass'),
    passError: document.getElementById('passError'),
  };

  let settings = getSaved();
  let lastSaved = deepClone(settings);
  let selectedPriorityIndex = 0;

  function setActiveText(el, active) {
    if (!el) return;
    el.style.color = active ? 'var(--accent)' : 'var(--muted)';
    el.textContent = active ? 'On' : 'Off';
  }

  function showToast(msg) {
    const t = els.toast;
    t.textContent = msg;
    t.style.opacity = '1';
    setTimeout(() => {
      t.style.opacity = '0';
    }, 1800);
  }

  function emailValid(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function renderForm() {
    els.nameInput.value = settings.name;
    els.emailInput.value = settings.email;
    els.budgetSlider.value = settings.weeklyBudget;
    els.budgetValue.textContent = String(settings.weeklyBudget);

    Array.from(els.priorityTags.children).forEach((btn, idx) => {
      const key = btn.getAttribute('data-key');
      const orderIdx = settings.priorities.indexOf(key);
      btn.setAttribute('data-order', String(orderIdx));
      btn.style.borderColor = orderIdx === selectedPriorityIndex ? 'var(--accent)' : 'var(--border)';
      btn.style.color = orderIdx === selectedPriorityIndex ? 'var(--accent)' : 'var(--text)';
    });

    els.autoAdjust.checked = settings.autoAdjust;
    setActiveText(els.autoAdjustLabel, settings.autoAdjust);

    els.toggleEmailReminders.checked = settings.notifications.emailReminders;
    setActiveText(els.labelEmailReminders, settings.notifications.emailReminders);
    els.toggleEventAlerts.checked = settings.notifications.eventAlerts;
    setActiveText(els.labelEventAlerts, settings.notifications.eventAlerts);
    els.toggleWeeklySummary.checked = settings.notifications.weeklySummary;
    setActiveText(els.labelWeeklySummary, settings.notifications.weeklySummary);

    els.toggleTwoFactor.checked = settings.twoFactor;
    setActiveText(els.labelTwoFactor, settings.twoFactor);
  }

  function animateBudgetValue(to) {
    const from = parseInt(els.budgetValue.textContent || '0', 10);
    const start = performance.now();
    const dur = 180;
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const val = Math.round(from + (to - from) * p);
      els.budgetValue.textContent = String(val);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initPriorityDrag() {
    let dragSrc = null;
    els.priorityTags.addEventListener('dragstart', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      dragSrc = target;
      e.dataTransfer.setData('text/plain', target.getAttribute('data-key') || '');
    });
    els.priorityTags.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    els.priorityTags.addEventListener('drop', (e) => {
      e.preventDefault();
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (!dragSrc || dragSrc === target) return;
      const srcKey = dragSrc.getAttribute('data-key');
      const tgtKey = target.getAttribute('data-key');
      if (!srcKey || !tgtKey) return;
      const arr = settings.priorities.slice();
      const si = arr.indexOf(srcKey);
      const ti = arr.indexOf(tgtKey);
      arr.splice(si, 1);
      arr.splice(ti, 0, srcKey);
      settings.priorities = arr;
      renderForm();
    });
  }

  function initPriorityClick() {
    els.priorityTags.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const key = target.getAttribute('data-key');
      if (!key) return;
      const idx = settings.priorities.indexOf(key);
      if (idx >= 0) {
        selectedPriorityIndex = idx;
        renderForm();
      }
    });
  }

  function bindInputs() {
    els.nameInput.addEventListener('input', (e) => {
      settings.name = e.target.value;
      els.nameInput.style.borderColor = '';
      els.nameError.style.display = 'none';
    });
    els.emailInput.addEventListener('input', (e) => {
      settings.email = e.target.value;
      els.emailInput.style.borderColor = '';
      els.emailError.style.display = 'none';
    });
    els.budgetSlider.addEventListener('input', (e) => {
      const v = parseInt(e.target.value, 10);
      settings.weeklyBudget = v;
      animateBudgetValue(v);
    });
    els.autoAdjust.addEventListener('change', (e) => {
      const v = e.target.checked;
      settings.autoAdjust = v;
      setActiveText(els.autoAdjustLabel, v);
    });
    els.toggleEmailReminders.addEventListener('change', (e) => {
      const v = e.target.checked;
      settings.notifications.emailReminders = v;
      setActiveText(els.labelEmailReminders, v);
    });
    els.toggleEventAlerts.addEventListener('change', (e) => {
      const v = e.target.checked;
      settings.notifications.eventAlerts = v;
      setActiveText(els.labelEventAlerts, v);
    });
    els.toggleWeeklySummary.addEventListener('change', (e) => {
      const v = e.target.checked;
      settings.notifications.weeklySummary = v;
      setActiveText(els.labelWeeklySummary, v);
    });
    els.toggleTwoFactor.addEventListener('change', (e) => {
      const v = e.target.checked;
      settings.twoFactor = v;
      setActiveText(els.labelTwoFactor, v);
    });
  }

  function validate() {
    let ok = true;
    if (!settings.name.trim()) {
      els.nameError.style.display = 'block';
      els.nameInput.style.borderColor = '#fca5a5';
      ok = false;
    }
    if (!emailValid(settings.email)) {
      els.emailError.style.display = 'block';
      els.emailInput.style.borderColor = '#fca5a5';
      ok = false;
    }
    return ok;
  }

  function onSave() {
    if (!validate()) return;
    els.saveBtn.disabled = true;
    const originalText = els.saveBtn.textContent;
    els.saveBtn.textContent = 'Saving...';
    setTimeout(() => {
      saveToStorage(settings);
      lastSaved = deepClone(settings);
      els.saveBtn.disabled = false;
      els.saveBtn.textContent = originalText;
      showToast('Settings saved successfully');
    }, 1000);
  }

  function onCancel() {
    settings = deepClone(lastSaved);
    renderForm();
    showToast('Reverted to last saved');
  }

  function initPasswordModal() {
    els.changePasswordBtn.addEventListener('click', () => {
      els.passwordModal.showModal();
    });
    els.closePassModal.addEventListener('click', () => {
      els.passwordModal.close();
      els.passError.style.display = 'none';
    });
    els.passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const np = els.newPass.value;
      const cp = els.confirmPass.value;
      if (np !== cp || np.length < 6) {
        els.passError.style.display = 'block';
        return;
      }
      els.passError.style.display = 'none';
      els.passwordModal.close();
      showToast('Password updated');
      els.currentPass.value = '';
      els.newPass.value = '';
      els.confirmPass.value = '';
    });
  }

  function init() {
    renderForm();
    bindInputs();
    initPriorityDrag();
    initPriorityClick();
    initPasswordModal();
    els.saveBtn.addEventListener('click', onSave);
    els.cancelBtn.addEventListener('click', onCancel);
  }

  init();
})();

