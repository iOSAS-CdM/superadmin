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

const EditStaffForm = React.createRef();

import { API_Route } from '../main';
import authFetch from '../utils/authFetch';

const StaffForm = ({ staff }) => {
	const [ProfilePicture, setProfilePicture] = React.useState(staff.profilePicture || '');

	return (
		<Form
			layout='vertical'
			ref={EditStaffForm}
			onFinish={(values) => { }}
			initialValues={staff}
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
									EditStaffForm.current.setFieldsValue({
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
							disabled
							rules={[{ required: true, message: 'Please input the employee ID!' }]}
							style={{ width: '100%' }}
						>
							<Input placeholder='Employee ID *' disabled />
						</Form.Item>
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

const EditStaff = async (Modal, staff, setRefreshSeed, editing, setEditing, setThisStaff, Notification) => {
	let newStaff = null;
	await Modal.info({
		title: 'Edit Staff',
		centered: true,
		closable: { 'aria-label': 'Close' },
		open: editing,
		content: (
			<StaffForm staff={staff} onChange={setThisStaff} />
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
				EditStaffForm.current.validateFields()
					.then(async (values) => {
						const request = await authFetch(`${API_Route}/superadmin/staff/${staff.id}`, {
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
								description: errorData.message || 'Failed to update staff.'
							});
							setRefreshSeed(prev => prev + 1);
							return reject(errorData);
						};

						const data = await request.json();
						newStaff = data;

						Notification.success({
							message: 'Update Successful',
							description: 'Staff details updated successfully'
						});

						setRefreshSeed(prev => prev + 1);
						setThisStaff(values);
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
				EditStaffForm.current.resetFields();
				resolve();
			});
		}
	});
	setEditing(false);
	return newStaff;
};

export default EditStaff;
