var db = new Mongo().getDB("issuetracker")

db.issues.remove({})
db.issues.insert([
    {
        status: "Open", owner: "Raven", created: new Date("2016-12-3"), 
        effort: 5, completionDate: undefined, 
        title: "Error to console when clicking Add"
    }, 
    {
        status: "Assigned", owner: "Eddie", created: new Date("2016-04-20"),
        effort: 14, completionDate: new Date("2016-05-12"), 
        title: "Missing bottom border on panel"
    }
])
db.issues.createIndex({status: 1})
db.issues.createIndex({owner: 1})
db.issues.createIndex({created: 1})
