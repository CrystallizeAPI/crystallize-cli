const React = require('react');
const { Text, useInput, Box } = require('ink');

const { highlightColor } = require('../shared');

function Select({ options, compact, onChange, initialSelected = 0 }) {
	const [selected, setSelected] = React.useState(initialSelected);

	useInput((input, key) => {
		if (key.return) {
			setSelected(0);
			onChange(options[selected]);
			return;
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
		<Box flexDirection="column">
			{options.map((o, i) => (
				<Box flexDirection="row" marginY={compact ? 0 : 1} key={o.value}>
					<Box width={1} marginRight={2} alignItems="center">
						<Text color={highlightColor}>{i === selected ? '>' : ''}</Text>
					</Box>
					<Box>
						<Text color={i === selected && highlightColor}>
							{o.render || o.label}
						</Text>
					</Box>
				</Box>
			))}
		</Box>
	);
}

module.exports = Select;
