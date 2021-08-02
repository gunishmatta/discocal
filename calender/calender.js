const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { credentials, calendarId } = require('./config/keys')
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

async function authorize(credentials, messageObj) {

    const { clientSecret, clientId, redirectUrls } = credentials.installed

    const OAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrls[0])

    //check for previously stored token

    return new Promise((resolve, reject) => {
        fs.readFile(TOKEN_PATH, async (err, token) => {
            if (err) {
                getAccessUrl(OAuth2Client, messageObj)
            }
            else {
                OAuth2Client.setCredentials(JSON.parse(token))
                resolve(OAuth2Client)
            }
        })
    })


}


async function getAccessUrl(OAuth2Client, messageObj) {

    const authUrl = OAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    })

    messageObj.channel.send(`Authorize the App by visiting this url ${authUrl} \n Reply with  [.token-key (yourTokenKye)] to authenticate `)
    return
}

async function getAccessToken(code) {
    const { clientSecret, clientId, redirectUrls } = credentials.installed
    const OAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrls[0])

    return new Promise((resolve, reject) => {
        OAuth2Client.getToken(code, (error, token) => {
            if (error) reject(error)
            if (token == null) reject("Bad Auth Token")
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err)
                    reject(err)
                console.log("Token Stored to ", TOKEN_PATH)
            })
            resolve("Authenticated Successfully")
        })
    })

}



function listEvents(authClient) {
    const calender = google.calendar({
        version: 'v3',
        authClient
    })
    return new Promise((resolve, reject) => {
        calender.events.list({
            calendarId,
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        }, (err, res) => {
            if (err)
                reject(err)
            const events = res.data.items
            if (events.length) {
                let eventStr = "Upcoming 5 events: \n"
                events.map((event, index) => {
                    const start = event.start.dateTime || event.start.date
                    eventStr += `\n${i + 1}. ${event.summary} - ${start}        (id: ${event.id})`
                })
                resolve(eventStr)
            }
            else {
                resolve("No Upcoming Events Found")
            }
        }
        )
    })
}

function createEvent(auth,event)
{
    const calendar = google.calendar({version: 'v3', auth});
    return new Promise((resolve,reject)=>{
        calendar.events.insert({
            auth:auth,
            calendarId,
            resource:event
        },(error,newEvent)=>{
            if(error)
            reject(
                "Error connecting with Calender API"
            )
            resolve(`New Event Created : ${newEvent.data.htmlLink}`)
        })
    }) 
}

function deleteEvent(auth,id){
    const calender = google.calendar({version:'v3',auth})
    return new Promise((resolve,reject) =>{
        calender.events.delete({
            calendarId,
            eventId:id,
        },(error)=>{
if(error)
{
if(error)
reject("Error Connecting with Google Calender API")
}
resolve("Event Deleted ");

        })

    })
}

module.exports ={
    authorize,
    credentials,
    listEvents,
    createEvent,
    deleteEvent,
    getAccessToken
}