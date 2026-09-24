document.addEventListener('DOMContentLoaded', function(){
  var wrap = document.getElementById('tourismFilter');
  if (!wrap) return;
  var buttons = wrap.querySelectorAll('button');
  var items = document.querySelectorAll('#tourismLinks .tourism-card');
  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      buttons.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      items.forEach(function(item){
        var show = (cat === 'all' || item.getAttribute('data-cat') === cat);
        item.style.display = show ? '' : 'none';
      });
    });
  });
});
