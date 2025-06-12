import React from 'react';
import { useNavigate } from 'react-router';

import {
	Flex,
	Card,
	Typography,
	Button,
	Input,
	Upload
} from 'antd';

import {
	ToolOutlined,
	LeftOutlined,
	RightOutlined,
	KeyOutlined
} from '@ant-design/icons';

import { MobileContext } from '../main';

const { Title, Text } = Typography;

import Header from '../components/Header';

import '../styles/pages/Dashboard.css';

const Profile = () => {
	const { mobile } = React.useContext(MobileContext);

	const navigate = useNavigate();

	return (
		<Card className='scrollable-content page-container' size='small'>
			{/************************** Header **************************/}
			<Flex vertical justify='flex-start' align='stretch' gap='small'>
				<Header
					icon={<ToolOutlined />}
					title={<Title level={3}>Configure System</Title>}
					actions={
						<>
							<Button
								type='primary'
								icon={<LeftOutlined />}
								onClick={() => {
									navigate('/dashboard');
								}}
							>Back</Button>
						</>
					}
				/>

				{/************************** Configuration **************************/}
				<Card
					title={<Title level={2}>Version Control</Title>}
				>
					<Flex vertical justify='flex-start' align='stretch' gap='large'>
						<Flex vertical justify='flex-start' align='stretch' gap='small'>
							<Title level={5}>Desktop</Title>
							<Flex justify='flex-start' align='stretch' gap='large'>
								<Flex vertical justify='flex-start' align='stretch' flex={1}>
									<Input
										value='vPr0t0typ3-0s4s'
									/>
									<Text type='secondary'>Github Action Build</Text>
								</Flex>

								<Button
									type='primary'
									onClick={() => {
										// Placeholder for update action
										console.log('Update action triggered');
									}}
									icon={<RightOutlined />}
									iconPosition='end'
								>
									Deploy
								</Button>

								<Flex vertical justify='flex-start' align='stretch' flex={1}>
									<Input
										value='vD3pl0y3d-0s4s'
									/>
									<Text type='secondary'>Deployed Software</Text>
								</Flex>
							</Flex>
						</Flex>
						<Flex vertical justify='flex-start' align='stretch' gap='small'>
							<Title level={5}>Mobile</Title>
							<Flex justify='flex-start' align='stretch' gap='large'>
								<Flex vertical justify='flex-start' align='stretch' flex={1}>
									<Input
										value='vPr0t0typ3-0s4s'
										readOnly
									/>
									<Text type='secondary'>EAS App Build</Text>
								</Flex>

								<Button
									type='primary'
									onClick={() => {
										// Placeholder for update action
										console.log('Update action triggered');
									}}
									icon={<RightOutlined />}
									iconPosition='end'
								>
									Deploy
								</Button>

								<Flex vertical justify='flex-start' align='stretch' flex={1}>
									<Input
										value='vD3pl0y3d-0s4s'
										readOnly
									/>
									<Text type='secondary'>Deployed Application</Text>
								</Flex>
							</Flex>
						</Flex>

						<Flex vertical justify='flex-start' align='stretch' gap='small'>
							<Title level={5}>Website</Title>
							<Flex justify='flex-start' align='stretch' gap='large'>
								<Flex vertical justify='flex-start' align='stretch' flex={1}>
									<Input
										value='vPr0t0typ3-0s4s'
										readOnly
									/>
									<Text type='secondary'>Github Action Build</Text>
								</Flex>

								<Button
									type='primary'
									onClick={() => {
										// Placeholder for update action
										console.log('Update action triggered');
									}}
									icon={<RightOutlined />}
									iconPosition='end'
								>
									Deploy
								</Button>

								<Flex vertical justify='flex-start' align='stretch' flex={1}>
									<Input
										value='vD3pl0y3d-0s4s'
									/>
									<Text type='secondary'>Deployed Website</Text>
								</Flex>
							</Flex>
						</Flex>
					</Flex>
				</Card>


				{/************************** Secret keys **************************/}

				<Card
					title={<Title level={2}>Secret Keys</Title>}
				>
					<Flex vertical justify='flex-start' align='stretch' gap='large'>
						<Flex justify='flex-start' align='stretch' gap='small'>
							<Title level={5} style={{ width: 'calc(var(--space-XL) * 14)' }}>Github Personal Access Token</Title>
							<Input
								value='AIzaSyD3pl0y3d-0s4s'
								readOnly
								suffix={<KeyOutlined />}
							/>
						</Flex>
						<Flex justify='flex-start' align='stretch' gap='small'>
							<Title level={5} style={{ width: 'calc(var(--space-XL) * 14)' }}>EAS App Token</Title>
							<Input
								value='AIzaSyD3pl0y3d-0s4s'
								readOnly
								suffix={<KeyOutlined />}
							/>
						</Flex>
						<Flex justify='flex-start' align='stretch' gap='small'>
							<Title level={5} style={{ width: 'calc(var(--space-XL) * 14)' }}>OpenAI API Key</Title>
							<Input
								value='AIzaSyD3pl0y3d-0s4s'
								readOnly
								suffix={<KeyOutlined />}
							/>
						</Flex>
						<Flex justify='flex-start' align='stretch' gap='small'>
							<Title level={5} style={{ width: 'calc(var(--space-XL) * 14)' }}>Firebase Admin Credentials</Title>
							<Flex vertical justify='flex-start' align='stretch' flex={1}>
								<Upload
									listType='text'
									fileList={[
										{
											name: 'firebase-admin.json',
											status: 'done',
											url: 'https://example.com/firebase-admin.json',
											size: 12345,
											type: 'application/json'
										}
									]}
								></Upload>
								<Text type='secondary'>Upload your Firebase Admin credentials in JSON format.</Text>
							</Flex>
						</Flex>
					</Flex>
				</Card>
			</Flex>
		</Card>
	);
};

export default Profile;
