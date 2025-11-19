import React from 'react';
import { ITerminalOptions, Terminal } from 'xterm';
export { Box, Instance, Newline, RenderOptions, Spacer, Static, Text, Transform, measureElement, render, useApp, useFocus, useFocusManager, useInput, useIsScreenReaderEnabled, useStderr, useStdin, useStdout } from 'ink';

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

interface InkXtermProps {
    className?: string;
    focus?: boolean;
    termOptions?: ITerminalOptions;
    children: React.ReactElement;
}
declare const InkXterm: React.FC<InkXtermProps>;

interface InkWebOptions {
    termOptions?: ITerminalOptions;
    container: HTMLElement;
    focus?: boolean;
}
declare function mountInkInXterm(element: React.ReactElement, opts: InkWebOptions): {
    term: Terminal;
    unmount: () => Promise<void>;
};

declare const waitForYogaInit: () => Promise<void>;

export { InkTerminalBox, type InkWebOptions, InkXterm, mountInkInXterm, waitForYogaInit };
