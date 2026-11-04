/* Modulo di iscrizione Seems Legit: validazione, invio al backend Apps Script (POST JSON). */
(function () {
  const f = document.getElementById('modulo'); if (!f) return;
  const esito = document.getElementById('esito'); const btn = document.getElementById('invia');
  const cfg = window.CONFIG || {};
  let inCorso = false;
  function dire(t, cls) { esito.textContent = t; esito.className = 'esito ' + (cls || ''); esito.hidden = false; }
  function segna(campo, errato) { if (errato) campo.setAttribute('aria-invalid', 'true'); else campo.removeAttribute('aria-invalid'); }
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (inCorso) return;
    const d = {
      nome: f.nome.value.trim(), email: f.email.value.trim(), azienda: f.azienda.value.trim(), ruolo: f.ruolo.value,
      consenso: f.consenso.checked, news: f.news.checked, pagina: location.href, evento: 'seems-legit-pilota-2026-11-12'
    };
    const nomeKo = !d.nome, emailKo = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email);
    segna(f.nome, nomeKo); segna(f.email, emailKo); segna(f.consenso, !d.consenso);
    if (nomeKo || emailKo) { (nomeKo ? f.nome : f.email).focus(); return dire('Servono nome e un indirizzo email valido.', 'err'); }
    if (!d.consenso) { f.consenso.focus(); return dire('Per mandarti il link serve il consenso all\'informativa.', 'err'); }
    if (!cfg.endpoint) return dire('Anteprima: il modulo non è ancora collegato. Per iscriverti scrivi a ' + (cfg.email || '') + '.', '');
    inCorso = true; btn.disabled = true; dire('Un attimo…', '');
    // Apps Script a freddo può metterci qualche secondo: oltre 25 s consideriamo l'invio fallito invece di lasciare la persona in attesa.
    const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), 25000) : null;
    try {
      const r = await fetch(cfg.endpoint, { method: 'POST', body: JSON.stringify(d), headers: { 'Content-Type': 'text/plain;charset=utf-8' }, signal: ctrl ? ctrl.signal : undefined });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      if (!j || !j.ok) throw new Error((j && j.errore) || 'errore');
      dire('Posto riservato. Ti scriviamo il giorno prima con il link della diretta.', 'ok');
      f.reset();
    } catch (err) {
      dire('Non siamo riusciti a registrare l\'iscrizione. Riprova tra un minuto o scrivi a ' + (cfg.email || '') + '.', 'err');
    } finally { if (timer) clearTimeout(timer); inCorso = false; btn.disabled = false; }
  });
})();
