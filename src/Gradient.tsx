import { type FC, type ReactNode } from 'react';
import { Transform } from 'ink';
import gradientString from 'gradient-string';
import stripAnsi from 'strip-ansi';

export type GradientName =
	| 'cristal'
	| 'teen'
	| 'mind'
	| 'morning'
	| 'vice'
	| 'passion'
	| 'fruit'
	| 'instagram'
	| 'atlas'
	| 'retro'
	| 'summer'
	| 'pastel'
	| 'rainbow';

export type GradientColors = Array<string | Record<string, unknown>>;

export type GradientProps = {
	readonly children: ReactNode;
	readonly name?: GradientName;
	readonly colors?: GradientColors;
};

export const Gradient: FC<GradientProps> = ({ name, colors, children }) => {
	if (name && colors) {
		throw new Error('The `name` and `colors` props are mutually exclusive');
	}

	type GradientFunction = ReturnType<typeof gradientString>;
	let gradient: GradientFunction;
	
	if (name) {
		gradient = gradientString[name];
	} else if (colors) {
		gradient = gradientString(colors as Parameters<typeof gradientString>[0]);
	} else {
		throw new Error('Either `name` or `colors` prop must be provided');
	}

	const applyGradient = (text: string) => gradient.multiline(stripAnsi(text));

	return <Transform transform={applyGradient}>{children}</Transform>;
};

export default Gradient;
