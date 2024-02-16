const Message = ({ message }: { message: string }) => (
	<div style={{
		fontWeight: "bold",
		padding: "4rem",
		textAlign: "center"
	}}>
		{message}
	</div>
);

export default Message;
