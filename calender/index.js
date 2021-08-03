const convertTime = require('convert-time')

const {authorize,getAccessToken,credentials,createEvent,deleteEvent,listEvents} = require('./calender')

let auth;

async function ListEvents(messageObj)
{
messageObj.channel.send("Listing all the Events")
if(!auth)
{
    try{
        auth = await authorize(credentials,messageObj)
    }
    catch(error)
    {
        return error;
    }
}
}

async function CreateEvent(event,messageObj)
{
    messageObj.channel.send("Creating new Event");
    if(!auth)
    {
        try{
            auth = await authorize(credentials, messageObj)
        }
        catch(error)
        {
            return error;
        }
    }

    
    try {
        return await createEvent(auth, event)
    } catch(e) {
        return e
    }

}

async function handleCreateEvent(contents,messageObj)
{
    eventObject = {
        date: "",
        time: "",
        endtime: "",
        name: ""
    }

    contents.forEach(string => {      
        if(string.startsWith("name:")) {
            eventObject.name = string.substring(5);
        }

        if(string.startsWith("date:")) {
            eventObject.date = string.substring(5);
        }

        if(string.startsWith("time:")) {
            let timePM = string.substring(5);
            let timeConverted = convertTime(timePM)

            eventObject.time = timeConverted
        }

        if(string.startsWith("endtime:")) {
            let timePM = string.substring(8);
            let timeConverted = convertTime(timePM)
            
            eventObject.endtime = timeConverted
        }
    });


    let dateSplitted = eventObject.date.split('/')
    let startTimeSplitted = eventObject.time.split(':')
    let endTimeSplitted = eventObject.endtime.split(':')

    let startDate = new Date(dateSplitted[2], dateSplitted[1] - 1, dateSplitted[0], startTimeSplitted[0], startTimeSplitted[1])
    let endDate = new Date(dateSplitted[2], dateSplitted[1] - 1, dateSplitted[0], endTimeSplitted[0], endTimeSplitted[1])


    let eventDetails = {
        description: eventObject.name,
        summary: eventObject.name,
        start: {
            dateTime: startDate
        },
        end: {
            dateTime: endDate
        }
    }

    try {
        return await CreateEvent(eventDetails, messageObj)
    } catch (error){
        return error
    }



}