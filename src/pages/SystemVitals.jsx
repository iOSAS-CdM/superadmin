import React from 'react';
import { useNavigate } from 'react-router';
import authFetch from '../utils/authFetch';

import {
	Flex,
	Card,
	Typography,
	Button,
	Row,
	Col,
	Statistic,
	Progress,
	App,
	Tag,
	Descriptions,
	Space,
	Divider
} from 'antd';

import {
	DashboardOutlined,
	LeftOutlined,
	ReloadOutlined,
	DatabaseOutlined,
	CloudServerOutlined,
	ApiOutlined,
	ClockCircleOutlined,
	FundViewOutlined,
	LoadingOutlined,
	DisconnectOutlined,
	LinkOutlined
} from '@ant-design/icons';

import Header from '../components/Header';
import { API_Route } from '../main';
import { useMobile } from '../contexts/MobileContext';

const { Title, Text } = Typography;

const SystemVitals = () => {
	const navigate = useNavigate();
	const { notification } = App.useApp();
	const isMobile = useMobile();

	const [loading, setLoading] = React.useState(false);
	const [vitals, setVitals] = React.useState(null);
	const [wsConnected, setWsConnected] = React.useState(false);
	const [useWebSocket, setUseWebSocket] = React.useState(true);
	const wsRef = React.useRef(null);

	// Fetch vitals via HTTP (fallback)
	const fetchVitals = async () => {
		setLoading(true);
		try {
			const response = await authFetch(`${API_Route}/superadmin/vitals`);

			if (!response.ok) {
				throw new Error('Failed to fetch system vitals');
			}

			const data = await response.json();
			setVitals(data);
		} catch (error) {
			console.error('Error fetching vitals:', error);
			notification.error({
				message: 'Error',
				description: 'Failed to load system vitals.'
			});
		} finally {
			setLoading(false);
		}
	};

	// WebSocket connection
	React.useEffect(() => {
		if (!useWebSocket) return;

		const wsUrl = API_Route.replace('http', 'ws');
		const ws = new WebSocket(wsUrl);
		wsRef.current = ws;

		ws.onopen = () => {
			console.log('WebSocket connected');
			setWsConnected(true);

			// Subscribe to vitals updates
			ws.send(JSON.stringify({
				type: 'subscribe_vitals'
			}));
		};

		ws.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);

				if (message.type === 'vitals') {
					setVitals(message.payload);
					setLoading(false);
				}
			} catch (error) {
				console.error('Error parsing WebSocket message:', error);
			}
		};

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
			setWsConnected(false);
			notification.warning({
				message: 'WebSocket Connection Error',
				description: 'Falling back to HTTP polling.'
			});
		};

		ws.onclose = () => {
			console.log('WebSocket disconnected');
			setWsConnected(false);
		};

		return () => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify({
					type: 'unsubscribe_vitals'
				}));
			}
			ws.close();
		};
	}, [useWebSocket]);

	// Fallback to HTTP polling when WebSocket is disabled
	React.useEffect(() => {
		if (useWebSocket || !vitals) return;

		const interval = setInterval(() => {
			fetchVitals();
		}, 5000);

		return () => clearInterval(interval);
	}, [useWebSocket, vitals]);

	// Initial fetch
	React.useEffect(() => {
		if (!useWebSocket) {
			fetchVitals();
		}
	}, [useWebSocket]);

	const getMemoryColor = (percentage) => {
		if (percentage < 50) return 'success';
		if (percentage < 75) return 'normal';
		if (percentage < 90) return 'exception';
		return 'exception';
	};

	return (
		<Flex vertical gap='middle' style={{ padding: '1rem', height: '100%', overflow: 'hidden' }}>
			<Header
				icon={<DashboardOutlined style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />}
				title={<Title level={3} style={{ margin: 0 }}>System Vitals</Title>}
				actions={
					<>
						<Button
							type={useWebSocket ? 'primary' : 'default'}
							icon={wsConnected ? <LinkOutlined /> : <DisconnectOutlined />}
							onClick={() => setUseWebSocket(!useWebSocket)}
						>
							{useWebSocket ? (wsConnected ? 'WebSocket (Connected)' : 'WebSocket (Connecting...)') : 'HTTP Mode'}
						</Button>
						{!useWebSocket && (
							<Button
								icon={<ReloadOutlined />}
								onClick={() => fetchVitals()}
								loading={loading}
							>
								Refresh Now
							</Button>
						)}
						<Button
							icon={<LeftOutlined />}
							onClick={() => navigate('/dashboard')}
						>
							Back to Dashboard
						</Button>
					</>
				}
			/>

			<Card
				style={{ flex: 1, overflow: 'auto' }}
				bodyStyle={{ height: '100%', overflow: 'auto' }}
			>
				{vitals ? (
					<Flex vertical gap='large'>
						{/* System Overview */}
						<div>
							<Title level={4}>
								<CloudServerOutlined /> System Overview
							</Title>
							<Row gutter={[16, 16]}>
								<Col xs={24} sm={12} md={8} lg={6}>
									<Card size='small'>
										<Statistic
											title='Uptime'
											value={vitals.uptime.formatted}
											prefix={<ClockCircleOutlined />}
										/>
									</Card>
								</Col>
								<Col xs={24} sm={12} md={8} lg={6}>
									<Card size='small'>
										<Statistic
											title='WebSocket Connections'
											value={vitals.websockets.connections}
											prefix={<ApiOutlined />}
										/>
									</Card>
								</Col>
								<Col xs={24} sm={12} md={8} lg={6}>
									<Card size='small'>
										<Statistic
											title='Node.js Version'
											value={vitals.node.version}
										/>
									</Card>
								</Col>
								<Col xs={24} sm={12} md={8} lg={6}>
									<Card size='small'>
										<Statistic
											title='Process ID'
											value={vitals.node.pid}
											formatter={(value) => value}
										/>
									</Card>
								</Col>
							</Row>
						</div>

						<Divider />

						{/* Memory Usage */}
						<div>
							<Title level={4}>
								<FundViewOutlined /> Memory Usage
							</Title>
							<Row gutter={[16, 16]}>
								<Col xs={24} lg={12}>
									<Card size='small' title='Heap Memory'>
										<Space direction='vertical' style={{ width: '100%' }} size='large'>
											<div>
												<Flex justify='space-between' style={{ marginBottom: 8 }}>
													<Text>Usage</Text>
													<Text strong>
														{vitals.memory.heap.usedMB} MB / {vitals.memory.heap.totalMB} MB
													</Text>
												</Flex>
												<Progress
													percent={parseFloat(vitals.memory.heap.percentage)}
													status={getMemoryColor(parseFloat(vitals.memory.heap.percentage))}
												/>
											</div>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label='Used'>
													{vitals.memory.heap.usedMB} MB
												</Descriptions.Item>
												<Descriptions.Item label='Total'>
													{vitals.memory.heap.totalMB} MB
												</Descriptions.Item>
											</Descriptions>
										</Space>
									</Card>
								</Col>
								<Col xs={24} lg={12}>
									<Card size='small' title='System Memory'>
										<Space direction='vertical' style={{ width: '100%' }} size='large'>
											<div>
												<Flex justify='space-between' style={{ marginBottom: 8 }}>
													<Text>Usage</Text>
													<Text strong>
														{vitals.memory.system.usedGB} GB / {vitals.memory.system.totalGB} GB
													</Text>
												</Flex>
												<Progress
													percent={parseFloat(vitals.memory.system.percentage)}
													status={getMemoryColor(parseFloat(vitals.memory.system.percentage))}
												/>
											</div>
											<Descriptions column={1} size='small'>
												<Descriptions.Item label='Used'>
													{vitals.memory.system.usedGB} GB
												</Descriptions.Item>
												<Descriptions.Item label='Free'>
													{vitals.memory.system.freeGB} GB
												</Descriptions.Item>
												<Descriptions.Item label='Total'>
													{vitals.memory.system.totalGB} GB
												</Descriptions.Item>
											</Descriptions>
										</Space>
									</Card>
								</Col>
							</Row>
						</div>

						<Divider />

						{/* Database Statistics */}
						<div>
							<Title level={4}>
								<DatabaseOutlined /> Database Statistics
							</Title>
							{vitals.database.error ? (
								<Card size='small'>
									<Text type='danger'>{vitals.database.error}</Text>
								</Card>
							) : (
								<Row gutter={[16, 16]}>
									<Col xs={24} sm={12} md={8}>
										<Card size='small'>
											<Statistic
												title='Total Records'
												value={vitals.database.records}
												prefix={<DatabaseOutlined />}
											/>
										</Card>
									</Col>
									<Col xs={24} sm={12} md={8}>
										<Card size='small'>
											<Statistic
												title='Total Cases'
												value={vitals.database.cases}
												prefix={<DatabaseOutlined />}
											/>
										</Card>
									</Col>
									<Col xs={24} sm={12} md={8}>
										<Card size='small'>
											<Statistic
												title='Organizations'
												value={vitals.database.organizations}
												prefix={<DatabaseOutlined />}
											/>
										</Card>
									</Col>
									<Col xs={24} sm={12} md={8}>
										<Card size='small'>
											<Statistic
												title='Announcements'
												value={vitals.database.announcements}
												prefix={<DatabaseOutlined />}
											/>
										</Card>
									</Col>
									<Col xs={24} sm={12} md={8}>
										<Card size='small'>
											<Statistic
												title='Events'
												value={vitals.database.events}
												prefix={<DatabaseOutlined />}
											/>
										</Card>
									</Col>
									<Col xs={24} sm={12} md={8}>
										<Card size='small'>
											<Statistic
												title='Bug Reports'
												value={vitals.database.bugs}
												prefix={<DatabaseOutlined />}
											/>
										</Card>
									</Col>
								</Row>
							)}

							{vitals.database.users && (
								<>
									<Title level={5} style={{ marginTop: 16 }}>User Distribution by Role</Title>
									<Row gutter={[16, 16]}>
										{Object.entries(vitals.database.users).map(([role, count]) => (
											<Col xs={12} sm={8} md={6} key={role}>
												<Card size='small'>
													<Statistic
														title={role.split('-').map(word =>
															word.charAt(0).toUpperCase() + word.slice(1)
														).join(' ')}
														value={count}
														valueStyle={{ fontSize: '1.5rem' }}
													/>
												</Card>
											</Col>
										))}
									</Row>
								</>
							)}
						</div>

						<Divider />

						{/* Platform Information */}
						<div>
							<Title level={4}>Platform Information</Title>
							<Card size='small'>
								<Descriptions column={isMobile ? 1 : 2} bordered size='small'>
									<Descriptions.Item label='OS Type'>
										{vitals.platform.type}
									</Descriptions.Item>
									<Descriptions.Item label='Platform'>
										{vitals.platform.platform}
									</Descriptions.Item>
									<Descriptions.Item label='Architecture'>
										{vitals.platform.arch}
									</Descriptions.Item>
									<Descriptions.Item label='CPU Cores'>
										{vitals.platform.cpus}
									</Descriptions.Item>
									<Descriptions.Item label='Hostname'>
										{vitals.platform.hostname}
									</Descriptions.Item>
									<Descriptions.Item label='Last Updated'>
										{new Date(vitals.timestamp).toLocaleString()}
									</Descriptions.Item>
								</Descriptions>
							</Card>
						</div>

						{/* CPU Usage */}
						<div>
							<Title level={4}>CPU Usage</Title>
							<Row gutter={[16, 16]}>
								<Col xs={24} sm={12}>
									<Card size='small'>
										<Statistic
											title='User CPU Time'
											value={vitals.cpu.userSeconds}
											suffix='seconds'
										/>
									</Card>
								</Col>
								<Col xs={24} sm={12}>
									<Card size='small'>
										<Statistic
											title='System CPU Time'
											value={vitals.cpu.systemSeconds}
											suffix='seconds'
										/>
									</Card>
								</Col>
							</Row>
						</div>
					</Flex>
				) : (
					<Flex justify='center' align='center' style={{ height: '100%' }}>
						<LoadingOutlined style={{ fontSize: '3rem' }} />
					</Flex>
				)}
			</Card>
		</Flex>
	);
};

export default SystemVitals;
