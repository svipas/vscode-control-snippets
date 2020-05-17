import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as sinon from "sinon";
import {
	disableSnippetForExtension,
	enableSnippetForExtension,
} from "../../snippets";

describe("snippets", () => {
	const writeFileFake = sinon.fake();
	const pathJoinFake = sinon.fake(() => "");
	const extension: {
		name: string;
		path: string;
		packageJSON: { contributes: { snippets?: []; snippets_disabled?: [] } };
	} = { name: "javascript", path: "", packageJSON: { contributes: {} } };

	before(() => {
		sinon.replace(fs.promises, "writeFile", writeFileFake);
		sinon.replace(path, "join", pathJoinFake);
	});

	beforeEach(() => {
		writeFileFake.resetHistory();
		pathJoinFake.resetHistory();
		extension.packageJSON.contributes = {};
	});

	describe("disableSnippetForExtension()", () => {
		it("should throw if snippet is already disabled", async () => {
			extension.packageJSON.contributes.snippets_disabled = [];
			try {
				await disableSnippetForExtension(extension as any);
			} catch (err) {
				assert.strictEqual(
					err.message,
					`${extension.name} is already disabled.`
				);
			}
		});

		it("should replace snippets with snippets_disabled", async () => {
			extension.packageJSON.contributes.snippets = [];
			await disableSnippetForExtension(extension as any);
			assert.deepStrictEqual(
				extension.packageJSON.contributes.snippets_disabled,
				[]
			);
			assert.strictEqual(extension.packageJSON.contributes.snippets, undefined);
		});

		it("should save package json after disabling snippets", async () => {
			await disableSnippetForExtension(extension as any);
			assert.strictEqual(
				writeFileFake.calledOnceWith("", JSON.stringify(extension.packageJSON)),
				true
			);
			assert.strictEqual(
				pathJoinFake.calledOnceWith(extension.path, "package.json"),
				true
			);
		});
	});

	describe("enableSnippetForExtension()", () => {
		it("should throw if snippet is already enabled", async () => {
			extension.packageJSON.contributes.snippets = [];
			try {
				await enableSnippetForExtension(extension as any);
			} catch (err) {
				assert.strictEqual(
					err.message,
					`${extension.name} is already enabled.`
				);
			}
		});

		it("should replace snippets_disabled with snippets", async () => {
			extension.packageJSON.contributes.snippets_disabled = [];
			await enableSnippetForExtension(extension as any);
			assert.deepStrictEqual(extension.packageJSON.contributes.snippets, []);
			assert.strictEqual(
				extension.packageJSON.contributes.snippets_disabled,
				undefined
			);
		});

		it("should save package json after enabling snippets", async () => {
			await enableSnippetForExtension(extension as any);
			assert.strictEqual(
				writeFileFake.calledOnceWith("", JSON.stringify(extension.packageJSON)),
				true
			);
			assert.strictEqual(
				pathJoinFake.calledOnceWith(extension.path, "package.json"),
				true
			);
		});
	});
});
