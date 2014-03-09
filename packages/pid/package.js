Package.on_use(function (api) {
    api.add_files('pid.js', ['server', 'client']);
    api.add_files('simulate.js', ['server', 'client']);
    api.export(['PID', 'simulate']);
});
