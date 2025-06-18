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

const RestrictStaffForm = React.createRef();

/**
 * Function to restrict staff member.
 * @param {import('antd/es/modal/useModal').HookAPI} Modal - The Ant Design Modal component.
 * @param {Object} staff - The staff member data to be restricted.
 */
const RestrictStaff = async (Modal, staff) => {
	Modal.warning({
		title: 'Restrict Staff Member',
		content: (
			<Form
				layout='vertical'
				ref={RestrictStaffForm}
				initialValues={{
					staffId: staff.id,
					reason: ''
				}}
			>
				<Form.Item
					name='reason'
					label='Reason for Restriction'
					rules={[{ required: true, message: 'Please provide a reason for the restriction.' }]}
				>
					<Input.TextArea rows={4} placeholder='Enter the reason for restricting this staff member.' />
				</Form.Item>
			</Form>
		),
		footer: (_, { CancelBtn, OkBtn }) => (
			<Flex justify='flex-end' align='center' gap='small'>
				<CancelBtn />
				<OkBtn />
			</Flex>
		),
		okText: 'Restrict',
		okButtonProps: {
			icon: <SaveOutlined />
		},
		onOk: () => {
			return new Promise((resolve, reject) => {
				RestrictStaffForm.current.validateFields()
					.then((values) => {
						console.log('Staff member restricted:', values);
						resolve();
					})
					.catch((errorInfo) => {
						console.error('Validation failed:', errorInfo);
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
			setAddingNew(false);
			return new Promise((resolve) => {
				newStaff = null; // Reset newStaff if cancelled
				resolve();
			});
		}
	});
};

export default RestrictStaff;
