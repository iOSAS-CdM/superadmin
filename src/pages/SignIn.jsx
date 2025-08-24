import React from 'react';
import { useNavigate } from 'react-router';
import supabase from '../utils/supabaseClient';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-shell';
import { start, cancel } from '@fabianlars/tauri-plugin-oauth';


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

import { MobileContext } from '../main';

const { Text, Title } = Typography;

import '../styles/pages/SignIn.css';

const SignIn = () => {
	const [signingIn, setSigningIn] = React.useState(false);
	const { mobile, setMobile } = React.useContext(MobileContext);

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
	}, []);

	return (
		<>
			<div id='auth-background'></div>

			<Card id='sign-in' className={`page-container${mobile ? ' mobile' : ''}`}>
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

						<Form
							layout='vertical'
							ref={AuthForm}
							onFinish={(values) => {
								signIn(values);
							}}
						>
							<Form.Item
								name='email'
								rules={[{ required: true, message: 'Please input your email!' }]}
							>
								<Input placeholder='Email' type='email' />
							</Form.Item>

							<Form.Item
								name='password'
								rules={[{ required: true, message: 'Please input your password!' }]}
							>
								<Input.Password placeholder='Password' type='password' />
							</Form.Item>

							<Flex justify='space-between' align='center' gap='small'>
								<Form.Item name='remember' valuePropName='checked' noStyle>
									<Checkbox>Remember me</Checkbox>
								</Form.Item>
								<Button
									type='primary'
									htmlType='submit'
									icon={signingIn ? <LoadingOutlined /> : <LoginOutlined />}
									disabled={signingIn}
								>
									Sign In
								</Button>
							</Flex>
						</Form>

						<Divider>or</Divider>

						<Button
							icon={signingIn ? <LoadingOutlined /> : <GoogleOutlined />}
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