module.exports = {

    production: {
        logging: {
            http: 'dev',
            colorize: true,
            timestamp: true,
            loggers: {
                debug: 'rainbow',
                assets: 'yellow',
                error: 'red',
                emojis: 'green',
                primus: 'cyan'
            },
            enabled: {
                debug: true,
                assets: true,
                error: true,
                emojis: true,
                primus: true
            }
        },
        port: process.env.NODE_PORT,
        primus: {
            port: 8000
        },
        twitter: {
            enabled: true,
            consumer_key: 'P2jERUxcHBleVPrrECziA',
            consumer_secret: 'An16FloSoNJjHRhiw0BY7pCtlXrm7vhjnULJgPyU',
            access_token_key: '14579804-LNbCkjQ4tzo3lhi2IFZe7A8E3Cqz3WuUE5YeGzfoo',
            access_token_secret: 'Ernhy9nELMiUIycSFxz0n4mugVxynPHgviXAa3ouC4'
        },
        assets: {
            dynamic: true,
            debug: false,
            dirs: ['public_dist','public'],
            maxAge: 31536000000 // one year
        }
    },

    development: {
        port: 8080,
        twitter: {
            enabled: true
        },
        assets: {
            debug: true
        }
    }

};
