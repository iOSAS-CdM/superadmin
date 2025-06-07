import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import { ConfigProvider } from 'antd';

import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';

import 'antd/dist/reset.css';
import './styles/index.css';

const remToPx = (rem) => {
	const htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
	return rem * htmlFontSize;
};
const rootToHex = (root) => {
	if (root.startsWith('#')) return root;
	if (root.startsWith('var(--')) {
		const varName = root.slice(4, -1);
		const computedStyle = getComputedStyle(document.documentElement);
		return computedStyle.getPropertyValue(varName).trim();
	};
	return root;
};

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: rootToHex('var(--primary-6-light)'),
						colorInfo: rootToHex('var(--primary-6-light)'),
						fontSize: remToPx(1.5),
						sizeUnit: remToPx(0.5),
						borderRadius: remToPx(1)
					}
				}}
			>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<SignIn />} />
					<Route path='/dashboard' element={<Dashboard />} />
				</Routes>
			</BrowserRouter>
		</ConfigProvider>
	</React.StrictMode>
);
