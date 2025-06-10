import React from 'react';

import { Card, Flex, Button, Dropdown } from 'antd';

import { MenuOutlined } from '@ant-design/icons';

import { MobileContext } from '../main';

import '../styles/components/Header.css';

const Header = ({ icon, title, actions }) => {
	const { mobile, setMobile } = React.useContext(MobileContext);

	return (
		<Card id='header' size='small'>
			<Flex justify='space-between' align='stretch' gap='small'>
				<Flex id='title' justify='flex-start' align='center' gap='small'>
					{icon}
					{title}
				</Flex>
				{!mobile ?
					<Flex justify='flex-end' align='center' gap='small'>
						{actions}
					</Flex>
					:
					<Dropdown
						trigger={['click']}
						placement='bottomRight'
						arrow
						popupRender={(menu) => (
							<Card size='small'>
								<Flex vertical justify='flex-start' align='stretch' gap='small'>
									{actions}
								</Flex>
							</Card>
						)}
					>
						<Button
							size='large'
							icon={<MenuOutlined />}
							onClick={(e) => e.stopPropagation()}
						/>
					</Dropdown>
				}
			</Flex>
		</Card>
	);
};

export default Header;