/* effects.js – ลูกเล่นและภาพเคลื่อนไหว (เคารพการตั้งค่า "ลดการเคลื่อนไหว" ของเครื่อง) */
window.PP = window.PP || {};

PP.fx = (function ($) {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var COLORS = ['#e6247a', '#ffd93b', '#1b3a8c', '#2f9e44', '#f08a1c', '#7a45c9'];
  var EMOJI = ['🌷', '⭐', '❤️', '🌟', '🎉'];
  var io;

  /* ---------- ลอยขึ้นเมื่อเลื่อนมาถึง ---------- */
  function reveal(el) {
    var $el = $(el);
    $el.addClass('is-in');
    var delay = (parseFloat($el.css('--i')) || 0) * 80;
    setTimeout(function () { $el.addClass('reveal-done'); }, 800 + delay); // คืนค่า transition ให้เอฟเฟกต์เอียงการ์ด
    if ($el.is('[data-count]')) countUp(el);
    if ($el.is('[data-confetti]')) {
      var r = el.getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top + r.height / 2, 36);
    }
  }

  function observe(root) {
    var $items = $(root || document).find('.reveal:not(.is-in), [data-count]:not(.is-in)');
    if (!('IntersectionObserver' in window) || reduce) {
      $items.each(function () { $(this).addClass('is-in reveal-done'); if ($(this).is('[data-count]')) this.textContent = this.getAttribute('data-count'); });
      return;
    }
    io = io || new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    $items.each(function () { io.observe(this); });
  }

  /* ---------- ตัวเลขนับขึ้น ---------- */
  function countUp(el) {
    var to = parseInt(el.getAttribute('data-count'), 10) || 0, t0 = null, dur = 1200;
    function tick(t) {
      t0 = t0 || t;
      var p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- พิมพ์ดีดข้อความวนในหัวเว็บ ---------- */
  function typewriter(sel, words) {
    var el = document.querySelector(sel);
    if (!el || !words.length) return;
    if (reduce) { el.textContent = words[0]; return; }
    var w = 0, i = 0, del = false;
    (function step() {
      var word = words[w];
      i += del ? -1 : 1;
      el.textContent = word.slice(0, i);
      var wait = del ? 35 : 85;
      if (!del && i === word.length) { del = true; wait = 1400; }
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; wait = 350; }
      setTimeout(step, wait);
    })();
  }

  /* ---------- ปาดอกไม้ไฟ / กระดาษสี ---------- */
  function confetti(x, y, n) {
    if (reduce) return;
    n = n || 28;
    for (var k = 0; k < n; k++) {
      var s = document.createElement('span');
      var isEmoji = Math.random() < 0.35;
      s.className = 'confetti';
      s.textContent = isEmoji ? EMOJI[k % EMOJI.length] : '';
      s.style.cssText = 'left:' + x + 'px;top:' + y + 'px;' + (isEmoji ? 'font-size:22px;' : 'background:' + COLORS[k % COLORS.length] + ';');
      document.body.appendChild(s);
      var a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 190;
      var dx = Math.cos(a) * d, dy = Math.sin(a) * d - 60;
      s.animate([
        { transform: 'translate(0,0) rotate(0) scale(1)', opacity: 1 },
        { transform: 'translate(' + dx + 'px,' + (dy + 230) + 'px) rotate(' + (Math.random() * 720 - 360) + 'deg) scale(.6)', opacity: 0 }
      ], { duration: 1100 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = (function (n) { return function () { n.remove(); }; })(s);
    }
  }

  /* ---------- เลื่อนหน้า: แถบความคืบหน้า, พารัลแลกซ์, ปุ่มจรวด ---------- */
  function scrollFx() {
    var $bar = $('.progress'), $top = $('.to-top'), floats = $('.float').toArray(), ticking = false;
    function update() {
      var y = window.pageYOffset, h = document.documentElement.scrollHeight - window.innerHeight;
      $bar.css('transform', 'scaleX(' + (h > 0 ? y / h : 0) + ')');
      $top.toggleClass('is-show', y > 600);
      if (!reduce) floats.forEach(function (f) { f.style.translate = '0 ' + (y * parseFloat(f.getAttribute('data-speed') || 0)) + 'px'; });
      ticking = false;
    }
    $(window).on('scroll resize', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } });
    update();
    $top.on('click', function () {
      var $b = $(this).addClass('is-launch');
      $('html, body').animate({ scrollTop: 0 }, 700, function () { $b.removeClass('is-launch'); });
    });
  }

  /* ---------- การ์ดบริการเอียงตามเมาส์ (เฉพาะคอมพิวเตอร์) ---------- */
  function tilt() {
    if (!finePointer || reduce) return;
    $('#service-grid')
      .on('mousemove', '.service', function (e) {
        var r = this.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        this.style.transform = 'perspective(800px) rotateY(' + (px * 8) + 'deg) rotateX(' + (-py * 8) + 'deg) translateY(-4px)';
      })
      .on('mouseleave', '.service', function () { this.style.transform = ''; });
  }

  /* ---------- แตะรูปป้าพรให้มีของเล่น ---------- */
  function easterEgg() {
    $('.hero__poster').on('click', function (e) {
      var r = this.getBoundingClientRect();
      confetti(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2, 42);
      $('.hero__sticker').removeClass('is-hop'); void this.offsetWidth; $('.hero__sticker').addClass('is-hop');
      $('.hero__hint').addClass('is-gone');
    });
    // กดปุ่มโทรก็มีพลุเล็กๆ
    $(document).on('click', '.btn[data-phone="tel"]', function (e) { confetti(e.clientX, e.clientY, 18); });
  }

  function init() {
    observe(document);
    scrollFx();
    tilt();
    easterEgg();
    typewriter('#typewriter', PP.rotatingWords);
  }

  return { init: init, observe: observe, confetti: confetti, reduce: reduce };
})(jQuery);
