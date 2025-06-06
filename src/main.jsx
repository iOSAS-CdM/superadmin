import React from 'react';
import ReactDOM from 'react-dom/client';

import { ConfigProvider } from 'antd';

import SignIn from './pages/SignIn';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#106a2e',
					colorInfo: '#106a2e',
					fontSize: 15,
					sizeUnit: 5,
					borderRadius: 10
				}
			}}
		>
			<SignIn />
		</ConfigProvider>
	</React.StrictMode>
);
