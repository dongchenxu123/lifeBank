import HomeView from '../App';
import HomeLayout from '../layouts/HomeLayout'
import LoginView from '../components/login'
import QiyeForm from '../components/qiye_message'
import Jigou from '../components/jigou'
import Bumen from '../components/bumen'
import BumenForm from '../components/bumenForm'
import YuangongView from '../components/yuangong'
import JigouForm from '../components/jigouForm'
import YuangongForm from '../components/yuangongForm'
import GangweiView from '../components/gangwei'
import GangweiForm from '../components/gangweiForm'
import ZhiweiView from '../components/zhiwei'
import ZhiweiForm from '../components/zhiweiForm'
export const routes = [
	{
		path: '/',
		component: HomeLayout,
		routes: [
			{
                path: '/',
                exact: true,
                component: HomeView
            },
            {
                path: '/login',
                exact: true,
                component: LoginView
            },
            {
                path: '/qiyeForm/:syscode',
                exact: true,
                component: QiyeForm
            },
            {
                path: '/jigou/:syscode',
                exact:　true,
                component: Jigou
            },
            {
                path: '/jigouForm/:syscode/:id/:isEdit',
                exact:　true,
                component: JigouForm
            },
            {
                path: '/bumen/:syscode',
                exact: true,
                component: Bumen
            },
            {
                path: '/bumenForm/:syscode/:id/:isEdit',
                exact: true,
                component: BumenForm
            },
            {
                path: '/yuangong/:syscode',
                exact: true,
                component: YuangongView
            },
            {
                path: '/yuangongForm/:syscode/:id/:isEdit',
                exact: true,
                component: YuangongForm
            },
            {
                path: '/gangwei/:syscode',
                exact: true,
                component: GangweiView
            },
            {
                path: '/gangweiForm/:syscode/:id/:isEdit',
                exact: true,
                component: GangweiForm
            },
            {
                path: '/zhiwei/:syscode',
                exact: true,
                component: ZhiweiView
            },
            {
                path: '/zhiweiForm/:syscode/:id/:isEdit',
                exact: true,
                component: ZhiweiForm
            }
         ]
	},
	
]