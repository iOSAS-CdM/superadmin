import React from 'react';
import { Button as AntdButton } from 'antd';
// import { ButtonProps } from 'antd/es/button/button.d.ts';
import { LoadingOutlined } from '@ant-design/icons';

/**
 * Custom Button component
 * @param {import('antd/es/button/button.d.ts').ButtonProps} props 
 */
const Button = (props) => {
	const [isLoading, setIsLoading] = React.useState(false);
	
	const handleClick = async (event) => {
		if (!props.onClick) return;
		
		try {
			setIsLoading(true);
			const result = props.onClick(event);
			// If the onClick handler returns a Promise, await it
			if (result instanceof Promise) {
				await result;
			};
		}
		 finally {
			setIsLoading(false);
		};
	};
	
	return (
		<AntdButton 
			{...props} 
			onClick={handleClick}
			loading={isLoading || props.loading}
		/>
	);
};

export default Button;