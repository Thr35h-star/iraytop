// ======================
// ОБРАБОТКА ФОРМ
// ======================

class FormHandler {
    constructor(formElement, options = {}) {
        this.form = formElement;
        this.options = {
            endpoint: options.endpoint || '/api/send-form.php',
            successRedirect: options.successRedirect || '/thank-you.html',
            validateOnBlur: options.validateOnBlur !== false,
            phoneFormat: options.phoneFormat !== false,
            ...options
        };
        
        this.init();
    }
    
    init() {
        // Обработчик отправки
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Валидация при потере фокуса
        if (this.options.validateOnBlur) {
            this.setupBlurValidation();
        }
        
        // Форматирование телефона
        if (this.options.phoneFormat) {
            this.setupPhoneFormatting();
        }
        
        // Автозаполнение из URL параметров
        this.autoFillFromURL();
    }
    
    // ======================
    // ОТПРАВКА ФОРМЫ
    // ======================
    async handleSubmit(e) {
        e.preventDefault();
        
        // Валидация
        if (!this.validateForm()) {
            this.showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        // Получаем элементы
        const submitButton = this.form.querySelector('[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Блокируем форму
        this.setFormState('loading');
        submitButton.textContent = 'Отправка...';
        
        try {
            // Собираем данные
            const formData = this.collectFormData();
            
            // Добавляем дополнительные данные
            formData.source = this.getSource();
            formData.timestamp = new Date().toISOString();
            formData.userAgent = navigator.userAgent;
            
            // Отправляем
            const response = await this.sendData(formData);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Успех
                this.handleSuccess(submitButton);
            } else {
                throw new Error(result.error || 'Ошибка отправки');
            }
            
        } catch (error) {
            // Ошибка
            this.handleError(error, submitButton, originalText);
        }
    }
    
    // ======================
    // ОТПРАВКА ДАННЫХ
    // ======================
    async sendData(data) {
        // Отправка на сервер
        const response = await fetch(this.options.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Отправка в аналитику
        this.sendAnalytics('form_submit', data);
        
        // Отправка в CRM (если настроено)
        if (this.options.crmEndpoint) {
            this.sendToCRM(data);
        }
        
        return response;
    }
    
    // ======================
    // ОБРАБОТКА РЕЗУЛЬТАТОВ
    // ======================
    handleSuccess(submitButton) {
        // Меняем вид кнопки
        submitButton.textContent = 'Отправлено! ✓';
        submitButton.classList.add('success');
        
        // Сохраняем в localStorage для thank you страницы
        localStorage.setItem('formSubmitted', JSON.stringify({
            timestamp: Date.now(),
            form: this.form.id || 'contact-form'
        }));
        
        // Показываем уведомление
        this.showNotification('Заявка успешно отправлена!', 'success');
        
        // Очищаем форму
        this.form.reset();
        
        // Редирект
        if (this.options.successRedirect) {
            setTimeout(() => {
                window.location.href = this.options.successRedirect;
            }, 1000);
        }
    }
    
    handleError(error, submitButton, originalText) {
        console.error('Ошибка отправки формы:', error);
        
        // Возвращаем кнопку
        submitButton.textContent = 'Ошибка отправки';
        submitButton.classList.add('error');
        
        // Показываем уведомление
        this.showNotification('Произошла ошибка. Пожалуйста, попробуйте позже.', 'error');
        
        // Восстанавливаем состояние
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.classList.remove('error');
            this.setFormState('normal');
        }, 3000);
        
        // Отправляем ошибку в аналитику
        this.sendAnalytics('form_error', { error: error.message });
    }
    
    // ======================
    // ВАЛИДАЦИЯ
    // ======================
    validateForm() {
        const fields = this.form.querySelectorAll('[required], [data-validate]');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type || field.tagName.toLowerCase();
        let isValid = true;
        let errorMessage = '';
        
        // Проверка на пустоту
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'Это поле обязательно для заполнения';
            isValid = false;
        }
        
        // Специфичная валидация по типу
        if (value && isValid) {
            switch (type) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        errorMessage = 'Введите корректный email адрес';
                        isValid = false;
                    }
                    break;
                    
                case 'tel':
                    if (!this.isValidPhone(value)) {
                        errorMessage = 'Введите полный номер телефона';
                        isValid = false;
                    }
                    break;
                    
                case 'text':
                    if (field.dataset.validate === 'name' && !this.isValidName(value)) {
                        errorMessage = 'Имя должно содержать только буквы';
                        isValid = false;
                    }
                    break;
            }
        }
        
        // Показываем/скрываем ошибку
        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    // ======================
    // ВАЛИДАТОРЫ
    // ======================
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    isValidPhone(phone) {
        // Российский формат
        const regex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        return regex.test(phone);
    }
    
    isValidName(name) {
        const regex = /^[а-яА-ЯёЁa-zA-Z\s-]+$/;
        return regex.test(name);
    }
    
    // ======================
    // ФОРМАТИРОВАНИЕ
    // ======================
    setupPhoneFormatting() {
        const phoneInputs = this.form.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            input.addEventListener('input', this.formatPhone.bind(this));
            input.addEventListener('paste', this.handlePhonePaste.bind(this));
            
            // Устанавливаем placeholder
            if (!input.placeholder) {
                input.placeholder = '+7 (___) ___-__-__';
            }
        });
    }
    
formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';
    
    // Если начинается с 7 или 8, убираем
    if (value.startsWith('7') && value.length > 1) {
        value = value.substring(1);
    } else if (value.startsWith('8')) {
        value = value.substring(1);
    }
    
    // Форматируем
    if (value.length >= 0) {
        formattedValue = '+7';
        if (value.length > 0) {
            formattedValue += ' (' + value.substring(0, Math.min(3, value.length));
        }
        if (value.length > 3) {
            formattedValue += ') ' + value.substring(3, Math.min(6, value.length));
        }
        if (value.length > 6) {
            formattedValue += '-' + value.substring(6, Math.min(8, value.length));
        }
        if (value.length > 8) {
            formattedValue += '-' + value.substring(8, Math.min(10, value.length));
        }
    }
    
    // Устанавливаем значение
    e.target.value = formattedValue;
}
    
    handlePhonePaste(e) {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const cleanedText = pastedText.replace(/\D/g, '');
        
        // Создаем искусственное событие input
        e.target.value = cleanedText;
        e.target.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // ======================
    // UI ФУНКЦИИ
    // ======================
    showFieldError(field, message) {
        field.classList.add('error');
        
        // Создаем или обновляем элемент ошибки
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Анимация
        errorElement.classList.add('animate-fade-in');
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} animate-slide-down`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Добавляем в DOM
        document.body.appendChild(notification);
        
        // Удаляем через 5 секунд
        setTimeout(() => {
            notification.classList.add('animate-fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            warning: '⚠'
        };
        return icons[type] || icons.info;
    }
    
    setFormState(state) {
        const fields = this.form.querySelectorAll('input, textarea, select, button');
        
        switch (state) {
            case 'loading':
                this.form.classList.add('loading');
                fields.forEach(field => field.disabled = true);
                break;
                
            case 'normal':
                this.form.classList.remove('loading');
                fields.forEach(field => field.disabled = false);
                break;
        }
    }
    
    // ======================
    // УТИЛИТЫ
    // ======================
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Преобразуем FormData в обычный объект
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Добавляем дополнительные данные
        data.formId = this.form.id || 'unknown';
        data.pageUrl = window.location.href;
        data.referrer = document.referrer;
        
        return data;
    }
    
    getSource() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source') || 'direct',
            utm_medium: urlParams.get('utm_medium') || 'none',
            utm_campaign: urlParams.get('utm_campaign') || 'none',
            utm_term: urlParams.get('utm_term') || '',
            utm_content: urlParams.get('utm_content') || ''
        };
    }
    
    autoFillFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Автозаполнение полей из URL
        urlParams.forEach((value, key) => {
            const field = this.form.querySelector(`[name="${key}"]`);
            if (field && !field.value) {
                field.value = decodeURIComponent(value);
            }
        });
    }
    
    setCursorPosition(input, position) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(position, position);
        }
    }
    
    setupBlurValidation() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                if (field.value) {
                    this.validateField(field);
                }
            });
        });
    }
    
    // ======================
    // АНАЛИТИКА
    // ======================
    sendAnalytics(eventName, data) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                'event_category': 'Form',
                'event_label': this.form.id,
                ...data
            });
        }
        
        // Яндекс.Метрика
        if (typeof ym !== 'undefined') {
            ym(window.yaCounterId, 'reachGoal', eventName, data);
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, data);
        }
    }
    
    // ======================
    // CRM ИНТЕГРАЦИЯ
    // ======================
    async sendToCRM(data) {
        try {
            const response = await fetch(this.options.crmEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.options.crmToken}`
                },
                body: JSON.stringify({
                    ...data,
                    source: 'website',
                    type: 'lead'
                })
            });
            
            if (!response.ok) {
                throw new Error('CRM error');
            }
        } catch (error) {
            console.error('CRM integration error:', error);
            // Не блокируем основной процесс
        }
    }
}

// ======================
// АВТОМАТИЧЕСКАЯ ИНИЦИАЛИЗАЦИЯ
// ======================
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем все формы с атрибутом data-form
    const forms = document.querySelectorAll('form[data-form]');
    
    forms.forEach(form => {
        const options = {
            endpoint: form.dataset.endpoint,
            successRedirect: form.dataset.redirect,
            crmEndpoint: form.dataset.crmEndpoint,
            crmToken: form.dataset.crmToken
        };
        
        new FormHandler(form, options);
    });
});

// Экспортируем для использования в других модулях
window.FormHandler = FormHandler;