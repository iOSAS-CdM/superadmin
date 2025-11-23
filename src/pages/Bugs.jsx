import React from 'react';
import { useNavigate } from 'react-router';
import authFetch from '../utils/authFetch';

import {
	Flex,
	Card,
	Typography,
	Button,
	List,
	Tag,
	App,
	Image,
	Carousel,
	Select
} from 'antd';

import {
	BugOutlined,
	ArrowLeftOutlined,
	ReloadOutlined
} from '@ant-design/icons';

import Header from '../components/Header';
import { API_Route } from '../main';

const { Title, Text, Paragraph } = Typography;
const Bugs = () => {
	const navigate = useNavigate();
	const { notification } = App.useApp();

	const [loading, setLoading] = React.useState(false);
	const [bugs, setBugs] = React.useState([]);
	const [total, setTotal] = React.useState(0);
	const [pagination, setPagination] = React.useState({
		current: 1,
		pageSize: 10
	});

	const fetchBugs = async (page = 1, pageSize = 10) => {
		setLoading(true);
		try {
			const offset = (page - 1) * pageSize;
			const response = await authFetch(`${API_Route}/bugs?limit=${pageSize}&offset=${offset}`);

			if (!response.ok) {
				throw new Error('Failed to fetch bugs');
			}

			const data = await response.json();
			setBugs(data.bugs || []);
			setTotal(data.length || 0);
			setPagination({ ...pagination, current: page, pageSize });
		} catch (error) {
			console.error('Error fetching bugs:', error);
			notification.error({
				message: 'Error',
				description: 'Failed to load bug reports.'
			});
		} finally {
			setLoading(false);
		}
	};

	React.useEffect(() => {
		fetchBugs(pagination.current, pagination.pageSize);
	}, []);

	const handlePageChange = (page, pageSize) => {
		fetchBugs(page, pageSize);
	};

	return (
		<Flex vertical gap='middle' style={{ padding: '1rem', height: '100%', overflow: 'hidden' }}>
			<Header
				icon={<BugOutlined style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />}
				title={<Title level={3} style={{ margin: 0 }}>Bug Reports</Title>}
				actions={
					<>
						<Button
							icon={<ReloadOutlined />}
							onClick={() => fetchBugs(pagination.current, pagination.pageSize)}
							loading={loading}
						>
							Refresh
						</Button>
						<Button
							icon={<ArrowLeftOutlined />}
							onClick={() => navigate('/dashboard')}
						>
							Back to Dashboard
						</Button>
					</>
				}
			/>

			<Card style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
				<List
					grid={{
						gutter: 16,
						xs: 1,
						sm: 1,
						md: 2,
						lg: 2,
						xl: 3,
						xxl: 3,
					}}
					dataSource={bugs}
					pagination={{
						current: pagination.current,
						pageSize: pagination.pageSize,
						total: total,
						onChange: handlePageChange,
						align: 'center'
					}}
					loading={loading}
					renderItem={(bug) => (
						<List.Item>
							<BugCard bug={bug} />
						</List.Item>
					)}
				/>
			</Card>
		</Flex>
	);
};

const BugCard = ({ bug }) => {
	const { notification } = App.useApp();
	const [status, setStatus] = React.useState(bug.status);
	const [updating, setUpdating] = React.useState(false);

	const handleStatusChange = async (newStatus) => {
		setUpdating(true);
		try {
			const response = await authFetch(`${API_Route}/bugs/${bug.id}/status`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: newStatus })
			});

			if (!response.ok)
				throw new Error('Failed to update status');

			setStatus(newStatus);
			notification.success({
				message: 'Success',
				description: 'Bug status updated successfully.'
			});
		} catch (error) {
			console.error('Error updating status:', error);
			notification.error({
				message: 'Error',
				description: 'Failed to update bug status.'
			});
		} finally {
			setUpdating(false);
		}
	};

	return (
		<Card
			title={bug.name}
			extra={<Text type='secondary'>{new Date(bug.created_at).toLocaleDateString()}</Text>}
			hoverable
		>
			<Flex vertical gap='small'>
				<Text strong>Email:</Text>
				<Text copyable>{bug.email}</Text>

				<Text strong>Description:</Text>
				<Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
					{bug.description}
				</Paragraph>

				<Text strong>Status:</Text>
				<Select
					value={status}
					style={{ width: '100%' }}
					onChange={handleStatusChange}
					loading={updating}
					disabled={updating}
					options={[
						{ value: 'open', label: 'Open' },
						{ value: 'in_progress', label: 'In Progress' },
						{ value: 'resolved', label: 'Resolved' },
						{ value: 'closed', label: 'Closed' },
					]}
				/>

				{bug.screenshots && bug.screenshots.length > 0 && (
					<>
						<Text strong>Screenshots:</Text>
						<div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
							<Image.PreviewGroup>
								<Flex gap='small' wrap='wrap'>
									{bug.screenshots.map((url, index) => (
										<Image
											key={index}
											width={80}
											height={80}
											src={url}
											style={{ objectFit: 'cover', borderRadius: '4px' }}
										/>
									))}
								</Flex>
							</Image.PreviewGroup>
						</div>
					</>
				)}
			</Flex>
		</Card>
	);
};


export default Bugs;
