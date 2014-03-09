Npm.depends({
	"ds18x20": "0.1.1",
})

Package.on_use(function (api) {
    api.add_files('thermo.js', ['server', 'client']);
    api.export(['Thermo', 'Readings']);
});
