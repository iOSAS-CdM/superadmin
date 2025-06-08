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
	Modal
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

			category: 'all',

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
				},
				{
					id: '025-006',
					name: {
						first: 'Jamie',
						middle: '',
						last: 'Morgan'
					},
					position: 'Prefect of Discipline Officer',
					category: 'prefect',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-007',
					name: {
						first: 'Casey',
						middle: '',
						last: 'Parker'
					},
					position: 'Student Affairs Officer',
					category: 'student-affairs',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-008',
					name: {
						first: 'Riley',
						middle: '',
						last: 'Lee'
					},
					position: 'Guidance Officer',
					category: 'guidance',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-009',
					name: {
						first: 'Drew',
						middle: '',
						last: 'Taylor'
					},
					position: 'Prefect of Discipline Officer',
					category: 'prefect',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-010',
					name: {
						first: 'Skyler',
						middle: '',
						last: 'Anderson'
					},
					position: 'Student Affairs Officer',
					category: 'student-affairs',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-011',
					name: {
						first: 'Taylor',
						middle: '',
						last: 'Johnson'
					},
					position: 'Guidance Officer',
					category: 'guidance',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-012',
					name: {
						first: 'Jordan',
						middle: '',
						last: 'Smith'
					},
					position: 'Prefect of Discipline Officer',
					category: 'prefect',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				},
				{
					id: '025-013',
					name: {
						first: 'Morgan',
						middle: '',
						last: 'Williams'
					},
					position: 'Student Affairs Officer',
					category: 'student-affairs',
					profilePicture: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
				}
			],

			displayedStaffs: [],

			newStaffForm: {
				name: {
					first: null,
					middle: null,
					last: null
				},
				position: null
			}
		};
	};

	componentDidMount() {
		this.setState({ displayedStaffs: this.state.staffs });
		this.categorizeFilter('all');
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

		const modal = Modal.info({
			title: 'Add New Staff',
			centered: true,
			width: {
				xs: '75%',
				sm: '50%',
				md: '25%',
			},
			open: this.state.addingNew,
			content: (
				<Flex vertical justify='flex-start' align='stretch' gap='small'>
					<Input
						placeholder='First Name *'
						onChange={(e) => this.setState({
							newStaffForm: {
								...this.state.newStaffForm,
								name: {
									...this.state.newStaffForm.name,
									first: e.target.value
								}
							}
						})}
					/>
					<Input
						placeholder='Middle Name'
						onChange={(e) => this.setState({
							newStaffForm: {
								...this.state.newStaffForm,
								name: {
									...this.state.newStaffForm.name,
									middle: e.target.value
								}
							}
						})}
					/>
					<Input
						placeholder='Last Name *'
						onChange={(e) => this.setState({
							newStaffForm: {
								...this.state.newStaffForm,
								name: {
									...this.state.newStaffForm.name,
									last: e.target.value
								}
							}
						})}
					/>
					<Segmented
						options={[
							{ label: 'Guidance Officer', value: 'guidance' },
							{ label: 'Prefect of Discipline Officer', value: 'prefect' },
							{ label: 'Student Affairs Officer', value: 'student-affairs' }
						]}
						defaultValue='guidance'
						onChange={(value) => this.setState({
							newStaffForm: {
								...this.state.newStaffForm,
								position: value
							}
						})}
					/>
				</Flex>
			),

			onCancel: () => {
				this.setState({ addingNew: false });
				this.setState({
					newStaffForm: {
						name: {
							first: null,
							middle: null,
							last: null
						},
						position: null
					}
				});
				modal.destroy();
			},

			footer: (_, { OkBtn, CancelBtn }) => (
				<Flex justify='flex-end' align='center' gap='small'>
					<Button
						{...CancelBtn}
						onClick={() => {
							this.setState({ addingNew: false });
							modal.destroy();
						}}
					>Cancel</Button>
					<Button
						{...OkBtn}
						type='primary'
						onClick={() => {
							if (
								!this.state.newStaffForm.name.first ||
								!this.state.newStaffForm.name.last ||
								!this.state.newStaffForm.position
							) {
								const errorModal = Modal.error({
									title: 'Error',
									content: 'Please fill in all fields * before saving.',
									centered: true,

									onCancel: () => modal.destroy(),
									footer: (
										<Flex justify='flex-end' align='center' gap='small'>
											<Button
												type='primary'
												onClick={() => {errorModal.destroy()}}
											>OK</Button>
										</Flex>
									)
								});
								return;
							};

							const newStaff = {
								id: `025-${Math.floor(Math.random() * 1000)}`,
								name: {
									first: this.state.newStaffForm.name.first,
									middle: this.state.newStaffForm.name.middle || '',
									last: this.state.newStaffForm.name.last
								},
								position: this.state.newStaffForm.position,
								category: this.state.newStaffForm.position === 'guidance' ? 'Guidance Officer' :
									this.state.newStaffForm.position === 'prefect' ? 'Prefect of Discipline Officer' :
										'Student Affairs Officer',
							};

							this.setState((prevState) => ({
								staffs: [...prevState.staffs, newStaff],
								displayedStaffs: [...prevState.displayedStaffs, newStaff],
								addingNew: false,
								newStaffForm: {
									name: {
										first: null,
										middle: null,
										last: null
									},
									position: null
								}
							}));
							modal.destroy();
						}}
					>Save</Button>
				</Flex>
			)
		});
	};

	categorizeFilter = (value) => {
		let staffs = this.state.staffs;

		this.setState({ displayedStaffs: [] });

		if (value !== 'all')
			staffs = staffs.filter(staff => staff.category === value);

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
					<Flex vertical justify='flex-start' align='flex-start'>
						<Title level={4}>{`${staff.name.first} ${staff.name.last}`}</Title>
						<p>{staff.position}</p>
					</Flex>
				</Flex>
			</Card>
		);
	};
};