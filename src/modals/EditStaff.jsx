import React, { useState } from 'react';

import {
	Modal,
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

import { PlusCircleOutlined, SwapOutlined, UploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

const EditStaff = async (staff) => {
	const EditStaffForm = React.createRef();
	const [fileList, setFileList] = useState([]);
	const [imageUrl, setImageUrl] = useState(staff.profilePicture);

	const handleChange = (info) => {
		if (info.file.status === 'done' || info.file.status === 'uploading') {
			// Get the preview
			if (info.file.originFileObj) {
				const reader = new FileReader();
				reader.addEventListener('load', () => setImageUrl(reader.result));
				reader.readAsDataURL(info.file.originFileObj);
			}
			setFileList(info.fileList);
		}
	};

	const uploadButton = (
		<div>
			<UploadOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</div>
	);

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
						<Flex vertical align="center">
							<Avatar
								src={imageUrl}
								alt='Profile Picture'
								shape='square'
								style={{
									height: 'calc(var(--space-XL) * 12)',
									width: 'calc(var(--space-XL) * 12)',
									marginBottom: 16
								}}
							/>
							<Upload
								name="avatar"
								listType="picture-card"
								className="avatar-uploader"
								showUploadList={false}
								beforeUpload={(file) => {
									// Return false to stop default upload behavior
									return false;
								}}
								fileList={fileList}
								onChange={handleChange}
							>
								{uploadButton}
							</Upload>
						</Flex>
						<Flex vertical justify='center' align='stretch'>
							<Space.Compact style={{ width: '100%' }}>
								<Form.Item
									name={['name', 'first']}
									rules={[{ required: true, message: 'Please input the first name!' }]}
									style={{ width: 'calc(100% /3)' }}
								>
									<Input placeholder='First Name *' />
								</Form.Item>
								{/* Rest of the form fields remain the same */}
							</Space.Compact>
							{/* ... other form items ... */}
						</Flex>
					</Flex>
				</Form>
			),
			okType: 'primary',
			okText: 'Save',
			onOk: () => {
				EditStaffForm.current.validateFields()
					.then((values) => {
						// Add the uploaded file to the form values
						if (fileList.length > 0) {
							values.profilePicture = fileList[0].originFileObj;
						}
						modal.destroy();
						console.log(values);
						resolve(values);
					})
					.catch((errorInfo) => {
						console.error('Validation Failed:', errorInfo);
					});
			}
		});
	});
};

export default EditStaff;
