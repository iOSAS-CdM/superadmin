import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';

import {
	Flex,
	Card,
	Typography,
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
	LockOutlined,
	UnlockOutlined
} from '@ant-design/icons';

import Button from '../components/Button';

import { MobileContext } from '../main';

const { Title, Text } = Typography;

import Header from '../components/Header';

import EditStaff from '../modals/EditStaff';
import RestrictStaff from '../modals/RestrictStaff';

import '../styles/pages/Dashboard.css';

import { API_Route } from '../main';

const Profile = () => {
	const { mobile } = React.useContext(MobileContext);
	const [activities, setActivities] = React.useState([]);
	const [editing, setEditing] = React.useState(false);
	const [restricting, setRestricting] = React.useState(false);

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


	const { staffId } = useParams();

	const [staff, setStaff] = React.useState({
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
		fetch(`${API_Route}/superadmin/staff/${staffId}`)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				if (data)
					setStaff(data);
			})
			.catch(error => console.error('Error fetching staff data:', error));
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
					{!mobile && <Avatar
						src={staff.profilePicture}
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
								src={staff.profilePicture}
								objectFit='cover'
								alt='Profile Picture'
								shape='square'
								style={{
									height: 'calc(var(--space-XL) * 12)',
									width: 'calc(var(--space-XL) * 12)'
								}}
							/>}

							<Title level={2}>
								{`${staff.name.first} ${staff.name.middle ? `${staff.name.middle} ` : ''}`} {staff.name.last}
							</Title>
							<Text type='secondary'>
								{
									staff.role === 'head' ? 'Head' : staff.role === 'guidance' ? 'Guidance Officer' :
										staff.role === 'prefect' ? 'Prefect of Discipline Officer' : 'Student Affairs Officer'
								} - {staff.id}
							</Text>

							<Flex gap='small' >
								<Button
									type='link'
									icon={<MailOutlined />}
									style={{ padding: 0 }}
								>
									{staff.email}
								</Button>

								{staff.phone &&
									<Button
										type='link'
										icon={<PhoneOutlined />}
										style={{ padding: 0 }}
									>
										{staff.phone}
									</Button>
								}
							</Flex>

							<Divider />

							<Flex justify='flex-start' align='stretch' gap='small'>
								{staff.status !== 'restricted' ? (
									<>
										<Button
											type='primary'
											icon={<EditOutlined />}
											onClick={async () => {
												const newStaff = await EditStaff(Modal, staff, setRefreshSeed, editing, setEditing, setStaff, Notification);
												if (staff.id !== newStaff.id) {
													navigate(`/dashboard`);
												};
											}}
										>
											Edit Profile
										</Button>
										<Button
											type='primary'
											danger
											icon={<LockOutlined />}
											onClick={async () => {
												setRestricting(true);
												const success = await RestrictStaff(Modal, staff, setRefreshSeed, restricting, setRestricting, Notification);
												setRestricting(false);
											}}
										>
											Restrict Access
										</Button>
									</>
								) : (
									<>
										<Button
											type='primary'
											icon={<UnlockOutlined />}
											onClick={async () => {
												await fetch(`${API_Route}/superadmin/staff/${staff.id}/unrestrict`, {
													method: 'PATCH',
													headers: {
														'Content-Type': 'application/json',
													},
													body: JSON.stringify({}),
												})
													.then((res) => {
														if (res.ok) {
															Notification.success({ message: 'Staff unrestricted successfully' });
															setRefreshSeed((s) => s + 1);
														} else {
															Notification.error({ message: 'Failed to unblock staff' });
														};
													});
											}}
										>
											Unrestrict Access
										</Button>
									</>
								)}
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
