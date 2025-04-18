module.exports = {
    apps: [{
        name: "time.js",
        script: "./app.js",
        cwd: "./",
        log_file: "./logs/time.log",
        restart_delay: 10000,
        env: {
            PORT: 3001,
	    TZ: "Asia/Shanghai"
        }
    }]
}
