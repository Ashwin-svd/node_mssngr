//<script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.0.1/mustache.min.js"></script>
//<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
//<script src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.6.0/qs.min.js"></script>



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
const port=3000
const publicdirectory=path.join(__dirname,'../public')
app.use(express.static(publicdirectory))
let count =0;


//server(emit)=>client(receive)-countUpdated
//client(emit)=>server(receive)-increment
io.on('connection',(socket)=>{//'connection'=built in event
    console.log('new connectio')
// io.emit('countUpdated',count)//emits to single event

// socket.emit('message',generateMessage("!welcome"))//message built in event
// socket.broadcast.emit('message',generateMessage('new one jpoined'))

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

    // socket.emit('countUpdated',count)//emits to every connection
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
                        // socket.emit('countUpdated',count)//emits to every connection
                            
                        })






socket.on('sendlocation',(position,callback)=>{
    const user= getUser(socket.id)
    // socket.emit('countUpdated',count)//emits to every connection
       // io.emit('locationMessage',`${position.longitude}and${position.latitude}`)//emits to single event
        io.to(user.room).emit('locationMessage',`https://google.com/maps?q=${position.longitude},${position.latitude}`)
        callback()
    })

})

server.listen(port,()=>{console.log("port=",port)})


 