export const sharingButtonsSchema = {
	type: 'object',
	patternProperties: {
		'^\\d+$': {
			type: 'object',
			required: [ 'ID', 'siteId' ],
			properties: {
				ID: { type: 'integer' },
				name: { type: 'string' },
				shortname: { type: 'string' },
				custom: { type: 'boolean' },
				enabled: { type: 'boolean' },
				genericon: { type: 'string' },
				visibility: { type: 'boolean' }
			}
		}
	},
	additionalProperties: false
};
