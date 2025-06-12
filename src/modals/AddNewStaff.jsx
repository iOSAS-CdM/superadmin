import React from 'react';

import { Modal, Form, Input, Button, Select, Upload, Avatar, Flex, Typography, Space } from 'antd';

import { PlusCircleOutlined, SwapOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

const AddNewStaff = async () => {
	const newStaff = {
		id: Math.random().toString(36).substring(2, 15),
		name: {
			first: null,
			middle: null,
			last: null
		},
		email: null,
		employeeId: null,
		position: null,
		profilePicture: null
	};

	const NewStaffForm = React.createRef();

	// Steps:
	// 1. Necessary validations (e.g., name, email, employee id, position)
	// 2. Avatar upload (mocked)
	// 	2.1. Progress bar
	// 3. Confirmation modal

	const NewStaffModal = await new Promise((resolve, reject) => {
		const modal = Modal.info({
			title: 'Add New Staff',
			centered: true,
			maskClosable: true,
			width: {
				xs: '100%',
				sm: remToPx(50),
				md: remToPx(60),
				lg: remToPx(70),
				xl: remToPx(80),
				xxl: remToPx(90)
			},
			onCancel: () => {
				modal.destroy();
				reject(new Error('User cancelled the operation'));
			},
			content: (
				<Form
					layout='vertical'
					ref={NewStaffForm}
					onFinish={(values) => { }}
					initialValues={newStaff}
					style={{ width: '100%' }}
				>
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
							name='employeeId'
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
								NewStaffForm.current.setFieldsValue({
									employeeId: `025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
								});
							}}
						>
							Generate ID
						</Button>
					</Space.Compact>

					<Form.Item
						name='position'
						rules={[{ required: true, message: 'Please select the position!' }]}
					>
						<Select
							placeholder='Select Position *'
							options={[
								{ label: 'Head', value: 'head', disabled: true },
								{ label: 'Guidance Officer', value: 'guidance' },
								{ label: 'Prefect of Discipline Officer', value: 'prefect' },
								{ label: 'Student Affairs Officer', value: 'student-affairs' }
							]}
							style={{ width: '100%' }}
						>
							<Select.Option value='head'>Head</Select.Option>
							<Select.Option value='guidance'>Guidance Officer</Select.Option>
							<Select.Option value='prefect'>Prefect of Discipline Officer</Select.Option>
							<Select.Option value='student-affairs'>Student Affairs Officer</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			),
			okType: 'primary',
			okText: 'Next',
			onOk: (args) => {
				NewStaffForm.current?.validateFields()
					.then(() => {
						newStaff.name.first = NewStaffForm.current.getFieldValue(['name', 'first']);
						newStaff.name.middle = NewStaffForm.current.getFieldValue(['name', 'middle']);
						newStaff.name.last = NewStaffForm.current.getFieldValue(['name', 'last']);
						newStaff.email = NewStaffForm.current.getFieldValue('email');
						newStaff.employeeId = NewStaffForm.current.getFieldValue('employeeId');
						newStaff.position = NewStaffForm.current.getFieldValue('position');

						resolve(modal);
					})
					.catch((errorInfo) => {
						console.error('Validation Failed:', errorInfo);
					});
			}
		});
	});

	console.log('Staff: ', newStaff);

	await new Promise((resolve, reject) => {
		const staffModal = NewStaffModal.update({
			title: 'Add New Staff - Avatar Upload',
			width: '',
			content: (
				<Form
					layout='vertical'
					ref={NewStaffForm}
					onFinish={(values) => { }}
					initialValues={NewStaffForm.current ? NewStaffForm.current.getFieldsValue() : newStaff}
					style={{ width: '100%' }}
				>
					<Flex vertical justify='center' align='center' gap='small'>
						<Form.Item
							name='profilePicture'
							rules={[{ required: true, message: 'Please upload a profile picture!' }]}
						>
							<Flex vertical justify='center' align='center' gap='small'>
								<Upload
									listType='picture-card'
									showUploadList={false}
									beforeUpload={(file) => {
										const reader = new FileReader();
										reader.onload = (e) => {
											NewStaffForm.current.setFieldsValue({
												profilePicture: e.target.result
											});
											newStaff.profilePicture = e.target.result;
											resolve(staffModal);
										};
										reader.readAsDataURL(file);
										return false; // Prevent auto upload
									}}
								>
									<Button
										icon={<PlusCircleOutlined />}
										style={{ width: '100%', height: '100%' }}
									/>
								</Upload>

								<Flex vertical justify='center' align='center'>
									<Title level={5} style={{ textAlign: 'center' }}>
										Upload Profile Picture
									</Title>
									<Text type='secondary' style={{ textAlign: 'center' }}>
										Click to upload a profile picture. Recommended size: 200x200 pixels.
									</Text>
								</Flex>
							</Flex>
						</Form.Item>
					</Flex>
				</Form>
			),
			footer: (
				<Flex justify='flex-end' gap='small'>
					<Button
						onClick={() => {
							staffModal.destroy();
							reject(new Error('User cancelled the operation'));
						}}
					>
						Cancel
					</Button>
					<Button
						type='primary'
						onClick={() => {
							if (NewStaffForm.current) {
								NewStaffForm.current.validateFields()
									.then(() => {
										newStaff.profilePicture = NewStaffForm.current.getFieldValue('profilePicture');
										NewStaffForm.current.setFieldsValue({
											profilePicture: newStaff.profilePicture
										});
										resolve(staffModal);
									})
									.catch((errorInfo) => {
										console.error('Validation Failed:', errorInfo);
									});
							};
						}}
					>
						Next
					</Button>
				</Flex>
			)
		});
	});

	console.log('Staff: ', newStaff);

	await new Promise((resolve, reject) => {
		const staffModal = NewStaffModal.update({
			title: 'Add New Staff - Confirmation',
			type: 'warning',
			content: (
				<Flex justify='flex-start' align='center' gap='small'>
					<Avatar
						src={newStaff.profilePicture}
						size={remToPx(10)}
					/>
					<Flex vertical justify='center' align='flex-start'>
						<Title level={5}>{newStaff.name.first} {newStaff.name.middle ? `${newStaff.name.middle} ` : ''}{newStaff.name.last}</Title>
						<Text type='secondary'>{newStaff.employeeId}</Text>
						<Text type='secondary'>{newStaff.position === 'head' ? 'Head' : newStaff.position === 'guidance' ? 'Guidance Officer' :
							newStaff.position === 'prefect' ? 'Prefect of Discipline Officer' : 'Student Affairs Officer'}</Text>
						<Text type='secondary'>{newStaff.email}</Text>
					</Flex>
				</Flex>
			),
			footer: (
				<Flex justify='flex-end' gap='small'>
					<Button
						onClick={() => {
							staffModal.destroy();
							reject(new Error('User cancelled the operation'));
						}}
					>
						Cancel
					</Button>
					<Button
						type='primary'
						onClick={() => {
							resolve(staffModal);
						}}
					>
						Add Staff
					</Button>
				</Flex>
			)
		});
	});

	Modal.destroyAll();

	Modal.success({
		title: 'Staff Added Successfully',
		centered: true,
		content: (
			<Flex justify='flex-start' align='center' gap='small'>
				<Avatar
					src={newStaff.profilePicture}
					size={remToPx(10)}
				/>
				<Flex vertical justify='center' align='flex-start'>
					<Title level={5}>{newStaff.name.first} {newStaff.name.middle ? `${newStaff.name.middle} ` : ''}{newStaff.name.last}</Title>
					<Text type='secondary'>{newStaff.employeeId}</Text>
					<Text type='secondary'>{newStaff.position === 'head' ? 'Head' : newStaff.position === 'guidance' ? 'Guidance Officer' :
						newStaff.position === 'prefect' ? 'Prefect of Discipline Officer' : 'Student Affairs Officer'}</Text>
					<Text type='secondary'>{newStaff.email}</Text>
				</Flex>
			</Flex>
		),
		onOk: () => { }
	});

	return newStaff;
};

export default AddNewStaff;