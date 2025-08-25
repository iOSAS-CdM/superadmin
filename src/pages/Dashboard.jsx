import React from 'react';
import { useNavigate } from 'react-router';
import supabase from '../utils/supabaseClient';

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
	Select,
	Upload,
	Avatar,
	App,
	Form,
	Space,
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
	RightOutlined,
	FilterOutlined
} from '@ant-design/icons';

import { MobileContext } from '../main';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

import Header from '../components/Header';

import '../styles/pages/Dashboard.css';

import AddNewAdmin from '../modals/AddNewAdmin';
import EditAdmin from '../modals/EditAdmin';
import RestrictAdmin from '../modals/RestrictAdmin';

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
	const [admins, setAdmins] = React.useState([]);

	React.useEffect(() => {
		const placeholderAdmins = [];
		for (let i = 0; i < 20; i++) {
			const id = `placeholder-025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${i + 1}`;
			if (admins.some(admin => admin.id === id)) {
				continue;
			};
			placeholderAdmins.push({
				id: id,
				name: {
					first: `First ${i + 1}`,
					middle: `Middle ${i + 1}`,
					last: `Last ${i + 1}`
				},
				email: `admin${i + 1}@example.com`,
				role: i === 0 ? 'head' : ['guidance', 'prefect', 'student-affairs'][i % 3],
				profilePicture: null,
				placeholder: true,
				status: 'active'
			});
		};
		setAdmins(placeholderAdmins);

		fetch(`${API_Route}/superadmin/admins`)
			.then(response => response.json())
			.then(data => {
				if (Array.isArray(data))
					setAdmins(data);
			})
			.catch(error => console.error('Error fetching admin data:', error));
	}, [refreshSeed]);

	const categorizedAdmins = React.useMemo(() => {
		if (category === 'all') return admins;
		return admins.filter(admin => admin.role === category);
	}, [admins, category]);
	const searchFilteredAdmins = React.useMemo(() => {
		if (!searchTerm) return categorizedAdmins;
		const lowerSearchTerm = searchTerm.toLowerCase();
		return categorizedAdmins.filter(admin =>
			`${admin.name.first} ${admin.name.middle} ${admin.name.last}`.toLowerCase().includes(lowerSearchTerm) ||
			admin.email.toLowerCase().includes(lowerSearchTerm) ||
			admin.id.toLowerCase().includes(lowerSearchTerm)
		);
	}, [categorizedAdmins, searchTerm]);

	const signOut = () => {
		supabase.auth.signOut();
	};

	const { mobile } = React.useContext(MobileContext);

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
									icon={<ToolOutlined />}
									onClick={() => {
										navigate('/configure');
									}}
								>Configure System</Button>
								<Button
									type='primary'
									icon={addingNew ? <LoadingOutlined /> : <UserAddOutlined />}
									onClick={async () => {
										const admin = await AddNewAdmin(Modal, addingNew, setAddingNew, admins, setAdmins, Notification);
										if (!admin) return;
										setRefreshSeed(prev => prev + 1);
									}}
								>Add New</Button>
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
						<Card size='small' {...mobile ? { style: { width: '100%' } } : {}}>
							<Input
								placeholder='Search'
								allowClear
								value={searchTerm}
								prefix={<SearchOutlined />}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</Card>
						<Card size='small'>
							{!mobile ? (
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


					{/************************** Grid of Admins **************************/}
					{searchFilteredAdmins.length > 0 ?
						<Flex vertical justify='flex-start' align='flex-start' gap='small' flex={1}>
							<Row gutter={[remToPx(1), remToPx(1)]} style={{ width: '100%' }}>
								{searchFilteredAdmins.map((admin, index) => (
									<Col key={admin.id} span={!mobile ? 8 : 24}>
										<AdminCard admin={admin} animationDelay={index * 0.1} loading={admin.placeholder} />
									</Col>
								))}
							</Row>
						</Flex>
						:
						<Flex vertical justify='center' align='center' style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none' }}>
							<Empty description='No admin found' />
						</Flex>
					}
				</Flex>
			</Card>
		</RefreshSeedContext.Provider>
	);
};

export default Dashboard;

const AdminCard = ({ admin, animationDelay, loading }) => {
	const [mounted, setMounted] = React.useState(false);

	const [thisAdmin, setThisAdmin] = React.useState(admin);

	const navigate = useNavigate();

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setMounted(true);
		}, animationDelay * 1000 || 0);

		return () => clearTimeout(timer);
	}, [animationDelay]);

	React.useEffect(() => {
		if (admin) {
			setThisAdmin(admin);
		};
	}, [admin]);

	const app = App.useApp();
	const Modal = app.modal;
	const Notification = app.notification;
	const [editing, setEditing] = React.useState(false);

	const { setRefreshSeed } = React.useContext(RefreshSeedContext);

	return (
		<Card
			size='small'
			hoverable
			loading={loading}
			className={mounted ? 'admin-card-mounted' : 'admin-card-unmounted'}
			actions={[
				<EditOutlined onClick={() => EditAdmin(Modal, thisAdmin, setRefreshSeed, editing, setEditing, setThisAdmin, Notification)} key='edit' />,
				<LockOutlined onClick={() => RestrictAdmin(Modal, thisAdmin)} key='restrict' />,
				<RightOutlined onClick={() => {
					navigate(`/admin/${thisAdmin.id}`);
				}} key='view' />
			]}
		>
			<Flex justify='flex-start' align='flex-start' gap='small' style={{ width: '100%' }}>
				<Avatar
					src={thisAdmin.profilePicture ?? thisAdmin.name.first.charAt(0).toUpperCase()}
					size='large'
				/>
				<Flex vertical justify='flex-start' align='flex-start'>
					<Title level={4}>{`${thisAdmin.name.first} ${thisAdmin.name.last}`}</Title>
					<Text>{
						thisAdmin.role === 'head' ? 'Head' : thisAdmin.role === 'guidance' ? 'Guidance Officer' :
							thisAdmin.role === 'prefect' ? 'Prefect of Discipline Officer' : 'Student Affairs Officer'
					}</Text>
				</Flex>
			</Flex>
		</Card>
	);
};