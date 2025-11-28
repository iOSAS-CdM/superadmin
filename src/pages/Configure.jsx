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
import authFetch from '../utils/authFetch';

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
	const [apiVersion, setApiVersion] = React.useState();
	const [secretsForm] = Form.useForm();
	const [loading, setLoading] = React.useState(false);
	React.useEffect(() => {
		const controller = new AbortController();

		// Fetch version info
		const fetchVersion = async () => {
			setLoading(true);
			const responses = await Promise.all([
				authFetch(`${API_Route}/superadmin/desktop/version`, { signal: controller.signal }),
				authFetch(`${API_Route}/superadmin/api/version`, { signal: controller.signal }),
				authFetch(`${API_Route}/superadmin/secrets`, { signal: controller.signal })
			]);
			setLoading(false);

			const data = await Promise.all(responses.map(res => res.json()));
			setDesktopVersion(data[0]);
			setApiVersion(data[1]);
			secretsForm.setFieldsValue({ secrets: data[2] });
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
							icon={<LeftOutlined />}
							onClick={() => navigate('/dashboard')}
						>
							Back to Dashboard
						</Button>
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
									<Form.Item label=' '>
										<Button
											type='primary'
											loading={loading}
											disabled={desktopVersion?.main === desktopVersion?.release}
											onClick={async () => {
												const apiResponse = await authFetch(`${API_Route}/superadmin/desktop/version/deploy`, {
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
									</Form.Item>
									<Form.Item label='Deployed Software'>
										<Input
											value={desktopVersion?.release || 'Loading...'}
											readOnly
										/>
									</Form.Item>
								</Flex>
							</Form>
						</Flex>
						<Divider />
						<Flex vertical justify='flex-start' align='stretch' gap='small'>
							<Title level={5}>API Server</Title>
							<Form layout='vertical' component={false}>
								<Flex justify='space-between' align='center' gap='large'>
									<Form.Item label='Development Source'>
										<Input
											value={apiVersion?.main || 'Loading...'}
											readOnly
										/>
									</Form.Item>
									<Form.Item label=' '>
										<Button
											type='primary'
											loading={loading}
											disabled={apiVersion?.main === apiVersion?.release}
											onClick={() => {
												modal.confirm({
													title: 'Deploy Latest API Version?',
													content: 'Deploying will restart the server and temporarily disconnect all connected clients. Do you want to continue?',
													okButtonProps: { danger: true },
													onOk: async () => {
														setLoading(true);
														const apiResponse = await authFetch(`${API_Route}/superadmin/api/version/deploy`, {
															method: 'POST'
														}).catch(() => null);
														setLoading(false);
														if (!apiResponse?.ok)
															return message.error('Failed to deploy the latest version.');
														const newVersion = await apiResponse.json();
														setApiVersion(newVersion);
														message.success('Deployment initiated successfully.');
													}
												});
											}}
											icon={<RightOutlined />}
											iconPosition='end'
										>
											Deploy
										</Button>
									</Form.Item>
									<Form.Item label='Deployed Software'>
										<Input
											value={apiVersion?.release || 'Loading...'}
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
										<Flex key={key} justify='flex-start' align='center' gap='large' style={{ width: '100%' }}>
											<Form.Item
												{...restField}
												name={[name, 'key']}
												label='Key'
												style={{ width: '100%' }}
												rules={[{ required: true, message: 'Missing key' }]}
											>
												<Input placeholder='KEY_NAME' />
											</Form.Item>
											<Form.Item
												{...restField}
												name={[name, 'value']}
												label='Value'
												style={{ width: '100%' }}
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
												const response = await authFetch(`${API_Route}/superadmin/secrets`, {
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
											const response = await authFetch(`${API_Route}/superadmin/restart`, {
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

				{/************************** Migration **************************/}
				<Card title={<Title level={2}>Academic Year Migration</Title>}>
					<Flex vertical gap='middle'>
						<Alert
							message="Warning: Destructive Operation"
							description="This will archive all records, cases, and requests to a new schema, then clear them from the active system. All students below year 4 will be set to 'unverified', and year 4 students will be removed."
							type="warning"
							showIcon
							icon={<WarningOutlined />}
						/>
						<Form layout='vertical' onFinish={(values) => {
							modal.confirm({
								title: 'Confirm Academic Year Migration',
								content: (
									<Flex vertical gap='small'>
										<Text>You are about to migrate to the new academic year with archive schema: <Text strong>{values.schemaName}</Text></Text>
										<Text type="danger">This action cannot be easily undone.</Text>
										<Text>Please ensure you have a database backup before proceeding.</Text>
									</Flex>
								),
								okText: 'Migrate & Reset',
								okButtonProps: { danger: true },
								onOk: async () => {
									setLoading(true);
									try {
										const res = await authFetch(`${API_Route}/superadmin/migrate`, {
											method: 'POST',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify({ schemaName: values.schemaName })
										});
										const data = await res.json();
										if (!res.ok) throw new Error(data.message || 'Migration failed');
										message.success('Academic year migration completed successfully!');
									} catch (err) {
										message.error('Migration failed: ' + err.message);
									} finally {
										setLoading(false);
									}
								}
							});
						}}>
							<Form.Item
								label="Archive Schema Name"
								name="schemaName"
								rules={[
									{ required: true, message: 'Please enter a schema name' },
									{ pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores allowed' }
								]}
								help="Example: ay_2024_2025"
							>
								<Input placeholder="ay_2024_2025" />
							</Form.Item>
							<Button type="primary" danger htmlType="submit" loading={loading}>
								Start Migration
							</Button>
						</Form>
					</Flex>
				</Card>
			</Flex>
		</Card>
	);
};

export default Profile;
