const dotenv = require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

var emailUsuario = [""];

const token = process.env.TELEGRAM_API_KEY;
const bot = new TelegramBot(token, { polling: true });


bot.on('message', async (msg : any) => {
        const mensagem = msg.text;
        const chatId = msg.chat.id;
        const horas = new Date().getHours();
        
        
        if(horas > 9 && horas < 17) 
        {       
              bot.sendMessage(chatId, "Acesse o site para mais informações: https://faesa.br");     
        }
        else
        {
              if(emailUsuario.includes(chatId)){
                        cadastrarEmail(mensagem.toString(), chatId.toString());
                        return;
              }           
              bot.sendMessage(chatId, `Nosso horario de funcionamento é de 9h às 18h \nInforme o seu email que entraremos em contato em breve`);
              emailUsuario.push(chatId);
        }
});

async function cadastrarEmail(EmailU : string, ChatId : string){

        await prisma.usuario.create({
                data: {
                        email: EmailU
                },
        });

        bot.sendMessage(ChatId, `Email registrado com sucesso.`);
}
