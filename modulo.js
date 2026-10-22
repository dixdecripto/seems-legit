/* Modulo di iscrizione Seems Legit: validazione, invio al backend Apps Script (POST JSON). */
(function () {
  const f = document.getElementById('modulo'); if (!f) return;
  const esito = document.getElementById('esito'); const btn = document.getElementById('invia');
  const cfg = window.CONFIG || {};
  function dire(t, cls) { esito.textContent = t; esito.className = 'esito ' + (cls || ''); esito.hidden = false; }
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = {
      nome: f.nome.value.trim(), email: f.email.value.trim(), azienda: f.azienda.value.trim(), ruolo: f.ruolo.value,
      consenso: f.consenso.checked, news: f.news.checked, pagina: location.href, evento: 'seems-legit-pilota-2026-11-12'
    };
    if (!d.nome || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return dire('Servono nome e un indirizzo email valido.', 'err');
    if (!d.consenso) return dire('Per mandarti il link serve il consenso all\'informativa.', 'err');
    if (!cfg.endpoint) return dire('Anteprima: il modulo non è ancora collegato. Per iscriverti scrivi a ' + (cfg.email || '') + '.', '');
    btn.disabled = true; dire('Un attimo…', '');
    try {
      const r = await fetch(cfg.endpoint, { method: 'POST', body: JSON.stringify(d), headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
      const j = await r.json();
      if (!j.ok) throw new Error(j.errore || 'errore');
      dire('Posto riservato. Ti scriviamo il giorno prima con il link della diretta.', 'ok');
      f.reset();
    } catch (err) {
      dire('Non siamo riusciti a registrare l\'iscrizione. Riprova tra un minuto o scrivi a ' + (cfg.email || '') + '.', 'err');
    } finally { btn.disabled = false; }
  });
})();
