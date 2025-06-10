import React from 'react';

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
	Avatar,
	Modal,
	Form,
	Space
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
	CaretRightOutlined,
	SwapOutlined,
	FilterOutlined
} from '@ant-design/icons';

import { MobileContext } from '../main';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

import Header from '../components/Header';

import '../styles/pages/Dashboard.css';

const Dashboard = () => {
	const [signingOut, setSigningOut] = React.useState(false);
	const [addingNew, setAddingNew] = React.useState(false);
	const [category, setCategory] = React.useState('all');
	const [staffs, setStaffs] = React.useState([]);
	const [displayedStaffs, setDisplayedStaffs] = React.useState([]);

	const NewStaffForm = React.useRef(null);
	const FilterForm = React.useRef(null);

	React.useEffect(() => {
		setStaffs([
			{
				id: '025-000',
				name: {
					first: 'Mia',
					middle: '',
					last: 'Martinez'
				},
				position: 'head',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-001',
				name: {
					first: 'Brandy',
					middle: '',
					last: 'Gray'
				},
				position: 'guidance',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-002',
				name: {
					first: 'Cameron',
					middle: '',
					last: 'Wheeler'
				},
				position: 'prefect',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-003',
				name: {
					first: 'Jordan',
					middle: '',
					last: 'Harris'
				},
				position: 'guidance',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-004',
				name: {
					first: 'Taylor',
					middle: '',
					last: 'Reed'
				},
				position: 'student-affairs',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-005',
				name: {
					first: 'Alex',
					middle: '',
					last: 'Carter'
				},
				position: 'guidance',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-006',
				name: {
					first: 'Jamie',
					middle: '',
					last: 'Morgan'
				},
				position: 'prefect',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-007',
				name: {
					first: 'Casey',
					middle: '',
					last: 'Parker'
				},
				position: 'student-affairs',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-008',
				name: {
					first: 'Riley',
					middle: '',
					last: 'Lee'
				},
				position: 'guidance',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-009',
				name: {
					first: 'Drew',
					middle: '',
					last: 'Taylor'
				},
				position: 'prefect',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-010',
				name: {
					first: 'Skyler',
					middle: '',
					last: 'Anderson'
				},
				position: 'student-affairs',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-011',
				name: {
					first: 'Taylor',
					middle: '',
					last: 'Johnson'
				},
				position: 'guidance',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-012',
				name: {
					first: 'Jordan',
					middle: '',
					last: 'Smith'
				},
				position: 'prefect',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			},
			{
				id: '025-013',
				name: {
					first: 'Morgan',
					middle: '',
					last: 'Williams'
				},
				position: 'student-affairs',
				profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
			}
		]);
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

	const { mobile, setMobile } = React.useContext(MobileContext);

	const addNew = () => {
		setAddingNew(true);

		const newStaff = {
			name: {
				first: null,
				middle: null,
				last: null
			},
			email: null,
			employeeId: null,
			position: null,
			profilePicture: null
		};

		// Steps:
		// 1. Necessary validations (e.g., name, email, employee id, position)
		// 2. Avatar upload (mocked)
		// 	2.1. Progress bar
		// 3. Confirmation modal

		Modal.info({
			title: 'Add New Staff',
			centered: true,
			width: {
				xs: '100%',
				sm: remToPx(80),
				md: remToPx(80),
				lg: remToPx(80),
				xl: remToPx(80)
			},
			onOk: () => { },
			content: (
				<Form
					layout='vertical'
					ref={NewStaffForm}
					onFinish={(values) => {
						setStaffs([...staffs, { ...newStaff, ...values }]);
						setAddingNew(false);
					}}
					initialValues={newStaff}
					style={{ width: '100%' }}
				>
					<Space.Compact style={{ width: '100%' }}>
						<Form.Item
							name={['name', 'first']}
							rules={[{ required: true, message: 'Please input the first name!' }]}
							style={{ width: 'calc(100% /3)' }}
						>
							<Input placeholder='First Name *' />
						</Form.Item>
						<Form.Item
							name={['name', 'middle']}
							rules={[{ required: false }]}
							style={{ width: 'calc(100% /3)' }}
						>
							<Input placeholder='Middle Name' />
						</Form.Item>
						<Form.Item
							name={['name', 'last']}
							rules={[{ required: true, message: 'Please input the last name!' }]}
							style={{ width: 'calc(100% /3)' }}
						>
							<Input placeholder='Last Name *' />
						</Form.Item>
					</Space.Compact>

					<Form.Item
						name='email'
						rules={[{ required: true, message: 'Please input the email!' }]}
					>
						<Input placeholder='Email *' type='email' />
					</Form.Item>

					<Space.Compact style={{ width: '100%' }}>
						<Form.Item
							name='employeeId'
							rules={[{ required: true, message: 'Please input the employee ID!' }]}
							style={{ width: '100%' }}
						>
							<Input placeholder='Employee ID *' />
						</Form.Item>
						<Button
							type='primary'
							icon={<SwapOutlined />}
							style={{ width: 'fit-content' }}
							onClick={() => {
								let newId;
								while (!newId || staffs.some(staff => staff.employeeId === newId))
									newId = `025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
								NewStaffForm.current.setFieldsValue({
									employeeId: newId
								});
							}}
						>
							Generate ID
						</Button>
					</Space.Compact>

					<Form.Item
						name='position'
						rules={[{ required: true, message: 'Please select the position!' }]}
					>
						<Select
							placeholder='Select Position *'
							options={[
								{ label: 'Head', value: 'head', disabled: true },
								{ label: 'Guidance Officer', value: 'guidance' },
								{ label: 'Prefect of Discipline Officer', value: 'prefect' },
								{ label: 'Student Affairs Officer', value: 'student-affairs' }
							]}
							style={{ width: '100%' }}
						>
							<Select.Option value='head'>Head</Select.Option>
							<Select.Option value='guidance'>Guidance Officer</Select.Option>
							<Select.Option value='prefect'>Prefect of Discipline Officer</Select.Option>
							<Select.Option value='student-affairs'>Student Affairs Officer</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			),
		});
	};

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
		<Card id='dashboard' className='scrollable-content' size='small'>
			{/************************** Header **************************/}
			<Flex vertical justify='flex-start' align='stretch' gap='small'>
				<Header
					icon={<HomeOutlined />}
					title={<Title level={3}>Dashboard</Title>}
					actions={
						<>
							<Button
								icon={<ToolOutlined />}
							>Configure System</Button>
							<Button
								type='primary'
								icon={addingNew ? <LoadingOutlined /> : <UserAddOutlined />}
								onClick={addNew}
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
				<Row gutter={[remToPx(1), remToPx(1)]}>
					{displayedStaffs.map((staff, index) => (
						<Col key={staff.id} span={!mobile ? 8 : 24}>
							<StaffCard staff={staff} animationDelay={index * 0.1} />
						</Col>
					))}
				</Row>
			</Flex>
		</Card>
	);
};

export default Dashboard;

class StaffCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mounted: false
		};
	};

	componentDidMount() {
		setTimeout(() => {
			this.setState({ mounted: true });
		}, this.props.animationDelay * 1000 || 0);
	};

	render() {
		const { staff } = this.props;
		const { mounted } = this.state;

		return (
			<Card
				size='small'
				hoverable
				className={mounted ? 'staff-card-mounted' : 'staff-card-unmounted'}
				actions={[
					<EditOutlined key='edit' />,
					<LockOutlined key='lock' />,
					<CaretRightOutlined key='view' />
				]}
			>
				<Flex justify='flex-start' align='flex-start' gap='small' style={{ width: '100%' }}>
					<Avatar
						src={staff.profilePicture}
						size='large'
					/>
					<Flex vertical justify='flex-start' align='flex-start'>
						<Title level={4}>{`${staff.name.first} ${staff.name.last}`}</Title>
						<p>{
							staff.position === 'head' ? 'Head' : staff.position === 'guidance' ? 'Guidance Officer' :
								staff.position === 'prefect' ? 'Prefect of Discipline Officer' : 'Student Affairs Officer'
						}</p>
					</Flex>
				</Flex>
			</Card>
		);
	};
};