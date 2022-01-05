

const socket =io()
// //<body>
// Chat App
// <script src="/socket.io/socket.io.js"></script>
// <script src="/js/chat.js"></script>
// </body>
// When you use a script tag on the client,
//  you can think of it as copying and pasting the entire contents of the file in place of the script tag.
//   Since the script tag for chat.js is below the one for socket.io.js, it can use the functions defined in it.

const $messageForm=document.querySelector('#form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $locationButton=document.querySelector('#send_location')
const $messages= document.querySelector('#messages')
//templates
const messagetemplate=document.querySelector('#message-template').innerHTML
const locationmessagetemplate=document.querySelector('#location-message-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//option
const{username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

//for rendering messages
socket.on('message',(word)=>{
    //console.log(word)
    const html=Mustache.render(messagetemplate,{name:word.name,created_at:moment(word.createdAt).format('h:mm a'),message:word.text})
    $messages.insertAdjacentHTML('beforeend',html)
})

//for location
socket.on('locationMessage',(url)=>{
    //console.log(url)
    const html=Mustache.render(locationmessagetemplate,{url:url})
    $messages.insertAdjacentHTML('beforeend',html)
})


socket.on('roomdata',({room,users})=>
{
    const html=Mustache.render(sidebarTemplate,{
        room:room,
        users:users
    })
    document.querySelector('#sidebar').innerHTML=html
})


$messageForm.addEventListener('submit',(e)=>{//submit event
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const input=document.querySelector('input').value

socket.emit('sendmessage',input,(error)=>{
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''//to clear input after sending message
    $messageFormInput.focus() //to bring the cursor inside input box

    if(error){return console.log(error)}})
})


$locationButton.addEventListener('click',()=>{
if(!navigator.geolocation)
{return alert('geolocation not supported')}
$locationButton.setAttribute('disabled','disabled')

navigator.geolocation.getCurrentPosition((position)=>
{socket.emit('sendlocation',
{'longitude':position.coords.longitude,'latitude':position.coords.latitude},
()=>{
    $locationButton.removeAttribute('disabled')
    console.log("location shared")}
)
})
//socket.emit('sendmessage',input)
})

socket.emit('join',{username,room},(error)=>{
    if(error)
    {alert(error)
    location.href='/'
    }
})