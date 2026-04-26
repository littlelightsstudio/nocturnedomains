/* Launch Gate
 *
 * Hides elements until their feature unlock time. Markup pattern:
 *   <element data-launch="<key>">…</element>
 *
 * Add a key + ISO datetime (with explicit Vienna offset) below to gate it.
 * Times are CET in winter (+01:00), CEST in summer (+02:00).
 * Once a feature is live and confirmed, remove its entry — keeps this file lean.
 */
(function () {
  var LAUNCHES = {
    clearance: '2026-05-01T00:00:00+02:00'
  };

  // Inject hide-rules so gated elements never flash before the JS runs.
  var css = Object.keys(LAUNCHES).map(function (k) {
    return 'html.pre-launch-' + k + ' [data-launch="' + k + '"]{display:none !important}';
  }).join('');
  var style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  function update() {
    var now = Date.now();
    Object.keys(LAUNCHES).forEach(function (key) {
      var unlocked = now >= new Date(LAUNCHES[key]).getTime();
      document.documentElement.classList.toggle('pre-launch-' + key, !unlocked);
    });
  }

  update();
  // Re-check every minute so a tab left open across midnight reveals correctly.
  setInterval(update, 60000);
})();
