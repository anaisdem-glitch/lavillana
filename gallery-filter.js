document.addEventListener('DOMContentLoaded', function(){
  var buttons = document.querySelectorAll('.gallery-filter button');
  var items = document.querySelectorAll('.gallery-grid .space-item');
  if (!buttons.length) return;
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
