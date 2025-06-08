import React from 'react';

import {
	Flex,
	Card,
	Grid,
	Typography,
	Button,
	Input,
	Segmented
} from 'antd';

import {
	HomeOutlined,
	UserAddOutlined,
	LogoutOutlined,
	ToolOutlined,
	LoadingOutlined,
	SearchOutlined
} from '@ant-design/icons';

const { Title } = Typography;

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
					profilePicture: '/staffs/025-000.jpg'
				},
				{
					id: '025-001',
					name: {
						first: 'Brandy',
						middle: '',
						last: 'Gray'
					},
					position: 'Guidance Student Affairs Officer',
					profilePicture: '/staffs/025-001.jpg'
				},
				{
					id: '025-002',
					name: {
						first: 'Cameron',
						middle: '',
						last: 'Wheeler'
					},
					position: 'Prefect of Discipline Officer',
					profilePicture: '/staffs/025-002.jpg'
				}
			]
		};
	};

	signOut = () => {
		this.setState({ signingOut: true });

		setTimeout(() => {
			this.setState({ signingOut: false });
			window.location.href = '/';
		}, 2000);
	};

	addNew = () => {
		this.setState({ addingNew: true });

		setTimeout(() => {
			this.setState({ addingNew: false });
		}, 2000);
	};

	render() {
		return (
			<Card id='dashboard' size='small'>
				/************************** Header **************************/
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

					/************************** Filter **************************/
					<Flex horizontal justify='space-between' align='center' gap='small'>
						<Card size='small'>
							<Input
								placeholder='Search'
								prefix={<SearchOutlined />}
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
							/>
						</Card>
					</Flex>



					/************************** Grid of Staffs **************************/
				</Flex>
			</Card>
		);
	}
};