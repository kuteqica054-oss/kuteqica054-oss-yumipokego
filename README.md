# YumiPokeGo — корпоративный сайт франчайзера

Astro 7 + Tailwind CSS 4, статическая сборка. Турецкий (по умолчанию, `/`) и английский (`/en/`).
Все иллюстрации (боулы, вок, роллы, фасад, планировки, карта, мокапы POS/приложения/меню-борда, логотип, OG-картинки) нарисованы кодом — фотографий в проекте нет, но для каждого места предусмотрен слот.

---

## Быстрый старт

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # генерирует OG/favicon PNG → собирает сайт в dist/
npm run preview    # локальный просмотр dist/
npm run check      # проверка типов
```

Node.js 20+ (проверено на 22).

## Деплой на Hostinger (GitHub Actions → SSH)

При каждом push в `main` GitHub Actions (`.github/workflows/deploy.yml`) собирает сайт и заливает `dist/` на хостинг через SSH (rsync, без удаления чужих файлов), затем проверяет живой сайт.

Один раз в репозитории на GitHub → **Settings → Secrets and variables → Actions**:

| Тип | Имя | Значение |
|---|---|---|
| Secret | `YUMI_SSH_HOST` | IP сервера |
| Secret | `YUMI_SSH_PORT` | порт SSH (у Hostinger обычно 65002) |
| Secret | `YUMI_SSH_USER` | SSH-пользователь (u…) |
| Secret | `YUMI_SSH_PASSWORD` | SSH-пароль |
| Variable | `SITE_URL` | `https://yumipokego.com.tr` (без слэша в конце) |
| Variable (необяз.) | `YUMI_DEPLOY_PATH` | по умолчанию `domains/<домен>/public_html` |

Запуск вручную: вкладка **Actions → Deploy YumiPokeGo to Hostinger → Run workflow**.

- `public/.htaccess` — HTTPS, домен без `www`, слэш в конце адресов, кэширование, страница 404.
- Форма заявки отправляется на `/form.php` (генерируется из `src/pages/form.php.ts`) и приходит письмом на `site.json → contacts.general.email` (сейчас contact@yumipokego.com.tr). Кнопка «Ответить» в письме отвечает заявителю.
- Домен для canonical/sitemap/OG берётся из `SITE_URL` (в Actions подставляется автоматически), иначе из `site.json → url`.

Netlify и Vercel тоже поддерживаются (`netlify.toml`, `vercel.json`), но тогда в `site.json → form.provider` поставьте `netlify` или `formspree`.

## Где что лежит

| Что | Файл |
|---|---|
| Бренд, ticaret unvanı, MERSİS, адрес, контакты, соцсети, WhatsApp, форма, аналитика, валюта EN | `src/config/site.json` |
| Ключевые цифры, модели франшизы, платежи, структура инвестиций, бюджеты в форме, сроки этапов | `src/data/franchise.json` |
| Форматы ресторанов (площадь, посадка, персонал, инвестиции, предлагается ли) | `src/data/formats.json` |
| Точки на карте, города открытые для франшизы, статусы регионов | `src/data/locations.json` |
| Yönetim kurulu и руководство | `src/data/leadership.json` |
| Меню | `src/data/menu.json` |
| Новости / пресса | `src/data/press.json` |
| Bilgi Toplumu Hizmetleri (реквизиты, документы) | `src/data/company.json` |
| Общие фото-слоты (hero, интерьер, команда, обучение, открытие) | `src/config/photos.json` |
| Все тексты интерфейса и страниц | `src/i18n/tr.ts`, `src/i18n/en.ts` |
| Юридические тексты (черновики) | `src/content/legal/tr/*.md`, `src/content/legal/en/*.md` |
| Цвета, шрифты, базовые стили | `src/styles/global.css` (блок `@theme`) |
| Адреса страниц (TR/EN) | `src/i18n/routes.ts` |

### Как заполнять цифры

Значения в JSON бывают трёх видов:

```jsonc
"value": null                          // → на сайте «— ₺ TODO»
"value": 2500000                       // → «₺2.500.000»
"value": { "min": 1800000, "max": 3200000 }   // → «₺1.800.000 – ₺3.200.000»
```

Денежные значения задаются отдельно для каждого языка: `"value": { "tr": <в TRY>, "en": <в USD или EUR> }`. Валюта английской версии — `site.json → currency.en` (`"USD"` или `"EUR"`). Проценты (royalti, reklam payı) — числом, например `6` → «%6» / «6%». Числа и даты форматируются по правилам языка через `Intl`.

Как только поле заполнено, бейдж TODO исчезает автоматически — вёрстку править не нужно. То же для `offered` у форматов и моделей франшизы: `true` / `false` вместо `null`.

### Карта

`src/data/locations.json`:
- `restaurants` — действующие рестораны (`lat`/`lon` в десятичных градусах). Сейчас там 2 примера с `"placeholder": true` (рисуются пунктиром с пометкой «Örnek»). Реальные рестораны добавляйте без `placeholder` — они же попадут в schema.org `Restaurant` на странице /restoranlar.
- `franchiseCities.items` — города, открытые для франшизы (`status`: `open` | `limited` | `taken`). Сейчас все — примеры.
- `regions.items` — статус 7 географических регионов.

Контур Турции сгенерирован из Natural Earth (public domain) скриптом `npm run map` в `src/data/turkey-map.json` — перегенерировать не нужно.

### Меню, руководство, новости

- Меню: `src/data/menu.json` — название и описание на двух языках, `tags` (`spicy`, `vegan`), `art` (вид иллюстрации). Цены не выводятся.
- Руководство: `src/data/leadership.json` — `name`, `bio`, `photo`, `linkedin`. Пустые карточки показывают «İsim eklenecek / TODO».
- Новости: `src/data/press.json` — у каждой новости свой `slug` для каждого языка; `"sample": true` выводит пометку «Örnek». Удалите примеры, когда появятся настоящие новости.

### Корпоративная информация (Bilgi Toplumu Hizmetleri)

`src/data/company.json` — реквизиты (`fields`), аудитор, разделы с документами (PDF кладите в `public/documents/`). Совет директоров берётся из `leadership.json → board`.

> **Важно:** состав обязательной информации на странице Bilgi Toplumu Hizmetleri (TTK md. 1524 и связанный регламент) и в футере нужно сверить с юристом или mali müşavir. Также юрист должен проверить KVKK Aydınlatma Metni, Çerez Politikası, Kullanım Koşulları, английские Privacy/Cookies/Terms и дисклеймер на страницах франшизы.

## Фотографии

Для франшизы реальные фото критичны, поэтому каждая иллюстрация обёрнута в компонент `PhotoSlot`: если у слота заполнен путь к фото — показывается фото, иначе рисунок. В режиме `npm run dev` поверх каждого слота выводится подпись «FOTO · размер», чтобы было видно, что и куда класть.

1. Положите файл в `public/photos/…` (WebP или JPG качества 80–85, до ~300 КБ).
2. Впишите путь в соответствующий JSON:

| Слот | Где указать | Рекомендуемый размер |
|---|---|---|
| Hero — боул сверху | `photos.json → heroBowl.src` | 1400×1400, квадрат (выводится в круге) |
| Hero — фасад ресторана | `photos.json → heroStore.src` | 1200×900 (4:3) |
| Интерьер | `photos.json → interior.src` | 1600×1000 |
| Линия сборки (страница франшизы) | `photos.json → assemblyLine.src` | 1600×1000 |
| Обучение (страница поддержки) | `photos.json → training.src` | 1600×1000 |
| Команда (корпоративная) | `photos.json → team.src` | 1800×1000 |
| Открытие (процесс открытия) | `photos.json → opening.src` | 1600×1000 |
| Блюда | `menu.json → items[].photo` | 1200×1200, сверху |
| Форматы | `formats.json → formats[].photo` | 1600×1000 (схема планировки останется под фото) |
| Руководство | `leadership.json → [].photo` | 800×800, нейтральный фон |
| Рестораны | `locations.json → restaurants[].photo` | 1600×1000 |
| Новости | `press.json → items[].image` | 1600×900 |

Alt-тексты для общих слотов — в `photos.json` (TR и EN); для блюд, людей и форматов alt берётся из названия.

## Форма заявки

Многошаговая форма `/basvuru` и `/en/apply` + короткая форма на главной. В каждой есть скрытые поля `site_language`, `form_type`, `page`, honeypot против спама, обязательное согласие KVKK и отдельное необязательное согласие на коммерческие сообщения (İYS).

- **PHP / Hostinger** (по умолчанию): `form.provider: "php"` — заявки приходят письмом на `contacts.general.email` через `/form.php`.
- **Netlify Forms**: `site.json → form.provider: "netlify"`. После первого деплоя формы `franchise-basvuru` и `franchise-on-basvuru` появятся в панели Netlify → Forms; там же настраиваются e-mail-уведомления.
- **Formspree**: создайте форму на formspree.io, затем `form.provider: "formspree"` и `form.formspreeId: "xxxxxxx"`.

На `localhost` отправка имитируется (данные пишутся в консоль браузера), чтобы можно было проверить экран «спасибо».

## Аналитика и cookie-баннер

Впишите ID Google Analytics 4 в `site.json → analytics.ga4Id` (`G-XXXXXXX`). Скрипт GA загружается **только** после того, как посетитель разрешил аналитические cookie в баннере. Выбор хранится в `localStorage` под ключом `ypg-consent`; ссылка «Çerez tercihleri / Cookie settings» в футере снова открывает баннер. Если нужен другой сервис аналитики — замените функцию `loadAnalytics` в `src/components/CookieBanner.astro` и обновите тексты Çerez Politikası.

## Тексты и языки

- Все тексты — в `src/i18n/tr.ts` и `src/i18n/en.ts` (структура одинаковая; TypeScript подсветит, если в английском файле чего-то не хватает). Meta title/description каждой страницы — в блоке `meta`.
- Переключатель TR/EN ведёт на ту же страницу в другой версии; соответствие адресов — `src/i18n/routes.ts`.
- `lang` на `<html>`, `hreflang` (tr, en, x-default → tr), canonical, Open Graph, Twitter card, sitemap с альтернативами — генерируются автоматически.
- `text-transform: uppercase` в проекте не используется (из-за i/İ в турецком).

## Цвета, шрифты, логотип

- Цвета — токены в `src/styles/global.css` (`@theme`). Основные акценты: лососёвый коралл (`coral-*`) и авокадо (`avocado-*`), манго — только в иллюстрациях и мелких акцентах; фон — рисовый белый, текст и корпоративные блоки — тёмно-синий «океан» (`ink`). Цвета кнопок подобраны под контраст WCAG AA.
- Шрифты: Bricolage Grotesque (заголовки) и DM Sans (текст) из Google Fonts, подключены локально через `@fontsource-variable` (так быстрее и без запросов к Google; поддерживается latin-ext: ğ, ş, ı, İ, ç, ö, ü).
- Логотип — временный вордмарк `src/components/ui/Logo.astro` + знак `BowlMark.astro` и `public/favicon.svg`. Когда будет финальный логотип — замените эти файлы.
- OG-картинки и PNG-фавиконки генерирует `scripts/build-assets.mjs` при каждой сборке (тексты OG — в объекте `OG_TEXT` этого файла).

## Технические заметки

- JS только там, где он нужен: форма, фильтр карты, мобильное меню, cookie-баннер, появление при скролле. FAQ — нативный `<details>`.
- Анимация сборки боула в hero и появление блоков уважают `prefers-reduced-motion`.
- Lighthouse (мобильный профиль, локально): Performance 98–99, Accessibility 100, Best Practices 100, SEO 100.
- schema.org: `Organization` (с `legalName`) на всех страницах, `FAQPage` на главной и странице франшизы, `BreadcrumbList` на внутренних, `Restaurant` для реальных точек, `NewsArticle` для реальных новостей.

---

## Режим отображения пустых полей

`site.json → showTodos`:
- `false` (сейчас) — бейджей TODO на сайте нет. Пустые финансовые поля показываются как «Bilgi paketinde paylaşılır / Shared in the information pack», пустые официальные реквизиты — как «Güncelleniyor / Being updated». Пустые соцсети и WhatsApp скрыты.
- `true` — все незаполненные места снова видны как бейджи TODO (удобно при наполнении).

## Что заполнено «от себя» (проверьте)

- Центральный офис = İzmir (Çeşme); телефон İzmir используется для франчайзинга, гостей и прессы; часы офиса «Hafta içi 09:00–18:00».
- Площадь 15–150 м² и срок открытия 12–20 недель; площадь/посадка/персонал по форматам; сроки 9 этапов открытия; обучение 2–3 недели; ответ на заявку — 2 рабочих дня.
- Диапазоны бюджета в форме (до 5 млн ₺ … 20 млн ₺+; USD 150k … 600k+).
- Все 7 регионов и 12 городов на карте — «открыты для франшизы»; образцы ресторанов удалены.
- Описания должностей в карточках руководства (без имён).
- Ответы FAQ, текст о финансировании, примечания к меню и аллергенам.
- Юр. тексты: «YumiPokeGo A.Ş.», адрес İzmir, сроки хранения данных (заявки 2 года, обращения 1 год, логи 2 года, аналитика 14 мес., согласия İYS 3 года), поставщики Netlify и Google, суд — İzmir (Merkez), дата 20.10.2026. Пометка «Taslak — hukuki inceleme gerekir» оставлена.
- Образец новости об открытии ресторана удалён; новость о запуске франчайзинговой программы оставлена как настоящая.

## Что осталось — только реальные данные

Эти данные нельзя придумать: они либо юридически значимые, либо вводят инвесторов в заблуждение.

- [ ] Полный ticaret unvanı, MERSİS, ticaret sicil, капитал, налоговые данные, KEP, аудитор, документы Bilgi Toplumu Hizmetleri (`company.json`, `site.json`)
- [ ] Финансовые условия: инвестиции, franchise bedeli, royalti, reklam payı, срок договора, окупаемость, мин. капитал, инвестиции по форматам, доли в структуре инвестиций (`franchise.json`, `formats.json`)
- [ ] Имена, фото и биографии руководства и yönetim kurulu (`leadership.json`)
- [ ] Реальные рестораны (`locations.json`)
- [ ] Телефон Kırklareli (0532113800 — 10 цифр), WhatsApp, Instagram, TikTok, YouTube, LinkedIn
- [ ] История компании, сертификаты, рыночная статистика с источниками
- [ ] ID Formspree (если Vercel) и GA4
- [ ] Финальный логотип и фотографии
- [ ] Юридическая проверка текстов и реквизитов
