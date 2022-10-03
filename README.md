<h1 align="center">
    FunPayServer
</h1>

<h4 align="center">
    Консольное приложение для автоматического управления вашим аккаунтом FunPay
</h4>

![FunPayServer](https://i.ibb.co/30BrFGr/Screenshot-107.png "FunPayServer")

## 🤖 **Возможности**

1. Автовыдача товаров.
2. Автоподнятие предложений.
3. Автовосстановление предложений после продажи.
4. Автоответ на сообщения.
5. Вечный онлайн.
6. Подсчёт продаж.
7. Подсчёт заработка с продаж.

## 🏆 **Преимущества**

- Оптимизированность
    *Для работы достаточно до 200мб свободного места на диске, 64-разрядная OS, любой процессор, до 250 мб ОЗУ, доступ в Интернет*
- Доступность
    *Программу можно запустить на любой платформе, которую поддерживает NodeJS: от Windows и Linux, до Android, iOS и FreeBSD.*
- Частичное управление через Telegram
- Наличие самого нужного функционала

## ⚡ **Установка**

<h3 align="center" >🔷 Windows 🔷</h3>

Данный вид установки подходит для большинства пользователей.

1. Скачайте `FunPayServer.exe` со страницы **[релизов](https://github.com/NightStrang6r/FunPayServer/releases)**.
2. Переместите программу в любую папку.
3. Получите `golden_key` из cookie FunPay. Вы можете использовать расширение [Edit This Cookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg). 
4. Запустите программу и следуйте инструкциям в консоли. Готово!

<h3 align="center" >🔨 Windows (продвинутая установка) 🔨</h3>

Данный вид установки подходит пользователей, которым нужен больший контроль над работой программы.

1. Установите **[Node.JS](https://nodejs.org/en/)**.
2. Скачайте данный **[репозиторий](https://github.com/NightStrang6r/FunPayServer)**.
3. Распакуйте загруженный архив в любую папку.
5. Получите `golden_key` из cookie FunPay. Вы можете использовать расширение [Edit This Cookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg). 
4. Запустите файл `Start.bat`, это установит зависимости для работы программы. После запустите этот файл повторно и следуйте инструкциям в консоли. Готово!

<h3 align="center" >♨️ Linux / Ubuntu ♨️</h3>

Данный вид установки предусматривает то, что вы будете запускать с source code, инструкцию по установке через .exe файл можно посмотреть в полной статье.
- **[Статья](https://lolz.guru/threads/4287473/)**

Установка NodeJS :
1. После входа в систему пропишите команду `sudo apt update && sudo apt upgrade`
2. Скачайте curl с помощью команды `sudo apt-get install curl`
3. Установите деб-пакет NodeJS при помощи команды `curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -`
4. Установите NodeJS при помощи команды : `sudo apt-get install nodejs`
5. Проверьте версию с помощью команды `node -v`, у вас должна отображаться версия 16, но любая версия выше тоже подойдет.

Включение бота :
1. Пропишите команду `cd (Название папки куда вы загрузили FunPayServer, можно написать часть названия и нажать tab , Linux сам подберет подходящую папку)`
2. Прописываем команду `npm i`, ждем загрузки. 
3. После загрузки прописываем команду `node .`
4. Готово! Бот запущен!
<h3 align="center" >⚫ Termux (Android) ⚫</h3>

1. Установите **Termux** на свой Android одним из вариантов: 
- [Скачать через F-Droid](https://f-droid.org/en/packages/com.termux/) - на странице кнопка "**Download APK**" (рекомендуется)
- [Скачать со страницы релизов Termux](https://github.com/termux/termux-app/releases) - нужен файл `termux-app_v0.118.0+github-debug_universal.apk`, либо более новой версии
- [Скачать через Google Play](https://play.google.com/store/apps/details?id=com.termux) (**важно:** версия Termux из Google Play больше **не обновляется**)
2. Обновите пакеты, выполнив команду `apt update && apt upgrade`.
3. Выполните команду `pkg install nodejs wget unzip`.
4. Выполните команду `wget https://github.com/NightStrang6r/FunPayServer/archive/refs/heads/main.zip && unzip main.zip`.
5. Перейдите в папку проекта, выполнив команду `cd FunPayServer-main`.
6. Выполните команды: `npm i`, `node .`.
7. Следуйте инструкциям консоли. Готово!

## 📦 Настройка автовыдачи

1. Проверьте, что в файле `settings.json` включена настройка автовыдачи: `"autoIssue": true`.
2. Переходим в папку `data`, открываем файл `autoIssueGoods.json`.
3. Заполняем необходимыми товарами в формате JSON по примерам:
- Если у вас выдаётся один и тот же товар (к примеру, какая-либо инструкция):
```
[{
    "name": "ТУТ ТОЧЬ В ТОЧЬ НАЗВАНИЕ ТОВАРА НА FUNPAY",
    "message": "Тут сообщение, которое будет выдано после оплаты. Для переноса строки используйте символы \n. Пример: первая строка\nвторая строка"
},
{
    "name": "ТУТ ТОЧЬ В ТОЧЬ НАЗВАНИЕ ТОВАРА НА FUNPAY",
    "message": "Тут другое сообщение, которое будет выдано после оплаты другого лота"
}]
```
- Если у вас выдаются разные товары (например, аккаунты):
```
[{
    "name": "ТУТ ТОЧЬ В ТОЧЬ НАЗВАНИЕ ТОВАРА НА FUNPAY",
    "nodes": [
        "Тут сообщение, которое будет выдано после первой оплаты. Для переноса строки используйте символы \n. Пример: первая строка\nвторая строка ",
        "Тут сообщение, которое будет выдано после второй оплаты данного лота.",
    ]
}]
```
- Их можно комбинировать:
```
[{
    "name": "ТУТ ТОЧЬ В ТОЧЬ НАЗВАНИЕ ТОВАРА НА FUNPAY",
    "nodes": [
        "Тут сообщение, которое будет выдано после первой оплаты. Для переноса строки используйте символы \n. Пример: первая строка\nвторая строка ",
        "Тут сообщение, которое будет выдано после второй оплаты данного лота.",
    ]
},
{
    "name": "ТУТ ТОЧЬ В ТОЧЬ НАЗВАНИЕ ТОВАРА НА FUNPAY",
    "message": "Тут сообщение, которое будет выдано после оплаты. Для переноса строки используйте символы \n. Пример: первая строка\nвторая строка"
}]
```
Для проверки правильности заполнения файла можете использовать сервис http://json.parser.online.fr
Для проверки работы автовыдачи без покупки товара используйте команду в чате: `!автовыдача "НАЗВАНИЕ ПРЕДЛОЖЕНИЯ"`. Для включения данной команды пропишите в файле настроек `settings.json` `"autoIssueTestCommand": true`. 

4. Сохраняем и перезапускаем программу.

## 💬 Настройка автоответа

1. Проверьте, что в файле `settings.json` включена настройка автовыдачи: `"autoResponse": true`.
2. Переходим в папку `data`, открываем файл `autoResponse.json`.
3. Заполняем необходимыми ответами в формате JSON по примерам:

```
[
    {
        "command": "!тест",
        "response": "Тестовое сообщение"
    },
    {
        "command": "!команда",
        "response": "Ответ на команду"
    }
]
```

4. Сохраняем и перезапускаем программу.

## 💲 Функция подсчёта продаж / заработка

Бот может подсчитать количество продаж и сумму заработанных средств с продаж. Для этого запустите файл `FunPayServer.exe` с параметром `--countProfit`, т.е. чтобы получилось `FunPayServer.exe --countProfit`. Запустить файл с параметром можно при помощи командной строки. Если вы использовали продвинутую установку, просто запустите файл `CountTradeProfit.bat`.

## 🌀 Работа с прокси

Бот поддерживает работу с http / https прокси с / без авторизации. Для включения работы через прокси пропишите в файле настроек `settings.json` настройку `"useProxy": true`, а также данные хоста в поле `host` и порт в поле `port`. Если ваш прокси не требует авторизации, оставьте поля `login` и `pass` пустыми.

## ⚙️ Файл настроек

Бот имеет модульную структуру, что позволяет отключать или подключать необходимые модули, редактируя файл настроек `settings.json`. Этот файл генерируется автоматически при первом запуске. После редактирования файла не забудьте перезапустить программу.

```
{
    "token": "golden_key",        // golden_key с FunPay cookies [string]
    "telegramBot": true,          // функция управления через Telegram [true / false]
    "telegramToken": "",          // токен телеграм бота [string]
    "telegramUserName": "",       // username пользователя [string]
    "alwaysOnline": true,         // функция вечного онлайна [true / false]
    "lotsRaise": true,            // функция автоподнятия предложений [true / false]
    "goodsStateCheck": true,      // функция автовосстановления предложений [true / false]
    "autoIssue": true,            // функция автовыдачи [true / false]
    "autoResponse": true,         // функция автоответа [true / false]
    "userDataUpdate": true,       // функция автоматического обновления данных (не рекомендуется отключать) [true / false]
    "autoIssueTestCommand": false, // функция включения команды "!автовыдача" для теста автовыдачи; требуется функция "autoResponse" для работы [true / false]
    "proxy": {
        "useProxy": false,        // функция использования прокси [true / false]
        "host": "",               // хост прокси [string]
        "port": 3128,             // порт прокси [number]
        "login": "",              // логин прокси [string]
        "pass": "",               // пароль прокси [string]
        "type": "http"            // тип прокси [string: "http" / "https"]
    },
    "requestsDelay": 0,           // задержка перед каждым запросом в миллисекундах [number]
    "watermark": "[ 🔥NightBot ]" // строка, которая добавляется перед отправкой сообщения ботом [string]
}
```

## 🔥 Аналоги
Если по какой-то причине данная версия бота не подходит для вас, попробуйте расширение для браузера - [FunPay Lite Bot](https://chrome.google.com/webstore/detail/funpay-lite-bot/amicfiagmpbgfiiopieeemlkblfeeeip) (функционал будет расширяться).

## 📧 Контакты
Если у вас есть какие-либо вопросы, я буду рад ответить.

Быстрый ответ:

- Telegram - [FunPay Lite Bot - chat / support](https://t.me/fplite)

- Discord - [Chat / Voice / Support](https://discord.gg/gEPnwzVD3H)

Более долгий ответ:

- Lolz.Guru - https://lolz.guru/threads/4149637/

## 🎉 Понравилось приложение?

Оцените данный репозиторий, поставив звёздчку в верхнем правом углу страницы на GitHub (нужно быть авторизованным в свой аккаунт). Это даёт мне мотивацию развивать данный проект.

![](https://i.ibb.co/x3hFFvf/2022-08-18-132617815.png)

Вы также можете поддержать разработчика материально, чтобы ускорить выход будущих обновлений:

- [Monobank](https://send.monobank.ua/jar/7fiVkcrWYv)
- [DonationAlerts](https://www.donationalerts.com/r/nightstranger)
- [ЮMoney](https://yoomoney.ru/to/4100115656349483)
