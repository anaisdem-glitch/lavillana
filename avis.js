function initAvisCarousel(){
  var track = document.getElementById('avisTrack');
  if (!track) return;
  var dotsWrap = document.getElementById('avisDots');
  dotsWrap.innerHTML = '';
  var cards = track.children;
  var dots = [];
  for (var i = 0; i < cards.length; i++){
    var b = document.createElement('button');
    if (i === 0) b.classList.add('active');
    b.addEventListener('click', function(idx){ return function(){ scrollToCard(idx); }; }(i));
    dotsWrap.appendChild(b);
    dots.push(b);
  }
  function cardStep(){ return cards[0].getBoundingClientRect().width + 20; }
  function scrollToCard(i){ track.scrollTo({ left: i * cardStep(), behavior: 'smooth' }); }
  var prevBtn = document.getElementById('avisPrev');
  var nextBtn = document.getElementById('avisNext');
  if (prevBtn) prevBtn.onclick = function(){ track.scrollBy({ left: -cardStep(), behavior: 'smooth' }); };
  if (nextBtn) nextBtn.onclick = function(){ track.scrollBy({ left: cardStep(), behavior: 'smooth' }); };
  track.onscroll = function(){
    var idx = Math.round(track.scrollLeft / cardStep());
    dots.forEach(function(d, i){ d.classList.toggle('active', i === idx); });
  };
}
document.addEventListener('DOMContentLoaded', initAvisCarousel);
