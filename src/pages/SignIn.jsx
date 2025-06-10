import React from 'react';

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

import remToPx from '../utils/remToPx';

const { Text, Title } = Typography;

import '../styles/pages/SignIn.css';

const SignIn = () => {
	const [signingIn, setSigningIn] = React.useState(false);

	const { mobile, setMobile } = React.useContext(MobileContext);

	const signIn = () => {
		setSigningIn(true);

		setTimeout(() => {
			setSigningIn(false);
			window.location.href = '/dashboard';
		}, remToPx(20));
	};

	return (
		<>
			<div id='auth-background'></div>

			<Card id='sign-in' className={mobile ? 'mobile' : ''}>
				<Flex vertical justify='space-between' align='center' gap='large'>
					<Flex vertical justify='center' align='center' gap='large'>
						<Image
							src='/CdM-OSAS Banner.png'
							alt='Logo Colegio de Montalban'
							width='75%'
							preview={false}
						/>

						<Divider />

						<Flex vertical justify='center' align='center'>
							<Text>Welcome,</Text>
							<Title level={1} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Admin</Title>
						</Flex>

						<Form
							layout='vertical'
							onFinish={(values) => {
								signIn();
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
							icon={<GoogleOutlined />}
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