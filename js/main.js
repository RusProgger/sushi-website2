/* ============================================================
   SushiRoll — main.js
   Ванильный JS: прелоадер, шапка, мобильное меню,
   слайдер, подсветка активного пункта, кнопка «наверх».
   ============================================================ */

(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Прелоадер ---------- */
    function initLoader() {
        var loader = document.getElementById('loader');
        if (!loader) return;

        function hide() {
            loader.classList.add('is-hidden');
            setTimeout(function () { loader.remove(); }, 600);
        }

        if (document.readyState === 'complete') { hide(); }
        else {
            window.addEventListener('load', hide);
            setTimeout(hide, 3000); // страховка, если загрузка зависнет
        }
    }

    /* ---------- Шапка + кнопка «наверх» ---------- */
    function initHeader() {
        var header = document.querySelector('.header');
        var toTop = document.getElementById('toTop');
        if (!header) return;

        function onScroll() {
            var scrolled = window.scrollY > 40;
            header.classList.toggle('is-scrolled', scrolled);
            if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 600);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        if (toTop) {
            toTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            });
        }
    }

    /* ---------- Мобильное меню ---------- */
    function initMenu() {
        var burger = document.getElementById('burger');
        var nav = document.getElementById('nav');
        if (!burger || !nav) return;

        function open(force) {
            nav.classList.toggle('is-open', force);
            burger.classList.toggle('is-open', force);
            burger.setAttribute('aria-expanded', String(force));
            burger.setAttribute('aria-label', force ? 'Закрыть меню' : 'Открыть меню');
        }

        burger.addEventListener('click', function () {
            open(!nav.classList.contains('is-open'));
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () { open(false); });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') open(false);
        });

        document.addEventListener('click', function (e) {
            if (nav.classList.contains('is-open') && !nav.contains(e.target) && !burger.contains(e.target)) {
                open(false);
            }
        });
    }

    /* ---------- Слайдер ---------- */
    function initSlider() {
        var slides = document.querySelectorAll('.hero__slide');
        var dots = document.getElementById('heroDots');
        var prev = document.getElementById('heroPrev');
        var next = document.getElementById('heroNext');
        if (!slides.length) return;

        var index = 0;
        var timer = null;
        var auto = !reduceMotion;

        function show(i) {
            index = (i + slides.length) % slides.length;
            slides.forEach(function (s, k) {
                s.classList.toggle('is-active', k === index);
            });
            var buttons = dots ? dots.children : [];
            for (var k = 0; k < buttons.length; k++) {
                buttons[k].classList.toggle('is-active', k === index);
            }
            restart();
        }

        function restart() {
            if (timer) clearInterval(timer);
            if (auto) timer = setInterval(function () { show(index + 1); }, 5500);
        }

        // точки
        if (dots) {
            slides.forEach(function (_, k) {
                var b = document.createElement('button');
                b.type = 'button';
                b.setAttribute('aria-label', 'Слайд ' + (k + 1));
                b.addEventListener('click', function () { show(k); });
                dots.appendChild(b);
            });
        }

        if (prev) prev.addEventListener('click', function () { show(index - 1); });
        if (next) next.addEventListener('click', function () { show(index + 1); });

        // пауза при наведении / фокусе
        var heroEl = document.querySelector('.hero');
        if (heroEl) {
            ['mouseenter', 'focusin'].forEach(function (ev) {
                heroEl.addEventListener(ev, function () { if (timer) clearInterval(timer); });
            });
            ['mouseleave', 'focusout'].forEach(function (ev) {
                heroEl.addEventListener(ev, restart);
            });
        }

        show(0);
    }

    /* ---------- Подсветка активного пункта меню ---------- */
    function initScrollSpy() {
        var links = document.querySelectorAll('.nav__link');
        if (!links.length || !('IntersectionObserver' in window)) return;

        var sections = [];
        links.forEach(function (link) {
            var target = document.querySelector(link.getAttribute('href'));
            if (target) sections.push({ link: link, el: target });
        });

        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    links.forEach(function (l) { l.classList.remove('is-active'); });
                    sections.forEach(function (s) {
                        if (s.el === entry.target) s.link.classList.add('is-active');
                    });
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        sections.forEach(function (s) { spy.observe(s.el); });
    }

    /* ---------- Старт ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        initLoader();
        initHeader();
        initMenu();
        initSlider();
        initScrollSpy();
    });
})();