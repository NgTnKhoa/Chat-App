import Login from '../pages/Login/login';
import ChatWindow from '../pages/ChatWindow/chat-window';

const publicRoutes = [
    { path: '/', component: Login },
    { path: '/chat', component: ChatWindow }
]

// const privateRoutes = []

export { publicRoutes }