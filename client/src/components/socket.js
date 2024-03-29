import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'https://react-chat-r4y1.onrender.com:4000' : 'http://localhost:4000';

export const socket = io.connect(URL);