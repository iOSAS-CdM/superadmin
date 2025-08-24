import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import supabase from './utils/supabaseClient';

import { ConfigProvider, App, theme } from 'antd';

import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Configure from './pages/Configure';

import remToPx from './utils/remToPx';
import rootToHex from './utils/rootToHex';

import 'antd/dist/reset.css';
import './styles/index.css';

const OSAS = () => {
	const [mobile, setMobile] = React.useState(false);
	const [session, setSession] = React.useState(null);

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

	React.useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
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
						borderRadius: remToPx(0.75)
					}
				}}
			>
				<App>
					<BrowserRouter>
						<MobileContext.Provider value={{ mobile, setMobile }}>
							<Routes>
								<Route path='/' element={session ? <Navigate to='/dashboard' /> : <SignIn />} />
								<Route path='/dashboard' element={session ? <Dashboard /> : <Navigate to='/' />} />
								<Route path='/admin/:adminId' element={session ? <Profile /> : <Navigate to='/' />} />
								<Route path='/configure' element={session ? <Configure /> : <Navigate to='/' />} />
							</Routes>
						</MobileContext.Provider>
					</BrowserRouter>
				</App>
			</ConfigProvider>
		</React.StrictMode>
	);
};

export const MobileContext = React.createContext({
	mobile: false,
	setMobile: () => { }
});

ReactDOM.createRoot(document.getElementById('root')).render(<OSAS />);
