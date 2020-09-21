const React = require('react');
const { Text, useInput } = require('ink');

function Input({ onChange, placeholder }) {
	const [text, setText] = React.useState('');

	useInput((input, key) => {
		if (key.return) {
			return onChange(text);
		}

		setText((t) => {
			if (key.delete || key.backspace) {
				return t.slice(0, t.length - 1);
			}
			return t + input;
		});
	});

	if (!text) {
		return <Text dimColor>█{placeholder}</Text>;
	}

	return (
		<Text>
			{text}
			<Text dimColor>█</Text>
		</Text>
	);
}

module.exports = {
	Input,
};
