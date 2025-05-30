<?php
// Конфигурационный файл сайта

// Основные настройки
define('SITE_NAME', 'iRay Optics');
define('SITE_URL', 'https://iray-optics.ru');
define('SITE_EMAIL', 'info@iray-optics.ru');
define('SITE_PHONE', '+7 (800) 123-45-67');

// Настройки базы данных (если используется)
define('DB_HOST', 'localhost');
define('DB_NAME', 'iray_optics');
define('DB_USER', 'root');
define('DB_PASS', '');

// Пути к файлам
define('ROOT_PATH', dirname(__DIR__));
define('INCLUDES_PATH', ROOT_PATH . '/includes');
define('DATA_PATH', ROOT_PATH . '/data');
define('IMAGES_PATH', ROOT_PATH . '/images');
define('LOGS_PATH', ROOT_PATH . '/logs');

// Настройки email
define('SMTP_HOST', 'smtp.yandex.ru');
define('SMTP_PORT', 465);
define('SMTP_USER', 'noreply@iray-optics.ru');
define('SMTP_PASS', 'your_password');
define('SMTP_SECURE', 'ssl');

// Настройки уведомлений
define('ADMIN_EMAIL', 'admin@iray-optics.ru');
define('MANAGER_EMAIL', 'manager@iray-optics.ru');
define('SEND_COPY_TO_ADMIN', true);

// Telegram настройки
define('TELEGRAM_BOT_TOKEN', '');
define('TELEGRAM_CHAT_ID', '');
define('TELEGRAM_ENABLED', false);

// Аналитика
define('GOOGLE_ANALYTICS_ID', 'UA-XXXXXXXXX-X');
define('YANDEX_METRIKA_ID', 'XXXXXXXX');
define('FACEBOOK_PIXEL_ID', 'XXXXXXXXXXXXXXXX');

// SEO настройки
define('DEFAULT_TITLE', 'Тепловизионные прицелы iRay - Профессиональная оптика');
define('DEFAULT_DESCRIPTION', 'Купить тепловизионные прицелы iRay по лучшим ценам. Сравнение цен в OZON, Wildberries, OpticMarket. Доставка по всей России.');
define('DEFAULT_KEYWORDS', 'iRay, тепловизор, прицел, тепловизионный прицел, охота, оптика');

// Режим разработки
define('DEBUG_MODE', false);
define('SHOW_ERRORS', false);

// Настройки безопасности
define('ALLOWED_ORIGINS', ['https://iray-optics.ru', 'https://www.iray-optics.ru']);
define('SESSION_LIFETIME', 3600); // 1 час
define('CSRF_TOKEN_NAME', 'csrf_token');

// Настройки кэширования
define('CACHE_ENABLED', true);
define('CACHE_LIFETIME', 3600); // 1 час

// Валюта
define('CURRENCY', 'RUB');
define('CURRENCY_SYMBOL', '₽');

// Временная зона
date_default_timezone_set('Europe/Moscow');

// Функция для безопасного вывода
function e($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

// Функция для логирования
function logMessage($message, $type = 'info') {
    $logFile = LOGS_PATH . '/' . date('Y-m-d') . '.log';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] [$type] $message" . PHP_EOL;
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Инициализация сессии
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Установка режима ошибок
if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}
?>