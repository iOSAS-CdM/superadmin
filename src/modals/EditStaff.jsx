import React from 'react';

import { Modal, Form, Input, Button, Select, Upload, Avatar, Flex, Typography, Space } from 'antd';

import { PlusCircleOutlined, SwapOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

const EditStaff = async (staff) => {
	const EditStaffForm = React.createRef();

	const EditStaffModal = await new Promise((resolve, reject) => {
		const modal = Modal.info({
			title: 'Edit Staff',
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
					ref={EditStaffForm}
					onFinish={(values) => { }}
					initialValues={staff}
					style={{ width: '100%' }}
				>
					<Flex justify='center' align='stretch' gap='large'>
						<Form.Item
							name='profilePicture'
							rules={[{ required: false, message: 'Please upload a profile picture!' }]}
						>
							<Upload
								listType='picture'
								maxCount={1}
								showUploadList={false}
								beforeUpload={(file) => {
									const isImage = file.type.startsWith('image/');
									if (!isImage) {
										Modal.error({
											title: 'Invalid File Type',
											content: 'Please upload an image file.'
										});
									};

									const reader = new FileReader();
									reader.onload = (e) => {
										EditStaffForm.current.setFieldsValue({
											profilePicture: e.target.result
										});
										staff.profilePicture = e.target.result;
									};
									reader.readAsDataURL(file);
									return false;
								}}
								fileList={[
									{
										uid: '-1',
										name: 'profile-picture',
										status: 'done',
										url: staff.profilePicture || 'https://via.placeholder.com/150'
									}
								]}
							>
								<Avatar
									src={staff.profilePicture}
									alt='Profile Picture'
									shape='square'
									style={{
										height: 'calc(var(--space-XL) * 12)',
										width: 'calc(var(--space-XL) * 12)'
									}}
								/>
							</Upload>
						</Form.Item>
						<Flex vertical justify='center' align='stretch'>
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
										EditStaffForm.current.setFieldsValue({
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
										{ label: 'Head', value: 'head', disabled: staff.position !== 'head' },
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
						</Flex>
					</Flex>
				</Form>
			),
			okType: 'primary',
			okText: 'Save',
			onOk: () => {
				EditStaffForm.current.validateFields()
					.then((values) => {
						modal.destroy();
						console.log(values);
						resolve(modal);
					})
					.catch((errorInfo) => {
						console.error('Validation Failed:', errorInfo);
					});
			}
		});
	});
};

export default EditStaff;