import { RunTest } from "./testHelper.js";
import { ArBasic } from "../js/ArBasic.js";

const ArBasicTest = {
    RemoveTatweelTest: function () {
        const data = [
            { In: "ـ", Out: "" },
            { In: "ــ", Out: "" },
            { In: "ـــ", Out: "" },
            { In: "ــــــ", Out: "" },

            { In: " ـ", Out: " " },
            { In: " ــ", Out: " " },
            { In: " ـــ", Out: " " },
            { In: " ــــــ", Out: " " },

            { In: "ـ ", Out: " " },
            { In: "ــ ", Out: " " },
            { In: "ـــ ", Out: " " },
            { In: "ــــــ ", Out: " " },

            { In: " ـ ", Out: "  " },
            { In: " ــ ", Out: "  " },
            { In: " ـــ ", Out: "  " },
            { In: " ــــــ ", Out: "  " },

            { In: "  ـ     ", Out: "       " },
            { In: "   ــ   ", Out: "      " },
            { In: "    ـــ    ", Out: "        " },
            { In: "     ــــــ   ", Out: "        " }
        ];

        RunTest("RemoveTatweel", data, function (value) {
            return ArBasic.RemoveTatweel(value);
        });
    }
};

export function RunTests () {
    return (ArBasicTest.RemoveTatweelTest());
}
