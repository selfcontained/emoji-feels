var deap = require('deap');

var Crampon = module.exports = function(hierarchy) {
	var configs = [],
		hasHierarchy = !!(hierarchy && hierarchy.length);

	function getFile(file, suppressErrors) {
		var config;

		try {
			config =require(file);
		}catch(e) {
			if(!suppressErrors) throw e;
		}

		return config||{};
	}

	function appendHierarchical(conf) {
		configs.push(deap.clone(conf));
		return this;
	}

	function append(conf) {
		configs.push({
			'*': deap.clone(conf)
		});
		return this;
	}

	function appendFileHierarchical(file, suppressErrors) {
		var conf = getFile(file, suppressErrors);
		appendHierarchical(conf);
		return this;
	}

	function appendFile(file, suppressErrors) {
		var conf = getFile(file, suppressErrors);
		append(conf);
		return this;
	}

	function appendEnvironmentConfig(objects, env) {
		for(var i = 0; i < configs.length; i++) {
			if(env in configs[i]) objects.push(configs[i][env]);
		}
	}

	function build(env) {
		if(hasHierarchy && !env) {
			throw new Error('You must specify an environment for getConfig when hierarchy is set.');
		}

		if(hasHierarchy && !~hierarchy.indexOf(env)) {
			throw new Error('Specified environment (' + env + ') is not in hierarchy.');
		}

		if(!configs.length) {
			throw new Error('You must add configuration objects or files before calling getConfig.');
		}

		var config = {},
			objects = [config],
			i = 0, j, len = configs.length;

		if(hasHierarchy) {
			do {
				appendEnvironmentConfig(objects, hierarchy[i]);
			} while(hierarchy[i] !== env && ++i < hierarchy.length);
		}

		appendEnvironmentConfig(objects, '*');

		deap.apply(deap, objects);

		return config;
	}

	var crampon = {
		add: (hasHierarchy ? appendHierarchical : append),
		addFile: (hasHierarchy ? appendFileHierarchical : appendFile),
		addOverride: (hasHierarchy ? append : undefined),
		addOverrideFile: (hasHierarchy ? appendFile : undefined),
		getConfig: build
	};

	return crampon;
};
