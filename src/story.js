/* Story Page behaviour: reveal on scroll, count-up numbers, scroll spy, reading progress,
   the mobile drawer and J / K presenter mode. No dependencies. Load at the end of <body>. */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Every animated container. A component that animates when it scrolls into view must be listed here,
     or it will never get .in. Presenter mode uses the same list. */
  var ANIMATED = '.rv,.stagger,.chat,.term,.chart,.swim,.layers,.arch,.gates,.kit,.doc,.prv';

  /* Presenter stops: the blocks J / K step through. Do not nest one stop inside another. */
  var STOPS = '#top,.ch-head,.sub,.persona,.closing';

  /* reveal: add .in when a block scrolls into view (content is visible before this runs) */
  var targets = document.querySelectorAll(ANIMATED);
  function countUp(root){
    root.querySelectorAll('[data-count]').forEach(function(el){
      if (el.dataset.done) return; el.dataset.done = 1;
      var end = parseInt(el.dataset.count,10), t0 = null, dur = 1200;
      if (reduce) return;
      function step(t){ if(!t0) t0=t; var p=Math.min(1,(t-t0)/dur); el.textContent = Math.round(end*(1-Math.pow(1-p,3))).toLocaleString('en-IN'); if(p<1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); countUp(e.target); io.unobserve(e.target); }
      });
    }, {threshold:0.22, rootMargin:'0px 0px -8% 0px'});
    targets.forEach(function(t){ io.observe(t); });
  }

  /* scroll spy for chapters and sub-sections, plus the reading progress bar */
  var toc = document.getElementById('toc');
  var chapters = Array.prototype.slice.call(document.querySelectorAll('.chapter'));
  var subLinks = Array.prototype.slice.call(toc.querySelectorAll('ul a'));
  var subs = subLinks.map(function(a){ return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
  var prog = document.getElementById('prog');
  function spy(){
    var y = window.scrollY + window.innerHeight*0.32;
    var cur = null;
    chapters.forEach(function(c){ if (c.offsetTop <= y) cur = c.id; });
    toc.querySelectorAll(':scope > li').forEach(function(li){ li.classList.toggle('on', li.dataset.ch === cur); });
    var curSub = null;
    subs.forEach(function(s){ if (s.getBoundingClientRect().top + window.scrollY <= y) curSub = s.id; });
    subLinks.forEach(function(a){ a.classList.toggle('on', a.getAttribute('href') === '#'+curSub); });
    var h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h>0 ? (window.scrollY/h*100) : 0) + '%';
  }
  var ticking=false;
  window.addEventListener('scroll', function(){ if(!ticking){ ticking=true; requestAnimationFrame(function(){ spy(); ticking=false; }); } }, {passive:true});
  window.addEventListener('resize', spy);
  spy();

  /* mobile drawer */
  var rail = document.getElementById('rail'), btn = document.getElementById('menuBtn');
  btn.addEventListener('click', function(){ var o = rail.classList.toggle('open'); btn.setAttribute('aria-expanded', o); btn.textContent = o ? 'Close' : 'Contents'; });
  rail.addEventListener('click', function(e){ if (e.target.closest('a') && rail.classList.contains('open')){ rail.classList.remove('open'); btn.setAttribute('aria-expanded','false'); btn.textContent='Contents'; } });

  /* presenter mode: J / K step through one block at a time.
     A block that fits the screen is centred on its own; a taller block is paged through
     before moving on. Everything except the current block is dimmed, so the next one never
     leaks into view half-read. */
  var stops = Array.prototype.slice.call(document.querySelectorAll(STOPS));
  stops.forEach(function(s){ s.classList.add('stop'); });
  var focusIdx = -1, lockUntil = 0;
  function topOf(el){ return el.getBoundingClientRect().top + window.scrollY; }
  function setFocus(i){
    focusIdx = Math.max(0, Math.min(stops.length-1, i));
    stops.forEach(function(s, j){ s.classList.toggle('focus', j === focusIdx); });
    var s = stops[focusIdx];
    if (s.classList && !s.classList.contains('in')) s.querySelectorAll(ANIMATED).forEach(function(t){ t.classList.add('in'); countUp(t); });
  }
  function centreIdx(){
    var mid = window.innerHeight/2, best = 0, bestD = Infinity;
    stops.forEach(function(s, i){
      var r = s.getBoundingClientRect();
      var d = (r.top <= mid && r.bottom >= mid) ? 0 : Math.min(Math.abs(r.top-mid), Math.abs(r.bottom-mid));
      if (d < bestD){ bestD = d; best = i; }
    });
    return best;
  }
  function go(top){ window.scrollTo({top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth'}); }
  function place(i){
    var s = stops[i], h = s.offsetHeight, vh = window.innerHeight, t = topOf(s);
    go(h <= vh - 64 ? t - (vh - h)/2 : t - 24);
  }
  function present(on){ document.body.classList.toggle('presenting', on); if (!on) stops.forEach(function(s){ s.classList.remove('focus'); }); }
  window.addEventListener('scroll', function(){
    if (!document.body.classList.contains('presenting') || Date.now() < lockUntil) return;
    setFocus(centreIdx());
  }, {passive:true});
  document.addEventListener('keydown', function(e){
    if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test(e.target.tagName)) return;
    var k = e.key.toLowerCase();
    if (k === 'escape'){ present(false); return; }
    if (k !== 'j' && k !== 'k') return;
    e.preventDefault();
    var vh = window.innerHeight, wasOn = document.body.classList.contains('presenting');
    present(true);
    var cur = (wasOn && focusIdx >= 0) ? focusIdx : centreIdx();
    var s = stops[cur], r = s.getBoundingClientRect();
    lockUntil = Date.now() + 900;
    if (!wasOn){ setFocus(cur); place(cur); return; }
    if (k === 'j'){
      if (r.bottom > vh - 24 && s.offsetHeight > vh - 64){ go(window.scrollY + Math.min(vh*0.8, r.bottom - vh + 48)); return; }
      if (cur < stops.length - 1){ setFocus(cur + 1); place(cur + 1); }
    } else {
      if (r.top < -10 && s.offsetHeight > vh - 64){ go(window.scrollY - Math.min(vh*0.8, -r.top + 24)); return; }
      if (cur > 0){ setFocus(cur - 1); place(cur - 1); }
    }
  });
  toc.addEventListener('click', function(e){
    var a = e.target.closest('a'); if (!a || !document.body.classList.contains('presenting')) return;
    var el = document.getElementById(a.getAttribute('href').slice(1)); if (!el) return;
    var i = stops.indexOf(el); if (i < 0) i = stops.indexOf(el.querySelector('.stop'));
    if (i >= 0){ e.preventDefault(); lockUntil = Date.now() + 900; setFocus(i); place(i); }
  });
})();
