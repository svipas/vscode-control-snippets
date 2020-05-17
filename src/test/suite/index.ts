import * as path from "path";
import * as Mocha from "mocha";
import * as glob from "glob";

export function run(
	cwd: string,
	cb: (error: Error | null, failures?: number) => void
): void {
	const mocha = new Mocha({
		ui: "bdd",
		useColors: true,
		timeout: 10_000,
	});

	glob("**/**.test.js", { cwd }, (err, files) => {
		if (err) {
			return cb(err);
		}

		files.forEach((f) => mocha.addFile(path.resolve(cwd, f)));

		try {
			mocha.run((failures) => cb(null, failures));
		} catch (err) {
			cb(err);
		}
	});
}
