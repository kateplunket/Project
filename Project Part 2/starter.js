class Session {
    constructor(sessionID,startDate,userID){
        this.SessionID = sessionID,
        this.StartDate =startDate,
        this.UserID = userID
    }
}

let objSession = new Session('abcd1234','2023-04-20','akplunket43@tntech.edu');

objSession.SessionID