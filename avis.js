(function(){
  var track = document.getElementById('avisTrack');
  if (!track) return;
  var dotsWrap = document.getElementById('avisDots');
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
  document.getElementById('avisPrev').addEventListener('click', function(){ track.scrollBy({ left: -cardStep(), behavior: 'smooth' }); });
  document.getElementById('avisNext').addEventListener('click', function(){ track.scrollBy({ left: cardStep(), behavior: 'smooth' }); });
  track.addEventListener('scroll', function(){
    var idx = Math.round(track.scrollLeft / cardStep());
    dots.forEach(function(d, i){ d.classList.toggle('active', i === idx); });
  });
})();
