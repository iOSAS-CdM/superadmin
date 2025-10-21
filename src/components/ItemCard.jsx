import React from 'react';
import { Card, Badge } from 'antd';
import { motion } from 'framer-motion';

/**
 * A reusable card component with optional status ribbon and animations
 * @param {{
 *  children: React.ReactNode;
 *  loading?: boolean;
 *  status?: 'restricted' | 'dismissed' | null;
 *  onClick?: (e: React.MouseEvent) => void;
 *  actions?: React.ReactNode[];
 *  animationDelay?: number;
 * }} props
 */
const ItemCard = ({
	children,
	loading = false,
	status = null,
	onClick,
	actions,
	animationDelay = 0
}) => {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setMounted(true);
		}, animationDelay * 1000 || 0);

		return () => clearTimeout(timer);
	}, [animationDelay]);

	const cardContent = (
		<Card
			size='small'
			hoverable={!!onClick}
			loading={loading}
			onClick={onClick}
			actions={actions}
			className={
				(mounted ? 'staff-card-mounted' : 'staff-card-unmounted') +
				(status === 'restricted' ? ' staff-card-restricted' : '') +
				(status === 'dismissed' ? ' staff-card-dismissed' : '')
			}
		>
			{children}
		</Card>
	);

	if (status === 'restricted' || status === 'dismissed') {
		return (
			<Badge.Ribbon
				text={status === 'restricted' ? 'Restricted' : 'Dismissed'}
				color={status === 'restricted' ? 'red' : 'gray'}
			>
				{cardContent}
			</Badge.Ribbon>
		);
	}

	return cardContent;
};

export default ItemCard;
