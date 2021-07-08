const fs = require('fs-extra');
const path = require('path');

const { Bootstrapper, EVENT_NAMES } = require('@crystallize/import-utilities');

function bootstrapTenant({
	tenant,
	tenantSpec,
	id,
	secret,
	onUpdate = () => {},
}) {
	return new Promise((resolve) => {
		try {
			const spec = JSON.parse(
				fs.readFileSync(
					path.resolve(__dirname, `./specs/${tenantSpec}.json`),
					'utf-8'
				)
			);
			if (spec) {
				const bootstrapper = new Bootstrapper();

				bootstrapper.setAccessToken(id, secret);

				bootstrapper.setTenantIdentifier(tenant);

				bootstrapper.setSpec(spec);

				bootstrapper.start();

				bootstrapper.on(EVENT_NAMES.SHAPES_DONE, function () {
					onUpdate({ done: 'shapes' });
				});
				bootstrapper.on(EVENT_NAMES.PRICE_VARIANTS_DONE, function () {
					onUpdate({ done: `priceVariants` });
				});
				bootstrapper.on(EVENT_NAMES.LANGUAGES_DONE, function () {
					onUpdate({ done: `languages` });
				});
				bootstrapper.on(EVENT_NAMES.VAT_TYPES_DONE, function () {
					onUpdate({ done: `vatTypes` });
				});
				bootstrapper.on(EVENT_NAMES.TOPICS_DONE, function () {
					onUpdate({ done: 'topics' });
				});
				bootstrapper.on(EVENT_NAMES.ITEMS_UPDATE, function () {
					onUpdate({ items: 'processed' });
				});
				bootstrapper.on(EVENT_NAMES.ITEMS_DONE, function () {
					onUpdate({ done: 'items' });
				});
				bootstrapper.on(EVENT_NAMES.GRIDS_DONE, function () {
					onUpdate({ done: 'grids' });
				});

				bootstrapper.on(EVENT_NAMES.DONE, resolve);
			}
		} catch (e) {
			console.log(e);
			resolve();
		}
	});
}

module.exports = { bootstrapTenant };
