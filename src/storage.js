import fs from 'fs-extra';
import c from 'chalk';
import inq from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { log, getDate } from './log.js';
import { exit } from './event.js';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const dataFolder = 'data';
const logPath = `${_dirname}/../${dataFolder}/log/`;

await initStorage();
global.settings = await loadSettings();

async function initStorage() {
    try {
        const files = [
            "autoIssueGoods.json", "autoResponse.json", "categories.json", "categoriesCache.json", "goodsState.json"
        ];
    
        if(!(await fs.exists(`${_dirname}/../${dataFolder}`))) {
            await fs.mkdir(`${_dirname}/../${dataFolder}`);
        }
    
        for(let i = 0; i < files.length; i++) {
            const file = files[i];

            if(!(await fs.exists(`${_dirname}/../${dataFolder}/${file}`))) {
                await fs.writeFile(`${_dirname}/../${dataFolder}/${file}`, '[]');
            }
        }
    } catch (err) {
        log(`Не удалось создать файлы хранилища: ${err}`);
    }
}

async function loadSettings() {
    try {
        let uri = `${_dirname}/../settings.json`;
        let settings = {};
        
        if(!(await fs.exists(uri))) {
            const answers = await askSettings();

            settings = {
                token: answers.token,
                alwaysOnline: answers.alwaysOnline,
                lotsRaise: answers.lotsRaise,
                goodsStateCheck: answers.goodsStateCheck, 
                autoIssue: answers.autoIssue, 
                autoResponse: answers.autoResponse, 
                autoIssueTestCommand: false,
                proxy: {
                    useProxy: false,
                    host: "",
                    port: 3128,
                    login: "",
                    pass: "",
                    type: "http"
                },
                requestsDelay: 0,
                watermark: "[ 🔥NightBot ]"
            };

            settings = JSON.stringify(settings, null, 4);
            await fs.writeFile(uri, settings);
        }

        if(!settings.token) {
            const rawdata = await fs.readFile(uri);
            settings = JSON.parse(rawdata);
        }

        if(!checkToken(settings.token)) {
            log('Невалидный токен (golden_key).', 'r');
            await exit();
        }

        return settings;
    } catch (err) {
        log(`Ошибка при загрузке файла настроек: ${err}. Программа будет закрыта.`, 'r');
        await exit();
    }
}

async function load(uri) {
    let result = false;
    try {
        uri = `${_dirname}/../${uri}`;
        
        if(!(await fs.exists(uri))) {
            await fs.writeFile(uri, '');
            return result;
        }

        const rawdata = await fs.readFile(uri, 'utf-8');
        result = JSON.parse(rawdata);
    } catch (err) {
        log(`Ошибка при загрузке файла "${uri}". Возможно файл имеет неверную кодировку (поддерживается UTF-8), либо неверный формат JSON: ${err}`, 'r');
    }
    return result;
}

async function updateFile(content, filePath) {
    let result = false;
    filePath = `${_dirname}/../${filePath}`;

    try {
        await fs.writeFile(filePath, JSON.stringify(content, null, 4));
        result = true;
    } catch(err) {
        log(`Ошибка записи файла: ${err}`, 'r');
        result = false;
    }

    return result;
}

function checkToken(token) {
    if(!token || token.length != 32) return false;
    return true;
}

function getConst(name) {
    switch (name) {
        case 'api': return 'https://funpay.com';
    }
}

async function logToFile(msg) {
    try {
        if(!(await fs.exists(logPath))) {
            await fs.mkdir(logPath);
        }

        const time = getDate();
        const logFile = `${logPath}log-${time.day}-${time.month}-${time.year}.txt`;
        if(!(await fs.exists(logFile))) {
            await fs.writeFile(logFile, '');
        }

        await fs.appendFile(logFile, `${msg}\n`);
    } catch(err) {
        log(`Ошибка записи файла: ${err}`, 'r');
    }
}

async function askSettings() {
    const question1 = await inq.prompt({
        name: 'golden_key',
        type: 'input',
        message: `Введите golden_key. Его можно получить из cookie с сайта FunPay при помощи расширения EditThisCookie:`,
        validate: function (input) {
            // Declare function as asynchronous, and save the done callback
            const done = this.async();
        
            if (!checkToken(input)) {
                done('Невалидный токен (golden_key).');
                return;
            }

            done(null, true);
          }
    });

    console.log(`${c.green('Отлично! Токен принят.')}`);

    const question2 = await inq.prompt({
        name: 'autoSettings',
        type: 'list',
        message: `Запуск бота выполняется впервые. Вы хотите настроить функции бота или оставить все параметры по умолчанию? Эти параметры всегда можно поменять в файле ${c.yellowBright('settings.json')}:`,
        choices: ['Оставить по умолчанию', 'Настроить']
    });

    if(question2.autoSettings == 'Оставить по умолчанию') {
        console.log();
        return {
            token: question1.golden_key,
            alwaysOnline: true,
            lotsRaise: true,
            goodsStateCheck: true,
            autoIssue: true,
            autoResponse: true,
        }
    }

    const answers = await inq.prompt([{
        name: 'alwaysOnline',
        type: 'list',
        message: `Включить функцию вечного онлайна?`,
        choices: ['Да', 'Нет']
    },{
        name: 'lotsRaise',
        type: 'list',
        message: `Включить функцию автоматического поднятия предложений?`,
        choices: ['Да', 'Нет']
    },
    {
        name: 'autoIssue',
        type: 'list',
        message: `Включить функцию автовыдачи товаров (не забудьте потом её настроить в файле autoIssueGoods.json)?`,
        choices: ['Да', 'Нет']
    },
    {
        name: 'goodsStateCheck',
        type: 'list',
        message: `Включить функцию автоактивации товаров после продажи?`,
        choices: ['Да', 'Нет']
    },
    {
        name: 'autoResponse',
        type: 'list',
        message: `Включить функцию автоответа на команды (настройка в файле autoResponse.json)?`,
        choices: ['Да', 'Нет']
    }]);

    const askSettings = {
        token: question1.golden_key,
        alwaysOnline: (answers.alwaysOnline == 'Да') ? true : false,
        lotsRaise: (answers.lotsRaise == 'Да') ? true : false,
        goodsStateCheck: (answers.goodsStateCheck == 'Да') ? true : false, 
        autoIssue: (answers.autoIssue == 'Да') ? true : false, 
        autoResponse: (answers.autoResponse == 'Да') ? true : false, 
    }

    console.log();
    return askSettings;
}

export { updateFile, initStorage, load, loadSettings, logToFile, getConst };