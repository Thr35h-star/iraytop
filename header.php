<?php
require_once 'config.php';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? e($page_title) . ' - ' . SITE_NAME : DEFAULT_TITLE; ?></title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="<?php echo isset($page_description) ? e($page_description) : DEFAULT_DESCRIPTION; ?>">
    <meta name="keywords" content="<?php echo isset($page_keywords) ? e($page_keywords) : DEFAULT_KEYWORDS; ?>">
    
    <!-- Open Graph -->
    <meta property="og:title" content="<?php echo isset($page_title) ? e($page_title) : DEFAULT_TITLE; ?>">
    <meta property="og:description" content="<?php echo isset($page_description) ? e($page_description) : DEFAULT_DESCRIPTION; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo SITE_URL . $_SERVER['REQUEST_URI']; ?>">
    <meta property="og:image" content="<?php echo isset($page_image) ? e($page_image) : SITE_URL . '/images/og-image.jpg'; ?>">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="<?php echo SITE_URL . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); ?>">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/images/favicon.png">
    
    <!-- CSS -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/animations.css">
    <link rel="stylesheet" href="/css/responsive.css">
    
    <?php if (GOOGLE_ANALYTICS_ID): ?>
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo GOOGLE_ANALYTICS_ID; ?>"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '<?php echo GOOGLE_ANALYTICS_ID; ?>');
    </script>
    <?php endif; ?>
    
    <?php if (YANDEX_METRIKA_ID): ?>
    <!-- Яндекс.Метрика -->
    <script type="text/javascript">
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(<?php echo YANDEX_METRIKA_ID; ?>, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true
        });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/<?php echo YANDEX_METRIKA_ID; ?>" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <?php endif; ?>
</head>
<body>
    
    <header class="header">
        <div class="header-content container">
            <a href="/" class="logo"><?php echo SITE_NAME; ?></a>
            <nav class="nav-menu">
                <a href="/#products" class="nav-link">Каталог</a>
                <a href="/#reviews" class="nav-link">Отзывы</a>
                <a href="/#contact-form" class="nav-link">Контакты</a>
                <a href="tel:<?php echo str_replace([' ', '(', ')', '-'], '', SITE_PHONE); ?>" class="nav-link"><?php echo SITE_PHONE; ?></a>
            </nav>
            <button class="btn btn-primary header-cta" onclick="scrollToForm()">Получить консультацию</button>
            <button class="mobile-menu-toggle" aria-label="Меню">☰</button>
        </div>
    </header>
    
    <main>