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

// 5. Заявка на сервис → Supabase
//    Вставьте адрес проекта и публичный (anon) ключ: Supabase → Project Settings → API.
//    anon-ключ публичный по замыслу, доступ к данным ограничивает RLS.
const SUPABASE_URL = 'https://hzzglbgrgcxwhvtumoax.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_g0lr_8L1JciriuketB_GEA_-QpQSsjT';
const ORDERS_TABLE = 'AUTOFiX';

const sb = (window.supabase && !SUPABASE_URL.includes('YOUR-') && !SUPABASE_ANON_KEY.includes('YOUR-'))
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const orderForm = document.getElementById('order-form');

if (orderForm) {
  const orderMsg = document.getElementById('order-msg');
  const orderBtn = document.getElementById('order-submit');
  const yearInput = document.getElementById('f-year');
  const dateInput = document.getElementById('f-date');

  // Ограничения полей: год — не позже следующего, дата — не раньше сегодняшней
  const now = new Date();
  yearInput.max = String(now.getFullYear() + 1);
  dateInput.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  function showOrderMessage(text, type) {
    orderMsg.textContent = text;
    orderMsg.className = 'form__msg' + (type ? ' form__msg--' + type : '');
  }

  orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!orderForm.reportValidity()) return;

    if (!sb) {
      showOrderMessage('Приём заявок через сайт пока не настроен. Позвоните нам — запишем по телефону.', 'error');
      return;
    }

    orderBtn.disabled = true;
    showOrderMessage('Отправляем…', '');

    try {
      // 1. Текущий пользователь из Supabase Auth (проверяется на сервере)
      const { data: { user }, error: authError } = await sb.auth.getUser();

      // 2. Не авторизован — заявку не отправляем
      if (authError || !user) {
        showOrderMessage('Чтобы отправить заявку, войдите в аккаунт или зарегистрируйтесь.', 'error');
        return;
      }

      // 3. Поля берём по одному и явно: user_id всегда из Auth, значение из формы не принимается.
      //    status задаётся здесь и не зависит от формы.
      const data = new FormData(orderForm);
      const text = (name) => String(data.get(name) || '').trim();
      const order = {
        user_id: user.id,
        name: text('name'),
        email: text('email'),
        phone: text('phone'),
        car_brand: text('car_brand'),
        car_model: text('car_model'),
        car_year: parseInt(text('car_year'), 10),
        service: text('service'),
        description: text('description'),
        preferred_date: text('preferred_date'),
        status: 'new'
      };

      if (!Number.isInteger(order.car_year)) {
        showOrderMessage('Укажите год выпуска числом, например 2018.', 'error');
        return;
      }

      const { error } = await sb.from(ORDERS_TABLE).insert(order);

      if (error) {
        const denied = error.code === '42501' || /row-level security/i.test(error.message || '');
        showOrderMessage(
          denied ? 'Не удалось отправить заявку: нет доступа. Войдите в аккаунт заново.'
                 : 'Не удалось отправить заявку. Проверьте данные и попробуйте ещё раз.',
          'error'
        );
        return;
      }

      orderForm.reset();
      showOrderMessage('Заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'ok');
    } catch (err) {
      showOrderMessage('Нет соединения. Проверьте интернет и попробуйте ещё раз.', 'error');
    } finally {
      orderBtn.disabled = false;
    }
  });
}
