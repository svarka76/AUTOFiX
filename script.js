// AUTOFiX — базовый JavaScript

// 1. Мобильное меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}

burger.addEventListener('click', () => {
  setMenu(!nav.classList.contains('is-open'));
});

// Закрываем меню после клика по ссылке
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

// 2. Шапка получает тень при прокрутке
const header = document.getElementById('header');
function onScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 3. Если файла изображения ещё нет — прячем его, остаётся красивая заглушка.
//    Когда JPG появляется по нужному пути, фото автоматически закрывает заглушку.
document.querySelectorAll('img').forEach((img) => {
  const markMissing = () => img.classList.add('is-missing');
  img.addEventListener('error', markMissing);
  img.addEventListener('load', () => img.classList.remove('is-missing'));
  // Ошибка могла случиться до того, как скрипт успел подписаться на событие
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) markMissing();
});

// 4. Год в подвале
document.getElementById('year').textContent = new Date().getFullYear();
