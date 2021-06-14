const filename = "./users.json";
const express = require("express");
const fs = require("fs");
const path = require('path');

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (request, response) => {
    response.render('index', {
        title: 'My title from the server',
        headerMessage: 'My header from server',
        partialText: ' is entertaining!',
        users: 
        [
        {
        username: 'Brent', 
        email: 'brent@example.com'
        },
        {
        username: 'Raymond', 
        email: 'raymond@example.com'
        },
        {
        username: 'Knudsen', 
        email: 'knudsen@example.com'
        }
    ],
    date: new Date()
    });
});
app.post("/userlist", (request, response) => {
    console.log(request.body);
    saveToFile(request.body, () => {
        const users = getJsonContents()
        response.render("userlist", {users})
    }
    );
   
    
    
})

app.use('/frontendjs', express.static('frontendjs'));

app.listen(3000, () => {
    console.log("Express app is running on port 3000");
});

app.delete('/deleteuser', (request, response) => {
    const users = getJsonContents();
    const userIdToDelete = request.body.userIdToDelete;
    const newUsers = users.filter((userItem) => userItem.userid !== userIdToDelete);
    const message = JSON.stringify(newUsers);
    fs.writeFileSync(filename, message);
    response.send('deleted userid ' + userIdToDelete)
}) 

app.put('/updateuser', (request, response) => {
  const userToUpdate = request.body.userToUpdate;
  const users = getJsonContents();
  const newUsers = users.map((userItem) => {
    const isUpdate = userItem.userid === userToUpdate.userid;
    if(isUpdate) {
        return userToUpdate
    } else {
        return userItem
    }

  })
    const message = JSON.stringify(newUsers);
    fs.writeFileSync(filename, message);
    response.send('updated user ' + JSON.stringify(userToUpdate))
})

function getJsonContents() {
    if(fs.existsSync(filename)) {
        const users = require(filename)
        return users
    } else 
    return []
} 

function saveToFile(user, callback) {
    const users = getJsonContents()
    const newUsers = [...users, user]
    const message = JSON.stringify(newUsers);
    fs.writeFile(filename, message, callback);
    
}