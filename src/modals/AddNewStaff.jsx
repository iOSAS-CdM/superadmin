import React from 'react';

import {
	Form,
	Input,
	Button,
	Select,
	Flex,
	Upload,
	Steps,
	Typography,
	Space,
	Image,
	Avatar
} from 'antd';

import {
	UploadOutlined,
	ClearOutlined,
	RightOutlined,
	SwapOutlined,
	SolutionOutlined,
	SmileOutlined,
	LoadingOutlined,
	UserAddOutlined,
	SaveOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

const NewStaffForm = React.createRef();

const InformationForm = ({ setProgress }) => {
	const [ProfilePicture, setProfilePicture] = React.useState('');

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

	return (
		<Form
			layout='vertical'
			ref={NewStaffForm}
			onFinish={(values) => { }}
			initialValues={newStaff}
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
							beforeUpload={(file) => {
								// Open the file
								const reader = new FileReader();
								reader.onload = (e) => {
									file.preview = e.target.result;
									setProfilePicture(e.target.result);
									NewStaffForm.current.setFieldsValue({
										profilePicture: e.target.result
									});
								};
								reader.readAsDataURL(file);
								return false;
							}}
							style={{
								width: 'calc(var(--space-XL) * 8)',
								height: 'calc(var(--space-XL) * 8)',
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
							Click to upload a profile picture *
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
									employeeId: `${String((new Date()).getFullYear()).slice(1)}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`
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
				</Flex>
			</Flex>

			{/* <Flex vertical gap='small'>
				<Steps
					current={steps}
					items={[
						{
							title: 'Information',
							icon: <SolutionOutlined />
						},
						{
							title: 'Profile Picture',
							icon: <SmileOutlined />
						},
						{
							title: 'Confirmation',
							icon: <LoadingOutlined />
						}
					]}
				/>
				<Flex justify='flex-end' align='center' gap='small'>
					<Text type='secondary'>
						Please fill all the required fields *
					</Text>
					<Button
						type='default'
						icon={<ClearOutlined />}
						iconPosition='start'
						disabled={steps === 0}
						onClick={() => setSteps(steps - 1)}
					>
						Back
					</Button>
					<Button
						type='primary'
						icon={steps === 2 ? <SaveOutlined /> : <RightOutlined />}
						iconPosition={steps === 2 ? 'start' : 'end'}
						onClick={() => {
							if (steps < 2) {
								NewStaffForm.current.validateFields()
									.then((values) => {
										setSteps(steps + 1);
									})
									.catch((errorInfo) => {
										console.error('Validation Failed:', errorInfo);
									});
							} else {
								NewStaffForm.current.validateFields()
									.then((values) => {
										onChange({
											...values,
											profilePicture: ProfilePicture
										});
										setAddingNew(false);
										modal.destroyAll();
									})
									.catch((errorInfo) => {
										console.error('Validation Failed:', errorInfo);
									});
							};
						}}
					>
						{steps === 2 ? 'Submit' : 'Next'}
					</Button>
				</Flex>
			</Flex> */}
		</Form>
	);
};

/**
 * Function to add a new staff member.
 * @param {import('antd/es/modal/useModal').HookAPI} Modal - The Ant Design Modal component.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setAddingNew - React.Dispatch<React.SetStateAction<boolean>> to set the adding new state.
 * @param {Array} staffs - The current list of staff members.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setStaffs - Function to update the list of staff members.
 * @return {Promise<Object>} - A promise that resolves to the new staff object.
 */
const AddNewStaff = async (Modal, addingNew, setAddingNew, staffs, setStaffs) => {
	let newStaff = {
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

	setAddingNew(true);
	await Modal.info({
		title: 'Add New Staff',
		centered: true,
		closable: { 'aria-label': 'Close' },
		open: addingNew,
		content: (
			<InformationForm setAddingNew={setAddingNew} onChange={(updatedStaff) => Object.assign(newStaff, updatedStaff)} />
		),
		icon: <UserAddOutlined />,
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
				NewStaffForm.current.validateFields()
					.then((values) => {
						Object.assign(newStaff, values);
						newStaff.profilePicture = values.profilePicture || newStaff.profilePicture;
						setStaffs([...staffs, newStaff]);
						resolve(newStaff);
					})
					.catch((errorInfo) => {
						console.error('Validation Failed:', errorInfo);
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
	setAddingNew(false);

	return newStaff;
};

export default AddNewStaff;