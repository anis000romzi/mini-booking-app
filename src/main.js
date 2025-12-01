import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './assets/style.css';
import './assets/main.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

library.add(faFaceFrown, faXmark);

const app = createApp(App);

app.use(router);
app.use(store);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
