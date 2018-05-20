import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import * as types from '../store/types';
import store from '../store/index';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

// 页面刷新时，重新赋值token
if (window.localStorage.getItem('token')) {
    store.commit(types.LOGIN, window.localStorage.getItem('token'));
}

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    // if (store.state.token) {
    //     next();
    // } else {
    //     next({
    //         name: 'login'
    //     });
    // }
    if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        // console.log(Cookies.get('user'));
        if (!Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'login'
            });
        } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
            Util.title();
            next({
                name: 'home_index'
            });
        } else {
            const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
            if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
                let auths = JSON.parse(Cookies.get('user'))['authorities'];
                console.log('router authorities:' + JSON.stringify(auths));
                let hasAuth = false;
                console.log('check user auths');
                for (let item of auths) {
                    console.log('check auth:' + item);
                    let curAccess = curRouterObj.access;
                    if (typeof curAccess === 'object' && Array.isArray(curAccess)) {
                        if (curAccess.indexOf(item) >= 0) {
                            hasAuth = true;
                            break;
                        }
                    } else {
                        if (curAccess === item) {
                            hasAuth = true;
                            break;
                        }
                    }
                }
                if (hasAuth) {
                    Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
                } else {
                    next({
                        replace: true,
                        name: 'error-403'
                    });
                }
            } else { // 没有配置权限的路由, 直接通过
                Util.toDefaultPage([...routers], to.name, router, next);
            }
        }
    }
});

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
