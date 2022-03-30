import fetch from 'node-fetch';
import { log } from './log.js';
import { parseDOM } from './DOMParser.js';
import { load } from './storage.js';
import { issueGood, getGood, addDeliveredName, searchOrdersByUserName } from './sales.js'
import { getSteamCode } from './email.js';

const config = load('config.json');
const autoRespData = load('data/autoResponse.json');
let appData = load('data/appData.json');

let isAutoRespBusy = false;

function enableAutoResponse(timeout) {
    setInterval(autoResponse, timeout);
    log(`Автоответ запущен.`);
}

async function autoResponse() {
    if(isAutoRespBusy) return;
    isAutoRespBusy = true;
    let result = false;

    try {
        const chats = await getChats();
        for(let j = 0; j < chats.length; j++) {
            const chat = chats[j];
    
            // Command logic here
    
            // Commands in file
            for(let i = 0; i < autoRespData.length; i++) {
                if(chat.message == autoRespData[i].command) {
                    log(`Команда: ${autoRespData[i].command}, ответ: ${autoRespData[i].response} для пользователя ${chat.userName}`);
                    await sendMessage(chat.node, autoRespData[i].response, true);
                    break;
                }
            }
    
            // Custom commands

            if(chat.message.includes("!теставтовыдачи")) {
                const goodName = chat.message.split(`"`)[1];
                const good = await getGood(goodName);
                    
                if(good) {
                    await issueGood(1664916, goodName);
                } else {
                    await sendMessage(chat.node, `Товар не найден в списке автовыдачи.`, true);
                }
            }

            if(chat.message.toLowerCase() == "!код") {
                const orders = await searchOrdersByUserName(chat.userName);
                if(orders.length == 0) {
                    await sendMessage(chat.node, `На данный момент нет соответствующих заказов для вызова данной команды.`, true);
                    return result;
                }
                const order = orders[0];
                const good = await getGood(order.name);
                const delivered = good.delivered;
                let alreadyDelivered = false;
            
                for(let i = 0; i < delivered.length; i++) {
                    if(delivered[i].name == order.buyerName && delivered[i].order == order.id) {
                        alreadyDelivered = true;
                        break;
                    }
                }
    
                if(!alreadyDelivered) {
                    //sendMessage(chat.node, `Получаем код. Пожалуйста, подождите.`, true);
                    const codeResult = await getSteamCode(good.email, good.pass, good.server);
                    let code = false;

                    if(codeResult.error != true) {
                        code = codeResult.code;
                    } else {
                        if(codeResult.msg == "no-new-mails") {
                            await sendMessage(chat.node, `На данный момент новых кодов нет. Убедитесь, что вошли в нужный аккаунт в нужном лаунчере, либо попробуйте ещё раз через минуту.`, true);
                            return result;
                        }
                    }

                    if(code) {
                        const res = await sendMessage(chat.node, `Code: ${code}`, true);
                        if(res) {
                            await addDeliveredName(order.name, order.buyerName, order.id);
                        }
                    }
                } else {
                    await sendMessage(chat.node, `К сожалению, вы уже получали код. Если у вас возникли проблемы со входом, напишите об этом сюда в чат. Продавец ответит вам при первой же возможности.`, true);
                }
                break;
            }
        }
    } catch (err) {
        log(`Ошибка при автоответе: ${err}`);
    }

    isAutoRespBusy = false;
    return result;
}

async function getChats() {
    let result = [];
    try {
        const url = `${config.api}/chat/`;
        const headers = { 
            "cookie": `golden_key=${config.token}`
        };

        const options = {
            method: 'GET',
            headers: headers
        }

        const resp = await fetch(url, options);
        const text = await resp.text();

        const doc = parseDOM(text);
        const chats = doc.querySelector(".contact-list").children;

        for(let i = 0; i < chats.length; i++) {
            const chat = chats[i];

            result[i] = {
                userName: chat.querySelector(".media-user-name").innerHTML,
                message: chat.querySelector(".contact-item-message").innerHTML,
                time: chat.querySelector(".contact-item-time").innerHTML,
                node: chat.dataset.id
            };
        }
    } catch (err) {
        log(`Ошибка при получении чатов: ${err}`);
    }
    return result;
}

async function getMessages(senderId) {
    let result = false;
    try {
        const url = `${config.api}/chat/history?node=users-${appData.id}-${senderId}&last_message=1000000000`;
        const headers = { 
            "cookie": `golden_key=${config.token}`,
            "x-requested-with": "XMLHttpRequest"
        };

        const options = {
            method: 'GET',
            headers: headers
        }

        const resp = await fetch(url, options);
        result = await resp.json();
    } catch (err) {
        log(`Ошибка при получении сообщений: ${err}`);
    }
    return result;
}

async function sendMessage(senderId, message, customNode = false) {
    if(!message || message == undefined || !senderId || senderId == undefined) return;

    let result = false;
    let node = "";

    try {
        appData = load('data/appData.json');

        const url = `${config.api}/runner/`;
        const headers = {
            "accept": "*/*",
            "cookie": `golden_key=${config.token}; PHPSESSID=${appData.sessid}`,
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest"
        };

        if(!customNode) {
            node = `users-${appData.id}-${senderId}`;
        } else {
            node = senderId;
        }

        message = `[ 🔥NightBot ]\n${message}`;

        const request = {
            "action": "chat_message",
            "data": {
                "node": node,
                "last_message": 2000000000,
                "content": message
            }
        };

        const params = new URLSearchParams();
        params.append('objects', "");
        params.append('request', JSON.stringify(request));
        params.append('csrf_token', appData.csrfToken);

        const options = {
            method: 'POST',
            body: params,
            headers: headers
        };

        const resp = await fetch(url, options);
        result = await resp.json();

        if(result.response != false) {
            result = true;
            log(`Сообщение отправлено, node: "${node}", сообщение: "${message}"`);
        } else {
            result = false;
            log(`Не удалось отправить сообщение, node: "${node}", сообщение: "${message}"`);
            log(`Request:`);
            console.log(params.toString());
            log(`Response:`);
            console.log(result);
        }
    } catch (err) {
        log(`Ошибка при отправке сообщения: ${err}`);
    }
    return result;
}

export { getMessages, sendMessage, getChats, enableAutoResponse };