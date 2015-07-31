module.exports = {
	prod: { env:'prod', foo:'bar', baz: { foo:'bar', boo: 'far'} },
	stage: { env: 'stage', baz: { boo:'poo', choo:'choo' } },
	dev: { env: 'dev', boo: 'far', baz: { choo:'chew' } }
};
