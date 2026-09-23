(function(){
  var PLACE_ID = 'ChIJSTcQGEr_BEgRzqUvsbzRi9Y';
  var API_KEY = 'AIzaSyC_UOWo2cy5FVU4FqdshS1MNhuEaMfq0r0';

  function esc(str){
    return String(str || '').replace(/[&<>"']/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    var track = document.getElementById('avisTrack');
    if (!track) return;

    fetch('https://places.googleapis.com/v1/places/' + PLACE_ID + '?languageCode=fr', {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'reviews'
      }
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.reviews || !data.reviews.length) return;

      track.innerHTML = data.reviews.slice(0, 5).map(function(rev){
        var author = rev.authorAttribution || {};
        var name = author.displayName || 'Client Google';
        var photo = author.photoUri || '';
        var initial = esc(name.charAt(0).toUpperCase());
        var rating = Math.max(0, Math.min(5, rev.rating || 5));
        var stars = '★★★★★'.slice(0, rating);
        var text = (rev.text && rev.text.text) || (rev.originalText && rev.originalText.text) || '';
        var date = rev.relativePublishTimeDescription || '';
        var avatarInner = photo ? '<img src="' + esc(photo) + '" alt="">' : initial;

        return '<div class="review-card">'
          + '<div class="review-top"><div class="avatar">' + avatarInner + '</div>'
          + '<div><div class="review-name">' + esc(name) + '</div><div class="review-date">' + esc(date) + '</div></div>'
          + '<div class="g-badge">G</div></div>'
          + '<div class="review-stars">' + stars + '</div>'
          + '<p class="review-text">' + esc(text) + '</p></div>';
      }).join('');

      if (typeof initAvisCarousel === 'function') initAvisCarousel();
    })
    .catch(function(err){
      console.warn('Avis Google indisponibles, affichage des avis par défaut.', err);
    });
  });
})();
