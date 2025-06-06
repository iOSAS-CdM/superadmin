import React from 'react';

import { Button } from 'antd';

export default class SignIn extends React.Component {
	render() {
		return (
			<div className='sign-in'>
				<Button
					type='primary'
					onClick={() => {
						alert('Sign In button clicked!');
					}}
				>
					Sign In
				</Button>
			</div>
		);
	}
};