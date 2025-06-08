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
	Avatar,
	Divider
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

const { Title } = Typography;

import remToPx from '../utils/remToPx';

import Header from '../components/Header';

import '../styles/pages/Dashboard.css';

export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			signingOut: false,
			addingNew: false,

			staffs: [
				{
					id: '025-000',
					name: {
						first: 'Mia',
						middle: '',
						last: 'Martinez'
					},
					position: 'Head',
					category: '',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-001',
					name: {
						first: 'Brandy',
						middle: '',
						last: 'Gray'
					},
					position: 'Guidance Student Affairs Officer',
					category: 'guidance',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-002',
					name: {
						first: 'Cameron',
						middle: '',
						last: 'Wheeler'
					},
					position: 'Prefect of Discipline Officer',
					category: 'prefect',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-003',
					name: {
						first: 'Jordan',
						middle: '',
						last: 'Harris'
					},
					position: 'Guidance Officer',
					category: 'guidance',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-004',
					name: {
						first: 'Taylor',
						middle: '',
						last: 'Reed'
					},
					position: 'Student Affairs Officer',
					category: 'student-affairs',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-005',
					name: {
						first: 'Alex',
						middle: '',
						last: 'Carter'
					},
					position: 'Guidance Officer',
					category: 'guidance',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				}
			],

			categorizedStaffs: [],
			searchedCategorizedStaffs: []
		};
	};

	componentDidMount() {
		this.setState({ categorizedStaffs: this.state.staffs });
	}

	signOut = () => {
		this.setState({ signingOut: true });

		setTimeout(() => {
			this.setState({ signingOut: false });
			window.location.href = '/';
		}, remToPx(20));
	};

	addNew = () => {
		this.setState({ addingNew: true });

		setTimeout(() => {
			this.setState({ addingNew: false });
		}, remToPx(20));
	};

	categorizeFilter = (value) => {
		let categorizedStaffs = this.state.staffs;

		this.setState({ categorizedStaffs: [] });

		if (value !== 'all')
			categorizedStaffs = this.state.staffs.filter(staff => staff.category.toLowerCase() == value);

		setTimeout(() => {
			this.setState({ categorizedStaffs });
		}, remToPx(2));
	};

	searchCategorizedStaffs = (searchTerm) => {
		const searchLower = searchTerm.toLowerCase();
		const searchedCategorizedStaffs = this.state.categorizedStaffs.filter(staff =>
			`${staff.name.first} ${staff.name.last}`.toLowerCase().includes(searchLower) ||
			staff.position.toLowerCase().includes(searchLower)
		);

		this.setState({ searchedCategorizedStaffs });
		if (searchTerm === '')
			this.setState({ searchedCategorizedStaffs: [] });
		else
			this.setState({ searchedCategorizedStaffs });
	};

	render() {
		return (
			<Card id='dashboard' size='small'>
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
								defaultValue='all'
								onChange={this.categorizeFilter}
							/>
						</Card>
					</Flex>


					{/************************** Grid of Staffs **************************/}
					<Row gutter={[remToPx(1), remToPx(1)]}>
						{(this.state.searchedCategorizedStaffs.length > 0 ? this.state.searchedCategorizedStaffs : this.state.categorizedStaffs).map((staff, index) => (
							<Col key={staff.id} span={8}>
								{/* Pass index to StaffCard for staggered animation if desired */}
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
			mounted: false,
		};
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({ mounted: true });
		}, this.props.animationDelay * 1000 || 0);
	}

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
					<Flex vertical justify='flex-start' align='flex-start' style={{ width: '100%' }}>
						<Title level={4}>{`${staff.name.first} ${staff.name.last}`}</Title>
						<p>{staff.position}</p>
					</Flex>
				</Flex>
			</Card>
		);
	};
};