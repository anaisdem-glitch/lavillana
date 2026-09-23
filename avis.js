function initAvisCarousel(){
  var track = document.getElementById('avisTrack');
  if (!track) return;
  var dotsWrap = document.getElementById('avisDots');
  dotsWrap.innerHTML = '';
  var cards = track.children;
  if (!cards.length) return;

  function cardStep(){ return cards[0].getBoundingClientRect().width + 20; }
  function visibleCount(){ return Math.max(1, Math.round(track.getBoundingClientRect().width / cardStep())); }
  function pageCount(){ return Math.max(1, cards.length - visibleCount() + 1); }

  var dots = [];
  var pages = pageCount();
  for (var i = 0; i < pages; i++){
    var b = document.createElement('button');
    if (i === 0) b.classList.add('active');
    b.addEventListener('click', function(idx){ return function(){ scrollToCard(idx); }; }(i));
    dotsWrap.appendChild(b);
    dots.push(b);
  }
  function scrollToCard(i){ track.scrollTo({ left: i * cardStep(), behavior: 'smooth' }); }

  var prevBtn = document.getElementById('avisPrev');
  var nextBtn = document.getElementById('avisNext');
  if (prevBtn) prevBtn.onclick = function(){ track.scrollBy({ left: -cardStep(), behavior: 'smooth' }); };
  if (nextBtn) nextBtn.onclick = function(){ track.scrollBy({ left: cardStep(), behavior: 'smooth' }); };

  track.onscroll = function(){
    var idx = Math.min(Math.round(track.scrollLeft / cardStep()), dots.length - 1);
    dots.forEach(function(d, i){ d.classList.toggle('active', i === idx); });
  };
}
document.addEventListener('DOMContentLoaded', initAvisCarousel);
