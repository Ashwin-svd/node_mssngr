const generateMessage =(text,username)=>{
    return{text,
    createdAt:new Date().getTime(),
name:username}
}
module.exports=generateMessage