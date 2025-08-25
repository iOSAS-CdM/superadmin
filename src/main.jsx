import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import supabase from './utils/supabaseClient';
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import { Window } from '@tauri-apps/api/window';


import { ConfigProvider, App, theme } from 'antd';

import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Configure from './pages/Configure';
import AuthReturn from './pages/AuthReturn';
import Unauthorized from './pages/Unauthorized';

import remToPx from './utils/remToPx';
import rootToHex from './utils/rootToHex';

import 'antd/dist/reset.css';
import './styles/index.css';

onOpenUrl((data) => {
	if (data.includes('osas-superadmin://return'))
		Window.getByLabel('main').then((window) => {
			if (window)
				window.setFocus();
		});
});

const OSAS = () => {
	const [mobile, setMobile] = React.useState(false);
	const [session, setSession] = React.useState(null);

	// Handle window resize
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

	// Get initial session
	React.useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
		console.log(session);
	}, []);

	// Modify `fetch`
	React.useEffect(() => {
		const originalFetch = window.fetch;

		window.fetch = async (...args) => {
			// Only add headers if we have a session with access token
			if (session?.access_token) {
				// First arg is the resource/URL, second arg is options
				if (args[1] && typeof args[1] === 'object') {
					// If headers already exist, add to them
					args[1].headers = {
						...args[1].headers,
						'Authorization': `Bearer ${session.access_token}`
					};
				} else {
					// Create headers object if options doesn't exist
					args[1] = {
						...(args[1] || {}),
						headers: {
							'Authorization': `Bearer ${session.access_token}`
						}
					};
				};
			};

			const response = await originalFetch(...args);

			// If we have a session but get a 403 Forbidden response, sign out
			if (session && response.status === 403) {
				await supabase.auth.signOut();
				window.location.href = '/unauthorized';
			};

			return response;
		};

		return () => {
			window.fetch = originalFetch;
		};
	}, [session]);

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
								<Route path='/' element={session ? <Navigate to='/signUp' /> : <SignIn />} />
								<Route path='/signUp' element={session ? <Navigate to='/dashboard' /> : <SignIn />} />

								<Route path='/dashboard' element={session ? <Dashboard /> : <Navigate to='/signUp' />} />
								<Route path='/admin/:adminId' element={session ? <Profile /> : <Navigate to='/signUp' />} />
								<Route path='/configure' element={session ? <Configure /> : <Navigate to='/signUp' />} />

								<Route path='/auth-return' element={<AuthReturn />} />
								<Route path='/unauthorized' element={<Unauthorized />} />
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

export const API_Route = import.meta.env.DEV ? 'http://localhost:3001' : 'https://api.example.com';

ReactDOM.createRoot(document.getElementById('root')).render(<OSAS />);
