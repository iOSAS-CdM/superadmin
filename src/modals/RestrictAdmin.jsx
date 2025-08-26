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

const RestrictAdminForm = React.createRef();

/**
 * Function to restrict admin member.
 * @param {import('antd/es/modal/useModal').HookAPI} Modal - The Ant Design Modal component.
 * 
 * @param {Object} admin - The admin member data to be restricted.
 */
const RestrictAdmin = async (Modal, admin, setRefreshSeed, restricting, setRestricting, Notification) => {
	await Modal.warning({
		title: 'Restrict Admin Member',
		centered: true,
		closable: { 'aria-label': 'Close' },
		open: restricting,
		content: (
			<Form
				layout='vertical'
				ref={RestrictAdminForm}
				initialValues={{
					adminId: admin.id,
					reason: ''
				}}
			>
				<Form.Item
					name='reason'
					label='Reason for Restriction'
					rules={[{ required: true, message: 'Please provide a reason for the restriction.' }]}
				>
					<Input.TextArea rows={4} placeholder='Enter the reason for restricting this admin member.' />
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
				RestrictAdminForm.current.validateFields()
					.then(async (values) => {
						const request = await fetch(`${API_Route}/superadmin/admin/${admin.id}/restrict`, {
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
								description: errorData.message || 'Failed to update admin.'
							});
							setRefreshSeed(prev => prev + 1);
							return reject(errorData);
						};

						Notification.success({ message: 'Admin restricted successfully' });
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
			setAddingNew(false);
			return new Promise((resolve) => {
				newAdmin = null; // Reset newAdmin if cancelled
				resolve();
			});
		}
	});
};

export default RestrictAdmin;
