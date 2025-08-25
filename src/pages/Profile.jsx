import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';

import {
	Flex,
	Card,
	Typography,
	Button,
	Avatar,
	Table,
	Tag,
	Divider,
	App
} from 'antd';

import {
	EditOutlined,
	LeftOutlined,
	MailOutlined,
	PhoneOutlined,
	LockOutlined
} from '@ant-design/icons';

import { MobileContext } from '../main';

const { Title, Text } = Typography;

import Header from '../components/Header';

import EditAdmin from '../modals/EditAdmin';

import '../styles/pages/Dashboard.css';

import { API_Route } from '../main';

const Profile = () => {
	const { mobile } = React.useContext(MobileContext);
	const [activities, setActivities] = React.useState([]);
	const [editing, setEditing] = React.useState(false);

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


	const { adminId } = useParams();

	const [admin, setAdmin] = React.useState({
		id: '',
		name: {
			first: '',
			middle: '',
			last: ''
		},
		email: '',
		role: '',
		profilePicture: ''
	});
	const [refreshSeed, setRefreshSeed] = React.useState(0);

	React.useEffect(() => {
		fetch(`${API_Route}/superadmin/admin/${adminId}`)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				if (data)
					setAdmin(data);
			})
			.catch(error => console.error('Error fetching admin data:', error));
	}, [refreshSeed])

	const app = App.useApp();
	const Modal = app.modal;
	const Notification = app.notification;

	return (
		<Card className='scrollable-content page-container' size='small'>
			{/************************** Header **************************/}
			<Flex vertical justify='flex-start' align='stretch' gap='small'>
				<Header
					icon={<EditOutlined />}
					title={<Title level={3}>Admin Profile</Title>}
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
					{!mobile && <Avatar
						src={admin.profilePicture}
						alt='Profile Picture'
						shape='square'
						style={{
							height: 'calc(var(--space-XL) * 12)',
							width: 'calc(var(--space-XL) * 12)'
						}}
					/>}

					<Card style={{ flex: 1 }}>
						<Flex
							vertical
							gap='small'
							justify='center'
							align={!mobile ? 'stretch' : 'center'}
							style={{ height: '100%', ...mobile ? { textAlign: 'center' } : {} }}
						>
							{mobile && <Avatar
								src={admin.profilePicture}
								objectFit='cover'
								alt='Profile Picture'
								shape='square'
								style={{
									height: 'calc(var(--space-XL) * 12)',
									width: 'calc(var(--space-XL) * 12)'
								}}
							/>}

							<Title level={2}>
								{`${admin.name.first} ${admin.name.middle ? `${admin.name.middle} ` : ''}`} {admin.name.last}
							</Title>
							<Text type='secondary'>
								{
									admin.role === 'head' ? 'Head' : admin.role === 'guidance' ? 'Guidance Officer' :
										admin.role === 'prefect' ? 'Prefect of Discipline Officer' : 'Student Affairs Officer'
								} - {admin.id}
							</Text>

							<Flex gap='small' >
								<Button
									type='link'
									icon={<MailOutlined />}
									style={{ padding: 0 }}
								>
									{admin.email}
								</Button>

								{admin.phone &&
									<Button
										type='link'
										icon={<PhoneOutlined />}
										style={{ padding: 0 }}
									>
										{admin.phone}
									</Button>
								}
							</Flex>

							<Divider />

							<Flex justify='flex-start' align='stretch' gap='small'>
								<Button
									type='primary'
									icon={<EditOutlined />}
									onClick={async () => {
										EditAdmin(Modal, admin, setRefreshSeed, editing, setEditing, setAdmin, Notification);
									}}
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
				<Table
					dataSource={activities}
					rowKey='id'
					pagination={false}
					bordered
					size='small'
					showHeader={true}
					title={() => (
						<Title level={4} style={{ margin: 0 }}>Recent Activities</Title>
					)}
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
			</Flex>
		</Card>
	);
};

export default Profile;
