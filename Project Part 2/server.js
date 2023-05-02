// My table structure was created in MySql workbench with these scripts (see below)
/*
CREATE TABLE tblSessions (
    SessionID varchar(80),
    UserID varchar(250),
    StartDateTime datetime,
    FOREIGN KEY (UserID) REFERENCES tblUsers(Email),
    CONSTRAINT PK_Sessions PRIMARY KEY (SessionID)
);

CREATE TABLE tblUsers (
	FirstName varchar(50) NOT NULL,
	LastName varchar(75) NOT NULL,
	Email varchar(250),
	MobileNumber varchar(12) NOT NUll,
	CONSTRAINT PK_Users PRIMARY KEY (Email)
);

CREATE TABLE tblFarms (
	FarmID varchar(80),
	FarmName varchar(250),
	StreetAddress1 varchar(100),
	StreetAddress2 varchar(100),
	City varchar(100),
	State varchar(2),
	ZIP varchar(5),
	CONSTRAINT PK_Farms PRIMARY KEY (FarmID)
);

CREAT TABLE tblTasks (
	TaskID varchar(80),
	TaskName varchar(100),
	Notes varchar(65535),
	Status varchar(10),
	CONSTRAINT PK_Tasks PRIMARY KEY (TaskID)
);

CREATE TABLE tblProducts (
	ProductID varchar(80),
	ShortName varchar(100),
	LongName varchar(250),
	Description varchar(65535),
	Status varchar(10),
	FarmID varchar(80),
	FOREIGN KEY (FarmID) REFERENCES tblFarms(FarmID),
	CONSTRAINT PK_Products PRIMARY KEY (ProductID)
);

CREATE TABLE tblHarvests (
	HarvestID varchar(80),
	Product varchar(80),
	User varchar(250),
	HarvestDateTime datetime,
	Quantity DECIMAL(9,2),
	UnitOfMeasure varchar(80),
	FarmID varchar(80),
	FOREIGN KEY (FarmID) REFERENCES tblFarms(FarmID),
	CONSTRAINT PK_Harvest PRIMARY KEY (HarvestID),
	FOREIGN KEY (User) REFERENCES tblUsers(Email),
	FOREIGN KEY (Product) REFERENCES tblProducts(ProductID),
	FOREIGN KEY (UnitOfMeasure) REFERENCES tblUnitOfMeasure(Abbreviation)
);

CREATE TABLE tblTaskLog (
	TaskLogID varchar(80),
	Task varchar(80),
	User varchar(250),
	LogDateTime datetime,
	Minutes DECIMAL(9,2),
	FarmID varchar(80),
	FOREIGN KEY (FarmID) REFERENCES tblFarms(FarmID),
	CONSTRAINT PK_TaskLog PRIMARY KEY (TaskLogID),
	FOREIGN KEY (User) REFERENCES tblUsers(Email)
);

CREATE TABLE tblPosition (
	EntryID varchar(80),
	User varchar(250),
	Title varchar(100),
	PayRate DECIMAL(6,2),
	EffectiveDateTime datetime,
	FarmID varchar(80),
	FOREIGN KEY (FarmID) REFERENCES tblFarms(FarmID),
	CONSTRAINT PK_Position PRIMARY KEY (EntryID),
	FOREIGN KEY (User) REFERENCES tblUsers(Email)
);

CREATE TABLE tblRawMaterials (
	MaterialID varchar(80,
	Description varchar(200),
	RelatedProduct varchar(80),
	RecordedByUser varchar(250),
	RecordedDateTime datetime,
	Quantity DECIMAL (9,2),
	UnitOfMeasure varchar(80),
	Cost DECIMAL (9,2),
	FarmID varchar(80),
	FOREIGN KEY (FarmID) REFERENCES tblFarms(FarmID),
	CONSTRAINT PK_RawMaterials PRIMARY KEY (MaterialID),
	FOREIGN KEY (RecordedByUser) REFERENCES tblUsers(Email),
	FOREIGN KEY (RelatedProduct) REFERENCES tblProducts(ProductID),
	FOREIGN KEY (UnitOfMeasure) REFERENCES tblUnitOfMeasure(Abbreviation)
);

CREATE TABLE tblUnitOfMeasure (
	Abbreviation varchar(3),
	Description varchar(200),
	FarmID varchar(80),
	FOREIGN KEY (FarmID) REFERENCES tblFarms(FarmID),
	Status varchar(10)
);

CREATE TABLE tblFarmAssignment (
	AssignmentID varchar(80),
	FarmID varchar(80),
	User varchar(250),
	IsOwner BOOLEAN,
	CONSTRAINT PK_FarmAssignment PRIMARY KEY (AssignmentID),
	FOREIGN KEY (User) REFERENCES tblUsers(Email),
	FOREIGN KEY (FarmID) REFERENCES tblFarms(FarmID)
);
*/

// Step One
const mysql = require('mysql');
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pool = mysql.createPool({
    host: 'localhost',
    user:'root',
    password:'Mickey2023!',
    database:'SwollenFarm'
});
const HTTP_PORT = 8000;
// Create Custom Classes
class Session {
    constructor(strSessionID,objUser,datStartDateTime,datLastUsedDateTime) {
        this.SessionID = strSessionID;
        this.User = objUser;
        this.StartDateTime = datStartDateTime;
        this.LastUsedDateTime = datLastUsedDateTime;
    }
}
class User {
    constructor(strEmail,strFirstName,strLastName,strMobileNumber,objFarm,blnOwner){
        this.Email = strEmail;
        this.FirstName = strFirstName;
        this.LastName = strLastName;
        this.MobileNumber = strMobileNumber;
        this.Farm = objFarm;
        this.FarmOwner = blnOwner;
    }
}
class Task {
    constructor(strTaskID,strTaskName,strNotes,strStatus){
        this.TaskID = strTaskID;
        this.TaskName = strTaskName;
        this.Notes = strNotes;
        this.Status = strStatus;
    }
}
class TaskLog {
    constructor(strTaskLogID,objTask,objUser,datLogDateTime,decMinutes){
        this.TaskLogID = strTaskLogID;
        this.Task = objTask;
        this.User = objUser;
        this.LogDateTime = datLogDateTime;
        this.Minutes = decMinutes;
    }
}
class Position {
    constructor(strEntryID,objUser,strTitle,decPayRate,datEffectiveDateTime){
        this.EntryID = strEntryID;
        this.User = objUser;
        this.Title = strTitle;
        this.PayRate = decPayRate;
        this.EffectiveDateTime = datEffectiveDateTime;
    }
}
class RawMaterial {
    constructor(strMaterialID,strDescription,objProduct,objUser,datRecordedDateTime,decQuantity,objUnitOfMeasure,decCost){
        this.MaterialID = strMaterialID;
        this.Description = strDescription;
        this.RelatedProduct = objProduct;
        this.RecordedByUser = objUser;
        this.RecordedDateTime = datRecordedDateTime;
        this.Quantity = decQuantity;
        this.UnitOfMeasure = objUnitOfMeasure;
        this.Cost = decCost;
    }
}
class UnitOfMeasure {
    constructor(strAbbreviation,strDescription){
        this.Abbreviation = strAbbreviation;
        this.Description = strDescription;
    }
}
class FarmAssignment {
    constructor(strAssignmentID,objFarm,objUser,blnIsOwner){
        this.AssignmentID = strAssignmentID;
        this.Farm = objFarm;
        this.User = objUser;
        this.IsOwner = blnIsOwner;
    }
}
class Harvest {
    constructor(strHarvestID,objProduct,datHarvestDate,decQuantity){
        this.HarvestID = strHarvestID;
        this.Product = objProduct;
        this.HarvestDate = datHarvestDate;
        this.Quantity = decQuantity;
    }
}
class Farm {
    constructor(strFarmID,strFarmName,strStreetAddress1,strStreetAddress2,strCity,strState,strZIP) {
        this.FarmID = strFarmID;
        this.FarmName = strFarmName;
        this.StreetAddress1 = strStreetAddress1;
        this.StreetAddress2 = strStreetAddress2;
        this.City = strCity;
        this.State = strState;
        this.ZIPCode = strZIP;
    }
}
class Product {
    constructor(strProductID,strShortName,strLongName,strDescription,strStatus,objFarm){
        this.ProductID = strProductID;
        this.ShortName = strShortName;
        this.LongName = strLongName;
        this.Description = strDescription;
        this.Status = strStatus;
        this.Farm = objFarm;
    }
}
class Message {
    constructor(strType,strMessage){
        this.Type = strType;
        this.Message = strMessage;
    }
}
// End Step One
//Step Two
var app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
// End Step Two
// Step Three
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
app.listen(HTTP_PORT, () => {
    console.log("Server is listening on port " + HTTP_PORT);
});
//End Step Three
// Step Four Users
app.post("/users", (req,res,next) => {
    let strFirstName = req.query.firstname || req.body.firstname;
    let strLastName = req.query.lastname || req.body.lastname;
    let strPreferredName = req.query.preferredname || req.body.preferredname;
    let strEmail = req.query.email || req.body.email;
    let strPassword = req.query.password || req.body.password;
    // call the hash method of bcrypt against the password to encrypt and store with a salt
    // notice the use of .then as a promise due to it being async
    bcrypt.hash(strPassword, 10).then(hash => {
        pool.query('INSERT INTO tblUsers VALUES(?, ?, ?, ?, ?,SYSDATE())',[strEmail, strFirstName, strLastName, strPreferredName, hash], function(error, results){
            if(!error){
                let strSession = uuidv4();
                pool.query('INSERT INTO tblSessions VALUES(?, ?, ?, ?, ?,SYSDATE())',[strEmail, strFirstName, strLastName, strPreferredName, hash], function(error, results){
                    if(!error){
                        let objMessage = new Message("SessionID",strSession);
                        res.status(201).send(objMessage);
                    } else {
                        let objMessage = new Message("Error",error);
                        res.status(400).send(objMessage);
                    }
                })
            } else {
                let objMessage = new Message("Error",error);
                res.status(400).send(objMessage);
            }
        })
    })
})

// using express and node.js, create a route for sessions that takes email and password and inserts a record to the tblSessions table

app.post("/sessions", (req,res,next) => {
    let strEmail = req.query.email || req.body.email;
    let strPassword = req.query.password || req.body.password;
    pool.query('SELECT * FROM tblUsers WHERE Email = ?',[strEmail], function(error, results){
        if(!error){
            if(results.length > 0){
                bcrypt.compare(strPassword, results[0].Password).then(match => {
                    if(match){
                        let strSession = uuidv4();
                        pool.query('INSERT INTO tblSessions VALUES(?, ?, ?, ?, ?,SYSDATE())',[results[0].Email, results[0].FirstName, results[0].LastName, results[0].PreferredName, strSession], function(error, results){
                            if(!error){
                                let objMessage = new Message("SessionID",strSession);
                                res.status(201).send(objMessage);
                            } else {
                                let objMessage = new Message("Error",error);
                                res.status(400).send(objMessage);
                            }
                        })
                    } else {
                        let objMessage = new Message("Error","Invalid Password");
                        res.status(400).send(objMessage);
                    }   
                })
            } else {
                let objMessage = new Message("Error","Invalid Email");
                res.status(400).send(objMessage);
            }
        } else {
            let objMessage = new Message("Error",error);
            res.status(400).send(objMessage);
        }
    })
})
// End Step Four Users

app.post("/farms", (req,res,next) => {
    let strStreetAddress1 = req.query.streetaddress1 || req.body.streetaddress1;
    let strStreetAddress2 = req.query.streetaddress2 || req.body.streetaddress2;
    let strCity = req.query.city || req.body.city;
    let strState = req.query.state || req.body.state;
    let strZIP = req.query.zip || req.body.zip;
    let strFarmID = uuidv4();
    let strFarmName = req.query.farmname || req.body.farmname;
    let strFirstName = req.query.firstname || req.body.firstname;
    let strLastName = req.query.lastname || req.body.lastname;
    let strPreferredName = req.query.preferredname || req.body.preferredname;
    let strEmail = req.query.email || req.body.email;
    let strPassword = req.query.password || req.body.password;
    let strSession = uuidv4();
    let strAssignmentID = uuidv4();

    pool.query('INSERT INTO tblFarms VALUES(?, ?, ?, ?, ?,?,?)',[strFarmID, strFarmName, strStreetAddress1, strStreetAddress2, strCity,strState,strZIP], function(error, results){
        if(!error){
            bcrypt.hash(strPassword, 10).then(hash => {
                strPassword = hash;
                pool.query('INSERT INTO tblUsers VALUES(?, ?, ?, ?, ?,SYSDATE())',[strEmail, strFirstName, strLastName, strPreferredName, strPassword], function(error, results){
                    if(!error){
                        pool.query('INSERT INTO tblFarmAssignment VALUES(?, ?, true, ?)',[strAssignmentID, strFarmID, strEmail], function(error, results){
                            if(!error){
                                pool.query('INSERT INTO tblSesisons VALUES(?,SYSDATE(),?)',[strSession, strEmail], function(error, results){
                                    if(!error){
                                        let objMessage = new Message("SessionID",strSession);
                                        res.status(201).send(objMessage);
                                    } else {
                                        let objMessage = new Message("Error",error);
                                        res.status(400).send(objMessage);
                                    }
                                })
                            } else {
                                let objMessage = new Message("Error",error);
                                res.status(400).send(objMessage);
                            }
                        })
                    } else {
                        let objMessage = new Message("Error",error);
                        res.status(400).send(objMessage);
                    }
                })
            })
        } else {
            let objMessage = new Message("Error",error);
            res.status(400).send(objMessage);
        }
    })
})
app.post("/products",(req,res,next)=> {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strProductID = uuidv4();
    let strShortName = req.query.shortname || req.body.shortname;
    let strLongName = req.query.longname || req.body.longname;
    let strDescription = req.query.description || req.body.description;
    getSessionDetails(strSessionID,function(objSession){
        if(objSession){
            pool.query("INSERT INTO tblProducts VALUES(?, ?, ?, ?, 'ACTIVE',?)",[strProductID,strShortName,strLongName,strDescription,objSession.Farm.FarmID], function(error, results){
                if(!error){
                    let objMessage = new Message("ProductID",strProductID);
                    res.status(201).send(objMessage);
                } else {
                    let objMessage = new Message("Error",error);
                    res.status(400).send(objMessage);
                }
            })
        } else {
            let objError = new Message("Error","Bad Session");
            res.status(401).send(objError);
        }
        
    })
    
})
app.post("/rawmaterials",(req,res,next)=> {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strMaterialID = uuidv4();
    let strRelatedProduct = req.query.shortname || req.body.shortname;
    let strQuantity = req.query.longname || req.body.longname;
    let strUnitOfMeasure = req.query.description || req.body.description;
    let strCost = req.query.description || req.body.description;
    getSessionDetails(strSessionID,function(objSession){
        if(objSession){
            pool.query("INSERT INTO tblRawMaterials VALUES(?, ?, ?, ?,GETDATE(),?,?,?,?)",[strMaterialID,strDescription,strRelatedProduct,objSession.Email,strQuantity,strUnitOfMeasure,strCost,objSession.Farm.FarmID], function(error, results){
                if(!error){
                    let objMessage = new Message("MaterialID",strMaterialID);
                    res.status(201).send(objMessage);
                } else {
                    let objMessage = new Message("Error",error);
                    res.status(400).send(objMessage);
                }
            })
        } else {
            let objError = new Message("Error","Bad Session");
            res.status(401).send(objError);
        }
        
    })
})
app.post("/tasklog",(req,res,next)=> {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strTaskLogID = uuidv4();
    let strTask = req.query.task || req.body.task;
    
    getSessionDetails(strSessionID,function(objSession){
        if(objSession){
            pool.query("INSERT INTO tblTaskLog VALUES(?,?,?,GETDATE(),NULL,?)",[strTaskLogID,strTask,objSession.Email,objSession.Farm.FarmID], function(error, results){
                if(!error){
                    let objMessage = new Message("TaskLogID",strTaskLogID);
                    res.status(201).send(objMessage);
                } else {
                    let objMessage = new Message("Error",error);
                    res.status(400).send(objMessage);
                }
            })
        } else {
            let objError = new Message("Error","Bad Session");
            res.status(401).send(objError);
        }
        
    })
})
app.post("/harvests",(req,res,next)=> {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strHarvestID = uuidv4();
    let strProduct = req.query.task || req.body.task;
    let strQuantity = req.query.quantity || req.body.quantity;
    let strUnitOfMeasure = req.query.unitofmeasure || req.body.unitofmeasure;
    
    getSessionDetails(strSessionID,function(objSession){
        if(objSession){
            pool.query("INSERT INTO tblHarvests VALUES(?,?,?,GETDATE(),?,?,?)",[strHarvestID,strProduct,objSession.Email,strQuantity,strUnitOfMeasure,objSession.Farm.FarmID], function(error, results){
                if(!error){
                    let objMessage = new Message("HarvestID",strHarvestID);
                    res.status(201).send(objMessage);
                } else {
                    let objMessage = new Message("Error",error);
                    res.status(400).send(objMessage);
                }
            })
        } else {
            let objError = new Message("Error","Bad Session");
            res.status(401).send(objError);
        }
        
    })
})
app.post("/farmassignment",(req,res,next)=> {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strAssignmentID = uuidv4();
    let strUser = req.query.user || req.body.user;
    getSessionDetails(strSessionID,function(objSession){
        if(objSession){
            if(objSession.User.FarmOwner == true){
                pool.query("INSERT INTO tblFarmAssignment VALUES(?,?,false,?)",[strAssignmentID,objSession.User.Farm.FarmID,strUser], function(error, results){
                    if(!error){
                        let objMessage = new Message("AssignmentID",strAssignmentID);
                        res.status(201).send(objMessage);
                    } else {
                        let objMessage = new Message("Error",error);
                        res.status(400).send(objMessage);
                    }
                })
            } else {
                let objError = new Message("Error","Function limited to farm owner");
            res.status(401).send(objError);
            }
            
        } else {
            let objError = new Message("Error","Bad Session");
            res.status(401).send(objError);
        }
        
    })
    
})
app.post("/position",(req,res,next)=> {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strEntry = uuidv4();
    let strUser = req.query.user || req.body.user;
    let strTitle = req.query.title || req.body.title;
    let strPayRate = req.query.payrate || req.body.payrate;
    let strEffectiveDate = req.query.effectivedate || req.body.effectivedate;
    getSessionDetails(strSessionID,function(objSession){
        if(objSession){
            pool.query("INSERT INTO tblPosition VALUES(?, ?, ?, ?, ?, ?)",[strEntry,strUser,strTitle,strPayRate,strEffectiveDate,objSession.Farm.FarmID], function(error, results){
                if(!error){
                    let objMessage = new Message("PositionID",strEntry);
                    res.status(201).send(objMessage);
                } else {
                    let objMessage = new Message("Error",error);
                    res.status(400).send(objMessage);
                }
            })
        } else {
            let objError = new Message("Error","Bad Session");
            res.status(401).send(objError);
        }
        
    })
    
})
app.post("/tasks",(req,res,next)=> {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strTaskID = uuidv4();
    let strTaskName = req.query.taskname || req.body.taskname;
    getSessionDetails(strSessionID,function(objSession){
        if(objSession){
            pool.query("INSERT INTO tblTasks VALUES(?, ?, ?)",[strTaskID,strTaskName,objSession.Farm.FarmID], function(error, results){
                if(!error){
                    let objMessage = new Message("TaskID",strTaskID);
                    res.status(201).send(objMessage);
                } else {
                    let objMessage = new Message("Error",error);
                    res.status(400).send(objMessage);
                }
            })
        } else {
            let objError = new Message("Error","Bad Session");
            res.status(401).send(objError);
        }
        
    })
})    
app.post("/unitofmeasure",(req,res,next)=> {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strAbbreviation = req.query.abbreviation || req.body.abbreviation;
    let strDescription = req.query.description || req.body.description;
    
    getSessionDetails(strSessionID,function(objSession){
        if(objSession){
            pool.query("INSERT INTO tblUnitOfMeasure VALUES(?,?,'ACTIVE',?)",[strAbbreviation,strDescription,objSession.User.Farm.FarmID], function(error, results){
                if(!error){
                    let objMessage = new Message("Success","Unit Of Measure Added");
                    res.status(201).send(objMessage);
                } else {
                    let objMessage = new Message("Error",error);
                    res.status(400).send(objMessage);
                }
            })
        } else {
            let objError = new Message("Error","Bad Session");
            res.status(401).send(objError);
        }
        
    })
})
app.post('/sessions', (req,res,next) => {
    let strSessionID = uuidv4();
    let strUser = req.query.user || req.body.user;
    let strStartDateTime = req.query.startdatetime || req.body.startdatetime;
    getSessionDetails(strSessionID,function(objSession){
        if(objSession){
            pool.query("INSERT INTO tblSessions VALUES(?, ?, ?, ?)",[strSessionID,strUser,strStartDateTime,objSession.Farm.FarmID], function(error, results){
                if(!error){
                    let objMessage = new Message("SessionID",strSessionID);
                    res.status(201).send(objMessage);
                } else {
                    let objMessage = new Message("Error",error);
                    res.status(400).send(objMessage);
                }
            })
        } else {
            let objError = new Message("Error","Bad Session");
            res.status(401).send(objError);
        }
        
    })
})

app.get("/tasks", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("SELECT * FROM tblTasks WHERE FarmID = ?",objSession.Farm.FarmID, function(error,results){
            if(!error){
                res.status(200).send(results)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.get("/unitofmeasure", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("SELECT * FROM tblUnitOfMeasure WHERE FarmID = ?",objSession.Farm.FarmID, function(error,results){
            if(!error){
                res.status(200).send(results)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.get("/harvests", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("SELECT * FROM tblHarvests WHERE FarmID = ?",objSession.Farm.FarmID, function(error,results){
            if(!error){
                res.status(200).send(results)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.get("/position", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("SELECT * FROM tblPositions WHERE FarmID = ?",objSession.Farm.FarmID, function(error,results){
            if(!error){
                res.status(200).send(results)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.get("/farmassignment", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("SELECT * FROM tblFarmAssignment WHERE FarmID = ?",objSession.Farm.FarmID, function(error,results){
            if(!error){
                res.status(200).send(results)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.get("/farms", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("SELECT * FROM tblFarm WHERE FarmID = ?",objSession.Farm.FarmID, function(error,results){
            if(!error){
                res.status(200).send(results)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.get("/users", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("SELECT * FROM tblUsers WHERE FarmID = ?",objSession.Farm.FarmID, function(error,results){
            if(!error){
                res.status(200).send(results)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.get("/sessions", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
            pool.query("SELECT * FROM tblSessions WHERE UserID = ?",objSession.User.UserID, function(error,results){
                if(!error){
                    res.status(200).send(results)
                } else {
                    let objError = new Message("Error",error);
                    res.status(400).send(objError);
                }
                
            })
    })
})
app.get("/products", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("SELECT * FROM tblProducts WHERE FarmID = ?",objSession.Farm.FarmID, function(error,results){
            if(!error){
                res.status(200).send(results)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.get("/rawmaterials", (req,res,next)=>{
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("SELECT * FROM tblRawMaterials WHERE FarmID = ?",objSession.Farm.FarmID, function(error,results){
            if(!error){
                res.status(200).send(results);
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
        })
    })
})
app.get("/tasklog", (req,res,next)=>{
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("SELECT * FROM tblTaskLogs WHERE FarmID = ?",objSession.Farm.FarmID, function(error,results){
            if(!error){
                res.status(200).send(results);
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
        })
    })
})
app.get("/test", (req,res,next)=>{
    let strFarmID = req.query.farmid || req.body.farmid;
    console.log(strFarmID);
    getFarmByID(strFarmID,function(objFarm){
        if(objFarm){
            res.status(200).send(objFarm);
        } else {
            let objError = new Message("Error","Farm Does Not Exist");
            res.status(400).send(objError);
        }
        
    })
})

app.put("/products", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strProductID = req.query.productid || req.body.productid;
    let strShortName = req.query.shortname || req.body.shortname;
    let strLongName = req.query.longname || req.body.longname;
    let strDescription = req.query.description || req.body.description;
    let strStatus = req.query.status || req.body.status;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("UPDATE tblProducts SET ShortName = ?, LongName = ?, Description = ?, Status = ? WHERE ProductID = ? AND FarmID = ?",[strShortName,strLongName,strDescription,strStatus,strProductID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Product Updated");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.put("/sessions", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strUserID = req.query.userid || req.body.userid;
    let strStatus = req.query.status || req.body.status;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("UPDATE tblSessions SET Status = ? WHERE SessionID = ? AND UserID = ?",[strStatus,strSessionID,strUserID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Session Updated");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })

})
app.put("/rawmaterials", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strMaterialID = req.query.materialid || req.body.materialid;
    let strDescription = req.query.description || req.body.description;
    let strRelatedProduct = req.query.relatedproduct || req.body.relatedproduct;
    let strRecordedByUser = req.query.recordedbyuser || req.body.recordedbyuser;
    let strRecordedDateTime = req.query.recordeddatetime || req.body.recordeddatetime;
    let strQuantity = req.query.quantity || req.body.quantity;
    let strUnitOfMeasure = req.query.unitofmeasure || req.body.unitofmeasure;
    let strCost = req.query.cost || req.body.cost;
    let strStatus = req.query.status || req.body.status;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("UPDATE tblRawMaterials SET Description = ?, RelatedProduct = ?, RecordedByUser = ?, RecordedDateTime = ?, Quantity = ?, UnitOfMeasure = ?, Cost = ?, Status = ? WHERE MaterialID = ? AND FarmID = ?",[strDescription,strRelatedProduct,strRecordedByUser,strRecordedDateTime,strQuantity,strUnitOfMeasure,strCost,strStatus,strMaterialID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Raw Material Updated");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.put("/tasklog", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strTaskLogID = req.query.tasklogid || req.body.tasklogid;
    let strTaskID = req.query.taskid || req.body.taskid;
    let strUser = req.query.user || req.body.user;
    let strLogDateTime = req.query.logdatetime || req.body.logdatetime;
    let strMinutes = req.query.minutes || req.body.minutes;
    let strStatus = req.query.status || req.body.status;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("UPDATE tblTaskLogs SET TaskID = ?, User = ?, LogDateTime = ?, Minutes = ?, Status = ? WHERE TaskLogID = ? AND FarmID = ?",[strTaskID,strUser,strLogDateTime,strMinutes,strStatus,strTaskLogID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Task Log Updated");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.put("/tasks", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strTaskID = req.query.taskid || req.body.taskid;
    let strNotes = req.query.notes || req.body.notes;
    let strStatus = req.query.status || req.body.status;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("UPDATE tblTasks SET Notes = ?, Status = ? WHERE TaskID = ? AND FarmID = ?",[strNotes,strStatus,strTaskID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Task Updated");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.put("/users", (req,res,next) => {
    let strSessionID = req.queryl.sessionid || req.body.sesisonid;
    let strFirstName = req.query.firstname || req.body.firstname;
    let strLastName = req.query.lastname || req.body.lastname;
    let strMobileNumber = req.query.mobilenumber || req.body.mobilenumber;
    // call the hash method of bcrypt against the password to encrypt and store with a salt
    // notice the use of .then as a promise due to it being async
    getSessionDetails(strSessionID,function(objSession){
        if(objSession){
            pool.query('UPDATE tblUsers SET FirstName = ?, LastName = ?, MobileNumber = ? WHERE Email = ?)',[strFirstName, strLastName, strMobileNumber, objSession.User.Email], function(error, results){
                if(!error){
                    let objMessage = new Message("Success","User Updated");
                    res.status(201).send(objMessage);
                } else {
                    let objMessage = new Message("Error",error);
                    res.status(400).send(objMessage);
                }
            })
        } else {
            let objError = new Message("Error","Bad Session");
            res.status(401).send(objError);
        }
    })
})
app.put("/userpassword", (req,res,next) => {
    let strSessionID = req.queryl.sessionid || req.body.sesisonid;

    let strPassword = req.query.password || req.body.password;
    // call the hash method of bcrypt against the password to encrypt and store with a salt
    // notice the use of .then as a promise due to it being async
    bcrypt.hash(strPassword, 10).then(hash => {
        strPassword = hash;
        getSessionDetails(strSessionID,function(objSession){
            if(objSession){
                pool.query('UPDATE tblUsers SET Password = ? WHERE Email = ?)',[strPassword, objSession.User.Email], function(error, results){
                    if(!error){
                        let objMessage = new Message("Success","User Password Updated");
                        res.status(201).send(objMessage);
                    } else {
                        let objMessage = new Message("Error",error);
                        res.status(400).send(objMessage);
                    }
                })
            } else {
                let objError = new Message("Error","Bad Session");
                res.status(401).send(objError);
            }
        })
    })
})
app.put("/farms", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strFarmName = req.query.farmname || req.body.farmname;
    let strStreetAddress1 = req.query.streetaddress1 || req.body.streetaddress1;
    let strStreetAddress2 = req.query.streetaddress2 || req.body.streetaddress2;
    let strCity = req.query.city || req.body.city;
    let strState = req.query.state || req.body.state;
    let strZip = req.query.zip || req.body.zip;
    let strStatus = req.query.status || req.body.status;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("UPDATE tblFarms SET FarmName = ?, StreetAddress1 = ?, StreetAddress2 = ?, City = ?, State = ?, Zip = ?, Status = ? WHERE FarmID = ?",[strFarmName,strStreetAddress1,strStreetAddress2,strCity,strState,strZip,strStatus,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Farm Updated");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.put("/harvests", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strHarvestID = req.query.harvestid || req.body.harvestid;
    let strProduct = req.query.product || req.body.product;
    let strUser = req.query.user || req.body.user;
    let strHarvestDateTime = req.query.harvestdatetime || req.body.harvestdatetime;
    let strQuantity = req.query.quantity || req.body.quantity;
    let strUnitOfMeasure = req.query.unitofmeasure || req.body.unitofmeasure;
    let strStatus = req.query.status || req.body.status;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("UPDATE tblHarvests SET Product = ?, User = ?, HarvestDateTime = ?, Quantity = ?, UnitOfMeasure = ?, Status = ? WHERE HarvestID = ? AND FarmID = ?",[strProduct,strUser,strHarvestDateTime,strQuantity,strUnitOfMeasure,strStatus,strHarvestID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Harvest Updated");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.put("/position", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strEntryID = req.query.entryid || req.body.entryid;
    let strTitle = req.query.title || req.body.title;
    let strPayRate = req.query.payrate || req.body.payrate;
    let strEffectiveDateTime = req.query.effectivedatetime || req.body.effectivedatetime;
    let strStatus = req.query.status || req.body.status;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("UPDATE tblPositions SET Title = ?, PayRate = ?, EffectiveDateTime = ?, Status = ? WHERE EntryID = ? AND FarmID = ?",[strTitle,strPayRate,strEffectiveDateTime,strStatus,strEntryID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Position Updated");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.put("/unitofmeasure", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strAbbreviation = req.query.abbreviation || req.body.abbreviation;
    let strDescription = req.query.description || req.body.description;
    let strStatus = req.query.status || req.body.status;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("UPDATE tblUnitOfMeasure SET Description = ?, Status = ? WHERE Abbreviation = ? AND FarmID = ?",[strDescription,strStatus,strAbbreviation,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Unit of Measure Updated");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.put("/farmassignment", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strAssignmentID = req.query.assignmentid || req.body.assignmentid;
    let strUser = req.query.user || req.body.user;
    let strStatus = req.query.status || req.body.status;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("UPDATE tblFarmAssignments SET User = ?, Status = ? WHERE AssignmentID = ? AND FarmID = ?",[strUser,strStatus,strAssignmentID,objSession.Farm.FarmID], function(error,results){
            if(IsOwner(objSession)){
                if(!error){
                    let objSuccess = new Message("Success","Farm Assignment Updated");
                    res.status(200).send(objSuccess)
                } else {
                    let objError = new Message("Error",error);
                    res.status(400).send(objError);
                }
            } else {
                let objError = new Message("Error","You are not authorized to perform this action");
                res.status(400).send(objError);
            }
        })
    })
})

app.delete("/products", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strProductID = req.query.productid || req.body.productid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("DELETE FROM tblProducts WHERE ProductID = ? AND FarmID = ?",[strProductID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Product Deleted");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.delete("/sessions", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("DELETE FROM tblSessions WHERE SessionID = ?",objSession.SessionID, function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Session Deleted");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.delete("/harvests", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strHarvestID = req.query.harvestid || req.body.harvestid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("DELETE FROM tblHarvests WHERE HarvestID = ? AND FarmID = ?",[strHarvestID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Harvest Deleted");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.delete("/positions", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strEntryID = req.query.entryid || req.body.entryid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("DELETE FROM tblPositions WHERE EntryID = ? AND FarmID = ?",[strEntryID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Position Deleted");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.delete("/unitofmeasure", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strAbbreviation = req.query.abbreviation || req.body.abbreviation;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("DELETE FROM tblUnitOfMeasure WHERE Abbreviation = ? AND FarmID = ?",[strAbbreviation,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Unit of Measure Deleted");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
            
        })
    })
})
app.delete("/farmassignment", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strAssignmentID = req.query.assignmentid || req.body.assignmentid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("DELETE FROM tblFarmAssignments WHERE AssignmentID = ? AND FarmID = ?",[strAssignmentID,objSession.User.Farm.FarmID], function(error,results){
            if(IsOwner(objSession)){
                if(!error){
                    let objSuccess = new Message("Success","Farm Assignment Deleted");
                    res.status(200).send(objSuccess)
                } else {
                    let objError = new Message("Error",error);
                    res.status(400).send(objError);
                }
            } else {
                let objError = new Message("Error","You are not authorized to perform this action");
                res.status(400).send(objError);
            }
            
        })
    })
})
app.delete("/farms", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("DELETE FROM tblFarms WHERE FarmID = ?",objSession.User.Farm.FarmID, function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Farm Deleted");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
        })
    })
})
app.delete("/users", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strEmail = req.query.email || req.body.email;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("DELETE FROM tblUsers WHERE Email = ?AND FarmID = ?",[strEmail,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","User Deleted");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
        })
    })
})
app.delete("/tasks", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strTaskID = req.query.taskid || req.body.taskid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("DELETE FROM tblTasks WHERE TaskID = ? AND FarmID = ?",[strTaskID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Task Deleted");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
        })
    })
})
app.delete("/tasklog", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strTaskLogID = req.query.tasklogid || req.body.tasklogid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("DELETE FROM tblTaskLog WHERE TaskLogID = ? AND FarmID = ?",[strTaskLogID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Task Log Deleted");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
        })
    })    
})
app.delete("/rawmaterials", (req,res,next) => {
    let strSessionID = req.query.sessionid || req.body.sessionid;
    let strMaterialID = req.query.materialid || req.body.materialid;
    getSessionDetails(strSessionID,function(objSession){
        pool.query("DELETE FROM tblRawMaterials WHERE MaterialID = ? AND FarmID = ?",[strMaterialID,objSession.Farm.FarmID], function(error,results){
            if(!error){
                let objSuccess = new Message("Success","Raw Material Deleted");
                res.status(200).send(objSuccess)
            } else {
                let objError = new Message("Error",error);
                res.status(400).send(objError);
            }
        })
    })
})

// End Step Four

// Step Five
function getSessionDetails(strSessionID,callback){
    pool.query('SELECT * FROM tblSessions LEFT JOIN tblUsers ON tblSessions.UserID = tblUsers.Email LEFT JOIN tblFarmAssignment ON tblSessions.UserID = tblFarmAssignment.User WHERE SessionID = ?',[strSessionID], function(error, results){
        if(!error){
            let objFarm;
            getFarmByID(strFarmID,function(objReturnedFarm){
                objFarm = objReturnedFarm;
                let objUser = new User(results[0].Email,results[0].FirstName,results[0].LastName,results[0].MobileNumber,objFarm,results[0].IsOwner);
                let objSession = new Session(results[0].SessionID,objUser,results[0].StartDateTime,null);
                return objSession;
            })
            
        } else {
          return null;
        }
    })
}

// Example function using the async pool.query with a callback
function getFarmByID(strFarmID,callback){
    pool.query('SELECT * FROM tblFarms WHERE FarmID = ?',[strFarmID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new Farm(results[0].FarmID,results[0].FarmName,results[0].StreetAddress1,results[0].StreetAddress2,results[0].City,results[0].State,results[0].ZIP));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getFarmByUserID(strUserID,callback){
    pool.query('SELECT tblFarms.* FROM tblFarmAssignment LEFT JOIN tblFarm ON tblFarmAssignment.FarmID = tblFarm.FarmID WHERE User = ?',[strUserID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new Farm(results[0].FarmID,results[0].FarmName,results[0].StreetAddress1,results[0].StreetAddress2,results[0].City,results[0].State,results[0].ZIP));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getUserBySessionID(strSessionID,callback){
    pool.query('SELECT * FROM tblUsers LEFT JOIN tblFarmAssignments ON tblUsers.Email = tblFarmAssingments.User LEFT JOIN tblFarms ON tblFarmAssignments.FarmID = tblFarms.FarmID WHERE Email = (SELECT UserID FROM tblSessions WHERE SessionID = ?',[strSessionID], function(error, results){
        if(!error){
            if(results.length > 0){
                console.log(results);
                callback(new User(results[0].Email,results[0].FirstName,results[0].LastName,results[0].MobileNumber,null,null));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
// End Step Five
