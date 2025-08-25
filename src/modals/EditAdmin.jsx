import React from 'react';

import {
	Form,
	Input,
	Button,
	Select,
	Upload,
	Avatar,
	Flex,
	Typography,
	Space
} from 'antd';

import {
	SwapOutlined,
	UploadOutlined,
	EditOutlined,
	SaveOutlined,
	ClearOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

const EditAdminForm = React.createRef();

import { API_Route } from '../main';

const AdminForm = ({ admin }) => {
	const [ProfilePicture, setProfilePicture] = React.useState(admin.profilePicture || '');

	return (
		<Form
			layout='vertical'
			ref={EditAdminForm}
			onFinish={(values) => { }}
			initialValues={admin}
			style={{ width: '100%' }}
		>
			<Flex justify='center' align='flex-start' gap='large'>
				<Form.Item
					name='profilePicture'
					rules={[{ required: true, message: 'Please upload a profile picture!' }]}
				>
					<Flex vertical justify='center' align='center' gap='small'>
						<Upload
							listType='picture-card'
							showUploadList={false}
							accept='image/*'
							beforeUpload={(file) => {
								// Open the file
								const reader = new FileReader();
								reader.onload = (e) => {
									file.preview = e.target.result;
									setProfilePicture(e.target.result);
									EditAdminForm.current.setFieldsValue({
										profilePicture: e.target.result
									});
								};
								reader.readAsDataURL(file);
								return false;
							}}
							style={{
								width: 'calc(var(--space-XL) * 12)',
								height: 'calc(var(--space-XL) * 12)',
							}}
						>
							{ProfilePicture ? (
								<Avatar
									src={ProfilePicture}
									shape='square'
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover'
									}}
								/>
							) : (
								<UploadOutlined style={{ fontSize: 'calc(var(--space-XL))' }} />
							)}
						</Upload>
						<Text type='secondary' style={{ textAlign: 'center' }}>
							Click to replace profile picture *
						</Text>
					</Flex>
				</Form.Item>

				<Flex vertical>
					<Space.Compact style={{ width: '100%' }}>
						<Form.Item
							name={['name', 'first']}
							rules={[{ required: true, message: 'Please input the first name!' }]}
							style={{ width: 'calc(100% /3)' }}
						>
							<Input placeholder='First Name *' />
						</Form.Item>
						<Form.Item
							name={['name', 'middle']}
							rules={[{ required: false }]}
							style={{ width: 'calc(100% /3)' }}
						>
							<Input placeholder='Middle Name' />
						</Form.Item>
						<Form.Item
							name={['name', 'last']}
							rules={[{ required: true, message: 'Please input the last name!' }]}
							style={{ width: 'calc(100% /3)' }}
						>
							<Input placeholder='Last Name *' />
						</Form.Item>
					</Space.Compact>
					<Form.Item
						name='email'
						rules={[{ required: true, message: 'Please input the email!' }]}
					>
						<Input placeholder='Email *' type='email' />
					</Form.Item>
					<Space.Compact style={{ width: '100%' }}>
						<Form.Item
							name='id'
							rules={[{ required: true, message: 'Please input the employee ID!' }]}
							style={{ width: '100%' }}
						>
							<Input placeholder='Employee ID *' />
						</Form.Item>
						<Button
							type='primary'
							icon={<SwapOutlined />}
							style={{ width: 'fit-content' }}
							onClick={() => {
								EditAdminForm.current.setFieldsValue({
									id: `${String((new Date()).getFullYear()).slice(1)}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
								});
							}}
						>
							Generate ID
						</Button>
					</Space.Compact>
					<Form.Item
						name='role'
						rules={[{ required: true, message: 'Please select the role!' }]}
					>
						<Select
							placeholder='Select Role *'
							options={[
								{ label: 'Head', value: 'head' },
								{ label: 'Guidance Officer', value: 'guidance' },
								{ label: 'Prefect of Discipline Officer', value: 'prefect' },
								{ label: 'Student Affairs Officer', value: 'student-affairs' }
							]}
							style={{ width: '100%' }}
						/>
					</Form.Item>
				</Flex>
			</Flex>
		</Form>
	);
};

const EditAdmin = async (Modal, admin, editing, setEditing, setThisAdmin, Notification) => {
	await Modal.info({
		title: 'Edit Admin',
		centered: true,
		closable: { 'aria-label': 'Close' },
		open: editing,
		content: (
			<AdminForm admin={admin} onChange={setThisAdmin} />
		),
		icon: <EditOutlined />,
		width: {
			xs: '100%',
			sm: remToPx(50),
			md: remToPx(60),
			lg: remToPx(70),
			xl: remToPx(80),
			xxl: remToPx(90)
		},
		footer: (_, { CancelBtn, OkBtn }) => (
			<Flex justify='flex-end' align='center' gap='small'>
				<CancelBtn />
				<OkBtn />
			</Flex>
		),
		okText: 'Save',
		okButtonProps: {
			icon: <SaveOutlined />
		},
		onOk: () => {
			return new Promise((resolve, reject) => {
				EditAdminForm.current.validateFields()
					.then(async (values) => {
						const request = await fetch(`${API_Route}/superadmin/admin/${admin.id}`, {
							method: 'PUT',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(values)
						});

						if (!request.ok) {
							const errorData = await request.json();
							Notification.error({
								message: 'Error',
								description: errorData.message || 'Failed to update admin.'
							});
							return reject(errorData);
						};

						const data = await request.json();

						Notification.success({
							message: 'Update Successful',
							description: 'Admin details updated successfully'
						});

						setThisAdmin(values);
						resolve();
					})
					.catch((errorInfo) => {
						reject(errorInfo);
					});
			});
		},
		cancelText: 'Cancel',
		cancelButtonProps: {
			icon: <ClearOutlined />,
			hidden: false
		},
		onCancel: () => {
			return new Promise((resolve) => {
				EditAdminForm.current.resetFields();
				resolve();
			});
		}
	});
	setEditing(false);
};

export default EditAdmin;
