import React from 'react';
import { useNavigate } from 'react-router';

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
	Modal,
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
	SwapOutlined,
	FilterOutlined,
	PlusCircleOutlined
} from '@ant-design/icons';

import { MobileContext } from '../main';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

import Header from '../components/Header';

import '../styles/pages/Dashboard.css';

import AddNewStaff from '../modals/AddNewStaff';
import EditStaff from '../modals/EditStaff';

const Dashboard = () => {
	const [signingOut, setSigningOut] = React.useState(false);
	const [addingNew, setAddingNew] = React.useState(false);
	const [category, setCategory] = React.useState('all');
	const [staffs, setStaffs] = React.useState([]);
	const [displayedStaffs, setDisplayedStaffs] = React.useState([]);
	const FilterForm = React.useRef(null);

	React.useEffect(() => {
		fetch('https://randomuser.me/api/?results=20&inc=name,email,phone,login,picture')
			.then(response => response.json())
			.then(data => {
				const fetchedStaffs = [];
				for (let i = 0; i < data.results.length; i++) {
					const user = data.results[i];
					fetchedStaffs.push({
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
							} while (fetchedStaffs.some(staff => staff.employeeId === id));
							return id;
						})(),
						position: i === 0 ? 'head' : ['guidance', 'prefect', 'student-affairs'][i % 3],
						profilePicture: user.picture.large
					});
				};
				setStaffs(fetchedStaffs);
			})
			.catch(error => console.error('Error fetching staff data:', error));
	}, []);

	React.useEffect(() => {
		setDisplayedStaffs(staffs);
		categorizeFilter('all');
	}, [staffs]);

	const signOut = () => {
		setSigningOut(true);

		setTimeout(() => {
			setSigningOut(false);
			window.location.href = '/';
		}, remToPx(20));
	};

	const { mobile } = React.useContext(MobileContext);

	const navigate = useNavigate();

	const categorizeFilter = (value) => {
		let filteredStaffs = staffs;

		if (value !== 'all')
			filteredStaffs = staffs.filter(staff => staff.position === value);

		setDisplayedStaffs([]);
		setTimeout(() => {
			setDisplayedStaffs(filteredStaffs);
		}, remToPx(2));
	};

	const searchCategorizedStaffs = (searchTerm) => {
		setCategory('all');

		if (searchTerm.trim() === '') {
			setDisplayedStaffs(staffs);
			return;
		};

		const filteredStaffs = staffs.filter(staff => {
			const fullName = `${staff.name.first} ${staff.name.last}`.toLowerCase();
			return fullName.includes(searchTerm.toLowerCase());
		});

		setDisplayedStaffs([]);
		setTimeout(() => {
			setDisplayedStaffs(filteredStaffs);
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
									setAddingNew(true);
									const staff = await AddNewStaff();
									if (staff) {
										setStaffs([...staffs, staff]);
										setDisplayedStaffs([...displayedStaffs, staff]);
										FilterForm.current.setFieldsValue({ category: staff.position, search: '' });
										categorizeFilter(staff.position);
									};
									setAddingNew(false);
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
									onChange={(e) => searchCategorizedStaffs(e.target.value)}
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


				{/************************** Grid of Staffs **************************/}
				{displayedStaffs.length > 0 ?
					<Flex vertical justify='flex-start' align='flex-start' gap='small' flex={1}>
						<Row gutter={[remToPx(1), remToPx(1)]}>
							{displayedStaffs.map((staff, index) => (
								<Col key={staff.id} span={!mobile ? 8 : 24}>
									<StaffCard staff={staff} animationDelay={index * 0.1} />
								</Col>
							))}
						</Row>
					</Flex>
					:
					<Flex vertical justify='center' align='center' flex={1}>
						<Empty description='No staff found' />
					</Flex>
				}

			</Flex>
		</Card>
	);
};

export default Dashboard;

const StaffCard = ({ staff, animationDelay }) => {
	const [mounted, setMounted] = React.useState(false);

	const [thisStaff, setThisStaff] = React.useState(staff);

	const navigate = useNavigate();

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setMounted(true);
		}, animationDelay * 1000 || 0);

		return () => clearTimeout(timer);
	}, [animationDelay]);

	return (
		<Card
			size='small'
			hoverable
			className={mounted ? 'staff-card-mounted' : 'staff-card-unmounted'}
			actions={[
				<EditOutlined onClick={() => EditStaff(thisStaff, setThisStaff)} key='edit' />,
				<LockOutlined key='lock' />,
				<RightOutlined onClick={() => {
					navigate(`/staff/${thisStaff.id}`, {
						state: { staff: thisStaff },
						viewTransition: true
					});
				}} key='view' />
			]}
		>
			<Flex justify='flex-start' align='flex-start' gap='small' style={{ width: '100%' }}>
				<Avatar
					src={thisStaff.profilePicture}
					size='large'
				/>
				<Flex vertical justify='flex-start' align='flex-start'>
					<Title level={4}>{`${thisStaff.name.first} ${thisStaff.name.last}`}</Title>
					<p>{
						thisStaff.position === 'head' ? 'Head' : thisStaff.position === 'guidance' ? 'Guidance Officer' :
							thisStaff.position === 'prefect' ? 'Prefect of Discipline Officer' : 'Student Affairs Officer'
					}</p>
				</Flex>
			</Flex>
		</Card>
	);
};