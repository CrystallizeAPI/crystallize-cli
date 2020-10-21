'use strict';

const React = require('react');
const { Text, Newline, Box } = require('ink');
const importJsx = require('import-jsx');
const { UncontrolledTextInput } = require('ink-text-input');

const { DownloadProject } = importJsx('./cli-utils/download-project');
const { InitProject } = importJsx('./cli-utils/init-project');
const GetPaymentMethods = importJsx('./cli-utils/get-payment-methods');
const GetMultilingual = importJsx('./cli-utils/get-multilingual');
const Tips = importJsx('./cli-utils/tips');
const Select = importJsx('./ui-modules/select');
const { highlightColor } = require('./shared');

const steps = [
	{
		render({ projectName, resolveStep }) {
			return (
				<>
					<Text>
						Please select a boilerplate for{' '}
						<Text color={highlightColor}>{projectName}</Text>
					</Text>
					<Select
						onChange={(answer) => resolveStep(answer)}
						options={[
							{
								label: 'Next.js',
								value: 'nextjs',
								render: (
									<>
										<Text>Next.js - Complete ecommerce</Text>
										<Newline />
										<Text dimColor>React, SSG &amp; SSR, Checkout, λ API</Text>
										<Newline />
										<Text dimColor>✓ Our recommendation for an ecommerce</Text>
									</>
								),
							},
							{
								value: 'nextjs-content-commerce',
								label: 'Next.js - Content and commerce',
								render: (
									<>
										<Text>Next.js - Content and commerce</Text>
										<Newline />
										<Text dimColor>React, SSG</Text>
										<Newline />
										<Text dimColor>
											Beautiful commerce with longform storytelling
										</Text>
									</>
								),
							},
							{
								label: 'Gatsby',
								value: 'gatsby',
								render: (
									<>
										<Text>Gatsby - Content and product listing</Text>
										<Newline />
										<Text dimColor>React, SSG</Text>
										<Newline />
										<Text dimColor>
											Good choice for a blog and other static sites
										</Text>
									</>
								),
							},
							{
								label: 'React Native',
								value: 'rn',
								render: (
									<>
										<Text>
											React Native <Text italic>(beta)</Text>
										</Text>
										<Newline />
										<Text dimColor>
											Go the App way. Currently just support for iOS
										</Text>
									</>
								),
							},
						]}
					/>
				</>
			);
		},
		answer({ answers, answer }) {
			answers[answer.value] = {};
			answers.boilerplate = answer.label;

			if (answer.value === 'nextjs-content-commerce') {
				answers.defaultTenant = 'voyage';
			}
		},
		staticMessage(props) {
			return (
				<Text>
					<Newline />
					All right,{' '}
					<Text color={highlightColor}>{props.answers.boilerplate}</Text> it is
				</Text>
			);
		},
	},
	{
		staticMessage({ projectName }) {
			return (
				<Text>
					In folder <Text color={highlightColor}>./{projectName}</Text>
				</Text>
			);
		},
	},
	{
		render({ resolveStep, answers }) {
			return (
				<>
					<Text>
						Please select a Crystallize tenant
						<Newline />
						<Text dimColor>
							Don't have a tenant yet? Create one at
							https://crystallize.com/signup
						</Text>
					</Text>
					<Select
						onChange={(answer) => resolveStep(answer)}
						options={[
							{
								value: answers.defaultTenant,
								render: (
									<>
										<Text>Our demo tenant ({answers.defaultTenant})</Text>
										<Newline />
										<Text dimColor>Lot's of demo data here already</Text>
									</>
								),
							},
							{
								value: '[use-own-tenant]',
								render: (
									<>
										<Text>My own tenant</Text>
									</>
								),
							},
						]}
					/>
				</>
			);
		},
		answer({ answers, answer }) {
			answers.tenant = answer.value;
		},
	},
	{
		render({ resolveStep, answers }) {
			return (
				<Box>
					<Box marginRight={1}>
						<Text>Enter your tenant identifier:</Text>
					</Box>
					<UncontrolledTextInput
						placeholder={answers.defaultTenant}
						onSubmit={(query) => resolveStep(query)}
					/>
				</Box>
			);
		},
		answer({ answers, answer }) {
			answers.tenant = answer;
		},
		when({ answers }) {
			return answers.tenant === '[use-own-tenant]';
		},
	},
	{
		staticMessage(props) {
			return (
				<Text>
					Using Crystallize tenant{' '}
					<Text color={highlightColor}>{props.answers.tenant}</Text>
				</Text>
			);
		},
	},
	{
		render({ resolveStep }) {
			return <GetPaymentMethods onChange={(answer) => resolveStep(answer)} />;
		},
		when({ answers }) {
			return answers.nextjs;
		},
		answer({ answers, answer }) {
			answers.paymentMethods = answer;
		},
		staticMessage({ answers }) {
			const { paymentMethods } = answers;

			if (paymentMethods && paymentMethods.length > 0) {
				return (
					<Text>
						With <Text color={highlightColor}>{paymentMethods.join(', ')}</Text>{' '}
						for payments
					</Text>
				);
			}

			return <Text>With no payment methods</Text>;
		},
	},
	{
		render({ resolveStep }) {
			return <GetMultilingual onChange={(answer) => resolveStep(answer)} />;
		},
		when({ answers }) {
			return answers.nextjs || answers.gatsby;
		},
		answer({ answers, answer }) {
			answers.multilingual = answer;
		},
		staticMessage({ answers }) {
			const { multilingual } = answers;

			if (multilingual) {
				return (
					<Text>
						In these languages:{' '}
						<Text color={highlightColor}>{multilingual.join(', ')}</Text>
					</Text>
				);
			}

			return <Text>In a single language</Text>;
		},
	},
	{
		render(props) {
			return (
				<>
					<DownloadProject {...props} />
					<Newline />
					<Tips />
				</>
			);
		},
	},
	{
		render(props) {
			return (
				<>
					<InitProject {...props} />
					<Newline />
					<Tips />
				</>
			);
		},
	},
	{
		staticMessage({ projectName, projectPath, answers }) {
			return (
				<Box flexDirection="column" marginTop={2}>
					<Box flexDirection="column" marginBottom={2} width={400}>
						<Text>
							✨ "{projectName}" is ready ✨
							<Newline />
							<Text>{projectPath}</Text>
						</Text>
					</Box>
					{answers.nextjs && (
						<>
							<Box flexDirection="column" marginBottom={1}>
								<Text>
									Configure tokens and secrets in the .env.local file:
								</Text>
								<Box
									flexDirection="column"
									borderStyle="round"
									paddingX={1}
									width={50}
								>
									<Text>
										CRYSTALLIZE_SECRET_TOKEN_ID=
										<Newline />
										CRYSTALLIZE_SECRET_TOKEN=
										<Newline />
										...and so on
									</Text>
								</Box>
							</Box>
							<Box flexDirection="column" marginBottom={2}>
								<Text>
									Configure the app language, price variant and such in{' '}
									<Text color={highlightColor}>app.config.json</Text>
								</Text>
							</Box>
							<Box flexDirection="column" marginBottom={2}>
								<Text>
									Deploying to Vercel? Read here on how to setup env values:
									<Newline />
									https://vercel.com/blog/environment-variables-ui
								</Text>
							</Box>
						</>
					)}
					<Box flexDirection="column" marginBottom={2}>
						<Text>
							<Text>
								Now, navigate to the project and start the dev server:
							</Text>
							<Newline />
							<Text color={highlightColor}>cd ./{projectName}</Text>
							<Newline />
							<Text color={highlightColor}>yarn dev</Text> or{' '}
							<Text color={highlightColor}>npm run dev</Text>
						</Text>
					</Box>
					<Box flexDirection="column" marginBottom={2}>
						<Text>
							<Text color={highlightColor}>Go fast and prosper!</Text>
							<Newline />
							<Text dimColor>The milliseconds are with you</Text>
						</Text>
					</Box>
					<Box flexDirection="column" marginBottom={2}>
						<Box flexDirection="column">
							<Text>
								Want to get in touch with us? We would love to hear from you!
							</Text>
						</Box>
						<Text>Reach us at: https://crystallize.com/about#contact</Text>
					</Box>
				</Box>
			);
		},
	},
];

module.exports = steps;
