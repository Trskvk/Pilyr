import Songs from "./components/Pages/Songs.vue";
import Playlists from "./components/Pages/Playlists.vue";
import Playlist from "./components/Pages/Playlist.vue";
import Profile from "./components/Pages/Profile.vue";
import Login from "./components/Pages/Login.vue";
import Register from "./components/Pages/Register.vue";

export default [
    {path: '/', alias: ['/home', '/songs'], component: Songs, name: 'songs'},
    {path: '/playlists', component: Playlists, name: 'playlists'},
    {path: '/playlist/:id', component: Playlist, name: 'playlist'},
    {path: '/profile', component: Profile, name: 'profile'},
    {path: '/login', component: Login, name: 'login'},
    {path: '/register', component: Register, name: 'register'},
]