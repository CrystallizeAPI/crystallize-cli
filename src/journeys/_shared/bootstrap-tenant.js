const fs = require('fs-extra');
const path = require('path');

const { Bootstrapper, EVENT_NAMES } = require('@crystallize/import-utilities');

function bootstrapTenant({ tenant, tenantSpec, id, secret, onUpdate }) {
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

				bootstrapper.on(EVENT_NAMES.SHAPES_UPDATE, function () {
					onUpdate(`Shapes`);
				});
				bootstrapper.on(EVENT_NAMES.PRICE_VARIANTS_UPDATE, function () {
					onUpdate(`Price variants`);
				});
				bootstrapper.on(EVENT_NAMES.LANGUAGES_UPDATE, function () {
					onUpdate(`Languages`);
				});
				bootstrapper.on(EVENT_NAMES.VAT_TYPES_UPDATE, function () {
					onUpdate(`Vat types`);
				});
				bootstrapper.on(EVENT_NAMES.TOPICS_UPDATE, function () {
					onUpdate(`Topics`);
				});
				bootstrapper.on(EVENT_NAMES.ITEMS_UPDATE, function () {
					onUpdate(`Items`);
				});
				bootstrapper.on(EVENT_NAMES.GRIDS_UPDATE, function () {
					onUpdate(`Grids`);
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
