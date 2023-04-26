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
function getHarvestByID(strHarvestID,callback){
    pool.query('SELECT * FROM tblHarvests WHERE HarvestID = ?',[strHarvestID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new Harvest(results[0].HarvestID,results[0].HarvestName,results[0].HarvestDate,results[0].HarvestTime,results[0].HarvestNotes,results[0].FarmID));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getPositionByEntryID(strEntryID,callback){
    pool.query('SELECT * FROM tblPositions WHERE EntryID = ?',[strEntryID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new Position(results[0].EntryID,results[0].HarvestID,results[0].PositionName,results[0].PositionQuantity,results[0].PositionUnitOfMeasure,results[0].PositionNotes));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getProductsByID(strProductID,callback){
    pool.query('SELECT * FROM tblProducts WHERE ProductID = ?',[strProductID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new Product(results[0].ProductID,results[0].ProductName,results[0].ProductQuantity,results[0].ProductUnitOfMeasure,results[0].ProductNotes));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getRawMaterialsByID(strRawMaterialID,callback){
    pool.query('SELECT * FROM tblRawMaterials WHERE RawMaterialID = ?',[strRawMaterialID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new RawMaterial(results[0].RawMaterialID,results[0].RawMaterialName,results[0].RawMaterialQuantity,results[0].RawMaterialUnitOfMeasure,results[0].RawMaterialNotes));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getTaskLogByID(strTaskLogID,callback){
    pool.query('SELECT * FROM tblTaskLogs WHERE TaskLogID = ?',[strTaskLogID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new TaskLog(results[0].TaskLogID,results[0].HarvestID,results[0].TaskLogName,results[0].TaskLogNotes));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getTasksByID(strTaskID,callback){
    pool.query('SELECT * FROM tblTasks WHERE TaskID = ?',[strTaskID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new Task(results[0].TaskID,results[0].TaskName,results[0].TaskNotes));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getUnitOfMeasureByAbbreviation(strAbbreviation,callback){
    pool.query('SELECT * FROM tblUnitOfMeasure WHERE Abbreviation = ?',[strAbbreviation], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new UnitOfMeasure(results[0].Abbreviation,results[0].UnitOfMeasureName));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}

function getUserByEmail(strEmail,callback){
    pool.query('SELECT * FROM tblUsers WHERE Email = ?',[strEmail], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new User(results[0].Email,results[0].FirstName,results[0].LastName,results[0].MobileNumber,null,results[0].IsOwner));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getUserByMobileNumber(strMobileNumber,callback){
    pool.query('SELECT * FROM tblUsers WHERE MobileNumber = ?',[strMobileNumber], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new User(results[0].Email,results[0].FirstName,results[0].LastName,results[0].MobileNumber,null,results[0].IsOwner));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getUserBySessionID(strSessionID,callback){
    pool.query('SELECT * FROM tblSessions LEFT JOIN tblUsers ON tblSessions.UserID = tblUsers.Email WHERE SessionID = ?',[strSessionID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new User(results[0].Email,results[0].FirstName,results[0].LastName,results[0].MobileNumber,null,results[0].IsOwner));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getUserByFarmID(strFarmID,callback){
    pool.query('SELECT tblUsers.* FROM tblFarmAssignment LEFT JOIN tblUsers ON tblFarmAssignment.User = tblUsers.Email WHERE FarmID = ?',[strFarmID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new User(results[0].Email,results[0].FirstName,results[0].LastName,results[0].MobileNumber,null,results[0].IsOwner));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getFarmBySessionID(strSessionID,callback){
    pool.query('SELECT * FROM tblSessions LEFT JOIN tblFarmAssignment ON tblSessions.UserID = tblFarmAssignment.User LEFT JOIN tblFarms ON tblFarmAssignment.FarmID = tblFarms.FarmID WHERE SessionID = ?',[strSessionID], function(error, results){
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
function getFarmAssignmentByUserID(strUserID,callback){
    pool.query('SELECT * FROM tblFarmAssignment WHERE User = ?',[strUserID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new FarmAssignment(results[0].FarmAssignmentID,results[0].User,results[0].Farm));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getFarmAssignmentByFarmID(strFarmID,callback){
    pool.query('SELECT * FROM tblFarmAssignment WHERE Farm = ?',[strFarmID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new FarmAssignment(results[0].FarmAssignmentID,results[0].User,results[0].Farm));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getFarmAssignmentByFarmIDAndUserID(strFarmID,strUserID,callback){
    pool.query('SELECT * FROM tblFarmAssignment WHERE Farm = ? AND User = ?',[strFarmID,strUserID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new FarmAssignment(results[0].FarmAssignmentID,results[0].User,results[0].Farm));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getSessionBySessionID(strSessionID,callback){
    pool.query('SELECT * FROM tblSessions WHERE SessionID = ?',[strSessionID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new Session(results[0].SessionID,results[0].UserID,results[0].StartDateTime,results[0].EndDateTime));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getSessionsByUserID(strUserID,callback){
    pool.query('SELECT * FROM tblSessions WHERE UserID = ?',[strUserID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(results);
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getHarvestsByHarvestID(strHarvestID,callback){
    pool.query('SELECT * FROM tblHarvests WHERE HarvestID = ?',[strHarvestID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new Harvest(results[0].HarvestID,results[0].FarmID,results[0].HarvestDate,results[0].HarvestWeight,results[0].HarvestType));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getHarvestsByFarmID(strFarmID,callback){
    pool.query('SELECT * FROM tblHarvests WHERE FarmID = ?',[strFarmID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(results);
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getHarvestsByHarvestDate(strHarvestDate,callback){
    pool.query('SELECT * FROM tblHarvests WHERE HarvestDate = ?',[strHarvestDate], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(results);
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getTasksByTaskID(strTaskID,callback){
    pool.query('SELECT * FROM tblTasks WHERE TaskID = ?',[strTaskID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new Task(results[0].TaskID,results[0].FarmID,results[0].TaskDate,results[0].TaskType,results[0].TaskDescription));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getTaskLogsByTaskLogID(strTaskLogID,callback){
    pool.query('SELECT * FROM tblTaskLogs WHERE TaskLogID = ?',[strTaskLogID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new TaskLog(results[0].TaskLogID,results[0].TaskID,results[0].TaskLogDate,results[0].TaskLogDescription));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getTaskLogsByEmail(strEmail,callback){
    pool.query('SELECT tblTaskLogs.* FROM tblFarmAssignment LEFT JOIN tblUsers ON tblFarmAssignment.User = tblUsers.Email LEFT JOIN tblTasks ON tblFarmAssignment.Farm = tblTasks.FarmID LEFT JOIN tblTaskLogs ON tblTasks.TaskID = tblTaskLogs.TaskID WHERE tblUsers.Email = ?',[strEmail], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(results);
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getTaskLogsByFarmID(strFarmID,callback){
    pool.query('SELECT tblTaskLogs.* FROM tblTasks LEFT JOIN tblTaskLogs ON tblTasks.TaskID = tblTaskLogs.TaskID WHERE tblTasks.FarmID = ?',[strFarmID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(results);
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getProdcutsByProductID(strProductID,callback){
    pool.query('SELECT * FROM tblProducts WHERE ProductID = ?',[strProductID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new Product(results[0].ProductID,results[0].ProductName,results[0].ProductDescription,results[0].ProductPrice));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getProductsByFarmID(strFarmID,callback){
    pool.query('SELECT * FROM tblProducts WHERE FarmID = ?',[strFarmID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(results);
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}
function getPositionByEntryID(strEntryID,callback){
    pool.query('SELECT * FROM tblPositions WHERE EntryID = ?',[strEntryID], function(error, results){
        if(!error){
            if(results.length > 0){
                callback(new Position(results[0].EntryID,results[0].PositionName,results[0].PositionDescription,results[0].PositionPrice));
            } else {
                callback(null);
            }
        } else {
          callback(null);
        }
    })
}