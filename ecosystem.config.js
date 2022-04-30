module.exports = [{
    script: 'build/app.js',
    name: 'prevent_machine_v1',
    exec_mode: 'cluster',
    watch: true,
    merge_logs: true,
    autorestart: true,
    instances: 2
}]