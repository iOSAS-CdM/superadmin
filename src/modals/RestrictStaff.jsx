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
	WarningOutlined,
	ClearOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

import { API_Route } from '../main';
import authFetch from '../utils/authFetch';

const RestrictStaffForm = React.createRef();

/**
 * Function to restrict staff member.
 * @param {import('antd/es/modal/useModal').HookAPI} Modal - The Ant Design Modal component.
 * 
 * @param {Object} staff - The staff member data to be restricted.
 */
const RestrictStaff = async (Modal, staff, setRefreshSeed, restricting, setRestricting, Notification) => {
	await Modal.warning({
		title: 'Restrict Staff Member',
		centered: true,
		closable: { 'aria-label': 'Close' },
		open: restricting,
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
			icon: <WarningOutlined />,
			danger: true
		},
		onOk: () => {
			return new Promise((resolve, reject) => {
				RestrictStaffForm.current.validateFields()
					.then(async (values) => {
						const request = await authFetch(`${API_Route}/superadmin/staff/${staff.id}/restrict`, {
							method: 'PATCH',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({ reason: values.reason })
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

						Notification.success({ message: 'Staff restricted successfully' });
						setRefreshSeed(prev => prev + 1);
						setRestricting(false);
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
			return new Promise((resolve, reject) => {
				newStaff = null; // Reset newStaff if cancelled
				reject();
			});
		}
	});
};

export default RestrictStaff;
