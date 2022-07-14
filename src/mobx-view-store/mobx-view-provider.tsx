import * as React from 'react'
import { ConfigService, TemplateConfigOptions } from './config-service';

let init = false;

type Props = {
	children: React.ReactNode;
	config: TemplateConfigOptions
}

export function MobxViewProvider({children, config}: Props) {
	if (!init) {
		init = true;
		ConfigService.setup(config);
	}

	return <>{children}</>;
}
