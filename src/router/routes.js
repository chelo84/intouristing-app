import store from '../store';

let entryUrl = null;

const guard = async (to, from, next) => {
  if (store().getters['auth/getAccount'] && store().getters['auth/getLoggedIn']) {
    if (entryUrl) {
      const url = entryUrl;
      entryUrl = null;
      return next(url);
    }
    return next();
  }

  await store().dispatch('auth/checkAuth');

  if (store().getters['auth/getAccount'] && store().getters['auth/getLoggedIn']) {
    next();
  } else {
    entryUrl = to.path;
    next('/login');
  }

  return null;
};

const routes = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/login/Login.vue') },
    ],
  },
  {
    path: '/sign-up',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/login/SignUp.vue') },
    ],
  },
  {
    path: '/',
    beforeEnter: guard,
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', redirect: '/search' },
      { path: 'search', component: () => import('pages/search/Search.vue') },
      { path: 'chat', component: () => import('pages/chat/Chat.vue') },
      { path: 'edit-profile', component: () => import('pages/EditProfile.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
