import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

import { ConfigProvider, theme } from 'antd';

import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';

import remToPx from './utils/remToPx';
import rootToHex from './utils/rootToHex';

import 'antd/dist/reset.css';
import './styles/index.css';

const App = () => {
	const [mobile, setMobile] = React.useState(false);

	React.useEffect(() => {
		const handleResize = () => {
			setMobile(window.innerWidth < remToPx(80));
			console.log(`Mobile mode: ${window.innerWidth < remToPx(80)}`);
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<React.StrictMode>
			<ConfigProvider
				theme={{
					algorithm: [
						theme.defaultAlgorithm
					],
					cssVar: true,
					token: {
						colorPrimary: rootToHex('var(--primary)'),
						colorInfo: rootToHex('var(--primary)'),
						fontSize: remToPx(1.5),
						sizeUnit: remToPx(0.5),
						borderRadius: remToPx(1)
					}
				}}
			>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={
							<MobileContext.Provider value={{ mobile, setMobile }}>
								<SignIn />
							</MobileContext.Provider>
						} />
						<Route
							path='/dashboard'
							element={
								<MobileContext.Provider value={{ mobile, setMobile }}>
									<Dashboard />
								</MobileContext.Provider>
							}
						/>
					</Routes>
				</BrowserRouter>
			</ConfigProvider>
		</React.StrictMode>
	);
};

export const MobileContext = React.createContext({
	mobile: false,
	setMobile: () => { }
});

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
