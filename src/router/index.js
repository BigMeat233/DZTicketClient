import Core from '@/utils/Core';

// 登录页
const Login = resolve => require(['@/pages/Login'], resolve);
const Home = resolve => require(['@/pages/Home'], resolve);

var routerCfg = {
  routes: [{
    name: 'Login',
    path: '/',
    component: Login
  },{
    name: 'Home',
    path: '/Home',
    component: Home
  }]
};

Core.navigator.create(routerCfg);
export default Core.navigator.router;