import React from 'react';

import {
	Card,
	Flex,
	Space,
	Button,
	Divider,
	Input,
	Image,
	Typography,
	Checkbox
} from 'antd';

import { LoginOutlined, GoogleOutlined, LoadingOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

import '../styles/pages/SignIn.css';

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

				<Card id='sign-in'>
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

							<Flex vertical justify='center' align='center' gap='small'>
								<Input placeholder='Email' type='email' />
								<Input.Password placeholder='Password' type='password' />

								<Flex horizontal justify='space-between' align='center' gap='small'>
									<Checkbox>Remember me</Checkbox>
									<Button
										type='primary'
										icon={this.state.signingIn ? <LoadingOutlined /> : <LoginOutlined />}
										disabled={this.state.signingIn}
										onClick={this.signIn}
									>
										Sign In
									</Button>
								</Flex>
							</Flex>

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
	}
};