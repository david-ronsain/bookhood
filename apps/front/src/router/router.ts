import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Signin from '../views/Signin.vue'
import Account from '../views/Account.vue'
import { useUserStore, useMainStore } from '../store'
import { RequiresAuth } from '../enums/requiresAuth.enum'
import { isAccessGranted, isAuthenticated } from '../plugins/authentication'
import { EnvConfig } from '../../config/env'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			alias: '',
			name: 'home',
			component: Home,
			meta: {
				requiresAuth: RequiresAuth.BOTH,
				authenticated: isAuthenticated(),
			},
		},
		{
			path: '/signup',
			name: 'signup',
			component: Signup,
			meta: {
				requiresAuth: RequiresAuth.NOT_AUTHENTICATED,
				authenticated: isAuthenticated(),
			},
		},
		{
			path: '/signin',
			name: 'signin',
			component: Signin,
			meta: {
				requiresAuth: RequiresAuth.NOT_AUTHENTICATED,
				authenticated: isAuthenticated(),
			},
		},
		{
			path: '/signin/:token',
			name: 'signinLink',
			component: Signin,
			beforeEnter: async (to, from, next) => {
				const userStore = useUserStore()
				const mainStore = useMainStore()

				const verified = await userStore
					.signin(to.params.token.toString())
					.then((res: { data: boolean }) => res.data)
					.catch((err) => {
						mainStore.$patch({ error: err.response.data.message })
						next({ name: 'signin', replace: true, force: true })
					})
				if (verified) {
					localStorage.setItem(
						'user',
						to.params.token +
							'|' +
							(Date.now() + EnvConfig.settings.session.duration)
					)
				}
				next({ name: 'home', force: true, replace: true })
			},
			meta: {
				requiresAuth: RequiresAuth.NOT_AUTHENTICATED,
				authenticated: isAuthenticated(),
			},
		},
		{
			path: '/account',
			name: 'account',
			component: Account,
			meta: {
				requiresAuth: RequiresAuth.AUTHENTICATED,
				authenticated: isAuthenticated(),
			},
		},
		{
			path: '/book/:id',
			name: 'book',
			component: Home,
			meta: {
				requiresAuth: RequiresAuth.BOTH,
				authenticated: isAuthenticated(),
			},
		},
		{
			path: '/search',
			name: 'search',
			component: Home,
			meta: {
				requiresAuth: RequiresAuth.BOTH,
				authenticated: isAuthenticated(),
			},
		},
	],
})

router.beforeEach((to, from, next) => {
	if (!isAccessGranted(to.meta.requiresAuth as RequiresAuth)) {
		next({ name: to.meta.requiresAuth ? 'signin' : 'home' })
	}

	next()
})

export default router
