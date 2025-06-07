import React from 'react';

import { Button, Divider, Input, Image, Typography, Checkbox } from 'antd';

import { LoginOutlined, GoogleOutlined, LoadingOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

import '../styles/SignIn.css';

export default class SignIn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signingIn: false
		};
	};

	signIn = () => {
		this.setState({ signingIn: true });

		setTimeout(() => {
			this.setState({ signingIn: false });
			window.location.href = '/dashboard';
		}, 2000);
	};

	render() {
		return (
			<>
				<div id='auth-background'></div>

				<section id='sign-in' className='scrollable-content'>
					<main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
						<Image
							src='/CdM-OSAS Banner.png'
							alt='Logo Colegio de Montalban'
							width='2'
							height='1'
							preview={false}
							style={{ display: 'block' }}
						/>

						<Divider />

						<div id='greetings'>
							<Text>Welcome,</Text>
							<Title level={1} style={{ color: 'var(--primary-6-light)', fontWeight: 'bold' }}>Admin</Title>
						</div>

						<form id='form'>
							<Input placeholder='Email' type='email' />
							<Input.Password placeholder='Password' type='password' />


							<div id='footer'>
								<Checkbox>Remember me</Checkbox>
								<Button
									type='primary'
									icon={this.state.signingIn ? <LoadingOutlined /> : <LoginOutlined />}
									onClick={this.signIn}
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