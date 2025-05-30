# iRay Optics - Лендинг тепловизионных прицелов

## 📋 Описание проекта

Современный лендинг для продажи тепловизионных прицелов iRay с интеграцией в популярные маркетплейсы (OZON, Wildberries, OpticMarket). Проект оптимизирован для контекстной рекламы и конверсии посетителей в покупателей.

### Особенности:
- 🎯 Военно-охотничий дизайн с эффектными анимациями
- 📱 Полностью адаптивная верстка
- 🚀 Оптимизирован для высокой скорости загрузки
- 🔍 SEO-оптимизация
- 📊 Интеграция с аналитикой
- 🛒 Сравнение цен в разных магазинах

## 🚀 Быстрый старт

### Требования к хостингу:
- PHP 7.0 или выше
- Apache с поддержкой .htaccess
- SSL сертификат (для HTTPS)
- Минимум 100 МБ дискового пространства

### Установка:

1. **Загрузите файлы на хостинг**
   ```bash
   git clone https://github.com/yourusername/iray-optics.git
   # или загрузите архив через FTP
   ```

2. **Создайте структуру папок**
   ```
   mkdir -p images/products images/icons images/backgrounds
   mkdir -p logs
   chmod 755 api/send-form.php
   chmod 777 logs
   ```

3. **Настройте конфигурацию**
   - Отредактируйте `api/send-form.php` - укажите ваш email
   - Обновите ссылки на товары в `data/products.json`
   - Добавьте коды аналитики в HTML файлы

4. **Проверьте работу**
   - Откройте сайт в браузере
   - Проверьте отправку формы
   - Убедитесь, что все стили и скрипты загружаются

## 📁 Структура проекта

```
iray-optics/
├── index.html                  # Главная страница
├── thank-you.html             # Страница благодарности
├── 404.html                   # Страница 404 (нужно создать)
│
├── css/                       # Стили
│   ├── main.css              # Основные стили
│   ├── animations.css        # Анимации
│   └── responsive.css        # Адаптивность
│
├── js/                        # Скрипты
│   ├── main.js               # Основная логика
│   ├── animations.js         # Анимации
│   └── form-handler.js       # Обработка форм
│
├── products/                  # Страницы товаров
│   ├── rico-rh50r.html
│   ├── saim-sct40.html
│   └── ... (другие товары)
│
├── data/                      # Данные
│   └── products.json         # База товаров
│
├── api/                       # Серверные скрипты
│   └── send-form.php         # Обработчик форм
│
├── images/                    # Изображения
│   ├── products/             # Фото товаров
│   ├── icons/                # Иконки
│   └── backgrounds/          # Фоны
│
├── .htaccess                 # Настройки Apache
├── robots.txt                # Для поисковиков
├── sitemap.xml               # Карта сайта
└── README.md                 # Документация
```

## ⚙️ Настройка

### 1. Email уведомления

Отредактируйте `api/send-form.php`:

```php
// Строка 29
$to = 'your-email@example.com'; // Ваш email для получения заявок

// Если нужно несколько получателей:
$to = 'email1@example.com, email2@example.com';
```

### 2. Товары и цены

Редактируйте `data/products.json`:

```json
{
  "products": [
    {
      "id": "rico-rh50r",
      "name": "iRay Rico RH50R",
      "basePrice": 245990,
      "shops": [
        {
          "name": "OZON",
          "price": 259990,
          "url": "https://ozon.ru/product/YOUR-PRODUCT-ID"
        }
      ]
    }
  ]
}
```

### 3. Изображения товаров

Структура папки изображений:
```
images/
└── products/
    ├── rico-rh50r/
    │   ├── main.jpg      (600x600px, оптимизировано)
    │   ├── view-1.jpg    (600x600px)
    │   ├── view-2.jpg    (600x600px)
    │   └── view-3.jpg    (600x600px)
    └── ... (другие товары)
```

### 4. Аналитика

Добавьте в `<head>` каждого HTML файла:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-XXXXXX');
</script>

<!-- Яндекс.Метрика -->
<script type="text/javascript">
   (function(m,e,t,r,i,k,a){/* код метрики */})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
   ym(XXXXXX, "init", {clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
</script>
```

## 🔧 Дополнительные настройки

### CRM интеграция

Для отправки лидов в CRM, добавьте в `api/send-form.php`:

```php
function sendToCRM($data) {
    $crmUrl = 'https://your-crm.com/api/leads';
    $crmToken = 'YOUR_API_TOKEN';
    
    $ch = curl_init($crmUrl);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $crmToken
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return $response;
}
```

### Telegram уведомления

Добавьте в `api/send-form.php`:

```php
function sendToTelegram($data) {
    $botToken = 'YOUR_BOT_TOKEN';
    $chatId = 'YOUR_CHAT_ID';
    
    $message = "🎯 Новая заявка с сайта:\n\n";
    $message .= "👤 Имя: " . $data['name'] . "\n";
    $message .= "☎️ Телефон: " . $data['phone'] . "\n";
    $message .= "❓ Вопрос: " . $data['question'] . "\n";
    $message .= "🌐 Источник: " . $data['source']['utm_source'];
    
    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    
    $params = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];
    
    file_get_contents($url . '?' . http_build_query($params));
}
```

## 📈 SEO оптимизация

### 1. Создайте sitemap.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.ru/products/rico-rh50r</loc>
    <lastmod>2024-01-15</lastmod>
    <priority>0.8</priority>
  </url>
  <!-- Добавьте остальные страницы -->
</urlset>
```

### 2. Создайте robots.txt:

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /data/
Disallow: /includes/

Sitemap: https://your-domain.ru/sitemap.xml
```

### 3. Meta-теги для каждой страницы:

```html
<meta name="description" content="Купить тепловизионный прицел iRay по лучшей цене. Сравнение цен в OZON, Wildberries, OpticMarket. Доставка по России.">
<meta name="keywords" content="iRay, тепловизор, прицел, охота, оптика">

<!-- Open Graph -->
<meta property="og:title" content="Тепловизионные прицелы iRay">
<meta property="og:description" content="Профессиональная оптика для охоты">
<meta property="og:image" content="https://your-domain.ru/images/og-image.jpg">
<meta property="og:url" content="https://your-domain.ru/">
```

## 🎨 Кастомизация

### Изменение цветовой схемы

Редактируйте переменные в `css/main.css`:

```css
:root {
    --color-primary: #a8d063;      /* Основной цвет */
    --color-secondary: #4a7c28;    /* Дополнительный */
    --color-dark: #2d5016;         /* Темный */
    --color-danger: #ff4444;       /* Цвет акцента */
    --color-bg-dark: #0a0a0a;      /* Фон */
}
```

### Добавление нового товара

1. Добавьте данные в `products.json`
2. Создайте страницу товара в папке `products/`
3. Добавьте изображения в `images/products/`
4. Обновите sitemap.xml

### Изменение анимаций

Настройки в `js/animations.js`:

```javascript
const CONFIG = {
    animationDuration: 300,    // Длительность анимаций (мс)
    parallaxSpeed: 0.5,        // Скорость параллакса
    crosshairEnabled: true     // Прицел-курсор
};
```

## 🚦 Тестирование

### Чек-лист перед запуском:

- [ ] Проверьте отправку форм на ваш email
- [ ] Проверьте все ссылки на товары
- [ ] Проверьте адаптивность на мобильных
- [ ] Проверьте скорость загрузки (Google PageSpeed)
- [ ] Проверьте работу HTTPS
- [ ] Настройте аналитику
- [ ] Проверьте meta-теги
- [ ] Создайте резервную копию

### Инструменты для тестирования:

1. **Скорость загрузки:**
   - Google PageSpeed Insights
   - GTmetrix
   - Pingdom

2. **SEO:**
   - Google Search Console
   - Яндекс.Вебмастер
   - Screaming Frog

3. **Кроссбраузерность:**
   - BrowserStack
   - LambdaTest

## 📊 Мониторинг и аналитика

### Настройка целей в Google Analytics:

```javascript
// Отправка формы
gtag('event', 'form_submit', {
  'event_category': 'engagement',
  'event_label': 'contact_form'
});

// Клик по товару
gtag('event', 'product_click', {
  'event_category': 'ecommerce',
  'event_label': productId,
  'value': productPrice
});
```

### Настройка целей в Яндекс.Метрике:

```javascript
// Достижение цели
ym(XXXXXX, 'reachGoal', 'FORM_SUBMIT');
```

## 🔒 Безопасность

### Рекомендации:

1. **Регулярно обновляйте:**
   - PHP версию
   - Зависимости
   - SSL сертификат

2. **Настройте бэкапы:**
   - Ежедневное копирование файлов
   - Копирование базы данных (если используется)

3. **Мониторинг:**
   - Настройте мониторинг доступности
   - Следите за логами ошибок

## 🆘 Решение проблем

### Форма не отправляется:

1. Проверьте права на файл `api/send-form.php` (должно быть 755)
2. Проверьте настройки PHP mail() на хостинге
3. Проверьте спам-папку
4. Включите логирование ошибок

### Медленная загрузка:

1. Оптимизируйте изображения (WebP формат)
2. Включите кэширование в .htaccess
3. Используйте CDN для статики
4. Минифицируйте CSS и JS

### Не работает на мобильных:

1. Проверьте viewport meta тег
2. Проверьте CSS медиа-запросы
3. Отключите hover эффекты для touch устройств

## 📞 Контакты и поддержка

- **Email:** support@your-domain.ru
- **Telegram:** @your_support_bot
- **Документация:** https://your-domain.ru/docs

## 📄 Лицензия

Этот проект является коммерческим продуктом. Все права защищены.

---

## 🎯 Дополнительные возможности

### A/B тестирование

Для проведения A/B тестов можно использовать:

```javascript
// Пример A/B теста кнопки
const variant = Math.random() > 0.5 ? 'A' : 'B';

if (variant === 'A') {
    button.textContent = 'Заказать сейчас';
    button.className = 'btn btn-danger';
} else {
    button.textContent = 'Подробнее о товаре';
    button.className = 'btn btn-primary';
}

// Отправка в аналитику
gtag('event', 'ab_test', {
    'event_category': 'experiment',
    'event_label': 'button_variant_' + variant
});
```

### Интеграция с WhatsApp

Добавьте кнопку WhatsApp:

```html
<a href="https://wa.me/79XXXXXXXXX?text=Здравствуйте! Интересует прицел iRay" 
   class="whatsapp-button" 
   target="_blank">
    <i class="fab fa-whatsapp"></i> Написать в WhatsApp
</a>
```

### Динамическое обновление цен

Создайте CRON задание для обновления цен:

```php
// update-prices.php
<?php
// Получение цен с API маркетплейсов
$ozonPrice = getOzonPrice($productId);
$wbPrice = getWildberriesPrice($productId);

// Обновление JSON файла
$products = json_decode(file_get_contents('data/products.json'), true);
// ... обновление цен ...
file_put_contents('data/products.json', json_encode($products));
?>
```

## 🚀 Оптимизация конверсии

### Рекомендации:

1. **Таймеры и ограничения:**
   - Используйте таймеры обратного отсчета
   - Показывайте количество товара в наличии
   - Добавьте "Осталось X штук по этой цене"

2. **Социальные доказательства:**
   - Добавьте счетчик просмотров
   - Показывайте "Сейчас смотрят X человек"
   - Добавьте виджет последних покупок

3. **Упрощение формы:**
   - Минимум полей
   - Автозаполнение
   - Валидация в реальном времени

4. **Мобильная оптимизация:**
   - Крупные кнопки
   - Простая навигация
   - Быстрая загрузка

---

**Последнее обновление:** 15.01.2024
**Версия:** 1.0.0>
    <loc>https://your-domain.ru/</loc>
    <lastmod>2024-01-15</lastmod>
    <priority>1.0</priority>
  </url>
  <url