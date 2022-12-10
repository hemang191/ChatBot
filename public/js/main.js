const chatForm = document.getElementById('chat-form') ; 
const chatMessages = document.querySelector('.chat-messages') ;
const roomName = document.getElementById('room-name') ; 
const userList = document.getElementById('users') ; 
// get username and room from URL 
const {username , room} = Qs.parse(location.search , {
    ignoreQueryPrefix : true 
});

// We had created a object socket of io class which is possible we add in our script file 
  
const socket = io() ;  

// join chatroom 
socket.emit('joinRoom' , {username , room}); 

// get room and users 
socket.on('roomUsers' , ({room , users})=>
{
    outputRoomName(room) ;
    outputUser(users) ; 
});


socket.on('message' , message=>
{
    // here the socket is sending in form of message it is printing here 
//    console.log(message) ; 
//    console.log(message.username) ;
//    console.log(message.text)  ;
//    console.log(message.time) ; 
   // now we need to display this message on screen 
   
   console.log(message) ; 
   outputMessage(message) ; 
   chatMessages.scrollTop = chatMessages.scrollHeight ; 
});

// Message submit 
chatForm.addEventListener('submit' , (e)=>
{
    e.preventDefault(); 
    
    // message text 
    let msg = e.target.elements.msg.value;
    
    msg = msg.trim() ; 
    if(!msg)
    {
        return false ;
    }
    // here we are sending the message in object form 

    socket.emit('chatMessage' , msg) ; 
    
    e.target.elements.msg.value = '' ; 
    e.target.elements.msg.focus() ; 

    // now we want to create this message 
    
})

// output message 

function outputMessage(message) 
{
    const div = document.createElement('div') ; 
    div.classList.add('message') ; 
    const p = document.createElement('p') ; 
    p.classList.add('meta') ; 
    p.innerText = message.username ; 
    p.innerHTML += `<span>${message.time}</span>` ;
    
    div.appendChild(p) ; 
    const para = document.createElement('p') ; 
    para.classList.add('text') ; 
    para.innerText = message.text;
    div.appendChild(para) ; 

    document.querySelector('.chat-messages').appendChild(div) ; 
}

// add room name to DOM 
function  outputRoomName(room) {
    roomName.innerText = room ; 
}

// add user to room 
function outputUser(users)
{
    userList.innerHTML = '';
    users.forEach((user) => 
    {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}