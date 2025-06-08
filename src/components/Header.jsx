import React from 'react';

import { Card, Flex } from 'antd';

import '../styles/components/Header.css';

export default class Header extends React.Component {
	render() {
		return (
			<Card id='header' size='small'>
				<Flex justify='space-between' align='center'>
					<Flex id='title' justify='flex-start' align='center' gap='small'>
						{this.props.icon}
						{this.props.title}
					</Flex>
					<Flex justify='flex-end' align='center' gap='small'>
						{this.props.actions}
					</Flex>
				</Flex>
			</Card>
		);
	};
};