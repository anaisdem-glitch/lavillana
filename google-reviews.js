(function(){
  var PLACE_ID = 'ChIJSTcQGEr_BEgRzqUvsbzRi9Y';
  var API_KEY = 'AIzaSyC_UOWo2cy5FVU4FqdshS1MNhuEaMfq0r0';
  var EXCERPT_LEN = 140;
  var LANG = (document.documentElement.lang || 'fr').slice(0, 2);
  var TXT = {
    fr: { more: 'Lire la suite', less: 'Réduire', anon: 'Client Google' },
    en: { more: 'Read more', less: 'Show less', anon: 'Google user' },
    de: { more: 'Weiterlesen', less: 'Weniger anzeigen', anon: 'Google-Nutzer' }
  }[LANG] || { more: 'Lire la suite', less: 'Réduire', anon: 'Client Google' };

  // Classification donnée par Anaïs : ces prénoms = avis "particuliers", tout le reste = "pro".
  var PARTICULIER_NAMES = ['rolf','fiona','christiane','clemence','whitney','guillaume'];

  function normalize(str){
    return String(str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function isKnownParticulier(name){
    var n = normalize(name);
    return PARTICULIER_NAMES.some(function(first){ return n.indexOf(first) !== -1; });
  }

  function esc(str){
    return String(str || '').replace(/[&<>"']/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  function truncate(text){
    if (text.length <= EXCERPT_LEN) return { short: text, needsMore: false };
    var cut = text.slice(0, EXCERPT_LEN);
    var lastSpace = cut.lastIndexOf(' ');
    if (lastSpace > 0) cut = cut.slice(0, lastSpace);
    return { short: cut + '…', needsMore: true };
  }

  function reviewText(rev){
    return (rev.text && rev.text.text) || (rev.originalText && rev.originalText.text) || '';
  }
  function reviewerName(rev){
    return (rev.authorAttribution && rev.authorAttribution.displayName) || '';
  }
  function isPro(rev){
    return !isKnownParticulier(reviewerName(rev));
  }
  function isPerso(rev){
    return isKnownParticulier(reviewerName(rev));
  }

  document.addEventListener('DOMContentLoaded', function(){
    var track = document.getElementById('avisTrack');
    if (!track) return;
    var mode = track.getAttribute('data-mode') || 'all';

    fetch('https://places.googleapis.com/v1/places/' + PLACE_ID + '?languageCode=' + LANG, {
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'reviews'
      }
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!data.reviews || !data.reviews.length) return;

      // Les mieux notés d'abord, puis les plus récents à note égale — pas de tri par catégorie.
      var reviews = data.reviews.slice().sort(function(a, b){
        var byRating = (b.rating || 0) - (a.rating || 0);
        if (byRating !== 0) return byRating;
        return new Date(b.publishTime) - new Date(a.publishTime);
      });

      var chosen = reviews;

      if (!chosen.length){
        var section = track.closest('section');
        if (section) section.style.display = 'none';
        return;
      }

      track.innerHTML = chosen.slice(0, 5).map(function(rev){
        var author = rev.authorAttribution || {};
        var name = author.displayName || TXT.anon;
        var photo = author.photoUri || '';
        var initial = esc(name.charAt(0).toUpperCase());
        var rating = Math.max(0, Math.min(5, rev.rating || 5));
        var stars = '★★★★★'.slice(0, rating);
        var fullText = reviewText(rev);
        var date = rev.relativePublishTimeDescription || '';
        var avatarInner = photo ? '<img src="' + esc(photo) + '" alt="">' : initial;
        var t = truncate(fullText);

        var textHtml = t.needsMore
          ? '<span class="review-short">' + esc(t.short) + ' <button class="review-more" type="button">' + TXT.more + '</button></span>'
            + '<span class="review-full" hidden>' + esc(fullText) + ' <button class="review-less" type="button">' + TXT.less + '</button></span>'
          : esc(fullText);

        return '<div class="review-card">'
          + '<div class="review-top"><div class="avatar">' + avatarInner + '</div>'
          + '<div><div class="review-name">' + esc(name) + '</div><div class="review-date">' + esc(date) + '</div></div>'
          + '<div class="g-badge">G</div></div>'
          + '<div class="review-stars">' + stars + '</div>'
          + '<p class="review-text">' + textHtml + '</p></div>';
      }).join('');

      track.querySelectorAll('.review-more, .review-less').forEach(function(btn){
        btn.addEventListener('click', function(){
          var p = btn.closest('.review-text');
          p.querySelector('.review-short').hidden = !p.querySelector('.review-short').hidden;
          p.querySelector('.review-full').hidden = !p.querySelector('.review-full').hidden;
        });
      });

      if (typeof initAvisCarousel === 'function') initAvisCarousel();
    })
    .catch(function(err){
      console.warn('Avis Google indisponibles, affichage des avis par défaut.', err);
    });
  });
})();
