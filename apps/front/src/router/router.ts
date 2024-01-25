import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Signin from '../views/Signin.vue'
import Account from '../views/Account.vue'

export default createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			alias: '',
			name: 'home',
			component: Home,
		},
		{
			path: '/signup',
			name: 'signup',
			component: Signup,
		},
		{
			path: '/signin',
			name: 'signin',
			component: Signin,
		},
		{
			path: '/account',
			name: 'account',
			component: Account,
		},
	],
})
