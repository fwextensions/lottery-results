import type { DragEvent } from "react";

type DropTargetProps = {
	visible?: boolean;
	onDrop: (event: DragEvent<HTMLDivElement>) => void;
	onLeave: () => void;
};

export default function DropTarget({
	onDrop,
	onLeave }: DropTargetProps)
{
	return (
		<div
			id="drop-target"
			onDragLeave={onLeave}
			onDrop={onDrop}
		>
			<div>
				Drag and drop a results file here
			</div>
		</div>
	);
}
