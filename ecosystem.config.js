module.exports = [{
    script: 'build/app.js',
    name: 'prevent_machine_v1',
    exec_mode: 'cluster',
    merge_logs: true,
    autorestart: true,
    instances: 4
}]