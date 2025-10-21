import React from 'react';
import { useNavigate } from 'react-router';

import {
	App,
	Flex,
	Card,
	Form,
	Typography,
	Button,
	Input
} from 'antd';

import {
	ToolOutlined,
	LeftOutlined,
	RightOutlined,
	KeyOutlined,
	SaveOutlined,
	ClearOutlined
} from '@ant-design/icons';

import { useMobile } from '../contexts/MobileContext';

const { Title, Text } = Typography;

import Header from '../components/Header';

import '../styles/pages/Dashboard.css';

import { API_Route } from '../main';

const Profile = () => {
	const isMobile = useMobile();

	const navigate = useNavigate();

	const { message } = App.useApp();

	/**
	 * @typedef {{
	 * 	commit: string;
	 * 	date: string;
	 * 	message: string;
	 * }} Tag
	 */

	/**
	 * @typedef {{
	 * 	version: string;
	 * 	main: Tag;
	 * 	release: Tag;
	 * }} Version
	 */

	/** @type {[Version, React.Dispatch<React.SetStateAction<Version>>]} */
	const [desktopVersion, setDesktopVersion] = React.useState({});
	React.useEffect(() => {
		const controller = new AbortController();

		// Fetch version info
		const fetchVersion = async () => {
			const responses = await Promise.all([
				fetch(`${API_Route}/superadmin/version`, { signal: controller.signal }),
			]);

			const data = await Promise.all(responses.map(res => res.json()));

			setDesktopVersion(data[0]);
		};

		fetchVersion();
		return () => controller.abort();
	}, []);

	return (
		<Card className='scrollable-content page-container' size='small'>
			{/************************** Header **************************/}
			<Flex vertical justify='flex-start' align='stretch' gap='small'>
				<Header
					icon={<ToolOutlined />}
					title={<Title level={3}>Configure System</Title>}
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

				{/************************** Configuration **************************/}
				<Card
					title={<Title level={2}>Version Control</Title>}
				>
					<Flex vertical justify='flex-start' align='stretch' gap='large'>
						<Flex vertical justify='flex-start' align='stretch' gap='small'>
							<Title level={5}>Desktop</Title>
							{/* <Flex justify='flex-start' align='stretch' gap='large'>
								<Flex vertical justify='flex-start' align='stretch' flex={1}>
									<Input
										value='vPr0t0typ3-0s4s'
									/>
									<Text type='secondary'>Github Action Build</Text>
								</Flex>

								<Button
									type='primary'
									onClick={() => {
										// Placeholder for update action
										console.log('Update action triggered');
									}}
									icon={<RightOutlined />}
									iconPosition='end'
								>
									Deploy
								</Button>

								<Flex vertical justify='flex-start' align='stretch' flex={1}>
									<Input
										value='vD3pl0y3d-0s4s'
									/>
									<Text type='secondary'>Deployed Software</Text>
								</Flex>
							</Flex> */}
							<Form layout='vertical' component={false}>
								<Flex justify='space-between' align='center' gap='large'>
									<Form.Item label='Development Source'>
										<Input
											value={desktopVersion?.main?.commit || 'Loading...'}
											readOnly
										/>
									</Form.Item>
									<Button
										type='primary'
										onClick={async () => {
											const apiResponse = await fetch(`${API_Route}/superadmin/version/deploy`, {
												method: 'POST'
											}).catch(() => null);
											if (!apiResponse?.ok) 
												return message.error('Failed to deploy the latest version.');
											const newVersion = await apiResponse.json();
											setDesktopVersion(prev => ({ ...prev, release: newVersion }));
											message.success('Deployment initiated successfully.');
										}}
										icon={<RightOutlined />}
										iconPosition='end'
									>
										Deploy
									</Button>
									<Form.Item label='Deployed Software'>
										<Input
											value={desktopVersion?.release?.commit || 'Loading...'}
											readOnly
										/>
									</Form.Item>
								</Flex>
							</Form>
						</Flex>
					</Flex>
				</Card>


				{/************************** Secret keys **************************/}

				<Card
					title={<Title level={2}>Secret Keys</Title>}
					extra={
						<Text type='secondary'>
							These keys are used to authenticate with various services. Please keep them secure.
						</Text>
					}
				>
					<Flex vertical justify='flex-start' align='stretch' gap='large'>
						<Flex justify='flex-start' align='stretch' gap='small'>
							<Title level={5} style={{ width: 'calc(var(--space-XL) * 14)' }}>Github Personal Access Token</Title>
							<Input
								value='AIzaSyD3pl0y3d-0s4s'
								readOnly
								suffix={<KeyOutlined />}
							/>
						</Flex>
						<Flex justify='flex-start' align='stretch' gap='small'>
							<Title level={5} style={{ width: 'calc(var(--space-XL) * 14)' }}>EAS App Token</Title>
							<Input
								value='AIzaSyD3pl0y3d-0s4s'
								readOnly
								suffix={<KeyOutlined />}
							/>
						</Flex>
						<Flex justify='flex-start' align='stretch' gap='small'>
							<Title level={5} style={{ width: 'calc(var(--space-XL) * 14)' }}>OpenAI API Key</Title>
							<Input
								value='AIzaSyD3pl0y3d-0s4s'
								readOnly
								suffix={<KeyOutlined />}
							/>
						</Flex>
						<Flex justify='flex-start' align='stretch' gap='small'>
							<Title level={5} style={{ width: 'calc(var(--space-XL) * 14)' }}>Firebase Super Administrator Credentials</Title>
							<Input.TextArea
								value='AIzaSyD3pl0y3d-0s4s'
								readOnly
								suffix={<KeyOutlined />}
							/>
						</Flex>

						<Flex justify='flex-end' gap='small'>
							<Button
								type='default'
								onClick={() => {
									console.log('Discard action triggered');
								}}
								icon={<ClearOutlined />}
							>
								Discard Changes
							</Button>
							<Button
								type='primary'
								onClick={() => {
									console.log('Save action triggered');
								}}
								icon={<SaveOutlined />}
							>
								Save and Restart
							</Button>
						</Flex>
					</Flex>
				</Card>
			</Flex>
		</Card>
	);
};

export default Profile;
