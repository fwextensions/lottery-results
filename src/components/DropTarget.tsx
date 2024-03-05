import type { DragEvent } from "react";

type DropTargetProps = {
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
				// we have to prevent the default dragOver behavior for the drop to work
			onDragOver={(event) => event.preventDefault()}
			onDrop={onDrop}
			onDragLeave={onLeave}
		>
			<div>
				Drag and drop a .xlsx results spreadsheet here
			</div>
		</div>
	);
}
