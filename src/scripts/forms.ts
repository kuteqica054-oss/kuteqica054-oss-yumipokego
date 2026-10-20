// Franchise başvuru formları: adım geçişi, doğrulama ve gönderim (Netlify Forms veya Formspree).
type Msgs = Record<'required' | 'email' | 'phone' | 'kvkk' | 'summary' | 'send' | 'notConfigured' | 'sending' | 'stepOf', string>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRe = /^\+?[0-9\s().-]{7,20}$/;

function msgs(form: HTMLFormElement): Msgs {
  return JSON.parse(form.dataset.msgs || '{}');
}

function setError(field: HTMLElement, msg: string | null) {
  const err = field.querySelector<HTMLElement>('[data-error]');
  const inputs = field.querySelectorAll<HTMLInputElement>('input, select, textarea');
  inputs.forEach((i) => (msg ? i.setAttribute('aria-invalid', 'true') : i.removeAttribute('aria-invalid')));
  if (err) { err.textContent = msg ?? ''; err.classList.toggle('hidden', !msg); }
}

function validateField(field: HTMLElement, m: Msgs): boolean {
  const inputs = Array.from(field.querySelectorAll<HTMLInputElement>('input, select, textarea'));
  const first = inputs[0];
  if (!first) return true;
  const required = inputs.some((i) => i.required);
  let msg: string | null = null;
  if (first.type === 'radio') {
    if (required && !inputs.some((i) => i.checked)) msg = m.required;
  } else if (first.type === 'checkbox') {
    if (required && !first.checked) msg = first.name === 'kvkk_consent' ? m.kvkk : m.required;
  } else {
    const v = first.value.trim();
    if (required && !v) msg = m.required;
    else if (v && first.type === 'email' && !emailRe.test(v)) msg = m.email;
    else if (v && first.type === 'tel' && !phoneRe.test(v)) msg = m.phone;
  }
  setError(field, msg);
  return !msg;
}

function validateScope(scope: HTMLElement, form: HTMLFormElement): boolean {
  const m = msgs(form);
  const fields = Array.from(scope.querySelectorAll<HTMLElement>('[data-field]'));
  const bad = fields.filter((f) => !validateField(f, m));
  const summary = form.querySelector<HTMLElement>('[data-summary]');
  if (summary) { summary.textContent = bad.length ? m.summary : ''; summary.classList.toggle('hidden', !bad.length); }
  if (bad.length) bad[0].querySelector<HTMLElement>('input, select, textarea')?.focus();
  return !bad.length;
}

async function submit(form: HTMLFormElement): Promise<'ok' | 'error' | 'not-configured'> {
  const provider = form.dataset.provider;
  const data = new FormData(form);
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (local) { console.warn('[form] Yerel geliştirme: gönderim simüle edildi.', Object.fromEntries(data)); return 'ok'; }
  try {
    if (provider === 'php') {
      const r = await fetch('/form.php', { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      return r.ok ? 'ok' : r.status === 503 ? 'not-configured' : 'error';
    }
    if (provider === 'formspree') {
      const id = form.dataset.formspree;
      if (!id) return 'not-configured';
      const r = await fetch(`https://formspree.io/f/${id}`, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      return r.ok ? 'ok' : 'error';
    }
    const body = new URLSearchParams(data as unknown as Record<string, string>).toString();
    const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
    return r.ok ? 'ok' : 'error';
  } catch { return 'error'; }
}

function showThanks(form: HTMLFormElement) {
  const wrap = form.closest('[data-form-wrap]');
  const thanks = wrap?.querySelector<HTMLElement>('[data-thanks]');
  if (!thanks) return;
  form.hidden = true;
  wrap?.querySelector<HTMLElement>('[data-progress]')?.setAttribute('hidden', '');
  thanks.hidden = false;
  thanks.querySelector<HTMLElement>('h2, h3')?.focus();
  thanks.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
}

export function initForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-apply-form]').forEach((form) => {
    if (form.dataset.ready) return;
    form.dataset.ready = '1';
    const m = msgs(form);
    const steps = Array.from(form.querySelectorAll<HTMLElement>('[data-step]'));
    const wrap = form.closest<HTMLElement>('[data-form-wrap]');
    let current = 0;

    if (new URLSearchParams(location.search).has('sent')) { showThanks(form); return; }

    const render = () => {
      steps.forEach((s, i) => (s.hidden = i !== current));
      wrap?.querySelectorAll<HTMLElement>('[data-progress-item]').forEach((p, i) => {
        p.dataset.state = i < current ? 'done' : i === current ? 'current' : 'todo';
        if (i === current) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current');
      });
      const label = wrap?.querySelector<HTMLElement>('[data-step-label]');
      if (label) label.textContent = m.stepOf.replace('{a}', String(current + 1)).replace('{b}', String(steps.length));
    };
    if (steps.length > 1) render();

    form.addEventListener('click', (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-nav]');
      if (!btn) return;
      e.preventDefault();
      if (btn.dataset.nav === 'next') {
        if (!validateScope(steps[current], form)) return;
        current = Math.min(current + 1, steps.length - 1);
      } else current = Math.max(current - 1, 0);
      render();
      steps[current].querySelector<HTMLElement>('legend, h3')?.focus();
      wrap?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });

    form.addEventListener('change', (e) => {
      const field = (e.target as HTMLElement).closest<HTMLElement>('[data-field]');
      if (field?.querySelector('[aria-invalid]')) validateField(field, m);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateScope(steps.length ? steps[current] : form, form)) return;
      const btn = form.querySelector<HTMLButtonElement>('[type="submit"]');
      const label = btn?.textContent;
      if (btn) { btn.disabled = true; btn.textContent = m.sending; }
      const page = form.querySelector<HTMLInputElement>('input[name="page"]');
      if (page) page.value = location.href;
      const res = await submit(form);
      if (btn) { btn.disabled = false; btn.textContent = label ?? ''; }
      if (res === 'ok') return showThanks(form);
      const summary = form.querySelector<HTMLElement>('[data-summary]');
      if (summary) { summary.textContent = res === 'not-configured' ? m.notConfigured : m.send; summary.classList.remove('hidden'); summary.focus(); }
    });
  });
}
