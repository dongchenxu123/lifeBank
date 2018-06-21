import registerServiceWorker from './registerServiceWorker';
import './index.css';
// import './style/step.css'
// import App from './App';
import createLoading from 'dva-loading';
import dva from 'dva';
import createHistory from 'history/createHashHistory';
import { Modal } from 'antd';

// import { Toast } from 'antd-mobile';

function startApp(){
	const app = dva({
		history: createHistory(),
		onError(err) {
			let str = err + ' '
			// Toast.fail(str)
			Modal.error({
				title: '错误提示',
				content: str,
			});
		},
		initialState:{
			
		}
	})
	
	app.use(createLoading())
	// app.model(require('./models/user').default);
	// app.model(require('./models/plan').default);
	// app.model(require('./models/people-tag').default);

	app.router(require('./routes/index').default);
	app.start('#root')
}
startApp()
// ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
