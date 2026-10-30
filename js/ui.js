/* ui.js – พฤติกรรมของหน้าเว็บ: เมนู, ปุ่มกรองบริการ, ขนาดตัวอักษร, lightbox */
window.PP = window.PP || {};

PP.ui = (function ($) {
  function initMenu() {
    var $nav = $('#nav'), $btn = $('.nav__burger');
    function toggle(open) {
      $nav.toggleClass('is-open', open);
      $btn.attr('aria-expanded', $nav.hasClass('is-open'));
    }
    $btn.on('click', function () { toggle(); });
    $nav.on('click', 'a', function () { toggle(false); });
  }

  /* กรองบริการตามกลุ่ม พร้อมเล่นแอนิเมชันใหม่ */
  function initFilter() {
    $('#filters').on('click', '.chip', function () {
      var g = $(this).data('group');
      $('#filters .chip').attr('aria-pressed', 'false');
      $(this).attr('aria-pressed', 'true');
      var $cards = $('#service-grid .service');
      $cards.addClass('is-hidden').filter(g === 'all' ? '*' : '[data-group="' + g + '"]').removeClass('is-hidden')
        .each(function (i) { this.style.setProperty('--i', i); })
        .removeClass('is-in reveal-done');
      var $shown = $cards.not('.is-hidden');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          $shown.addClass('is-in');
          setTimeout(function () { $shown.addClass('reveal-done'); }, 900);
        });
      });
    });
  }

  /* ปรับขนาดตัวอักษร 3 ระดับ (เหมาะกับผู้สูงอายุ) จำค่าไว้ */
  function initFontSize() {
    var level = 0, labels = ['ก', 'ก+', 'ก++'];
    try { level = parseInt(localStorage.getItem('pp-fs'), 10) || 0; } catch (e) {}
    function apply() {
      $('html').removeClass('fs-1 fs-2').addClass(level ? 'fs-' + level : '');
      $('.fontsize').text(labels[level]).attr('aria-label', 'ขนาดตัวอักษร ระดับ ' + (level + 1) + ' จาก 3 กดเพื่อเปลี่ยน');
    }
    $('.fontsize').on('click', function () {
      level = (level + 1) % 3;
      try { localStorage.setItem('pp-fs', level); } catch (e) {}
      apply();
    });
    apply();
  }

  /* Lightbox: ก่อนหน้า/ถัดไป, ปุ่มลูกศร, ปาดนิ้ว */
  function initLightbox() {
    var $lb = $('#lightbox'), $img = $lb.find('img'), $cap = $lb.find('.lightbox__caption'), cur = 0, x0 = null;
    function show(i) {
      cur = (i + PP.gallery.length) % PP.gallery.length;
      var g = PP.gallery[cur];
      $img.removeClass('is-swap'); void $img[0].offsetWidth;
      $img.attr({ src: g.src, alt: g.alt }).addClass('is-swap');
      $cap.text(g.caption + '  ·  ' + (cur + 1) + '/' + PP.gallery.length);
    }
    function open(i) { show(i); $lb.addClass('is-open'); $lb.find('.lightbox__close').trigger('focus'); }
    function close() { $lb.removeClass('is-open'); }

    $('#gallery').on('click', '.gallery__item', function () { open($(this).data('index')); });
    $lb.on('click', function (e) { if (e.target === this) close(); });
    $lb.find('.lightbox__close').on('click', close);
    $lb.find('.lightbox__prev').on('click', function () { show(cur - 1); });
    $lb.find('.lightbox__next').on('click', function () { show(cur + 1); });
    $lb.on('touchstart', function (e) { x0 = e.originalEvent.touches[0].clientX; })
       .on('touchend', function (e) {
         if (x0 === null) return;
         var dx = e.originalEvent.changedTouches[0].clientX - x0;
         if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
         x0 = null;
       });
    $(document).on('keydown', function (e) {
      if (!$lb.hasClass('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'ArrowLeft') show(cur - 1);
    });
  }

  return { init: function () { initMenu(); initFilter(); initFontSize(); initLightbox(); } };
})(jQuery);
