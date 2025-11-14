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
	App,
	Badge
} from 'antd';

import {
	EditOutlined,
	LeftOutlined,
	MailOutlined,
	PhoneOutlined,
	LockOutlined,
	UnlockOutlined,
	DeleteOutlined
} from '@ant-design/icons';

import Button from '../components/Button';

import { useMobile } from '../contexts/MobileContext';
import authFetch from '../utils/authFetch';

const { Title, Text } = Typography;

import Header from '../components/Header';

import EditStaff from '../modals/EditStaff';
import RestrictStaff from '../modals/RestrictStaff';

import '../styles/pages/Dashboard.css';

import { API_Route } from '../main';

const Profile = () => {
	const isMobile = useMobile();
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
		authFetch(`${API_Route}/superadmin/staff/${staffId}`)
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
				<Badge.Ribbon
					text={staff.status === 'restricted' ? 'Restricted' : null}
					color='red'
					style={{ display: staff.status === 'restricted' ? 'block' : 'none' }}
				>
					<Flex justify='flex-start' align='stretch' gap='small'>
						{!isMobile && <Avatar
							src={staff.profilePicture}
							alt='Profile Picture'
							shape='square'
							className={staff.status === 'restricted' ? 'staff-card-restricted' : ''}
							style={{
								height: 'calc(var(--space-XL) * 12)',
								width: 'calc(var(--space-XL) * 12)',
								overflow: 'hidden'
							}}
						/>}
						<Card className={staff.status === 'restricted' ? 'staff-card-restricted' : ''} style={{ flex: 1, overflow: 'hidden' }}>
							<Flex
								vertical
								gap='small'
								justify='center'
								align={!isMobile ? 'stretch' : 'center'}
								style={{ height: '100%', ...isMobile ? { textAlign: 'center' } : {} }}
							>
								{isMobile && <Avatar
									src={staff.profilePicture}
									objectFit='cover'
									alt='Profile Picture'
									shape='square'
									style={{
										height: 'calc(var(--space-XL) * 12)',
										width: 'calc(var(--space-XL) * 12)'
									}}
								/>}
								<Flex vertical justify='center' align={!isMobile ? 'flex-start' : 'center'}>
									<Title level={2}>
										{`${staff.name.first} ${staff.name.middle ? `${staff.name.middle} ` : ''}`} {staff.name.last}
									</Title>
									<Text type='secondary'>
										{
											staff.role === 'head' ? 'Head' : staff.role === 'guidance' ? 'Guidance Officer' :
												staff.role === 'prefect' ? 'Prefect of Discipline Officer' : 'Student Affairs Officer'
										} - {staff.id}
									</Text>
								</Flex>
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
													await authFetch(`${API_Route}/superadmin/staff/${staff.id}/unrestrict`, {
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
											<Button
												type='primary'
												icon={<DeleteOutlined />}
												danger
												onClick={async () => {
													Modal.confirm({
														title: 'Are you sure you want to delete this staff?',
														okButtonProps: { danger: true },
														onOk: () =>
															authFetch(`${API_Route}/superadmin/staff/${thisStaff.id}`, {
																method: 'DELETE',
															})
																.then((res) => {
																	if (res.ok) {
																		Notification.success({ message: 'Staff deleted successfully' });
																		navigate('/dashboard');
																	} else {
																		Notification.error({ message: 'Failed to delete staff' });
																	};
																})
													});
												}}
											>
												Delete Staff
											</Button>
										</>
									)}
								</Flex>
							</Flex>
						</Card>
					</Flex>
				</Badge.Ribbon>

				{staff.status === 'restricted' && (
					<Card size='small' className={staff.status === 'restricted' ? 'staff-card-restricted' : ''}>
						<Text type='danger' style={{ fontSize: 12 }}>Restriction:</Text>
						<br />
						<Title type='danger' level={3}>{staff.reason}</Title>
					</Card>
				)}
			</Flex>
		</Card>
	);
};

export default Profile;
