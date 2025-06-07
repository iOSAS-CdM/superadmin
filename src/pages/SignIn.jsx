import React from 'react';

import { Button, Divider, Input, Image, Typography, Checkbox } from 'antd';

import { LoginOutlined, GoogleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

import '../styles/SignIn.css';

export default class SignIn extends React.Component {
	render() {
		return (
			<>
				<div id='auth-background'></div>

				<section id='signIn'>
					<main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
						<Image
							src='./CdM-OSAS Banner.png'
							alt='Logo Colegio de Montalban'
							width='2'
							height='1'
							preview={false}
							style={{ display: 'block' }}
						/>

						<Divider />

						<div id='greetings'>
							<Text>Welcome,</Text>
							<Title level={1} style={{ color: '#106a2e', fontWeight: 'bold' }}>Admin</Title>
						</div>

						<form id='form'>
							<Input placeholder='Email' type='email' />
							<Input.Password placeholder='Password' type='password' />


							<div id='footer'>
								<Checkbox>Remember me</Checkbox>
								<Button
									type='primary'
									icon={<LoginOutlined />}
								>
									Sign In
								</Button>
							</div>
						</form>

						<Divider>or</Divider>

						<Button
							type='secondary'
							icon={<GoogleOutlined />}
						>
							Sign in with Google
						</Button>
					</main>
					<Text style={{ display: 'block', textAlign: 'center' }}>Copyright © Colegio de Montalban 2025.</Text>
				</section>
			</>
		);
	}
};