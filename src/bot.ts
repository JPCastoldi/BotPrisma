const dotenv = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

var emailUsuario = [null];

const Token = process.env.TELEGRAM_API_KEY;
const bot = new TelegramBot(Token, { polling: true });


bot.on('message', async (msg : any) => {
        const mensagem = msg.text;
        const chatId = msg.chat.id;
        const date = new Date(msg.date * 1000);
        const hours = date.getHours();
        
        if(hours < 9 || hours > 17) 
        {       
                if(emailUsuario.includes(chatId)){
                        cadastrarEmail(mensagem.toString(), chatId.toString());
                        return;
                }           
                
                bot.sendMessage(chatId, `Nosso horario de funcionamento é de 9h às 18h \nInforme o seu email que entraremos em contato em breve`);
                emailUsuario.push(chatId);
                          
        }
        else
        {
                bot.sendMessage(chatId, "Acesse o site para mais informações: https://faesa.br");
        }
});

async function cadastrarEmail(EmailU : string, ChatIdU : string){

        await prisma.usuario.create({
                data: {
                        chatId: ChatIdU,
                        email: EmailU
                },
        });

        bot.sendMessage(ChatIdU, `Email registrado com sucesso.`);
}
