import React from 'react';

import {
	Form,
	Input,
	Button,
	Select,
	Upload,
	Steps,
	Typography,
	Space
} from 'antd';

import {
	PlusCircleOutlined,
	SwapOutlined,
	SolutionOutlined,
	SmileOutlined,
	LoadingOutlined,
	UserAddOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

import remToPx from '../utils/remToPx';

const NewStaffForm = React.createRef();

const InformationForm = ({ staff, onChange }) => {
	// information, profilePicture, confirmation
	const [steps, setSteps] = React.useState(0);

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
		</Form>
	);
};

const AddNewStaff = async (Modal) => {
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

	await new Promise((resolve) => {
		Modal.info({
			title: 'Add New Staff',
			centered: true,
			content: (
				<InformationForm staff={newStaff} onChange={(updatedStaff) => Object.assign(newStaff, updatedStaff)} />
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
			footer: null
		});
	});

	return newStaff;
};

export default AddNewStaff;