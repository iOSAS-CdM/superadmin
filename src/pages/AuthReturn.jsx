import React from 'react';

import { Flex, Button, Image, Typography, Card } from 'antd';

const { Text, Title } = Typography;

import '../styles/pages/SignIn.css';

const AuthReturn = () => {
	return (
		<>
			<div id='auth-background'></div>

			<Card
				style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)'
				}}
			>
				<Flex vertical align='center' gap={32}>
					<Image width={256} height={256} src='/CDM Logo.png' preview={false} />
					<Flex vertical align='center' gap={4}>
						<Title level={3} style={{ textAlign: 'center' }}>Authentication Successful</Title>
						<Text style={{ textAlign: 'center' }}>Please return to the app</Text>
					</Flex>
				</Flex>
			</Card>
		</>
	);
};

export default AuthReturn;