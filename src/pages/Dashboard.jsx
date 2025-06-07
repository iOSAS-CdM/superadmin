import React from 'react';

import { Button, Divider, Input, Image, Typography, Checkbox } from 'antd';

import { LoginOutlined, GoogleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

export default class Dashboard extends React.Component {
	render() {
		return (
			<>
				<Title level={2} style={{ textAlign: 'center', marginTop: '20px' }}>Dashboard</Title>
			</>
		);
	}
};