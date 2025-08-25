import React from 'react';
import { useNavigate } from 'react-router';

import { Flex, Button, Image, Typography, Card } from 'antd';

const { Text, Title } = Typography;

import '../styles/pages/SignIn.css';

const Unauthorized = () => {
	const navigate = useNavigate();

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
						<Title level={3} style={{ textAlign: 'center' }}>Unauthorized Access</Title>
						<Text style={{ textAlign: 'center' }}>You do not have permission to use this application</Text>
						<Text style={{ textAlign: 'center' }}>Please contact the <a href='mailto:danieljohnbyns@gmail.com'>system developer</a> if you believe this is an error</Text>
					</Flex>
						<Button type='primary' size='large' onClick={() => { window.localStorage.clear(); navigate('/'); }}>Go to Home</Button>
				</Flex>
			</Card>
		</>
	);
};

export default Unauthorized;