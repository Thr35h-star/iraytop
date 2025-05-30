// ======================
// ОСНОВНОЙ ФУНКЦИОНАЛ
// ======================

// Конфигурация
const CONFIG = {
    animationDuration: 300,
    scrollOffset: 100,
    formEndpoint: '/api/send-form.php',
    timerDuration: 15 * 60, // 15 минут в секундах
    productsDataUrl: '/data/products.json',
    shopsDataUrl: '/data/shops.json'
};

// Состояние приложения
const APP_STATE = {
    products: [],
    shops: [],
    cart: [],
    isLoading: false,
    isMobileMenuOpen: false
};

// ======================
// ИНИЦИАЛИЗАЦИЯ
// ======================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Показываем индикатор загрузки
        showLoader();
        
        // Инициализируем компоненты
        await initializeComponents();
        
        // Настраиваем обработчики событий
        setupEventListeners();
        
        // Загружаем данные
        await loadInitialData();
        
        // Скрываем индикатор загрузки
        hideLoader();
        
        // Инициализируем анимации
        initAnimations();
        
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        showError('Произошла ошибка при загрузке страницы');
    }
}

// ======================
// КОМПОНЕНТЫ
// ======================
async function initializeComponents() {
    // Инициализация слайдера
    if (document.querySelector('.hero-slider')) {
        initSlider();
    }
    
    // Инициализация таймеров
    const timers = document.querySelectorAll('[data-timer]');
    timers.forEach(timer => initTimer(timer));
    
    // Инициализация форм
    const forms = document.querySelectorAll('form[data-ajax]');
    forms.forEach(form => initForm(form));
    
    
    // Инициализация параллакса
    initParallax();
}

// ======================
// ЗАГРУЗКА ДАННЫХ
// ======================
async function loadInitialData() {
    try {
        // Загружаем товары
        if (document.querySelector('[data-products]')) {
            await loadProducts();
        }
        
        // Загружаем информацию о магазинах
        if (document.querySelector('[data-shops]')) {
            await loadShops();
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(CONFIG.productsDataUrl);
        if (!response.ok) throw new Error('Ошибка загрузки товаров');
        
        const data = await response.json();
        APP_STATE.products = data.products;
        
        // Рендерим товары
        renderProducts(APP_STATE.products);
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
        // Используем статичные данные как fallback
        renderStaticProducts();
    }
}

async function loadShops() {
    try {
        const response = await fetch(CONFIG.shopsDataUrl);
        if (!response.ok) throw new Error('Ошибка загрузки магазинов');
        
        const data = await response.json();
        APP_STATE.shops = data.shops;
    } catch (error) {
        console.error('Ошибка загрузки магазинов:', error);
    }
}

// ======================
// РЕНДЕРИНГ
// ======================
function renderProducts(products) {
    const container = document.querySelector('[data-products]');
    if (!container) return;
    
    const productsHTML = products.map(product => createProductCard(product)).join('');
    container.innerHTML = productsHTML;
    
    // Анимируем появление карточек
    animateCards();
}

function createProductCard(product) {
    const badgeHTML = product.badge ? `<div class="badge">${product.badge}</div>` : '';
    const featuresHTML = Object.entries(product.features)
        .map(([key, value]) => `<li>${value}</li>`)
        .join('');
    
    return `
        <div class="product-card fade-in" data-product-id="${product.id}">
            ${badgeHTML}
            <div class="product-image">
                <img src="${product.images.main}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <ul class="product-features">
                    ${featuresHTML}
                </ul>
                <div class="product-price">${formatPrice(product.basePrice)} ₽</div>
                <a href="/products/${product.id}.html" class="btn btn-primary w-100">
                    Подробнее
                </a>
            </div>
        </div>
    `;
}

function renderStaticProducts() {
    // Fallback для статичного контента
    console.log('Используем статичные данные товаров');
}

// ======================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ======================
function setupEventListeners() {
    // Плавный скролл
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
    
    // Мобильное меню
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Закрытие мобильного меню при клике вне его
    document.addEventListener('click', handleOutsideClick);
    
    // Изменение размера окна
    window.addEventListener('resize', debounce(handleResize, 300));
    
    // Скролл
    window.addEventListener('scroll', throttle(handleScroll, 100));
}

// ======================
// СЛАЙДЕР
// ======================
function initSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Автоматическое переключение
    if (slides.length > 1) {
        setInterval(nextSlide, 5000);
    }
}

// ======================
// ТАЙМЕРЫ
// ======================
function initTimer(element) {
    const duration = parseInt(element.dataset.timer) || CONFIG.timerDuration;
    let timeLeft = duration;
    
    function updateTimer() {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        const display = hours > 0 
            ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
            : `${pad(minutes)}:${pad(seconds)}`;
        
        element.textContent = display;
        
        if (timeLeft > 0) {
            timeLeft--;
        } else {
            element.textContent = 'Время истекло!';
            element.classList.add('expired');
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// ======================
// ФОРМЫ
// ======================
function initForm(form) {
    form.addEventListener('submit', handleFormSubmit);
    
    // Маска для телефона
    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', handlePhoneInput);
    }
    
    // Валидация в реальном времени
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitButton = form.querySelector('[type="submit"]');
    
    // Валидация
    if (!validateForm(form)) {
        return;
    }
    
    // Блокируем кнопку
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    
    try {
        // Собираем данные
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Отправляем
        const response = await fetch(CONFIG.formEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Ошибка отправки');
        
        // Успех
        submitButton.textContent = 'Отправлено! ✓';
        submitButton.style.background = 'linear-gradient(45deg, #4a7c28, #2d5016)';
        
        // Редирект на страницу благодарности
        setTimeout(() => {
            window.location.href = '/thank-you.html';
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка отправки формы:', error);
        submitButton.textContent = 'Ошибка отправки';
        submitButton.style.background = '#ff4444';
        
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить заявку';
            submitButton.style.background = '';
        }, 3000);
    }
}



// ======================
// ПАРАЛЛАКС
// ======================
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// ======================
// УТИЛИТЫ
// ======================
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ======================
// UI ФУНКЦИИ
// ======================
function showLoader() {
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'flex';
}

function hideLoader() {
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'none';
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
    
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

function toggleMobileMenu() {
    APP_STATE.isMobileMenuOpen = !APP_STATE.isMobileMenuOpen;
    const menu = document.querySelector('.nav-menu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (menu) {
        menu.classList.toggle('active', APP_STATE.isMobileMenuOpen);
    }
    
    if (toggle) {
        toggle.classList.toggle('active', APP_STATE.isMobileMenuOpen);
    }
}

// ======================
// ОБРАБОТЧИКИ
// ======================
function handleSmoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
        const offset = CONFIG.scrollOffset;
        const targetPosition = target.offsetTop - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function handlePhoneInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length > 0) {
        formattedValue = '+7';
        if (value.length > 1) {
            formattedValue += ' (' + value.substring(1, 4);
        }
        if (value.length > 4) {
            formattedValue += ') ' + value.substring(4, 7);
        }
        if (value.length > 7) {
            formattedValue += '-' + value.substring(7, 9);
        }
        if (value.length > 9) {
            formattedValue += '-' + value.substring(9, 11);
        }
    }
    
    e.target.value = formattedValue;
}

function handleOutsideClick(e) {
    const menu = document.querySelector('.nav-menu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target)) {
        if (APP_STATE.isMobileMenuOpen) {
            toggleMobileMenu();
        }
    }
}

function handleResize() {
    // Закрываем мобильное меню при изменении размера
    if (window.innerWidth > 768 && APP_STATE.isMobileMenuOpen) {
        toggleMobileMenu();
    }
}

function handleScroll() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// ======================
// ВАЛИДАЦИЯ
// ======================
function validateForm(form) {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Проверка на пустоту
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Это поле обязательно');
        isValid = false;
    }
    
    // Проверка email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Введите корректный email');
            isValid = false;
        }
    }
    
    // Проверка телефона
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Введите полный номер телефона');
            isValid = false;
        }
    }
    
    if (isValid) {
        clearFieldError(field);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// ======================
// АНИМАЦИИ
// ======================
function initAnimations() {
    // Анимация появления при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми элементами с анимацией
    document.querySelectorAll('.fade-in, .slide-in').forEach(el => {
        observer.observe(el);
    });
}

function animateCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animated');
        }, index * 100);
    });
}