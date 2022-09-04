import {config} from 'dotenv';
config();

import {Client, Message} from 'discord.js';
import { prefix } from './config.json';
const GphApiClient = require('giphy-js-sdk-core');
const { GIPHY_TOKEN, CLIENT_TOKEN } = process.env;

const client: Client = new Client();
const giphy = GphApiClient(GIPHY_TOKEN);


client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', async (message: Message) => {
    const words: string[] = message.content.split(" ");

    if(message.content.startsWith(`${prefix}hola`)){
            message.channel.send("hola, mi amor");
    }

    if(message.content.startsWith(`${prefix}kick`)){
        if(message.member.hasPermission(["KICK_MEMBERS"])){
            const member = message.mentions.members.first();
            if(member) {
                const kickedMember = await member.kick();
                console.log(kickedMember.user.username);
                message.channel.send(`${kickedMember.user.username} has been kicked`);
            } else {
                message.reply("You don't have permission to do this");
            }
        }
    }

    if(message.content.startsWith(`${prefix}deleteMessages`)){
        try {
            const messages = await message.channel.fetchMessages();
            await message.channel.bulkDelete(messages);
        } catch (error) {
            console.error(error);
        }
    }

    if(message.content.startsWith(`${prefix}gif`)){
        try {
            const keywords: string = words.splice(1, words.length).join(" ");

            const response = await giphy.search("gifs", {q: `${keywords}`});
            const totalResponses: number = response.data.length;
            const responseIndex: number = Math.floor((Math.random() * 10) + 1) % totalResponses;

            message.channel.send(response.data[responseIndex].images.fixed_height.url);
        } catch (error) {
            console.error(error);
        }
    }
});


client.login(CLIENT_TOKEN);