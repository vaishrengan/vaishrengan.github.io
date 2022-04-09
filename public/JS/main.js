const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const UserList = document.getElementById('users');
// for getting username and room from URL
const {username, room }= Qs.parse(location.search,{
    ignoreQueryPrefix: true   // no need of special characters from URL
});
console.log(username, room);

const socket = io();

// join chat room
socket.emit('joinRoom', {username, room})

socket.on('roomUsers',({room,users}) =>
{
   outputRoomName(room);
   outputUsers(users);

});

// Messages from server
socket.on("message", message=>
{
   console.log(message);
   outputMeg(message);
   chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit',(eve)=>
{
    eve.preventDefault();  // to stop from submitting a file
    const msg = eve.target.elements.msg.value;
   
    socket.emit('messageFromChat', msg);
    eve.target.elements.msg.value="";
    eve.target.elements.msg.focus();

});

//Output message from server
function outputMeg(message)
{
   const div = document.createElement('div');
   div.classList.add('message');
   div.innerHTML =` <p class="meta"> ${message.username} <span>${message.time}</span></p>
   <p class="text">
    ${message.text}
    </p>`
    document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room)
{
   roomName.innerText = room;
}

function outputUsers(users)
{
   UserList.innerHTML = `
   ${users.map(user => `<li>${user.username}</li>`).join('')}`;
}