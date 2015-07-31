var assert = require('chai').assert,
	path = require('path'),
	Crampon = require('../index');

var FILE_1 = path.join(__dirname, 'sample.1.js'),
	FILE_2 = path.join(__dirname, 'sample.2.js'),
	FILE_HIERARCHICAL_1 = path.join(__dirname, 'sample.hierarchical.1.js'),
	FILE_HIERARCHICAL_2 = path.join(__dirname, 'sample.hierarchical.2.js');

describe('crampon', function() {
	describe('without hierarchy', function() {
		it('should instantiate with the correct interface', function() {
			var crampon = new Crampon();

			assert.isFunction(crampon.add, 'add');
			assert.isFunction(crampon.addFile, 'addFile');
			assert.isNotFunction(crampon.addOverride, 'addOverride');
			assert.isNotFunction(crampon.addOverrideFile, 'addOverrideFile');
			assert.isFunction(crampon.getConfig, 'getConfig');
		});

		if('should throw an error if config is not set', function() {
			var crampon = new Crampon();

			assert.throws(function(){
				crampon.getConfig('dev');
			}, 'throws no config');
		});

		it('should load a single object', function() {
			var config = {
					foo: 'bar',
					baz: {
						boo: 'far'
					}
				},
				crampon = new Crampon().add(config),
				output = crampon.getConfig();

			assert.deepEqual(output, config);
			assert.notStrictEqual(output, config);
		});

		it('should load multiple objects', function() {
			var configA = {
					foo: 'bar',
					baz: {
						foo: 'bar',
						boo: 'far'
					}
				},
				configB = {
					boo: 'far',
					baz: {
						foo: 'too',
						too: 'far'
					}
				},
				target = {
					foo: 'bar',
					boo: 'far',
					baz: {
						foo: 'too',
						boo: 'far',
						too: 'far'
					}
				},
				crampon = new Crampon().add(configA).add(configB);

			assert.deepEqual(crampon.getConfig(), target);
		});

		it('should load a single file', function() {
			var target = {
					foo: 'bar',
					baz: {
						foo: 'bar',
						boo: 'far'
					},
					list: [{
						order: 'one'
					}, {
						order: 'two'
					}]
				},
				crampon = new Crampon().addFile(FILE_1);

			assert.deepEqual(crampon.getConfig(), target);
		});

		it('should load multiple files', function() {
			var target = {
					foo: 'bar',
					boo: 'far',
					baz: {
						foo: 'too',
						boo: 'far',
						too: 'far'
					},
					list: [{
						order: 'uno'
					}, {
						position: 'two'
					}]
				},
				crampon = new Crampon().addFile(FILE_1).addFile(FILE_2);

			assert.deepEqual(crampon.getConfig(), target);
		});

		it('should load files and objects', function() {
			var target = {
					foo: 'bar',
					boo: 'far',
					too: 'true',
					baz: {
						foo: 'too',
						boo: 'far',
						too: 'far'
					},
					list: [{
						order: 'uno',
					}, {
						position: 'two'
					}]
				},
				crampon = new Crampon()
					.addFile(FILE_1)
					.add({ boo: 'zoo', too: 'true', list: [{ position: 'one' }] })
					.addFile(FILE_2);

			assert.deepEqual(crampon.getConfig(), target);
		});

		it('should error out on a non-existant file via addFile()', function() {
			var crampon = new Crampon();

			assert.throws(function() {
				crampon.addFile('badfile');
			});
		});

		it('should not error out on a non-existant file via addFile() if errors are suppressed', function() {
			var crampon = new Crampon();

			assert.doesNotThrow(function() {
				crampon.addFile('badfile', true);
			});
		});

		it('should not error out when adding a non-existant file and calling getConfig()', function() {
				var crampon = new Crampon();

				assert.doesNotThrow(function() {
					crampon
						.addFile('badfile', true)
						.getConfig();
				});
		});

	});

	describe('with hierarchy', function() {
		var hierarchy = ['prod', 'stage', 'dev'];

		it('should instantiate with the correct interface', function() {
			var crampon = new Crampon(hierarchy);

			assert.isFunction(crampon.add, 'add');
			assert.isFunction(crampon.addFile, 'addFile');
			assert.isFunction(crampon.addOverride, 'addOverride');
			assert.isFunction(crampon.addOverrideFile, 'addOverrideFile');
			assert.isFunction(crampon.getConfig, 'getConfig');
		});

		if('should throw an error if config is not set', function() {
			var crampon = new Crampon(hierarchy);

			assert.throws(function(){
				crampon.getConfig('dev');
			}, 'throws no config');
		});

		if('should throw an error if environment is not specified', function() {
			var crampon = new Crampon(hierarchy).addOverride({ foo:'bar' });

			assert.throws(function(){
				crampon.getConfig();
			}, 'throws environment not specified');
		});

		if('should throw an error if a bad environment is specified', function() {
			var crampon = new Crampon(hierarchy).addOverride({ foo:'bar' });

			assert.throws(function(){
				crampon.getConfig('spaz');
			}, 'throws bad environment');
		});

		it('should load a single object', function() {
			var config = {
					foo: 'bar',
					baz: {
						boo: 'far'
					}
				},
				crampon = new Crampon(hierarchy).addOverride(config),
				output = crampon.getConfig('dev');

			assert.deepEqual(output, config);
			assert.notStrictEqual(output, config);
		});

		it('should load multiple objects', function() {
			var configA = {
					foo: 'bar',
					baz: {
						foo: 'bar',
						boo: 'far'
					}
				},
				configB = {
					boo: 'far',
					baz: {
						foo: 'too',
						too: 'far'
					}
				},
				target = {
					foo: 'bar',
					boo: 'far',
					baz: {
						foo: 'too',
						boo: 'far',
						too: 'far'
					}
				},
				crampon = new Crampon(hierarchy).addOverride(configA).addOverride(configB);

			assert.deepEqual(crampon.getConfig('dev'), target);
		});

		it('should load a hierarchical object', function() {
			var config = {
					prod: { env:'prod', foo:'bar', baz: { foo:'bar', boo: 'far'} },
					stage: { env: 'stage', baz: { boo:'poo', choo:'choo' } },
					dev: { env: 'dev', boo: 'far', baz: { choo:'chew' } }
				},
				crampon = new Crampon(hierarchy).add(config);

			assert.deepEqual(crampon.getConfig('prod'), config.prod);
			assert.deepEqual(crampon.getConfig('stage'), { env:'stage', foo:'bar', baz: { foo:'bar', boo:'poo', choo:'choo'} });
			assert.deepEqual(crampon.getConfig('dev'), { env:'dev', foo:'bar', boo:'far', baz: { foo:'bar', boo:'poo', choo:'chew'} });
		});

		it('should load multiple hierarchical objects', function() {
			var configA = {
					prod: { env:'prod', foo:'bar', baz: { foo:'bar', boo: 'far'} },
					stage: { env: 'stage', baz: { boo:'poo', choo:'choo' } },
					dev: { env: 'dev', boo: 'far', baz: { choo:'chew' } }
				},
				configB = {
					prod: { baz: { foo:'bart'} },
					stage: { env: 'stagez', nuff:'sed' },
					dev: { boo: 'fart', baz: { choo:'food' } }
				},
				crampon = new Crampon(hierarchy).add(configA).add(configB);

			assert.deepEqual(crampon.getConfig('prod'), { env:'prod', foo:'bar', baz: { foo:'bart', boo: 'far'} });
			assert.deepEqual(crampon.getConfig('stage'), { env:'stagez', foo:'bar', nuff:'sed', baz: { foo:'bart', boo:'poo', choo:'choo'} });
			assert.deepEqual(crampon.getConfig('dev'), { env:'dev', foo:'bar', boo:'fart', nuff:'sed', baz: { foo:'bart', boo:'poo', choo:'food'} });
		});

		it('should load a single hierarchical file', function() {
			var target = {
					prod: { env:'prod', foo:'bar', baz: { foo:'bar', boo: 'far'} },
					stage: { env:'stage', foo:'bar', baz: { foo:'bar', boo:'poo', choo:'choo'} },
					dev: { env:'dev', foo:'bar', boo:'far', baz: { foo:'bar', boo:'poo', choo:'chew'} }
				},
				crampon = new Crampon(hierarchy).addFile(FILE_HIERARCHICAL_1);

			assert.deepEqual(crampon.getConfig('prod'), target.prod);
			assert.deepEqual(crampon.getConfig('stage'), target.stage);
			assert.deepEqual(crampon.getConfig('dev'), target.dev);
		});

		it('should load multiple hierarchical files', function() {
			var target = {
					prod: { env:'prod', foo:'bar', baz: { foo:'bart', boo: 'far'} },
					stage: { env:'stagez', foo:'bar', nuff:'sed', baz: { foo:'bart', boo:'poo', choo:'choo'} },
					dev: { env:'dev', foo:'bar', boo:'fart', nuff:'sed', baz: { foo:'bart', boo:'poo', choo:'food'} }
				},
				crampon = new Crampon(hierarchy).addFile(FILE_HIERARCHICAL_1).addFile(FILE_HIERARCHICAL_2);

			assert.deepEqual(crampon.getConfig('prod'), target.prod);
			assert.deepEqual(crampon.getConfig('stage'), target.stage);
			assert.deepEqual(crampon.getConfig('dev'), target.dev);
		});

		it('should load hierarchical files and objects', function() {
			var target = {
					prod: { env:'prod', foo:'bar', baz: { foo:'bart', boo: 'far'} },
					stage: { env:'stagez', foo:'bar', nuff:'sed', baz: { foo:'bart', boo:'new', choo:'choo'} },
					dev: { env:'dev', foo:'bar', boo:'fart', nuff:'said', baz: { foo:'bart', boo:'new', choo:'food'} }
				},
				crampon = new Crampon(hierarchy)
					.addFile(FILE_HIERARCHICAL_1)
					.add({ stage: { baz: { boo:'new' } }, dev: { nuff:'said' } })
					.addFile(FILE_HIERARCHICAL_2);

			assert.deepEqual(crampon.getConfig('prod'), target.prod);
			assert.deepEqual(crampon.getConfig('stage'), target.stage);
			assert.deepEqual(crampon.getConfig('dev'), target.dev);
		});

		it('should load hierarchical and non-hierarchical files', function() {
			var list = [{ order: 'uno' }, { position: 'two' }],
				target = {
					prod: { env:'prod', foo:'bar', boo:'far', baz: { foo:'too', boo:'far', too:'far' }, list:list },
					stage: { env:'stage', foo:'bar', boo:'far', baz: { foo:'too', boo:'poo', choo:'choo', too:'far' }, list:list },
					dev: { env:'dev', foo:'bar', boo:'far', baz: { foo:'too', boo:'poo', choo:'chew', too:'far' }, list:list }
				},
				crampon = new Crampon(hierarchy)
					.addFile(FILE_HIERARCHICAL_1)
					.addOverrideFile(FILE_2);

			assert.deepEqual(crampon.getConfig('prod'), target.prod);
			assert.deepEqual(crampon.getConfig('stage'), target.stage);
			assert.deepEqual(crampon.getConfig('dev'), target.dev);
		});

		it('should error out on a non-existant file via addFile()', function() {
			var crampon = new Crampon();

			assert.throws(function() {
				crampon.addFile('badfile');
			});
		});

		it('should error out on a non-existant file via addOverrideFile()', function() {
			var crampon = new Crampon(hierarchy);

			assert.throws(function() {
				crampon.addOverrideFile('badfile');
			});
		});

		it('should not error out on a non-existant file via addFile() if errors are suppressed', function() {
			var crampon = new Crampon(hierarchy);

			assert.doesNotThrow(function() {
				crampon.addFile('badfile', true);
			});
		});

		it('should not error out on a non-existant file via addOverrideFile() if errors are suppressed', function() {
			var crampon = new Crampon(hierarchy);

			assert.doesNotThrow(function() {
				crampon.addOverrideFile('badfile', true);
			});
		});

		it('should not error out when adding a non-existant file and calling getConfig()', function() {
				var crampon = new Crampon(hierarchy);

				assert.doesNotThrow(function() {
					crampon
						.addOverrideFile('badfile', true)
						.getConfig('dev');
				});
		});

	});

});
