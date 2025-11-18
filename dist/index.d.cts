import React from 'react';
import { ITerminalOptions, Terminal } from 'xterm';
import * as react_jsx_runtime from 'react/jsx-runtime';

interface InkXtermProps {
    className?: string;
    focus?: boolean;
    termOptions?: ITerminalOptions;
    children: React.ReactElement;
}
declare const InkXterm: React.FC<InkXtermProps>;

interface InkTerminalBoxProps {
    className?: string;
    focus?: boolean;
    termOptions?: ITerminalOptions;
    children: React.ReactElement;
}
/**
 * A wrapper component that provides proper styling and containment for InkXterm.
 * Handles CSS isolation from parent styles and ensures proper scrolling behavior.
 */
declare const InkTerminalBox: React.FC<InkTerminalBoxProps>;

interface InkWebOptions {
    termOptions?: ITerminalOptions;
    container: HTMLElement;
    focus?: boolean;
}
declare function mountInkInXterm(element: React.ReactElement, opts: InkWebOptions): {
    term: Terminal;
    unmount: () => Promise<void>;
};

declare const DemoApp: () => react_jsx_runtime.JSX.Element;

export { DemoApp, InkTerminalBox, type InkWebOptions, InkXterm, mountInkInXterm };
