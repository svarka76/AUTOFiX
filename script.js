```javascript
// ============================================
// AUTOFiX — основной JavaScript
// ============================================

// ---------- Мобильное меню ----------

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function setMenu(open) {
  if (!nav || !burger) return;

  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute(
    'aria-label',
    open ? 'Закрыть меню' : 'Открыть меню'
  );
}

if (burger && nav) {
  burger.addEventListener('click', () => {
    setMenu(!nav.classList.contains('is-open'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });
}


// ---------- Шапка при прокрутке ----------

const header = document.getElementById('header');

function onScroll() {
  if (header) {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();


// ---------- Обработка отсутствующих изображений ----------

document.querySelectorAll('img').forEach((img) => {
  const markMissing = () => img.classList.add('is-missing');

  img.addEventListener('error', markMissing);

  img.addEventListener('load', () => {
    img.classList.remove('is-missing');
  });

  if (
    img.complete &&
    img.naturalWidth === 0 &&
    img.getAttribute('src')
  ) {
    markMissing();
  }
});


// ---------- Текущий год ----------

const yearElement = document.getElementById('year');

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// ============================================
// SUPABASE
// ============================================

const SUPABASE_URL =
  'https://hzzglbgrgcxwhvtumoax.supabase.co';

const SUPABASE_ANON_KEY =
  'sb_publishable_g0lr_8L1JciriuketB_GEA_-QpQSsjT';

const ORDERS_TABLE = 'AUTOFiX';

const sb =
  window.supabase &&
  !SUPABASE_URL.includes('YOUR-') &&
  !SUPABASE_ANON_KEY.includes('YOUR-')
    ? window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      )
    : null;


// ============================================
// ЭЛЕМЕНТЫ АВТОРИЗАЦИИ
// ============================================

const authGuest = document.getElementById('auth-guest');
const authUser = document.getElementById('auth-user');
const authEmail = document.getElementById('auth-email');

const authOpenLogin =
  document.getElementById('auth-open-login');

const authOpenRegister =
  document.getElementById('auth-open-register');

const authLogout =
  document.getElementById('auth-logout');

const authDialog =
  document.getElementById('auth-dialog');

const authDialogTitle =
  document.getElementById('auth-dialog-title');

const authClose =
  document.getElementById('auth-close');

const loginForm =
  document.getElementById('login-form');

const registerForm =
  document.getElementById('register-form');

const loginTab =
  document.getElementById('auth-tab-login');

const registerTab =
  document.getElementById('auth-tab-register');

const loginMsg =
  document.getElementById('login-msg');

const registerMsg =
  document.getElementById('register-msg');

const loginBtn =
  document.getElementById('login-submit');

const registerBtn =
  document.getElementById('register-submit');

const authHint =
  document.getElementById('order-auth-hint');


// ============================================
// ОШИБКИ АВТОРИЗАЦИИ
// ============================================

function authErrorMessage(error, context) {
  const message =
    String(error?.message || '').toLowerCase();

  if (
    message.includes('invalid login credentials')
  ) {
    return 'Неверный email или пароль.';
  }

  if (
    message.includes('email not confirmed')
  ) {
    return 'Сначала подтвердите email через письмо.';
  }

  if (
    message.includes('user already registered')
  ) {
    return 'Этот email уже зарегистрирован. Попробуйте войти.';
  }

  if (
    message.includes('password should be at least')
  ) {
    return 'Пароль должен содержать минимум 8 символов.';
  }

  if (
    message.includes('invalid email')
  ) {
    return 'Введите корректный email.';
  }

  if (
    message.includes('signup is disabled')
  ) {
    return 'Регистрация сейчас отключена.';
  }

  if (
    message.includes('rate limit')
  ) {
    return 'Слишком много попыток. Попробуйте немного позже.';
  }

  return context || 'Произошла ошибка. Попробуйте ещё раз.';
}


// ============================================
// СООБЩЕНИЯ
// ============================================

function showLoginMessage(text, type) {
  if (!loginMsg) return;

  loginMsg.textContent = text;

  loginMsg.className =
    'form__msg' +
    (type ? ' form__msg--' + type : '');
}


function showRegisterMessage(text, type) {
  if (!registerMsg) return;

  registerMsg.textContent = text;

  registerMsg.className =
    'form__msg' +
    (type ? ' form__msg--' + type : '');
}


// ============================================
// СОСТОЯНИЕ АВТОРИЗАЦИИ
// ============================================

function setAuthView(user) {
  if (authGuest) {
    authGuest.classList.toggle('is-hidden', !!user);
  }

  if (authUser) {
    authUser.classList.toggle('is-hidden', !user);
  }

  if (authEmail) {
    authEmail.textContent =
      user?.email || '';
  }

  if (authHint) {
    authHint.classList.toggle(
      'is-hidden',
      !!user
    );
  }
}


// ============================================
// ОКНО АВТОРИЗАЦИИ
// ============================================

function showAuthPanel(mode) {
  const isLogin = mode === 'login';

  if (loginForm) {
    loginForm.classList.toggle(
      'is-hidden',
      !isLogin
    );
  }

  if (registerForm) {
    registerForm.classList.toggle(
      'is-hidden',
      isLogin
    );
  }

  if (loginTab) {
    loginTab.classList.toggle(
      'is-active',
      isLogin
    );
  }

  if (registerTab) {
    registerTab.classList.toggle(
      'is-active',
      !isLogin
    );
  }

  if (authDialogTitle) {
    authDialogTitle.textContent =
      isLogin
        ? 'Вход в аккаунт'
        : 'Регистрация';
  }

  showLoginMessage('', '');
  showRegisterMessage('', '');
}


function openAuthDialog(mode) {
  if (!authDialog) return;

  showAuthPanel(mode);

  if (typeof authDialog.showModal === 'function') {
    authDialog.showModal();
  } else {
    authDialog.setAttribute(
      'open',
      ''
    );
  }
}


function closeAuthDialog() {
  if (!authDialog) return;

  if (typeof authDialog.close === 'function') {
    authDialog.close();
  } else {
    authDialog.removeAttribute(
      'open'
    );
  }
}


// ============================================
// ОТКРЫТИЕ ВХОДА / РЕГИСТРАЦИИ
// ============================================

if (authOpenLogin) {
  authOpenLogin.addEventListener(
    'click',
    () => openAuthDialog('login')
  );
}


if (authOpenRegister) {
  authOpenRegister.addEventListener(
    'click',
    () => openAuthDialog('register')
  );
}


// ============================================
// ЗАКРЫТИЕ ОКНА
// ============================================

if (authClose) {
  authClose.addEventListener(
    'click',
    closeAuthDialog
  );
}


if (authDialog) {
  authDialog.addEventListener(
    'click',
    (event) => {
      if (event.target === authDialog) {
        closeAuthDialog();
      }
    }
  );
}


// ============================================
// ПЕРЕКЛЮЧЕНИЕ ВХОД / РЕГИСТРАЦИЯ
// ============================================

if (loginTab) {
  loginTab.addEventListener(
    'click',
    () => showAuthPanel('login')
  );
}


if (registerTab) {
  registerTab.addEventListener(
    'click',
    () => showAuthPanel('register')
  );
}


// ============================================
// ВХОД
// ============================================

if (loginForm) {
  loginForm.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();

      if (!sb) {
        showLoginMessage(
          'Supabase не подключён.',
          'error'
        );
        return;
      }

      if (!loginForm.reportValidity()) {
        return;
      }

      const formData =
        new FormData(loginForm);

      const email =
        String(
          formData.get('email') || ''
        ).trim();

      const password =
        String(
          formData.get('password') || ''
        );

      if (loginBtn) {
        loginBtn.disabled = true;
      }

      showLoginMessage(
        'Выполняем вход…',
        ''
      );

      try {
        const {
          data,
          error
        } = await sb.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          showLoginMessage(
            authErrorMessage(
              error,
              'Не удалось войти.'
            ),
            'error'
          );
          return;
        }

        setAuthView(data.user);

        closeAuthDialog();

        loginForm.reset();

      } catch (error) {
        showLoginMessage(
          'Нет соединения. Проверьте интернет.',
          'error'
        );
      } finally {
        if (loginBtn) {
          loginBtn.disabled = false;
        }
      }
    }
  );
}


// ============================================
// РЕГИСТРАЦИЯ
// ============================================

if (registerForm) {
  registerForm.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();

      if (!sb) {
        showRegisterMessage(
          'Supabase не подключён.',
          'error'
        );
        return;
      }

      if (!registerForm.reportValidity()) {
        return;
      }

      const formData =
        new FormData(registerForm);

      const email =
        String(
          formData.get('email') || ''
        ).trim();

      const password =
        String(
          formData.get('password') || ''
        );

      const passwordConfirm =
        String(
          formData.get('password_confirm') || ''
        );

      if (password !== passwordConfirm) {
        showRegisterMessage(
          'Пароли не совпадают.',
          'error'
        );
        return;
      }

      if (password.length < 8) {
        showRegisterMessage(
          'Пароль должен содержать минимум 8 символов.',
          'error'
        );
        return;
      }

      if (registerBtn) {
        registerBtn.disabled = true;
      }

      showRegisterMessage(
        'Создаём аккаунт…',
        ''
      );

      try {
        const {
          data,
          error
        } = await sb.auth.signUp({
          email,
          password
        });

        if (error) {
          showRegisterMessage(
            authErrorMessage(
              error,
              'Не удалось зарегистрироваться.'
            ),
            'error'
          );
          return;
        }

        // Supabase иногда возвращает пользователя
        // без identity при повторной регистрации.
        if (
          data?.user &&
          Array.isArray(data.user.identities) &&
          data.user.identities.length === 0
        ) {
          showRegisterMessage(
            'Этот email уже зарегистрирован. Попробуйте войти.',
            'error'
          );
          return;
        }

        if (data?.session) {
          setAuthView(data.user);
          closeAuthDialog();
          registerForm.reset();
        } else {
          showRegisterMessage(
            'Регистрация успешна. Проверьте почту и подтвердите email.',
            'ok'
          );
        }

      } catch (error) {
        showRegisterMessage(
          'Нет соединения. Проверьте интернет.',
          'error'
        );
      } finally {
        if (registerBtn) {
          registerBtn.disabled = false;
        }
      }
    }
  );
}


// ============================================
// ВЫХОД
// ============================================

if (authLogout) {
  authLogout.addEventListener(
    'click',
    async () => {
      if (!sb) return;

      authLogout.disabled = true;

      try {
        const { error } =
          await sb.auth.signOut();

        if (error) {
          alert(
            'Не удалось выйти из аккаунта.'
          );
          return;
        }

        setAuthView(null);

      } catch (error) {
        alert(
          'Ошибка соединения.'
        );
      } finally {
        authLogout.disabled = false;
      }
    }
  );
}


// ============================================
// СЛУШАЕМ ИЗМЕНЕНИЕ СОСТОЯНИЯ AUTH
// ============================================

if (sb) {
  sb.auth.onAuthStateChange(
    (_event, session) => {
      setAuthView(
        session?.user || null
      );
    }
  );

  sb.auth
    .getUser()
    .then(({ data, error }) => {
      if (!error) {
        setAuthView(
          data?.user || null
        );
      }
    })
    .catch(() => {
      setAuthView(null);
    });
} else {
  setAuthView(null);
}


// ============================================
// ФОРМА ЗАКАЗА
// ============================================

const orderForm =
  document.getElementById('order-form');

if (orderForm) {
  const orderMsg =
    document.getElementById('order-msg');

  const orderBtn =
    document.getElementById('order-submit');

  const yearInput =
    document.getElementById('f-year');

  const dateInput =
    document.getElementById('f-date');


  const now = new Date();

  if (yearInput) {
    yearInput.max =
      String(now.getFullYear() + 1);
  }

  if (dateInput) {
    dateInput.min =
      new Date(
        now.getTime() -
        now.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 10);
  }


  function showOrderMessage(
    text,
    type
  ) {
    if (!orderMsg) return;

    orderMsg.textContent = text;

    orderMsg.className =
      'form__msg' +
      (type
        ? ' form__msg--' + type
        : '');
  }


  orderForm.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault();

      if (!orderForm.reportValidity()) {
        return;
      }

      if (!sb) {
        showOrderMessage(
          'Приём заявок через сайт пока не настроен. Позвоните нам — запишем по телефону.',
          'error'
        );
        return;
      }

      if (orderBtn) {
        orderBtn.disabled = true;
      }

      showOrderMessage(
        'Отправляем…',
        ''
      );


      try {
        const {
          data: { user },
          error: authError
        } = await sb.auth.getUser();


        if (authError || !user) {
          showOrderMessage(
            'Чтобы отправить заявку, войдите в аккаунт или зарегистрируйтесь.',
            'error'
          );
          return;
        }


        const data =
          new FormData(orderForm);


        const text = (name) =>
          String(
            data.get(name) || ''
          ).trim();


        const order = {
          user_id: user.id,
          name: text('name'),
          email: text('email'),
          phone: text('phone'),
          car_brand: text('car_brand'),
          car_model: text('car_model'),
          car_year: parseInt(
            text('car_year'),
            10
          ),
          service: text('service'),
          description: text('description'),
          preferred_date:
            text('preferred_date'),
          status: 'new'
        };


        if (!Number.isInteger(
          order.car_year
        )) {
          showOrderMessage(
            'Укажите год выпуска числом, например 2018.',
            'error'
          );
          return;
        }


        const { error } =
          await sb
            .from(ORDERS_TABLE)
            .insert(order);


        if (error) {
          const denied =
            error.code === '42501' ||
            /row-level security/i.test(
              error.message || ''
            );


          showOrderMessage(
            denied
              ? 'Не удалось отправить заявку: нет доступа. Войдите в аккаунт заново.'
              : 'Не удалось отправить заявку. Проверьте данные и попробуйте ещё раз.',
            'error'
          );

          return;
        }


        orderForm.reset();


        showOrderMessage(
          'Заявка отправлена. Мы свяжемся с вами в ближайшее время.',
          'ok'
        );

      } catch (error) {
        showOrderMessage(
          'Нет соединения. Проверьте интернет и попробуйте ещё раз.',
          'error'
        );
      } finally {
        if (orderBtn) {
          orderBtn.disabled = false;
        }
      }
    }
  );
}
```
