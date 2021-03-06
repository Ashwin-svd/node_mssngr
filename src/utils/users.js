const users=[]
//adduserr,remove,getuser,get user

//ID ASSOCIATED WITH INDIVIDUAL SOCKET

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!Try some other'
        }
    }

    // Store user
    const user = { id, username, room }
    
    users.push(user)
   
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
    
}

// addUser({
//     id: 22,
//     username: 'Andrew  ',
//     room: '  South Philly'
// })



// const removedUser = removeUser(22)

// console.log(removedUser)
// console.log(users)
const getUser=((id)=>{

   return  users.find((user) =>{return user.id === id})

})

const getUsersInRoom=((room)=>{
    room=room.trim().toLowerCase()
    console.log(room)
return users.filter((user)=>{return user.room===room})

})

// console.log('ashwin',getUser(22).room)
// console.log(users)
//console.log(getUsersInRoom('South'))
module.exports={addUser,removeUser,getUser,getUsersInRoom}