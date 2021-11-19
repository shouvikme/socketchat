module.exports = {


    /**
     * This function extracts the incoming message
     * 1) Check if the user has permission to send message
     * 2) Store in the database
     * 3) If everything is fine , send it back to the channel
     */
    handleIncomingMsg: function(msg)
    {
            console.log('Inside Helper :::: Received');
            console.log("Received :"+JSON.stringify(msg));
    }   


}