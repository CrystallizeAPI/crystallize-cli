const React = require('react');
const { Text, Newline } = require('ink');
const importJsx = require('import-jsx');

const steps = importJsx('./steps');

const baseAnswers = {
	defaultTenant: 'furniture',
	defaultServiceAPIURL: 'https://service-api-demo.superfast.shop/api/graphql',
	bootstrapTenant: 'no',
};

const welcomeMessage = (
	<>
		<Text>
			<Text underline>
				Crystallize - headless commerce for product storytellers
			</Text>
			<Newline />
			<Text>Hi you, let's make something awesome!</Text>
		</Text>
	</>
);

module.exports = {
	baseAnswers,
	welcomeMessage,
	steps,
};
