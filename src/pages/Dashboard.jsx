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

const Dashboard = () => {
	const [signingOut, setSigningOut] = React.useState(false);
	const [addingNew, setAddingNew] = React.useState(false);
	const [category, setCategory] = React.useState('all');
	const [admins, setAdmins] = React.useState([]);
	const [displayedAdmins, setDisplayedAdmins] = React.useState([]);
	const FilterForm = React.useRef(null);

	const app = App.useApp();
	const Modal = app.modal;
	const Notification = app.notification;

	React.useEffect(() => {
		const placeholderAdmins = [];
		for (let i = 0; i < 20; i++) {
			const id = `placeholder-025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${i + 1}`;
			if (admins.some(admin => admin.employeeId === id)) {
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
				employeeId: id,
				position: i === 0 ? 'head' : ['guidance', 'prefect', 'student-affairs'][i % 3],
				profilePicture: null,
				placeholder: true,
				status: 'active'
			});
		};
		setAdmins(placeholderAdmins);

		fetch('https://randomuser.me/api/?results=20&inc=name,email,phone,login,picture')
			.then(response => response.json())
			.then(data => {
				const fetchedAdmins = [];
				for (let i = 0; i < data.results.length; i++) {
					const user = data.results[i];
					fetchedAdmins.push({
						id: i + 1,
						name: {
							first: user.name.first,
							middle: user.name.middle || '',
							last: user.name.last
						},
						email: user.email,
						phone: user.phone,
						employeeId: (() => {
							let id;
							do {
								id = `025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
							} while (fetchedAdmins.some(admin => admin.employeeId === id));
							return id;
						})(),
						position: i === 0 ? 'head' : ['guidance', 'prefect', 'student-affairs'][i % 3],
						profilePicture: user.picture.large,
						placeholder: false,
						status: ['active', 'restricted', 'archived'][Math.floor(Math.random() * 3)]
					});
				};
				setAdmins(fetchedAdmins);
			})
			.catch(error => console.error('Error fetching admin data:', error));
	}, []);

	React.useEffect(() => {
		setDisplayedAdmins(admins);
		categorizeFilter('all');
	}, [admins]);

	const signOut = () => {
		supabase.auth.signOut();
	};

	const { mobile } = React.useContext(MobileContext);

	const navigate = useNavigate();

	const categorizeFilter = (value) => {
		let filteredAdmins = admins;

		if (value !== 'all')
			filteredAdmins = admins.filter(admin => admin.position === value);

		setDisplayedAdmins([]);
		setTimeout(() => {
			setDisplayedAdmins(filteredAdmins);
		}, remToPx(2));
	};

	const searchCategorizedAdmins = (searchTerm) => {
		setCategory('all');

		if (searchTerm.trim() === '') {
			setDisplayedAdmins(admins);
			return;
		};

		const filteredAdmins = admins.filter(admin => {
			const fullName = `${admin.name.first} ${admin.name.last}`.toLowerCase();
			return fullName.includes(searchTerm.toLowerCase());
		});

		setDisplayedAdmins([]);
		setTimeout(() => {
			setDisplayedAdmins(filteredAdmins);
		}, remToPx(2));
	};

	return (
		<Card className='scrollable-content page-container' size='small'>
			{/************************** Header **************************/}
			<Flex vertical justify='flex-start' align='stretch' gap='small' style={{ height: '100%' }}>
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
									const admin = await AddNewAdmin(Modal, addingNew, setAddingNew, admins, setAdmins);
									if (admin) {
										setAdmins([...admins, admin]);
										setDisplayedAdmins([...displayedAdmins, admin]);
										FilterForm.current.setFieldsValue({ category: admin.position, search: '' });
										categorizeFilter(admin.position);
										Notification.success({
											message: 'Success',
											description: 'New admin member added successfully.'
										});
									}
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
				<Form
					id='filter'
					layout='vertical'
					ref={FilterForm}
					style={{ width: '100%' }}
					initialValues={{ search: '', category: 'all' }}
				>
					<Flex justify='space-between' align='center' gap='small'>
						<Card size='small' {...mobile ? { style: { width: '100%' } } : {}}>
							<Form.Item
								name='search'
								style={{ margin: 0 }}
							>
								<Input
									placeholder='Search'
									allowClear
									prefix={<SearchOutlined />}
									onChange={(e) => searchCategorizedAdmins(e.target.value)}
								/>
							</Form.Item>
						</Card>
						<Card size='small'>
							<Form.Item
								name='category'
								style={{ margin: 0 }}
							>
								{!mobile ?
									<Segmented
										options={[
											{ label: 'All', value: 'all' },
											{ label: 'Guidance Officer', value: 'guidance' },
											{ label: 'Prefect of Discipline Officer', value: 'prefect' },
											{ label: 'Student Affairs Officer', value: 'student-affairs' }
										]}
										value={category}
										onChange={(value) => {
											setCategory(value);
											categorizeFilter(value);
											FilterForm.current.setFieldsValue({ search: '' });
										}}
										style={{ width: '100%' }}
									/>
									:
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
													onChange={(value) => {
														setCategory(value);
														categorizeFilter(value);
														FilterForm.current.setFieldsValue({ search: '' });
													}}
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
								}
							</Form.Item>
						</Card>
					</Flex>
				</Form>


				{/************************** Grid of Admins **************************/}
				{displayedAdmins.length > 0 ?
					<Flex vertical justify='flex-start' align='flex-start' gap='small' flex={1}>
						<Row gutter={[remToPx(1), remToPx(1)]} style={{ width: '100%' }}>
							{displayedAdmins.map((admin, index) => (
								<Col key={admin.id} span={!mobile ? 8 : 24}>
									<AdminCard admin={admin} animationDelay={index * 0.1} loading={admin.placeholder} />
								</Col>
							))}
						</Row>
					</Flex>
					:
					<Flex vertical justify='center' align='center' flex={1}>
						<Empty description='No admin found' />
					</Flex>
				}
			</Flex>
		</Card>
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

	return (
		<Card
			size='small'
			hoverable
			loading={loading}
			className={mounted ? 'admin-card-mounted' : 'admin-card-unmounted'}
			actions={[
				<EditOutlined onClick={() => EditAdmin(Modal, thisAdmin, setThisAdmin)} key='edit' />,
				<LockOutlined onClick={() => RestrictAdmin(Modal, thisAdmin)} key='restrict' />,
				<RightOutlined onClick={() => {
					navigate(`/admin/${thisAdmin.id}`, {
						state: { admin: thisAdmin },
						viewTransition: true
					});
				}} key='view' />
			]}
		>
			<Flex justify='flex-start' align='flex-start' gap='small' style={{ width: '100%' }}>
				<Avatar
					src={thisAdmin.profilePicture}
					size='large'
				/>
				<Flex vertical justify='flex-start' align='flex-start'>
					<Title level={4}>{`${thisAdmin.name.first} ${thisAdmin.name.last}`}</Title>
					<Text>{
						thisAdmin.position === 'head' ? 'Head' : thisAdmin.position === 'guidance' ? 'Guidance Officer' :
							thisAdmin.position === 'prefect' ? 'Prefect of Discipline Officer' : 'Student Affairs Officer'
					}</Text>
				</Flex>
			</Flex>
		</Card>
	);
};