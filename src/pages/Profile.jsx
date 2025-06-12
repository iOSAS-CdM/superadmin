import React from 'react';
import { useNavigate, useLocation } from 'react-router';

import {
	Flex,
	Card,
	Typography,
	Button,
	Avatar,
	Table,
	Tag,
	Divider
} from 'antd';

import {
	UserOutlined,
	LeftOutlined,
	MailOutlined,
	PhoneOutlined,
	LockOutlined
} from '@ant-design/icons';

import { MobileContext } from '../main';

const { Title, Text } = Typography;

import Header from '../components/Header';

import '../styles/pages/Dashboard.css';

const Profile = () => {
	const { mobile } = React.useContext(MobileContext);
	const [activities, setActivities] = React.useState([]);

	React.useEffect(() => {
		setActivities([
			{
				id: 1,
				type: 'login',
				timestamp: new Date().toLocaleString(),
				description: 'Logged in to the system.'
			},
			{
				id: 2,
				type: 'update',
				timestamp: new Date().toLocaleString(),
				description: 'Updated profile information.'
			},
			{
				id: 3,
				type: 'update',
				timestamp: new Date().toLocaleString(),
				description: 'Updated student 22-00250\'s profile.'
			},
			{
				id: 4,
				type: 'login',
				timestamp: new Date().toLocaleString(),
				description: 'Logged out of the system.'
			}
		]);
	}, []);

	const navigate = useNavigate();
	const location = useLocation();

	return (
		<Card className='scrollable-content page-container' size='small'>
			{/************************** Header **************************/}
			<Flex vertical justify='flex-start' align='stretch' gap='small'>
				<Header
					icon={<UserOutlined />}
					title={<Title level={3}>Staff Profile</Title>}
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

				{/************************** Profile **************************/}
				<Flex justify='flex-start' align='stretch' gap='small'>
					<Avatar
						src={location.state?.staff?.profilePicture || 'https://via.placeholder.com/150'}
						objectFit='cover'
						alt='Profile Picture'
						shape='square'
						style={{
							height: 'calc(var(--space-XL) * 12)',
							width: 'calc(var(--space-XL) * 12)'
						}}
					/>

					<Card style={{ flex: 1 }}>
						<Flex vertical gap='small' justify='center' align='stretch' style={{ height: '100%' }}>
							<Title level={2}>
								{`${location.state?.staff?.name.first} ${location.state?.staff?.name.middle ? `${location.state?.staff?.name.middle} ` : ''}`} {location.state?.staff?.name.last}
							</Title>
							<Text type='secondary'>{
								location.state?.position === 'head' ? 'Head' : location.state?.position === 'guidance' ? 'Guidance Officer' :
									location.state?.position === 'prefect' ? 'Prefect of Discipline Officer' : 'Student Affairs Officer'
							}</Text>

							<Flex gap='small' >
								<Button
									type='link'
									icon={<MailOutlined />}
									style={{ padding: 0 }}
								>
									{location.state?.staff?.email}
								</Button>

								{location.state?.staff?.phone &&
									<Button
										type='link'
										icon={<PhoneOutlined />}
										style={{ padding: 0 }}
									>
										{location.state?.staff?.phone}
									</Button>
								}
							</Flex>

							<Divider />

							<Flex justify='flex-start' align='stretch' gap='small'>
								<Button
									type='primary'
									icon={<UserOutlined />}
								>
									Edit Profile
								</Button>
								<Button
									type='primary'
									danger
									icon={<LockOutlined />}
								>
									Restrict Access
								</Button>
							</Flex>
						</Flex>
					</Card>
				</Flex>

				{/************************** Recent Activities **************************/}
				<Flex vertical gap='small' justify='flex-start' align='stretch'>
					<Card title='Recent Activities' size='small'>
						<Table
							dataSource={activities}
							rowKey='id'
							pagination={false}
							bordered
							size='small'
						>
							<Table.Column
								title='Timestamp'
								dataIndex='timestamp'
								key='timestamp'
								render={(timestamp) => {
									// Day (word) - Month (word) - Year, Hour:Minute:Second
									const date = new Date(timestamp);
									return date.toLocaleString('en-US', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit'
									});
								}}
							/>
							<Table.Column
								title='Type'
								dataIndex='type'
								key='type'
								render={(type) => (
									<Tag color={type === 'login' ? 'green' : 'blue'}>
										{type.charAt(0).toUpperCase() + type.slice(1)}
									</Tag>
								)}
							/>
							<Table.Column
								title='Description'
								dataIndex='description'
								key='description'
							/>
						</Table>
					</Card>
				</Flex>
			</Flex>
		</Card>
	);
};

export default Profile;
