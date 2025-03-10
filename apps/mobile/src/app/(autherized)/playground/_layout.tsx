import React from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import { PlaygroundNavigatoinButton } from '@/modules/PlaygroundNavigationButton';

const Layout = () => {
	return <BaseLayout className="pt-14" animationType="componentSlideExpand" animationComponent={<PlaygroundNavigatoinButton />} />;
};

export default Layout;
