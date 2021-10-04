module.exports = (io, socket, onlineUsers, channels) => {
  // Listen for "new user" socket emits

  socket.on("new user", (username) => {
    onlineUsers[username] = socket.id
    socket["username"] = username

    console.log(`✋ ${username} has joined the chat! ✋`)
    io.emit("new user", username)
  })
}