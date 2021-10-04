module.exports = (io, socket, onlineUsers, channels) => {

  const socket = io.connect()

  let currentUser

  socket.emit("get online users")
  socket.emit("get channels")

  socket.emit("user changed channel", "General")

  //Users can change the channel by clicking on its name.
  $(document).on("click", ".channel", (e) => {
    let newChannel = e.target.textContent
    socket.emit("user changed channel", newChannel)
  })


  socket.on('get online users', () => {
    //Send over the onlineUsers
    socket.emit('get online users', onlineUsers);
  })

  socket.on('new message', (data) => {
    //Save the new message to the channel.
    channels[data.channel].push({sender : data.sender, message : data.message});
    //Emit only to sockets that are in that channel room.
    io.to(data.channel).emit('new message', data);
  })

  socket.on('new channel', (newChannel) => {
    console.log(newChannel);
  })

  socket.on('disconnect', () => {
    //This deletes the user by using the username we saved to the socket
    delete onlineUsers[socket.username]
    io.emit('user has left', onlineUsers);
  })

  socket.on("new channel", (newChannel) => {
    //Save the new channel to our channels object. The array will hold the messages.
    channels[newChannel] = []
    //Have the socket join the new channel room.
    socket.join(newChannel)
    //Inform all clients of the new channel.
    io.emit("new channel", newChannel)
    //Emit to the client that made the new channel, to change their channel to the one they made.
    socket.emit("user changed channel", {
      channel: newChannel,
      messages: channels[newChannel],
    })
  })
}