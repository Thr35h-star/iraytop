// ======================
// АНИМАЦИИ И ЭФФЕКТЫ
// ======================

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animations = new Map();
        this.rafId = null;
        
        this.init();
    }
    
    init() {
        // Инициализация при загрузке страницы
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupPageTransitions();
        
        // Специальные эффекты
        this.initParallax();
        this.initTextEffects();
    }
    
    // ======================
    // INTERSECTION OBSERVER
    // ======================
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: [0, 0.25, 0.5, 0.75, 1]
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target, entry.intersectionRatio);
                }
            });
        }, options);
        
        // Наблюдаем за элементами с анимацией
        this.observeElements(observer);
        
        this.observers.set('main', observer);
    }
    
    observeElements(observer) {
        // Fade анимации
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
        
        // Slide анимации
        document.querySelectorAll('.slide-in-left').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-50px)';
            observer.observe(el);
        });
        
        document.querySelectorAll('.slide-in-right').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(50px)';
            observer.observe(el);
        });
        
        // Scale анимации
        document.querySelectorAll('.scale-in').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'scale(0.8)';
            observer.observe(el);
        });
        
        // Stagger анимации для списков
        document.querySelectorAll('[data-stagger]').forEach(container => {
            const children = container.children;
            Array.from(children).forEach((child, index) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(20px)';
                child.style.transitionDelay = `${index * 100}ms`;
                observer.observe(child);
            });
        });
    }
    
    animateElement(element, ratio) {
        // Базовая анимация
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.opacity = '1';
        element.style.transform = 'translate(0, 0) scale(1)';
        
        // Добавляем класс для CSS анимаций
        element.classList.add('animated');
        
        // Удаляем из наблюдения после анимации
        if (ratio > 0.5) {
            this.observers.get('main').unobserve(element);
        }
        
        // Callback для кастомных анимаций
        if (element.dataset.animationCallback) {
            this.runCustomAnimation(element, element.dataset.animationCallback);
        }
    }
    
    // ======================
    // SCROLL АНИМАЦИИ
    // ======================
    setupScrollAnimations() {
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        const updateScrollAnimations = () => {
            const scrollY = window.scrollY;
            const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
            const scrollSpeed = Math.abs(scrollY - lastScrollY);
            
            // Анимация шапки
            this.animateHeader(scrollY, scrollDirection);
            
            // Параллакс элементы
            this.updateParallax(scrollY);
            
            // Progress bar
            this.updateProgressBar(scrollY);
            
            // Reveal анимации
            this.checkRevealElements(scrollY);
            
            lastScrollY = scrollY;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        });
    }
    
    animateHeader(scrollY, direction) {
        const header = document.querySelector('.header');
        if (!header) return;
        
        if (scrollY > 100) {
            header.classList.add('scrolled');
            if (direction === 'down' && scrollY > 300) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('scrolled', 'hidden');
        }
    }
    
    updateProgressBar(scrollY) {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;
        
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / documentHeight) * 100;
        
        progressBar.style.width = `${progress}%`;
    }
    
    // ======================
    // HOVER ЭФФЕКТЫ
    // ======================
    setupHoverEffects() {
        // Магнитные кнопки
        document.querySelectorAll('.btn-magnetic').forEach(btn => {
            this.createMagneticEffect(btn);
        });
        
        // 3D карточки
        document.querySelectorAll('.card-3d').forEach(card => {
            this.create3DEffect(card);
        });
        
        // Ripple эффект
        document.querySelectorAll('.ripple').forEach(element => {
            this.createRippleEffect(element);
        });
        
        // Glow эффект
        document.querySelectorAll('.glow-hover').forEach(element => {
            this.createGlowEffect(element);
        });
    }
    
    createMagneticEffect(element) {
        const strength = element.dataset.magneticStrength || 0.5;
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    }
    
    create3DEffect(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const rotateY = (x - 0.5) * 30;
            const rotateX = (y - 0.5) * -30;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
    
    createRippleEffect(element) {
        element.addEventListener('click', (e) => {
            const rect = element.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            element.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    }
    
    createGlowEffect(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            element.style.setProperty('--glow-x', `${x}px`);
            element.style.setProperty('--glow-y', `${y}px`);
        });
    }
    
  
    
    // ======================
    // ПАРАЛЛАКС
    // ======================
    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;
        
        this.parallaxElements = Array.from(parallaxElements).map(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const offset = parseFloat(element.dataset.parallaxOffset) || 0;
            
            return {
                element,
                speed,
                offset,
                top: element.offsetTop,
                height: element.offsetHeight
            };
        });
    }
    
    updateParallax(scrollY) {
        if (!this.parallaxElements) return;
        
        this.parallaxElements.forEach(({ element, speed, offset }) => {
            const yPos = -(scrollY * speed) + offset;
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
    
    // ======================
    // ТЕКСТОВЫЕ ЭФФЕКТЫ
    // ======================
    initTextEffects() {
        // Печатающийся текст
        document.querySelectorAll('[data-typewriter]').forEach(element => {
            this.createTypewriterEffect(element);
        });
        
        // Разделение текста на буквы для анимации
        document.querySelectorAll('[data-split-text]').forEach(element => {
            this.splitText(element);
        });
        
        // Счетчики
        document.querySelectorAll('[data-counter]').forEach(element => {
            this.createCounterEffect(element);
        });
    }
    
    createTypewriterEffect(element) {
        const text = element.textContent;
        const speed = parseInt(element.dataset.typewriterSpeed) || 100;
        element.textContent = '';
        element.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        
        // Запускаем когда элемент виден
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    }
    
    splitText(element) {
        const text = element.textContent;
        element.textContent = '';
        
        // Разбиваем на буквы
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.animationDelay = `${index * 50}ms`;
            span.className = 'letter';
            element.appendChild(span);
        });
        
        // Анимируем при появлении
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    element.classList.add('animate-letters');
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    }
    
    createCounterEffect(element) {
        const target = parseInt(element.dataset.counter);
        const duration = parseInt(element.dataset.counterDuration) || 2000;
        const start = 0;
        const increment = target / (duration / 16);
        
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        // Запускаем при видимости
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    }
    
    // ======================
    // ПЕРЕХОДЫ СТРАНИЦ
    // ======================
    setupPageTransitions() {
        // Плавное появление страницы
        document.body.classList.add('page-enter');
        setTimeout(() => {
            document.body.classList.remove('page-enter');
            document.body.classList.add('page-ready');
        }, 100);
        
        // Плавный уход при переходе
        document.querySelectorAll('a:not([target="_blank"])').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Игнорируем якорные ссылки и специальные
                if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) {
                    return;
                }
                
                e.preventDefault();
                document.body.classList.add('page-exit');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });
    }
    
    // ======================
    // REVEAL ЭЛЕМЕНТЫ
    // ======================
    checkRevealElements(scrollY) {
        document.querySelectorAll('.reveal').forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const elementBottom = elementTop + element.offsetHeight;
            const viewportBottom = scrollY + window.innerHeight;
            
            if (viewportBottom > elementTop + 100) {
                element.classList.add('revealed');
            }
        });
    }
    
    // ======================
    // СПЕЦИАЛЬНЫЕ ЭФФЕКТЫ
    // ======================
    
    // Эффект частиц
    createParticles(container, options = {}) {
        const defaults = {
            count: 50,
            color: '#a8d063',
            size: 3,
            speed: 0.5,
            direction: 'up'
        };
        
        const settings = { ...defaults, ...options };
        
        for (let i = 0; i < settings.count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${settings.size}px;
                height: ${settings.size}px;
                background: ${settings.color};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random()};
                animation: float-${settings.direction} ${10 + Math.random() * 20}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
            `;
            
            container.appendChild(particle);
        }
    }
    
    // Эффект глитча
    createGlitchEffect(element) {
        const text = element.textContent;
        element.dataset.text = text;
        
        element.addEventListener('mouseenter', () => {
            let iterations = 0;
            const glitchInterval = setInterval(() => {
                element.textContent = text
                    .split('')
                    .map((char, index) => {
                        if (Math.random() < 0.5) {
                            return String.fromCharCode(33 + Math.random() * 94);
                        }
                        return char;
                    })
                    .join('');
                
                iterations++;
                if (iterations > 10) {
                    element.textContent = text;
                    clearInterval(glitchInterval);
                }
            }, 50);
        });
    }
    
    // Морфинг SVG
    morphSVG(from, to, duration = 1000) {
        const fromPath = document.querySelector(from);
        const toPath = document.querySelector(to);
        
        if (!fromPath || !toPath) return;
        
        const interpolate = (start, end, progress) => {
            return start + (end - start) * progress;
        };
        
        const animate = (timestamp) => {
            const progress = timestamp / duration;
            
            if (progress < 1) {
                // Интерполяция путей
                // Здесь должна быть более сложная логика морфинга
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // ======================
    // УТИЛИТЫ
    // ======================
    runCustomAnimation(element, animationName) {
        if (typeof this[animationName] === 'function') {
            this[animationName](element);
        }
    }
    
    // Останавливаем все анимации
    pauseAllAnimations() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        
        document.body.classList.add('animations-paused');
    }
    
    // Возобновляем анимации
    resumeAllAnimations() {
        document.body.classList.remove('animations-paused');
        // Перезапускаем необходимые анимации
    }
    
    // Очистка при уходе со страницы
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        // Удаляем слушатели событий
        document.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('scroll', this.handleScroll);
    }
}

// ======================
// CSS АНИМАЦИИ В JS
// ======================
const cssAnimations = `
    <style>
    /* Ripple эффект */
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Анимация букв */
    .animate-letters .letter {
        animation: letterIn 0.5s cubic-bezier(0.5, 0, 0.5, 1) forwards;
        opacity: 0;
        transform: translateY(20px);
    }
    
    @keyframes letterIn {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Переходы страниц */
    .page-enter {
        opacity: 0;
        transform: translateY(20px);
    }
    
    .page-ready {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.5s ease-out;
    }
    
    .page-exit {
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease-in;
    }
    

    
    /* Скрытая шапка */
    .header.hidden {
        transform: translateY(-100%);
    }
    
    /* Прогресс скролла */
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--color-primary);
        z-index: 9999;
        transition: width 0.1s;
    }
    
    /* Частицы */
    @keyframes float-up {
        from {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        to {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes float-down {
        from {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    /* Glow эффект */
    .glow-hover {
        position: relative;
        overflow: hidden;
    }
    
    .glow-hover::before {
        content: '';
        position: absolute;
        top: var(--glow-y, 50%);
        left: var(--glow-x, 50%);
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(168, 208, 99, 0.3) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s;
        pointer-events: none;
    }
    
    .glow-hover:hover::before {
        opacity: 1;
    }
    
    /* Паузы анимаций */
    .animations-paused * {
        animation-play-state: paused !important;
        transition: none !important;
    }
    </style>
`;

// Добавляем стили в head
document.head.insertAdjacentHTML('beforeend', cssAnimations);

// ======================
// ИНИЦИАЛИЗАЦИЯ
// ======================
let animationController;

document.addEventListener('DOMContentLoaded', () => {
    animationController = new AnimationController();
});

// Очистка при уходе
window.addEventListener('beforeunload', () => {
    if (animationController) {
        animationController.destroy();
    }
});

// Экспортируем для использования
window.AnimationController = AnimationController;