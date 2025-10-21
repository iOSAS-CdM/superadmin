import React from 'react';
import { useNavigate } from 'react-router';

import {
	App,
	Flex,
	Card,
	Form,
	Typography,
	Button,
	Input,
	Alert,
	Divider
} from 'antd';

import {
	ToolOutlined,
	LeftOutlined,
	RightOutlined,
	DeleteOutlined,
	SaveOutlined,
	WarningOutlined,
	PlusOutlined
} from '@ant-design/icons';

import { useMobile } from '../contexts/MobileContext';

const { Title, Text } = Typography;

import Header from '../components/Header';

import '../styles/pages/Dashboard.css';

import { API_Route } from '../main';

const Profile = () => {
	const isMobile = useMobile();

	const navigate = useNavigate();

	const { message, modal } = App.useApp();

	/**
	 * @typedef {{
	 * 	main: string;
	 * 	release: string;
	 * }} Version
	 */
	/**
	 * @typedef {{ key: string, value: string }[]} secret
	 */

	/** @type {[Version, React.Dispatch<React.SetStateAction<Version>>]} */
	const [desktopVersion, setDesktopVersion] = React.useState();
	const [secretsForm] = Form.useForm();
	const [loading, setLoading] = React.useState(false);
	React.useEffect(() => {
		const controller = new AbortController();

		// Fetch version info
		const fetchVersion = async () => {
			setLoading(true);
			const responses = await Promise.all([
				fetch(`${API_Route}/superadmin/version`, { signal: controller.signal }),
				fetch(`${API_Route}/superadmin/secrets`, { signal: controller.signal })
			]);
			setLoading(false);

			const data = await Promise.all(responses.map(res => res.json()));
			setDesktopVersion(data[0]);
			secretsForm.setFieldsValue({ secrets: data[1] });
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
							<Form layout='vertical' component={false}>
								<Flex justify='space-between' align='center' gap='large'>
									<Form.Item label='Development Source'>
										<Input
											value={desktopVersion?.main || 'Loading...'}
											readOnly
										/>
									</Form.Item>
									<Button
										type='primary'
										loading={loading}
										disabled={desktopVersion?.main === desktopVersion?.release}
										onClick={async () => {
											const apiResponse = await fetch(`${API_Route}/superadmin/version/deploy`, {
												method: 'POST'
											}).catch(() => null);
											if (!apiResponse?.ok) 
												return message.error('Failed to deploy the latest version.');
											const newVersion = await apiResponse.json();
											setDesktopVersion(newVersion);
											message.success('Deployment initiated successfully.');
										}}
										icon={<RightOutlined />}
										iconPosition='end'
									>
										Deploy
									</Button>
									<Form.Item label='Deployed Software'>
										<Input
											value={desktopVersion?.release || 'Loading...'}
											readOnly
										/>
									</Form.Item>
								</Flex>
							</Form>
						</Flex>
					</Flex>
				</Card>

				{/************************** Secret keys **************************/}
				<Card title={<Title level={2}>Secret Keys</Title>}>
					<Form
						form={secretsForm}
						layout='vertical'
						component={false}
					>
						<Form.List name='secrets'>
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, ...restField }) => (
										<Flex key={key} justify='flex-start' align='center' gap='large'>
											<Form.Item
												{...restField}
												name={[name, 'key']}
												label='Key'
												rules={[{ required: true, message: 'Missing key' }]}
											>
												<Input placeholder='KEY_NAME' />
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, 'value']}
												label='Value'
												rules={[{ required: true, message: 'Missing value' }]}
											>
												<Input.Password placeholder='secret_value' />
											</Form.Item>
											<Form.Item>
												<Button
													type='primary'
													danger
													icon={<DeleteOutlined />}
													onClick={() => remove(name)}
												/>
											</Form.Item>
										</Flex>
									))}
									<Flex justify='center' align='center' gap='large'>
										<Button
											type='dashed'
											onClick={() => add()}
											block
										>
											<PlusOutlined /> Add secret Variable
										</Button>
										<Button
											type='primary'
											icon={<SaveOutlined />}
											onClick={async () => secretsForm.validateFields().then(async () => {
												/** @type {[secret, React.Dispatch<React.SetStateAction<secret>>]} */
												const values = secretsForm.getFieldsValue();

												setLoading(true);
												const response = await fetch(`${API_Route}/superadmin/secrets`, {
													method: 'POST',
													headers: {
														'Content-Type': 'application/json'
													},
													body: JSON.stringify(values)
												}).catch(() => null);
												setLoading(false);
												if (!response?.ok)
													return message.error('Failed to save secret keys.');
												message.success('Secret keys saved successfully.');
											})}
											loading={loading}
										>
											Save Changes
										</Button>
									</Flex>
								</>
							)}
						</Form.List>
					</Form>
				</Card>

				<Alert
					type='warning'
					showIcon
					icon={<WarningOutlined />}
					description={(
						<Flex vertical gap='small'>
							<Text>Changes to secret keys may require a system restart to take effect. Please ensure to restart the application after making modifications.</Text>
							<Text>It is recommended to backup current configurations before proceeding.</Text>
							<Divider />
							<Button
								type='default'
								icon={<WarningOutlined />}
								danger
								onClick={() => {
									modal.confirm({
										title: 'Are you sure you want restart the system server?',
										content: 'This will temporarily disconnect all connected clients.',
										okButtonProps: { danger: true },
										onOk: async () => {
											setLoading(true);
											const response = await fetch(`${API_Route}/superadmin/restart`, {
												method: 'POST'
											}).catch(() => null);
											setLoading(false);
											if (!response?.ok)
												return message.error('Failed to restart the server.');
											message.success('Server restart initiated successfully.');
										}
									});
								}}
							>
								Restart Server
							</Button>
						</Flex>
					)}
				/>
			</Flex>
		</Card>
	);
};

export default Profile;
