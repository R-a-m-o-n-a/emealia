import {DragDropProvider} from "@dnd-kit/react";
import React from "react";

type ProviderProps = React.ComponentProps<typeof DragDropProvider>;

/**
 * this is a wrapper for the DragDropProvider because TypeScript falsy assumes that DragDropProvider cannot take children even though in the definition it does.
 * todo examine why this happens and if it is fixable on my side or maybe in an update from dnd-kit
 */
export function ImageDragDropProvider({
                                          children,
                                          ...props
                                      }: React.PropsWithChildren<ProviderProps>) {
    return React.createElement(DragDropProvider, props, children);
}