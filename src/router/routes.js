import store from '../store';

let entryUrl = null;

const guard = async (to, from, next) => {
  if (store().state.auth.account && store().state.auth.loggedIn) {
    if (entryUrl) {
      const url = entryUrl;
      entryUrl = null;
      return next(url);
    }
    return next();
  }

  await store().dispatch('auth/checkAuth');

  if (store().state.auth.account && store().state.auth.loggedIn) {
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
      { path: '', component: () => import('pages/Login.vue') },
    ],
  },
  {
    path: '/',
    beforeEnter: guard,
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
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
