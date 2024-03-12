import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
const Signup = () => import('../views/Signup.vue')
const Signin = () => import('../views/Signin.vue')
const Account = () => import('../views/Account.vue')
const Logout = () => import('../views/Logout.vue')
import Requests from '../views/Requests.vue'
const Profile = () => import('../views/Profile.vue')
const Conversation = () => import('../views/Conversation.vue')
import { useUserStore, useMainStore } from '../store'
import { RequiresAuth } from '../enums/requiresAuth.enum'
import { useAuthentication } from '../composables/authentication.composable'
import { EnvConfig } from '../../config/env'

const auth = useAuthentication()
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
				authenticated: auth.isAuthenticated(),
			},
		},
		{
			path: '/signup',
			name: 'signup',
			component: Signup,
			meta: {
				requiresAuth: RequiresAuth.NOT_AUTHENTICATED,
				authenticated: auth.isAuthenticated(),
			},
		},
		{
			path: '/logout',
			name: 'logout',
			component: Logout,
			meta: {
				requiresAuth: RequiresAuth.NOT_AUTHENTICATED,
			},
		},
		{
			path: '/signin',
			name: 'signin',
			component: Signin,
			meta: {
				requiresAuth: RequiresAuth.NOT_AUTHENTICATED,
				authenticated: auth.isAuthenticated(),
			},
			children: [
				{
					path: ':token',
					name: 'signinLink',
					component: Signin,
					beforeEnter: async (to, from, next) => {
						const userStore = useUserStore()
						const mainStore = useMainStore()

						const verified = await userStore
							.signin(to.params.token.toString())
							.then((res: { data: boolean }) => {
								return res.data
							})
							.catch((err) => {
								mainStore.$patch({
									error: err.response.data.message,
								})
								next({
									name: 'signin',
									replace: true,
									force: true,
								})
							})
						if (verified) {
							localStorage.setItem(
								EnvConfig.localStorage.userKey,
								to.params.token +
									'|' +
									(Date.now() +
										EnvConfig.settings.session.duration),
							)
						}
						mainStore.getProfile()
						next({ name: 'home', force: true, replace: true })
					},
					meta: {
						requiresAuth: RequiresAuth.NOT_AUTHENTICATED,
						authenticated: auth.isAuthenticated(),
					},
				},
			],
		},
		{
			path: '/account',
			name: 'account',
			component: Account,
			meta: {
				requiresAuth: RequiresAuth.AUTHENTICATED,
				authenticated: auth.isAuthenticated(),
			},
		},
		{
			path: '/requests',
			name: 'requests',
			component: Requests,
			meta: {
				requiresAuth: RequiresAuth.AUTHENTICATED,
				authenticated: auth.isAuthenticated(),
			},
		},
		{
			path: '/book/:id',
			name: 'book',
			component: Home,
			meta: {
				requiresAuth: RequiresAuth.BOTH,
				authenticated: auth.isAuthenticated(),
			},
		},
		{
			path: '/search',
			name: 'search',
			component: Home,
			meta: {
				requiresAuth: RequiresAuth.BOTH,
				authenticated: auth.isAuthenticated(),
			},
		},
		{
			path: '/profile/:userId',
			name: 'profile',
			component: Profile,
			meta: {
				requiresAuth: RequiresAuth.AUTHENTICATED,
				authenticated: auth.isAuthenticated(),
			},
		},
		{
			path: '/conversations/:id',
			name: 'conversation',
			component: Conversation,
			meta: {
				requiresAuth: RequiresAuth.AUTHENTICATED,
				authenticated: auth.isAuthenticated(),
				fullHeight: true,
			},
		},
	],
})

router.beforeEach((to, from, next) => {
	if (!auth.isAccessGranted(to.meta.requiresAuth as RequiresAuth)) {
		localStorage.removeItem(EnvConfig.localStorage.userKey)
		next({ name: to.meta.requiresAuth ? 'signin' : 'home' })
	} else {
		next()
	}
})

export default router
