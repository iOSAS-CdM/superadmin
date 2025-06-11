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
	Image,
	Avatar,
	Modal,
	Form,
	Space
} from 'antd';

import {
	UserOutlined,
	LeftOutlined
} from '@ant-design/icons';

import { MobileContext } from '../main';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

import Header from '../components/Header';

import '../styles/pages/Dashboard.css';

const Profile = () => {
	const { mobile } = React.useContext(MobileContext);

	const navigate = useNavigate();

	return (
		<Card className='scrollable-content page-container' size='small'>
			{/************************** Header **************************/}
			<Flex vertical justify='flex-start' align='stretch' gap='small'>
				<Header
					icon={<UserOutlined />}
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
			</Flex>
		</Card>
	);
};

export default Profile;
