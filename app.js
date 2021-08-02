const express = require('express')
const app = express()
const Discord = require('discord.js')
const client = new Discord.Client()


app.listen(3000,()=>{
    console.log("Server listening on port ")
})
client.on('ready',()=>{
    console.log("Ready")
})

client.on('message',async (message)=>{
if(message.content==='.hello')
{
    message.reply("Welcome to DiscoCal Discord-Google Calender bot");
}
if(message.content==='.listallevents')
{

}
})