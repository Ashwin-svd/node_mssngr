

const http=require('http')
const express=require('express')
const path=require('path')
const app=express()
const socketio=require('socket.io')
const Filter=require('bad-words')
//create new web server
const generateMessage=require('./utils/messages')
const server=http.createServer(app)
//for socket io to work eith server
const io=socketio(server)// vow our servver suprots web socket

const{addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')
const port=process.env.PORT || 3000
const publicdirectory=path.join(__dirname,'../public')
app.use(express.static(publicdirectory))
let count =0;


io.on('connection',(socket)=>{//'connection'=built in event
    

                    socket.on('join',({username,room},callback)=>{
                        const {error,user}=addUser({id:socket.id,username,room})

                        if(error)
                        {
                            return callback(error)
                        }
                    socket.join(user.room)

                    socket.emit('message',generateMessage("!welcome",'admin'))//message built in event
                    socket.broadcast.to(room).emit('message',generateMessage(`${user.username} has joined`,'admin'))

                        io.to(user.room).emit('roomdata',{
                            room:user.room,
                            users:getUsersInRoom(user.room)
                        }
                        )
                        callback()
                        //socket.emit,io.emit,socket.broadcst.emit
                        //io.to.emit,socket,briadcast.to.emit//for specific room
                    })



socket.on('sendmessage',(input,callback)=>{
    const filter = new Filter()
    const user=getUser(socket.id)
if (input==='') {
    return callback('empty message')
    }
if (filter.isProfane(input)) {
return callback('Profanity is not allowed!')
}
    io.to(user.room).emit('message',generateMessage(input,user.username))//emits to single event
    callback()//ene=vent acknowledged
})


                        socket.on('disconnect',()=>{//'disconnect'=built in event
                            const user=removeUser(socket.id)
                            if(user)
                            { io.to(user.room).emit('message',generateMessage(`a ${user.username} has disconnected`,'admin'))//emits to single event
                           
                            io.to(user.room).emit('roomdata',{
                                room:user.room,
                                users:getUsersInRoom(user.room)
                            }
                            )
                        }   
                        })


socket.on('sendlocation',(position,callback)=>{
    const user= getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateMessage(`https://google.com/maps?q=${position.longitude},${position.latitude}`,user.username))
        callback()
    })
})

server.listen(port,()=>{console.log("port=",port)})


 