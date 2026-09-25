document.addEventListener('DOMContentLoaded', function(){
  var header = document.querySelector('header');
  var btn = document.querySelector('.nav-toggle');
  if (!header || !btn) return;
  function close(){ header.classList.remove('menu-open'); btn.setAttribute('aria-expanded','false'); }
  btn.addEventListener('click', function(){
    var open = header.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  header.querySelectorAll('.nav-links a').forEach(function(a){ a.addEventListener('click', close); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
});
