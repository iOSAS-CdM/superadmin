import React from 'react';
import { useNavigate } from 'react-router';
import supabase from '../utils/supabaseClient';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-shell';
import { start, cancel } from '@fabianlars/tauri-plugin-oauth';
import { isTauri } from '@tauri-apps/api/core';

import {
	Form,
	Card,
	Flex,
	Button,
	Divider,
	Input,
	Image,
	Typography,
	Checkbox
} from 'antd';

import { LoginOutlined, GoogleOutlined, LoadingOutlined } from '@ant-design/icons';

import { useMobile } from '../contexts/MobileContext';

const { Text, Title } = Typography;

import '../styles/pages/SignIn.css';

const SignIn = () => {
	const [signingIn, setSigningIn] = React.useState(false);
	const isMobile = useMobile();

	const navigate = useNavigate();
	const AuthForm = React.useRef(null);

	const signIn = async (values) => {
		if (!AuthForm.current) return;
		setSigningIn(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: values.email,
			password: values.password
		});

		if (error) {
			AuthForm.current.setFields([{
				name: 'email',
				errors: ['']
			}]);
			AuthForm.current.setFields([{
				name: 'password',
				errors: [error.message]
			}]);
		} else {
			navigate('/dashboard');
		};
		setSigningIn(false);
	};

	const signInWithGoogle = React.useCallback(async () => {
		setSigningIn(true);
		if (isTauri()) {
		// Tauri desktop OAuth flow
			let port;
			const unlisten = await listen('oauth://url', (data) => {
				if (!data.payload) return;
				const url = new URL(data.payload);
				const code = new URLSearchParams(url.search).get('code');
				if (code) {
					supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
						if (error) {
							alert(error.message);
							console.error(error);
							return;
						};
						console.log(data);
						location.reload();
						unlisten();
						cancel(port)
							.catch((e) => console.error(`Error cancelling OAuth listener for port ${port}:`, e));
					});
				};
			});
			await start({
				ports: [8000],
				response: `<script>window.location.href = 'http://${window.location.hostname}:${window.location.port}/auth-return';</script>`,
			})
				.then(async (p) => {
					console.log(`OAuth listener started on port ${p}`);
					port = p;
				})
				.catch((e) => console.error('Error starting OAuth listener:', e));
			if (!port) return;
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `http://localhost:${port}`,
					skipBrowserRedirect: true
				}
			});
			console.log(data, error);
			if (data.url)
				open(data.url);
			else if (error)
				console.error('Error signing in with Google:', error.message);
		} else {
			// Web browser OAuth flow
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: window.location.origin + '/auth-return',
				}
			});
			if (error) {
				alert(error.message);
				setSigningIn(false);
				return;
			}
			// Supabase will handle the redirect, so no further action needed
		};
	}, []);

	return (
		<>
			<div id='auth-background'></div>

			<Card id='sign-in' className={`page-container${isMobile ? ' mobile' : ''}`}>
				<Flex vertical justify='space-between' align='center' gap='large' style={{ height: '100%' }}>
					<Flex vertical justify='center' align='center' gap='large' style={{ height: '100%' }}>
						<Image
							src='/CdM-OSAS Banner.png'
							alt='Logo Colegio de Montalban'
							width='75%'
							preview={false}
						/>

						<Divider />

						<Flex vertical justify='center' align='center'>
							<Text>Welcome,</Text>
							<Title level={1} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Super Administrator</Title>
						</Flex>



						<Button
							type='primary'
							icon={signingIn ? <LoadingOutlined /> : <GoogleOutlined />}
							size='large'
							onClick={signInWithGoogle}
						>
							Sign in with Google
						</Button>
					</Flex>
					<Text style={{ display: 'block', textAlign: 'center' }}>Copyright © Colegio de Montalban 2025.</Text>
				</Flex>
			</Card>
		</>
	);
};

export default SignIn;