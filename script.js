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

// 3. Если файла изображения ещё нет — прячем его, остаётся красивая заглушка
document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', () => img.classList.add('is-missing'));
});

// 4. Год в подвале
document.getElementById('year').textContent = new Date().getFullYear();
