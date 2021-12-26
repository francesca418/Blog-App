const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const SocketServer = require('../socketServer')

describe('socket test', () => {
  let io, serverSocket, clientSocket;

  beforeAll(done => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
        SocketServer(socket);
      });
      clientSocket.on("connect", done);
    });
  })

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  // it("join user", (done) => {
  //   clientSocket.emit("joinUser", {
  //     _id: '61b9037ff5126af338d02a8a',
  //     followers: []
  //   }, () => {
  //     done()
  //   });
  // });

  it("like Post", (done) => {
    clientSocket.emit("likePost", {
      user: {
        _id: '61b9037ff5126af338d02a8a',
        followers: []
      }
    }, () => {
      done()
    });
  });

  it("unLikePost Post", (done) => {
    clientSocket.emit("unLikePost", {
      user: {
        _id: '61b9037ff5126af338d02a8a',
        followers: []
      }
    }, () => {
      done()
    });
  });

  it("create Comment", (done) => {
    clientSocket.emit("createComment", {
      user: {
        _id: '61b9037ff5126af338d02a8a',
        followers: []
      }
    }, () => {
      done()
    });
  });

  it("delete Comment", (done) => {
    clientSocket.emit("deleteComment", {
      user: {
        _id: '61b9037ff5126af338d02a8a',
        followers: []
      }
    }, () => {
      done()
    });
  });

  // it("follow", (done) => {
  //   clientSocket.emit("follow", {
  //     user: {
  //       _id: '61b9037ff5126af338d02a8a',
  //     }
  //   }, () => {
  //     done()
  //   });
  // });
  //
  // it("unFollow", (done) => {
  //   clientSocket.emit("unFollow", {
  //     user: {
  //       _id: '61b9037ff5126af338d02a8a',
  //     }
  //   }, () => {
  //     done()
  //   });
  // });

  it("create Notify", (done) => {
    clientSocket.emit("createNotify", {
      recipients: ['61b9037ff5126af338d02a8a']
    }, () => {
      done()
    });
  });

  it("remove Notify", (done) => {
    clientSocket.emit("removeNotify", {
      recipients: ['61b9037ff5126af338d02a8a']
    }, () => {
      done()
    });
  });

  it("add Message", (done) => {
    clientSocket.emit("addMessage", {
      recipients: ['61b9037ff5126af338d02a8a']
    }, () => {
      done()
    });
  });

  it("check User Online", (done) => {
    clientSocket.emit("checkUserOnline", {
      _id: '61b9037ff5126af338d02a8a',
      following: [],
      followers: []
    }, () => {
      done()
    });
  });
})
