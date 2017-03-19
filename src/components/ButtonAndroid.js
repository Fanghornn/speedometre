export default ({onPress, text, style, disabled}) => (
	<TouchableOpacity onPress={onPress}>

		<Text
			style={style}
			disabled={disabled}
		>
			{text}
		</Text>

	</TouchableOpacity>
)