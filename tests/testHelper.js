// أداة اختبار بسيطة وسهلة، وتفي بالغرض.
// Testing utility that is simple, basic and gets the job done.

/* eslint-disable no-console */

export function RunTest (name, data, callback) {
    let failed = false;

    for (let index = 0; index < data.length; index++) {
        const value = data[index];
        const returned = callback(value.In);

        if (returned !== value.Out) {
            failed = true;
            console.error("\x1b[31mFailed\x1b[0m:", name);

            console.error("    Given: `", value.In, "`");
            console.error("    Returned: `", returned, "`");
            console.error("    Expected: `", value.Out, "`\n");
            break;
        }
    }

    if (!(failed)) {
        console.info("\x1b[32mPassed\x1b[0m", name);
    }
};
