import React from 'react';
import { useNavigate } from 'react-router';
import supabase from '../utils/supabaseClient';
import authFetch from '../utils/authFetch';

import {
	Flex,
	Card,
	Row,
	Col,
	Dropdown,
	Typography,
	Button,
	Input,
	Segmented,
	Avatar,
	App,
	Tooltip,
	Badge,
	Empty
} from 'antd';

import {
	HomeOutlined,
	UserAddOutlined,
	LogoutOutlined,
	ToolOutlined,
	LoadingOutlined,
	SearchOutlined,
	EditOutlined,
	LockOutlined,
	UnlockOutlined,
	RightOutlined,
	FilterOutlined,
	DeleteOutlined,
	BugOutlined,
	DashboardOutlined
} from '@ant-design/icons';

import { useMobile } from '../contexts/MobileContext';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

import Header from '../components/Header';

import '../styles/pages/Dashboard.css';

import AddNewStaff from '../modals/AddNewStaff';
import EditStaff from '../modals/EditStaff';
import RestrictStaff from '../modals/RestrictStaff';

import { API_Route } from '../main';

const RefreshSeedContext = React.createContext({
	refreshSeed: 0,
	setRefreshSeed: () => { }
});

const Dashboard = () => {
	const [signingOut, setSigningOut] = React.useState(false);
	const [addingNew, setAddingNew] = React.useState(false);

	const app = App.useApp();
	const Modal = app.modal;
	const Notification = app.notification;

	const [refreshSeed, setRefreshSeed] = React.useState(0);
	const [category, setCategory] = React.useState('all');
	const [searchTerm, setSearchTerm] = React.useState('');
	const [staffs, setStaffs] = React.useState([]);

	React.useEffect(() => {
		const placeholderStaffs = [];
		for (let i = 0; i < 20; i++) {
			const id = `placeholder-025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${i + 1}`;
			if (staffs.some(staff => staff.id === id)) {
				continue;
			};
			placeholderStaffs.push({
				id: id,
				name: {
					first: `First ${i + 1}`,
					middle: `Middle ${i + 1}`,
					last: `Last ${i + 1}`
				},
				email: `staff${i + 1}@example.com`,
				role: i === 0 ? 'head' : ['guidance', 'prefect', 'student-affairs'][i % 3],
				profilePicture: null,
				placeholder: true,
				status: 'active'
			});
		};
		setStaffs(placeholderStaffs);

		authFetch(`${API_Route}/superadmin/staffs`)
			.then(response => response.json())
			.then(data => {
				if (Array.isArray(data))
					setStaffs(data);
			})
			.catch(error => console.error('Error fetching staff data:', error));
	}, [refreshSeed]);

	const categorizedStaffs = React.useMemo(() => {
		if (category === 'all') return staffs;
		return staffs.filter(staff => staff.role === category);
	}, [staffs, category]);
	const searchFilteredStaffs = React.useMemo(() => {
		if (!searchTerm) return categorizedStaffs;
		const lowerSearchTerm = searchTerm.toLowerCase();
		return categorizedStaffs.filter(staff =>
			`${staff.name.first} ${staff.name.middle} ${staff.name.last}`.toLowerCase().includes(lowerSearchTerm) ||
			staff.email.toLowerCase().includes(lowerSearchTerm) ||
			staff.id.toLowerCase().includes(lowerSearchTerm)
		);
	}, [categorizedStaffs, searchTerm]);

	const signOut = () => {
		supabase.auth.signOut();
	};

	const isMobile = useMobile();

	const navigate = useNavigate();

	return (
		<RefreshSeedContext.Provider value={{ refreshSeed, setRefreshSeed }}>
			<Card className='scrollable-content page-container' size='small'>
				{/************************** Header **************************/}
				<Flex vertical justify='flex-start' align='stretch' gap='small'>
					<Header
						icon={<HomeOutlined />}
						title={<Title level={3}>Dashboard</Title>}
						actions={
							<>
								<Button
									icon={<BugOutlined />}
									onClick={() => {
										navigate('/bugs');
									}}
								>Bug Reports</Button>
								<Button
									icon={<ToolOutlined />}
									onClick={() => {
										navigate('/configure');
									}}
								>Configure System</Button>
								<Button
									icon={<DashboardOutlined />}
									onClick={() => {
										navigate('/system-vitals');
									}}
								>System Vitals</Button>
								<Button
									type='primary'
									icon={signingOut ? <LoadingOutlined /> : <LogoutOutlined />}
									disabled={signingOut}
									onClick={signOut}
									danger
								>Sign Out</Button>
							</>
						}
					/>

					{/************************** Filter **************************/}
					<Flex justify='space-between' align='center' gap='small'>
						<Card size='small' {...isMobile ? { style: { width: '100%' } } : {}}>
							<Flex justify='space-between' align='center' gap='small'>
								<Input
									placeholder='Search'
									allowClear
									value={searchTerm}
									prefix={<SearchOutlined />}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>

								<Button
									type='primary'
									icon={addingNew ? <LoadingOutlined /> : <UserAddOutlined />}
									onClick={async () => {
										const staff = await AddNewStaff(Modal, addingNew, setAddingNew, staffs, setStaffs, Notification);
										if (!staff) return;
										setRefreshSeed(prev => prev + 1);
									}}
								>Add New</Button>
							</Flex>
						</Card>
						<Card size='small'>
							{!isMobile ? (
								<Segmented
									options={[
										{ label: 'All', value: 'all' },
										{ label: 'Guidance Officer', value: 'guidance' },
										{ label: 'Prefect of Discipline Officer', value: 'prefect' },
										{ label: 'Student Affairs Officer', value: 'student-affairs' }
									]}
									value={category}
									onChange={(value) => setCategory(value)}
									style={{ width: '100%' }}
								/>
							) : (
								<Dropdown
									trigger={['click']}
									placement='bottomRight'
									arrow
									popupRender={(menu) => (
										<Card size='small'>
											<Segmented
												options={[
													{ label: 'All', value: 'all' },
													{ label: 'Guidance Officer', value: 'guidance' },
													{ label: 'Prefect of Discipline Officer', value: 'prefect' },
													{ label: 'Student Affairs Officer', value: 'student-affairs' }
												]}
												vertical
												value={category}
												onChange={(value) => setCategory(value)}
												style={{ width: '100%' }}
											/>
										</Card>
									)}
								>
									<Button
										icon={<FilterOutlined />}
										onClick={(e) => e.stopPropagation()}
									/>
								</Dropdown>
							)}
						</Card>
					</Flex>


					{/************************** Grid of Staff **************************/}
					{searchFilteredStaffs.length > 0 ?
						<Flex vertical justify='flex-start' align='flex-start' gap='small' flex={1}>
							<Row gutter={[remToPx(1), remToPx(1)]} style={{ width: '100%' }}>
								{searchFilteredStaffs.map((staff, index) => (
									<Col key={staff.id} span={!isMobile ? 8 : 24}>
										<StaffCard staff={staff} animationDelay={index * 0.1} loading={staff.placeholder} />
									</Col>
								))}
							</Row>
						</Flex>
						:
						<Flex vertical justify='center' align='center' style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none' }}>
							<Empty description='No staff found' />
						</Flex>
					}
				</Flex>
			</Card>
		</RefreshSeedContext.Provider>
	);
};

export default Dashboard;

const StaffCard = ({ staff, animationDelay, loading }) => {
	const [mounted, setMounted] = React.useState(false);

	const [thisStaff, setThisStaff] = React.useState(staff);

	const navigate = useNavigate();

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setMounted(true);
		}, animationDelay * 1000 || 0);

		return () => clearTimeout(timer);
	}, [animationDelay]);

	React.useEffect(() => {
		if (staff) {
			setThisStaff(staff);
		};
	}, [staff]);

	const app = App.useApp();
	const Modal = app.modal;
	const Notification = app.notification;
	const [editing, setEditing] = React.useState(false);
	const [restricting, setRestricting] = React.useState(false);

	const { setRefreshSeed } = React.useContext(RefreshSeedContext);

	return (
		<Badge.Ribbon
			text={thisStaff.status === 'restricted' ? 'Restricted' : null}
			color='red'
			style={{ display: thisStaff.status === 'restricted' ? 'block' : 'none' }}
		>
			<Card
				size='small'
				hoverable
				loading={loading}
				className={(mounted ? 'staff-card-mounted' : 'staff-card-unmounted') + (thisStaff.status === 'restricted' ? ' staff-card-restricted' : '')}
				actions={[
					...thisStaff.status !== 'restricted' ? [
						<Tooltip title='Edit Staff'><EditOutlined onClick={() => EditStaff(Modal, thisStaff, setRefreshSeed, editing, setEditing, setThisStaff, Notification)} key='edit' /></Tooltip>,
						<Tooltip title='Restrict Staff'><LockOutlined onClick={() => RestrictStaff(Modal, thisStaff, setRefreshSeed, restricting, setRestricting, Notification)} key='restrict' /></Tooltip>
					] : [
						<Tooltip title='Unrestrict Staff'>
							<UnlockOutlined onClick={() => {
								authFetch(`${API_Route}/superadmin/staff/${thisStaff.id}/unrestrict`, {
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
							}} key='unrestrict' />
							</Tooltip>,
							<Tooltip title='Delete Staff'>
								<DeleteOutlined onClick={() => {
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
														setRefreshSeed((s) => s + 1);
													} else {
														Notification.error({ message: 'Failed to delete staff' });
													};
												})
									});
								}} key='delete' />
						</Tooltip>
					],
					<Tooltip title='View Staff'>
						<RightOutlined onClick={() => {
							navigate(`/staff/${thisStaff.id}`);
						}} key='view' />
					</Tooltip>
				]}
			>
				<Flex justify='flex-start' align='flex-start' gap='small' style={{ width: '100%' }}>
					<Avatar
						src={thisStaff.profilePicture ?? thisStaff.name.first.charAt(0).toUpperCase()}
						size='large'
					/>
					<Flex vertical justify='flex-start' align='flex-start'>
						<Title level={4}>{`${thisStaff.name.first} ${thisStaff.name.last}`}</Title>
						<Text>{
							thisStaff.role === 'head' ? 'Head' : thisStaff.role === 'guidance' ? 'Guidance Officer' :
								thisStaff.role === 'prefect' ? 'Prefect of Discipline Officer' : 'Student Affairs Officer'
						}</Text>
					</Flex>
				</Flex>

				{thisStaff.status === 'restricted' && (
					<>
						<Text type='danger' style={{ fontSize: 12 }}>Restriction:</Text>
						<br />
						<Title type='danger' level={3}>{thisStaff.reason}</Title>
					</>
				)}
			</Card>
		</Badge.Ribbon>
	);
};