import React from 'react';
import ReactDOM from 'react-dom/client';

import { ConfigProvider } from 'antd';

import SignIn from './pages/SignIn';

import 'antd/dist/reset.css';
import './styles/index.css';

const remToPx = (rem) => {
	const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
	return rem * htmlFontSize;
};

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: '#106a2e',
					colorInfo: '#106a2e',
					fontSize: remToPx(1.5),
					sizeUnit: remToPx(0.5),
					borderRadius: remToPx(1),
				}
			}}
		>
			<SignIn />
		</ConfigProvider>
	</React.StrictMode>
);
