let users = []

const EditData = (data, id) => {
    const newData = data.map(item =>
        item.id === id ? {...item} : item
    )
    return newData;
}

const SocketServer = (socket) => {
    // Connect - Disconnect
    // socket.on('joinUser', user => {
    //     users.push({id: user._id, socketId: socket.id, followers: user.followers})
    // })

    // socket.on('disconnect', () => {
    //     const data = users.find(user => user.socketId === socket.id)
    //     if(data){
    //         const clients = users.filter(user =>
    //             data.followers.find(item => item._id === user.id)
    //         )

    //         if(clients.length > 0){
    //             clients.forEach(client => {
    //                 socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id)
    //             })
    //         }
    //     }

    //     users = users.filter(user => user.socketId !== socket.id)
    // })


    // Likes
    socket.on('likePost', (newPost, cb) => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
        cb && cb()
    })

    socket.on('unLikePost', (newPost, cb) => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
        cb && cb()
    })


    // Comments
    socket.on('createComment', (newPost, cb) => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
        cb && cb()
    })

    socket.on('deleteComment', (newPost, cb) => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
        cb && cb()
    })


    // // Follow
    // socket.on('follow', newUser => {
    //     const user = users.find(user => user.id === newUser._id)
    //     user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    // })

    // socket.on('unFollow', newUser => {
    //     const user = users.find(user => user.id === newUser._id)
    //     user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    // })


    // Notification
    socket.on('createNotify', (msg, cb) => {
        const client = users.find(user => msg.recipients.includes(user.id))
        client && socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
        cb && cb()
    })

    socket.on('removeNotify', (msg, cb) => {
        const client = users.find(user => msg.recipients.includes(user.id))
        client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)
        cb && cb()
    })


    // Message
    socket.on('addMessage', (msg, cb) => {
        const user = users.find(user => user.id === msg.recipient)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
        cb && cb()
    })


    // Check User Online / Offline
    socket.on('checkUserOnline', (data, cb) => {
        const following = users.filter(user =>
            data.following.find(item => item._id === user.id)
        )
        socket.emit('checkUserOnlineToMe', following)

        const clients = users.filter(user =>
            data.followers.find(item => item._id === user.id)
        )

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
            })
        }
        cb && cb()
    })

}

module.exports = SocketServer
