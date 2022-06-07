import BackendConnector from './helpers/Requester'
import {createApp} from 'vue'
import Vuex from "vuex";
import {createRouter, createWebHashHistory} from 'vue-router'

import App from './App.vue'
import routes from './routes'
// import Songs from './components/Pages/'
// import Songs from './components/Pages/'

const API_URL = 'http://localhost:8080'

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const store = new Vuex.Store({
    state: {
        user: {
            logged_in: false,
            username: null,
            _id: null,
            role: 'nobody',
            token: null,
        },
    },
    mutations: {
        initialiseStore(state) {
            // Check if the ID exists
            if (localStorage.getItem('store')) {
                this.replaceState(
                    Object.assign(state, JSON.parse(localStorage.getItem('store')))
                );
            }
        },

        user(state, payload) {
            state.user = {...state.user, ...payload};
        }
    },
    actions: {}
})

store.subscribe((mutation, state) => {
    // Store the state object as a JSON string
    localStorage.setItem('store', JSON.stringify(state));
});

let app = createApp(App)

app.config.globalProperties.$api = new BackendConnector(API_URL)

app.use(router)
    .use(store)
    .mount('#app')

