const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: 'https://buzzbase.space',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('newPost', (data) => {
    console.log('Received new post:', data);
    socket.broadcast.emit('postBroadcast', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.post('/new-post-hook', (req, res) => {
  const data = req.body;
  console.log('Received POST hook:', data);
  io.emit('postBroadcast', data);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
