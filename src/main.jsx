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
import Bugs from './pages/Bugs';
import SystemVitals from './pages/SystemVitals';
import AuthReturn from './pages/AuthReturn';
import Unauthorized from './pages/Unauthorized';

import remToPx from './utils/remToPx';
import rootToHex from './utils/rootToHex';

import 'antd/dist/reset.css';
import './styles/index.css';

import { MobileProvider } from './contexts/MobileContext';
import { CacheProvider } from './contexts/CacheContext';
import { RefreshProvider } from './contexts/RefreshContext';

onOpenUrl((data) => {
	if (data.includes('osas-superadmin://return'))
		Window.getByLabel('main').then((window) => {
			if (window)
				window.setFocus();
		});
});

const OSAS = () => {
	const [session, setSession] = React.useState(null);
	const [sessionChecked, setSessionChecked] = React.useState(false);

	// Get initial session
	React.useLayoutEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setSessionChecked(true);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setSessionChecked(true);
		});
	}, []);

	// Modify `fetch`
	React.useLayoutEffect(() => {
		const originalFetch = window.fetch;

		window.fetch = async (...args) => {
			// Only add headers if we have a session with access token
			if (session?.access_token) {
				// First arg is the resource/URL, second arg is options
				if (args[1] && typeof args[1] === 'object') {
					// If headers already exist, add to them
					args[1].headers = {
						...args[1].headers,
						'Authorization': `Bearer ${JSON.parse(localStorage.getItem('CustomApp')).access_token}`
					};
				} else {
					// Create headers object if options doesn't exist
					args[1] = {
						...(args[1] || {}),
						headers: {
							'Authorization': `Bearer ${JSON.parse(localStorage.getItem('CustomApp')).access_token}`
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
	}, [session, sessionChecked]);

	if (!sessionChecked) return null;

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
						<MobileProvider>
							<Routes>
								<Route path='/' element={session ? <Navigate to='/signUp' /> : <SignIn />} />
								<Route path='/signUp' element={session ? <Navigate to='/dashboard' /> : <SignIn />} />

								<Route path='/dashboard' element={session ? (
									<CacheProvider>
										<RefreshProvider>
											<Dashboard />
										</RefreshProvider>
									</CacheProvider>
								) : <Navigate to='/signUp' />} />
								<Route path='/staff/:staffId' element={session ? <Profile /> : <Navigate to='/signUp' />} />
								<Route path='/configure' element={session ? <Configure /> : <Navigate to='/signUp' />} />
								<Route path='/bugs' element={session ? <Bugs /> : <Navigate to='/signUp' />} />
								<Route path='/system-vitals' element={session ? <SystemVitals /> : <Navigate to='/signUp' />} />

								<Route path='/auth-return' element={<AuthReturn />} />
								<Route path='/unauthorized' element={<Unauthorized />} />
							</Routes>
						</MobileProvider>
					</BrowserRouter>
				</App>
			</ConfigProvider>
		</React.StrictMode>
	);
};

export const API_Route = import.meta.env.DEV ? 'http://localhost:3001' : 'https://api.iosas.online';

ReactDOM.createRoot(document.getElementById('root')).render(<OSAS />);
