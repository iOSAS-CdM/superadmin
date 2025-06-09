import React from 'react';

import {
	Flex,
	Card,
	Row,
	Col,
	Typography,
	Button,
	Input,
	Segmented,
	Avatar
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
	CaretRightOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

import Header from '../components/Header';

import '../styles/pages/Dashboard.css';

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signingOut: false,
			addingNew: false,

			category: 'all',

			staffs: [
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
			],

			displayedStaffs: []
		};
	};

	componentDidMount() {
		this.setState({ displayedStaffs: this.state.staffs });
		this.categorizeFilter('all');
	};

	signOut = () => {
		this.setState({ signingOut: true });

		setTimeout(() => {
			this.setState({ signingOut: false });
			window.location.href = '/';
		}, remToPx(20));
	};

	addNew = async () => {
		this.setState({ addingNew: true });

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
	};

	categorizeFilter = (value) => {
		let staffs = this.state.staffs;

		this.setState({ displayedStaffs: [] });

		if (value !== 'all')
			staffs = staffs.filter(staff => staff.position === value);

		setTimeout(() => {
			this.setState({ displayedStaffs: staffs });
		}, remToPx(2));
	};

	searchCategorizedStaffs = (searchTerm) => {
		this.setState({ category: 'all' });

		const filteredStaffs = this.state.staffs.filter(staff => {
			const fullName = `${staff.name.first} ${staff.name.last}`.toLowerCase();
			return fullName.includes(searchTerm.toLowerCase());
		});

		this.setState({ displayedStaffs: [] });

		setTimeout(() => {
			this.setState({ displayedStaffs: filteredStaffs });
		}, remToPx(2));
	};

	render() {
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
									icon={this.state.addingNew ? <LoadingOutlined /> : <UserAddOutlined />}
									onClick={this.addNew}
								>Add New</Button>
								<Button
									type='primary'
									icon={this.state.signingOut ? <LoadingOutlined /> : <LogoutOutlined />}
									disabled={this.state.signingOut}
									onClick={this.signOut}
									danger
								>Sign Out</Button>
							</>
						}
					/>

					{/************************** Filter **************************/}
					<Flex justify='space-between' align='center' gap='small'>
						<Card size='small'>
							<Input
								placeholder='Search'
								prefix={<SearchOutlined />}
								onChange={(e) => this.searchCategorizedStaffs(e.target.value)}
							/>
						</Card>
						<Card size='small'>
							<Segmented
								options={[
									{ label: 'All', value: 'all' },
									{ label: 'Guidance Officer', value: 'guidance' },
									{ label: 'Prefect of Discipline Officer', value: 'prefect' },
									{ label: 'Student Affairs Officer', value: 'student-affairs' },
								]}
								value={this.state.category}
								onChange={(value) => {
									this.setState({ category: value });
									this.categorizeFilter(value);
								}}
								style={{ width: '100%' }}
							/>
						</Card>
					</Flex>


					{/************************** Grid of Staffs **************************/}
					<Row gutter={[remToPx(1), remToPx(1)]}>
						{this.state.displayedStaffs.map((staff, index) => (
							<Col key={staff.id} span={8}>
								<StaffCard staff={staff} animationDelay={index * 0.1} />
							</Col>
						))}
					</Row>
				</Flex>
			</Card>
		);
	}
};

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