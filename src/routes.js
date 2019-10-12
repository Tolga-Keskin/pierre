import Home from './pages/home.vue';
import { CategoryAll, CategoryShow } from './pages/category/all';
import PanelLeftPage from './pages/panel-left.vue';
import Login from './pages/login';
import Search from './pages/search';
import Profile from './pages/profile';

export default [
  {
    path: '/',
    component: Home,
    name: 'Home'
  },
  {
    path: '/category/',
    component: CategoryAll,
    name: 'Category',
  },
  {
    path: '/category/:categoryId/',
    component: CategoryShow,
    name: 'ShowCategory',
  },
  {
    path: '/panel-left/',
    component: PanelLeftPage,
  },
  {
    path: '/search/',
    component: Search,
  },
  {
    path: '/profile/',
    component: Profile,
  },
  {
    path: '/login',
    component: Login,
  }
];
