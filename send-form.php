<?php
// Настройки
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Конфигурация
$config = [
    'email_to' => 'your-email@example.com', // ИЗМЕНИТЕ на ваш email
    'email_from' => 'noreply@iray-optics.ru',
    'email_subject' => 'Новая заявка с сайта iRay Optics',
    'telegram_bot_token' => '', // Токен бота Telegram (опционально)
    'telegram_chat_id' => '', // ID чата Telegram (опционально)
    'save_to_file' => true, // Сохранять заявки в файл
    'leads_file' => '../data/leads.json'
];

// Получение данных
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Валидация
if (!$data || empty($data['name']) || empty($data['phone'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Заполните обязательные поля']);
    exit;
}

// Санитизация данных
$name = htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8');
$phone = htmlspecialchars(trim($data['phone']), ENT_QUOTES, 'UTF-8');
$question = isset($data['question']) ? htmlspecialchars(trim($data['question']), ENT_QUOTES, 'UTF-8') : '';

// UTM метки
$utm_source = isset($data['source']['utm_source']) ? $data['source']['utm_source'] : 'direct';
$utm_medium = isset($data['source']['utm_medium']) ? $data['source']['utm_medium'] : 'none';
$utm_campaign = isset($data['source']['utm_campaign']) ? $data['source']['utm_campaign'] : 'none';

// Дополнительная информация
$page_url = isset($data['pageUrl']) ? $data['pageUrl'] : '';
$timestamp = date('d.m.Y H:i:s');
$ip_address = $_SERVER['REMOTE_ADDR'];

// Формирование email сообщения
$email_message = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2d5016; color: white; padding: 20px; text-align: center; }
        .content { background: #f4f4f4; padding: 20px; margin-top: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2d5016; }
        .value { margin-left: 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Новая заявка с сайта iRay Optics</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Имя:</span>
                <span class='value'>$name</span>
            </div>
            <div class='field'>
                <span class='label'>Телефон:</span>
                <span class='value'>$phone</span>
            </div>
            <div class='field'>
                <span class='label'>Вопрос:</span>
                <span class='value'>$question</span>
            </div>
            <hr>
            <div class='field'>
                <span class='label'>Источник:</span>
                <span class='value'>$utm_source / $utm_medium / $utm_campaign</span>
            </div>
            <div class='field'>
                <span class='label'>Страница:</span>
                <span class='value'>$page_url</span>
            </div>
            <div class='field'>
                <span class='label'>Дата и время:</span>
                <span class='value'>$timestamp</span>
            </div>
            <div class='field'>
                <span class='label'>IP адрес:</span>
                <span class='value'>$ip_address</span>
            </div>
        </div>
        <div class='footer'>
            <p>Это автоматическое сообщение. Не отвечайте на него.</p>
        </div>
    </div>
</body>
</html>
";

// Отправка email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: iRay Optics <{$config['email_from']}>\r\n";
$headers .= "Reply-To: {$config['email_from']}\r\n";

$email_sent = mail($config['email_to'], $config['email_subject'], $email_message, $headers);

// Сохранение в файл
if ($config['save_to_file']) {
    $lead_data = [
        'id' => uniqid(),
        'timestamp' => $timestamp,
        'name' => $name,
        'phone' => $phone,
        'question' => $question,
        'utm_source' => $utm_source,
        'utm_medium' => $utm_medium,
        'utm_campaign' => $utm_campaign,
        'page_url' => $page_url,
        'ip_address' => $ip_address
    ];
    
    $leads_file = $config['leads_file'];
    $leads = [];
    
    if (file_exists($leads_file)) {
        $leads = json_decode(file_get_contents($leads_file), true) ?: [];
    }
    
    $leads[] = $lead_data;
    file_put_contents($leads_file, json_encode($leads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// Отправка в Telegram (если настроено)
if (!empty($config['telegram_bot_token']) && !empty($config['telegram_chat_id'])) {
    $telegram_message = "🎯 *Новая заявка с сайта iRay Optics*\n\n";
    $telegram_message .= "👤 *Имя:* $name\n";
    $telegram_message .= "☎️ *Телефон:* $phone\n";
    if ($question) {
        $telegram_message .= "❓ *Вопрос:* $question\n";
    }
    $telegram_message .= "\n📊 *Источник:* $utm_source / $utm_medium\n";
    $telegram_message .= "🕐 *Время:* $timestamp";
    
    $telegram_url = "https://api.telegram.org/bot{$config['telegram_bot_token']}/sendMessage";
    $telegram_data = [
        'chat_id' => $config['telegram_chat_id'],
        'text' => $telegram_message,
        'parse_mode' => 'Markdown'
    ];
    
    $ch = curl_init($telegram_url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($telegram_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_exec($ch);
    curl_close($ch);
}

// Ответ
if ($email_sent) {
    echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Ошибка отправки заявки']);
}
?>