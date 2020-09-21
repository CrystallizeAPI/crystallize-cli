const React = require('react');
const { Text, useInput, Newline } = require('ink');

function Select({ options, onChange }) {
	const [selected, setSelected] = React.useState(0);
	useInput((input, key) => {
		if (key.return) {
			return onChange(options[selected]);
		}

		let newSel = selected;
		if (key.upArrow) {
			newSel--;
		} else if (key.downArrow) {
			newSel++;
		}
		if (newSel < 0) {
			newSel = options.length - 1;
		} else if (newSel > options.length - 1) {
			newSel = 0;
		}

		setSelected(newSel);
	});

	return (
		<>
			<Newline />
			{options.map((o, i) => (
				<Text key={o.value} color={i === selected && 'green'}>
					{o.message || o.label}
				</Text>
			))}
		</>
	);
}

module.exports = {
	Select,
};
