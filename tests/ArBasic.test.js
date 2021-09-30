import { RunTest } from "./testHelper.js";
import { ArBasic } from "../js/ArBasic.js";

const ArBasicTest = {
    RemoveTashkil: function () {
        const data1 = [
            { In: "", Out: "" },
            { In: " ", Out: " " },
            { In: "  ", Out: "  " },
            { In: "   ", Out: "   " },
            { In: " َ ", Out: "  " },
            { In: " ِ ", Out: "  " },
            { In: " ً ", Out: "  " },
            { In: " ٍ ", Out: "  " },
            { In: " ُ ", Out: "  " },
            { In: " ٌ ", Out: "  " },
            { In: " ْ ", Out: "  " },
            { In: " ْ ", Out: "  " },
            { In: " ّ ", Out: "  " },
            { In: "ّْ", Out: "" },
            { In: "ّْ ", Out: " " },
            { In: "ًٌٍَُِّْ", Out: "" },
            { In: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿـفقكلمنهوىيًٌٍَُِّْٓٔ", Out: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿـفقكلمنهوىيٓٔ" },
            { In: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿـفقكلمنهوىيٓٔ", Out: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿـفقكلمنهوىيٓٔ" }
        ];

        const data2 = [
            { In: "", Out: "" },
            { In: " ", Out: " " },
            { In: "  ", Out: "  " },
            { In: "   ", Out: "   " },
            { In: " َ ", Out: "  " },
            { In: " ِ ", Out: "  " },
            { In: " ً ", Out: "  " },
            { In: " ٍ ", Out: "  " },
            { In: " ُ ", Out: "  " },
            { In: " ٌ ", Out: "  " },
            { In: " ْ ", Out: "  " },
            { In: " ْ ", Out: "  " },
            { In: " ّ ", Out: " ّ " },
            { In: "ّْ", Out: "ّ" },
            { In: "ّْ ", Out: "ّ " },
            { In: "ًٌٍَُِّْ", Out: "ّ" },
            { In: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿـفقكلمنهوىيًٌٍَُِّْٓٔ", Out: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿـفقكلمنهوىيّٓٔ" },
            { In: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿـفقكلمنهوىيّٓٔ", Out: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿـفقكلمنهوىيّٓٔ" }
        ];

        RunTest("RemoveTashkil [keepShadda=false]", data1, function (value) {
            return ArBasic.RemoveTashkil(value, false);
        });

        RunTest("RemoveTashkil [keepShadda=true]", data2, function (value) {
            return ArBasic.RemoveTashkil(value, true);
        });
    },

    RemoveTatweelTest: function () {
        const data = [
            { In: "", Out: "" },
            { In: " ", Out: " " },
            { In: "  ", Out: "  " },
            { In: "   ", Out: "   " },

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
            { In: " ـ ـ ـ ـ", Out: "    " },
            { In: " ـ ", Out: "  " },
            { In: " ــ ", Out: "  " },
            { In: " ـــ ", Out: "  " },
            { In: " ـــ ـــ ـــ ـــ ", Out: "     " },
            { In: " ــــــ ", Out: "  " },

            { In: "  ـ     ", Out: "       " },
            { In: "   ــ   ", Out: "      " },
            { In: "    ـــ    ", Out: "        " },
            { In: "     ــــــ   ", Out: "        " },

            { In: "هاني", Out: "هاني" },
            { In: "هـــــانــــــي", Out: "هاني" },
            { In: " هـــــانــــــي ", Out: " هاني " },
            { In: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿـفقكلمنهوىيًٌٍَُِّْٓٔ", Out: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿفقكلمنهوىيًٌٍَُِّْٓٔ" },
            { In: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿفقكلمنهوىيًٌٍَُِّْٓٔ", Out: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿفقكلمنهوىيًٌٍَُِّْٓٔ" }
        ];

        RunTest("RemoveTatweel", data, function (value) {
            return ArBasic.RemoveTatweel(value);
        });
    }
};

export function RunTests () {
    ArBasicTest.RemoveTashkil();
    ArBasicTest.RemoveTatweelTest();
}
