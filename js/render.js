/* render.js – สร้าง HTML จากข้อมูลใน js/data/ (ไม่มีเนื้อหาในไฟล์นี้) */
window.PP = window.PP || {};

PP.render = (function ($) {
  function chip(g, i) {
    return '<button class="chip" data-group="' + g.id + '" aria-pressed="' + (i === 0) + '">' + g.label + '</button>';
  }

  function service(s, i) {
    var items = s.items.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    return '<article class="service reveal reveal--zoom' + (s.wide ? ' service--wide' : '') + '" data-group="' + s.group +
      '" style="--c:var(--' + s.color + ');--i:' + i + '">' +
      (s.badge ? '<span class="service__badge">' + s.badge + '</span>' : '') +
      '<div class="service__head"><div class="service__icon" aria-hidden="true">' + s.icon + '</div>' +
      '<h3 class="service__title">' + s.title + '</h3></div>' +
      '<ul class="service__list">' + items + '</ul></article>';
  }

  function galleryItem(g, i) {
    return '<button class="gallery__item reveal reveal--zoom" style="--i:' + i + '" data-index="' + i + '">' +
      '<img src="' + g.src + '" alt="' + g.alt + '" loading="lazy">' +
      '<span class="gallery__caption">' + g.caption + '</span></button>';
  }

  function step(s, i) {
    return '<div class="step reveal" style="--i:' + i + '"><h3>' + s.title + '</h3><p>' + s.text + '</p></div>';
  }

  function marquee() {
    var one = PP.services.map(function (s) { return '<span>' + s.icon + ' ' + s.title + '</span>'; }).join('<i aria-hidden="true">✦</i>');
    // ซ้ำ 2 ชุดเพื่อให้วนต่อเนื่องไม่สะดุด
    return '<div class="marquee__track">' + one + '<i aria-hidden="true">✦</i>' + one + '<i aria-hidden="true">✦</i></div>';
  }

  function phone() {
    $('[data-phone="tel"]').attr('href', 'tel:' + PP.config.phoneTel);
    $('[data-phone="text"]').text(PP.config.phoneDisplay);
  }

  function all() {
    $('#filters').html(PP.groups.map(chip).join(''));
    $('#service-grid').html(PP.services.map(service).join(''));
    $('#gallery').html(PP.gallery.map(galleryItem).join(''));
    $('#steps').html(PP.steps.map(step).join(''));
    $('#marquee').html(marquee());
    $('#stat-services').attr('data-count', PP.services.length);
    phone();
  }

  return { all: all };
})(jQuery);
