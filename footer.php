</main>
    
    <footer class="footer">
        <div class="footer-content container">
            <div class="footer-grid">
                <div class="footer-column">
                    <h3><?php echo SITE_NAME; ?></h3>
                    <p>Профессиональная тепловизионная оптика для охоты и тактических задач</p>
                    <p>&copy; <?php echo date('Y'); ?> <?php echo SITE_NAME; ?>. Все права защищены.</p>
                </div>
                
                <div class="footer-column">
                    <h4>Каталог</h4>
                    <ul class="footer-links">
                        <li><a href="/products/rico-rh50r">iRay Rico RH50R</a></li>
                        <li><a href="/products/saim-sct40">iRay Saim SCT40</a></li>
                        <li><a href="/products/tube-th50">iRay Tube TH50</a></li>
                        <li><a href="/products/bolt-th50c">iRay Bolt TH50C</a></li>
                        <li><a href="/products/geni-gl35r">iRay Geni GL35R</a></li>
                        <li><a href="/products/zoom-zh50">iRay Zoom ZH50</a></li>
                    </ul>
                </div>
                
                <div class="footer-column">
                    <h4>Информация</h4>
                    <ul class="footer-links">
                        <li><a href="/#about">О компании</a></li>
                        <li><a href="/#delivery">Доставка и оплата</a></li>
                        <li><a href="/#warranty">Гарантия</a></li>
                        <li><a href="/#reviews">Отзывы</a></li>
                        <li><a href="/privacy">Политика конфиденциальности</a></li>
                    </ul>
                </div>
                
                <div class="footer-column">
                    <h4>Контакты</h4>
                    <p>
                        <strong>Телефон:</strong><br>
                        <a href="tel:<?php echo str_replace([' ', '(', ')', '-'], '', SITE_PHONE); ?>"><?php echo SITE_PHONE; ?></a>
                    </p>
                    <p>
                        <strong>Email:</strong><br>
                        <a href="mailto:<?php echo SITE_EMAIL; ?>"><?php echo SITE_EMAIL; ?></a>
                    </p>
                    <p>
                        <strong>Время работы:</strong><br>
                        Пн-Пт: 9:00 - 18:00<br>
                        Сб-Вс: 10:00 - 17:00
                    </p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>Информация на сайте не является публичной офертой</p>
                <div class="footer-links">
                    <a href="/sitemap.xml">Карта сайта</a>
                    <a href="/privacy">Конфиденциальность</a>
                    <a href="/terms">Условия использования</a>
                </div>
            </div>
        </div>
    </footer>
    
    <!-- JavaScript -->
    <script src="/js/main.js"></script>
    <script src="/js/animations.js"></script>
    <script src="/js/form-handler.js"></script>
    
    <?php if (isset($page_scripts)): ?>
        <?php foreach ($page_scripts as $script): ?>
            <script src="<?php echo $script; ?>"></script>
        <?php endforeach; ?>
    <?php endif; ?>
    
    <!-- Дополнительные скрипты для отслеживания -->
    <script>
        // Отслеживание целей
        document.addEventListener('DOMContentLoaded', function() {
            // Клик по номеру телефона
            document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
                link.addEventListener('click', function() {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'click', {
                            'event_category': 'contact',
                            'event_label
                            'event_label': 'phone_click'
                       });
                   }
                   if (typeof ym !== 'undefined') {
                       ym(<?php echo YANDEX_METRIKA_ID; ?>, 'reachGoal', 'PHONE_CLICK');
                   }
               });
           });
           
           // Отправка формы
           document.querySelectorAll('form[data-form]').forEach(function(form) {
               form.addEventListener('submit', function() {
                   if (typeof gtag !== 'undefined') {
                       gtag('event', 'submit', {
                           'event_category': 'form',
                           'event_label': 'contact_form'
                       });
                   }
                   if (typeof ym !== 'undefined') {
                       ym(<?php echo YANDEX_METRIKA_ID; ?>, 'reachGoal', 'FORM_SUBMIT');
                   }
               });
           });
           
           // Клик по товару
           document.querySelectorAll('.product-card a').forEach(function(link) {
               link.addEventListener('click', function() {
                   const productName = this.closest('.product-card').querySelector('.product-name').textContent;
                   if (typeof gtag !== 'undefined') {
                       gtag('event', 'view_item', {
                           'event_category': 'ecommerce',
                           'event_label': productName
                       });
                   }
               });
           });
       });
   </script>
   
   <?php if (FACEBOOK_PIXEL_ID): ?>
   <!-- Facebook Pixel -->
   <script>
       !function(f,b,e,v,n,t,s)
       {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
       n.callMethod.apply(n,arguments):n.queue.push(arguments)};
       if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
       n.queue=[];t=b.createElement(e);t.async=!0;
       t.src=v;s=b.getElementsByTagName(e)[0];
       s.parentNode.insertBefore(t,s)}(window, document,'script',
       'https://connect.facebook.net/en_US/fbevents.js');
       fbq('init', '<?php echo FACEBOOK_PIXEL_ID; ?>');
       fbq('track', 'PageView');
   </script>
   <noscript>
       <img height="1" width="1" style="display:none"
       src="https://www.facebook.com/tr?id=<?php echo FACEBOOK_PIXEL_ID; ?>&ev=PageView&noscript=1"/>
   </noscript>
   <?php endif; ?>
   
   <!-- Виджет обратного звонка (опционально) -->
   <div class="callback-widget">
       <button class="callback-button" onclick="showCallbackForm()">
           <span class="callback-icon">📞</span>
           <span class="callback-text">Заказать звонок</span>
       </button>
   </div>
   
   <!-- Модальное окно для обратного звонка -->
   <div id="callbackModal" class="modal">
       <div class="modal-content">
           <span class="modal-close" onclick="closeCallbackForm()">&times;</span>
           <h3>Заказать обратный звонок</h3>
           <p>Оставьте ваш номер телефона и мы перезвоним в течение 15 минут</p>
           <form data-form data-ajax data-endpoint="/api/send-form.php" class="callback-form">
               <div class="form-group">
                   <input type="text" name="name" class="form-input" placeholder="Ваше имя" required>
               </div>
               <div class="form-group">
                   <input type="tel" name="phone" class="form-input" placeholder="+7 (___) ___-__-__" required>
               </div>
               <input type="hidden" name="question" value="Заказ обратного звонка">
               <button type="submit" class="btn btn-danger w-100">Жду звонка</button>
           </form>
       </div>
   </div>
   
   <!-- Уведомление о cookies -->
   <div id="cookieNotice" class="cookie-notice">
       <div class="cookie-content">
           <p>Мы используем файлы cookie для улучшения работы сайта. Продолжая использовать сайт, вы соглашаетесь с <a href="/privacy">политикой конфиденциальности</a>.</p>
           <button class="btn btn-primary" onclick="acceptCookies()">Принять</button>
       </div>
   </div>
   
   <script>
       // Проверка cookies
       if (!localStorage.getItem('cookiesAccepted')) {
           document.getElementById('cookieNotice').style.display = 'block';
       }
       
       function acceptCookies() {
           localStorage.setItem('cookiesAccepted', 'true');
           document.getElementById('cookieNotice').style.display = 'none';
       }
       
       // Модальное окно обратного звонка
       function showCallbackForm() {
           document.getElementById('callbackModal').style.display = 'flex';
           document.body.style.overflow = 'hidden';
       }
       
       function closeCallbackForm() {
           document.getElementById('callbackModal').style.display = 'none';
           document.body.style.overflow = 'auto';
       }
       
       // Закрытие модального окна при клике вне его
       window.onclick = function(event) {
           const modal = document.getElementById('callbackModal');
           if (event.target == modal) {
               closeCallbackForm();
           }
       }
   </script>
   
   <!-- Schema.org разметка -->
   <script type="application/ld+json">
   {
       "@context": "https://schema.org",
       "@type": "Organization",
       "name": "<?php echo SITE_NAME; ?>",
       "url": "<?php echo SITE_URL; ?>",
       "logo": "<?php echo SITE_URL; ?>/images/logo/iray-logo.png",
       "telephone": "<?php echo SITE_PHONE; ?>",
       "email": "<?php echo SITE_EMAIL; ?>",
       "address": {
           "@type": "PostalAddress",
           "addressCountry": "RU",
           "addressLocality": "Москва"
       },
       "sameAs": [
           "https://vk.com/irayoptics",
           "https://t.me/irayoptics"
       ]
   }
   </script>
   
   <?php if (DEBUG_MODE): ?>
   <!-- Debug информация -->
   <div style="position: fixed; bottom: 0; right: 0; background: #333; color: #fff; padding: 10px; font-size: 12px;">
       Page load: <?php echo round(microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"], 3); ?>s
   </div>
   <?php endif; ?>
</body>
</html>