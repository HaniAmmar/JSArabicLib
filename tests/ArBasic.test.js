import { RunTest } from "./testHelper.js";
import { ArBasic } from "../js/ArBasic.js";

const ArBasicTest = {
    RemoveTatweelTest: function () {
        const removedTatweelData = [
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

        RunTest("RemoveTatweel", removedTatweelData, function (value) {
            return ArBasic.RemoveTatweel(value);
        });
    },

    RemoveTashkilTest: function () {
        const removedTashkilData1 = [
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

        const removedTashkilData2 = [
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

        RunTest("RemoveTashkil [keepShadda=false]", removedTashkilData1, function (value) {
            return ArBasic.RemoveTashkil(value, false);
        });

        RunTest("RemoveTashkil [keepShadda=true]", removedTashkilData2, function (value) {
            return ArBasic.RemoveTashkil(value, true);
        });
    },

    SeparateLamAlefTest: function () {
        const separatedLamAlefData = [
            { In: "", Out: "" },
            { In: " ", Out: " " },
            { In: "  ", Out: "  " },
            { In: "   ", Out: "   " },

            { In: "ﻻ", Out: "لا" },
            { In: "ﻵ", Out: "لآ" },
            { In: "ﻷ", Out: "لأ" },
            { In: "ﻹ", Out: "لإ" },

            { In: " ﻻ ", Out: " لا " },
            { In: " ﻵ ", Out: " لآ " },
            { In: " ﻷ ", Out: " لأ " },
            { In: " ﻹ ", Out: " لإ " },

            { In: "ﻻﻵﻷﻹ", Out: "لالآلألإ" },
            { In: "ﻻﻵ ﻷﻹ", Out: "لالآ لألإ" },
            { In: "ﻻ ﻵﻷﻹ", Out: "لا لآلألإ" },
            { In: "ﻻﻵﻷ ﻹ", Out: "لالآلأ لإ" },
            { In: "  ﻻﻵﻷﻹ  ", Out: "  لالآلألإ  " }
        ];

        RunTest("SeparateLamAlef", separatedLamAlefData, function (value) {
            return ArBasic.SeparateLamAlef(value);
        });
    },

    UnifyLettersTest: function () {
        const unifiedLettersData = [
            { In: "", Out: "" },
            { In: " ", Out: " " },
            { In: "  ", Out: "  " },
            { In: "   ", Out: "   " },
            { In: "ا", Out: "ا" },
            { In: "ه", Out: "ه" },

            { In: "ة", Out: "ه" },
            { In: "ى", Out: "ا" },
            { In: "آ", Out: "ا" },
            { In: "أ", Out: "ا" },
            { In: "إ", Out: "ا" },
            { In: "ؤ", Out: "ء" },
            { In: "ئ", Out: "ء" },
            { In: "\u0653", Out: "ا" }, //  ٓ Arabic Madda Above مدة علوية.
            { In: "\u0654", Out: "ا" }, //  ٔ Arabic Hamza Above همزة علوية.
            { In: "\u0655", Out: "ا" }, //  ٕ Arabic Hamza Below همزة سفلية.
            { In: "ةىآأإؤئ", Out: "هااااءء" },
            { In: "  ةىآأإؤئ  ", Out: "  هااااءء  " },
            { In: "ةىآ  أإؤئ", Out: "هاا  ااءء" },
            { In: "  ةىآ  أإؤئ  ", Out: "  هاا  ااءء  " },
            { In: "\u0653ةىآ\u0654أإؤئ\u0655", Out: "اهاااااءءا" },
            { In: " \u0654 ةىآأإؤئ \u0655 \u0653", Out: " ا هااااءء ا ا" },
            { In: "ةىآ\u0655  \u0653 أإؤئ\u0654", Out: "هااا  ا ااءءا" },
            { In: " \u0655 ةىآ \u0654 أإؤئ \u0653 ", Out: " ا هاا ا ااءء ا " }

        ];

        RunTest("UnifyLetters", unifiedLettersData, function (value) {
            return ArBasic.UnifyLetters(value);
        });
    },

    SimplifyTextTest: function () {
        const simplifiedTextData = [
            { In: "", Out: "" },
            { In: " ", Out: " " },
            { In: "  ", Out: "  " },
            { In: "   ", Out: "   " },

            { In: " ـــ ـــ ـــ ـــ ", Out: "     " },
            { In: "ّْ ", Out: " " },
            { In: "  ﻻﻵﻷﻹ  ", Out: "  لالالالا  " },
            { In: "\u0653ةىآ\u0654أإؤئ\u0655", Out: "اهاااااءءا" },
            { In: "ﻻ\u0653ةىآ\u0654أإؤئ\u0655غػؼؽؾؿـفقكﻵﻷﻹـــ", Out: "لااهاااااءءاغػؼؽؾؿفقكلالالا" }
        ];

        RunTest("SimplifyText", simplifiedTextData, function (value) {
            return ArBasic.SimplifyText(value);
        });
    },

    ReduceTashkilTest: function () {
        const reducedTextData = [
            // الفتحة
            { In: "", Out: "" },
            { In: " ", Out: " " },
            { In: "  ", Out: "  " },
            { In: "   ", Out: "   " },

            { In: "وَاب", Out: "واب" },
            { In: "وَأب", Out: "وأب" },
            { In: "ؤَاب", Out: "ؤاب" },
            { In: "ؤَأب", Out: "ؤأب" },
            { In: "يَاب", Out: "ياب" },
            { In: "يَأب", Out: "يأب" },

            { In: " وَاب", Out: " واب" },
            { In: " وَأب", Out: " وأب" },
            { In: " ؤَاب", Out: " ؤاب" },
            { In: " ؤَأب", Out: " ؤأب" },
            { In: " يَاب", Out: " ياب" },
            { In: " يَأب", Out: " يأب" },

            { In: "بوَاب", Out: "بواب" },
            { In: "بوَأب", Out: "بوأب" },
            { In: "بؤَاب", Out: "بؤاب" },
            { In: "بؤَأب", Out: "بؤأب" },
            { In: "بيَاب", Out: "بياب" },
            { In: "بيَأب", Out: "بيأب" },

            { In: "وَبب", Out: "وبب" },
            { In: "ؤَبب", Out: "ؤبب" },
            { In: "يَبب", Out: "يبب" },
            { In: "بوَبب", Out: "بوَبب" },
            { In: "بؤَبب", Out: "بؤَبب" },
            { In: "بيَبب", Out: "بيَبب" },

            { In: "بَوب", Out: "بَوب" },
            { In: "بَؤب", Out: "بَؤب" },
            { In: "بَيب", Out: "بَيب" },
            { In: " بَوب", Out: " بَوب" },
            { In: " بَؤب", Out: " بَؤب" },
            { In: " بَيب", Out: " بَيب" },
            { In: "ببَوب", Out: "ببَوب" },
            { In: "ببَؤب", Out: "ببَؤب" },
            { In: "ببَيب", Out: "ببَيب" },
            { In: "فَؤه", Out: "فَؤه" },
            { In: "فَؤه", Out: "فَؤه" },

            { In: "ببَاَب", Out: "بباب" },
            { In: "ببَأَب", Out: "ببأب" },
            { In: " ببَاَب ", Out: " بباب " },
            { In: " ببَأَب ", Out: " ببأب " },

            { In: "باَو", Out: "باو" },
            { In: "باَؤ", Out: "باؤ" },
            { In: "باَي", Out: "باي" },
            { In: "بأَو", Out: "بأو" },
            { In: "بأَؤ", Out: "بأؤ" },
            { In: "بأَي", Out: "بأي" },

            { In: "بَبَبَ", Out: "بببَ" },
            { In: "بَبَبَبَ", Out: "ببببَ" },
            { In: "بَبَبَبَبَ", Out: "بببببَ" },
            { In: " بَبَبَ", Out: " بببَ" },
            { In: " بَبَبَبَ", Out: " ببببَ" },
            { In: " بَبَبَبَبَ", Out: " بببببَ" },

            { In: "بَبَبَ ", Out: "بببَ " },
            { In: "بَبَبَبَ ", Out: "ببببَ " },
            { In: "بَبَبَبَبَ ", Out: "بببببَ " },
            { In: " بَبَبَ ", Out: " بببَ " },
            { In: " بَبَبَبَ ", Out: " ببببَ " },
            { In: " بَبَبَبَبَ ", Out: " بببببَ " },

            /// الضمة
            { In: "بُبُبُبُ", Out: "بُبُبُبُ" },
            { In: "بُبُبُ", Out: "بُبُبُ" },
            { In: " بُبُبُبُ ", Out: " بُبُبُبُ " },
            { In: " بُبُبُ ", Out: " بُبُبُ " },

            { In: "وُبب", Out: "وُبب" },
            { In: " وُبب", Out: " وُبب" },
            { In: "ؤُبب", Out: "ؤُبب" },
            { In: " ؤُبب", Out: " ؤُبب" },
            { In: "بوُب", Out: "بوب" },
            { In: "ببوُب", Out: "ببوب" },
            { In: "بؤُب", Out: "بؤب" },
            { In: "ببؤُب", Out: "ببؤب" },

            { In: "بُوب", Out: "بُوب" },
            { In: "ببُوب", Out: "ببوب" },
            { In: "بُؤب", Out: "بُؤب" },
            { In: "ببُؤب", Out: "ببؤب" },

            { In: "وُيي", Out: "وُيي" },
            { In: " وُيي", Out: " وُيي" },
            { In: "ؤُيي", Out: "ؤُيي" },
            { In: " ؤُيي", Out: " ؤُيي" },
            { In: "يوُي", Out: "يوي" },
            { In: "ييوُي", Out: "ييوي" },
            { In: "يؤُي", Out: "يؤي" },
            { In: "ييؤُي", Out: "ييؤي" },
            { In: "يُوي", Out: "يُوي" },
            { In: "ييُوي", Out: "ييوي" },
            { In: "يُؤي", Out: "يُؤي" },
            { In: "ييُؤي", Out: "ييؤي" },

            { In: "ببوُ", Out: "ببوُ" },
            { In: "ببؤُ", Out: "ببؤُ" },
            { In: "بوُ", Out: "بوُ" },
            { In: "بؤُ", Out: "بؤُ" },

            { In: " ببوُ ", Out: " ببوُ " },
            { In: " ببؤُ ", Out: " ببؤُ " },
            { In: " بوُ ", Out: " بوُ " },
            { In: " بؤُ ", Out: " بؤُ " },

            { In: "سَؤُوُل", Out: "سَؤول" },
            { In: "يُوم", Out: "يُوم" },
            { In: "يَوم", Out: "يوم" },
            { In: "فُوه", Out: "فُوه" },

            /// الكسرة
            { In: "بِبِبِبِ", Out: "بِبِبِبِ" },
            { In: "بِبِبِ", Out: "بِبِبِ" },

            { In: " بِبِبِبِ ", Out: " بِبِبِبِ " },
            { In: " بِبِبِ ", Out: " بِبِبِ " },

            { In: "اِيما", Out: "اِيما" },
            { In: "اِئما", Out: "اِئما" },
            { In: "باِيما", Out: "باِيما" },
            { In: "باِئما", Out: "باِئما" },
            { In: "باِيماِ", Out: "باِيماِ" },
            { In: "باِئماِ", Out: "باِئماِ" },

            { In: "إِمم", Out: "إمم" },
            { In: "مإِمم", Out: "مإمم" },

            { In: " إِمم ", Out: " إمم " },
            { In: " مإِمم ", Out: " مإمم " },

            { In: "بِيبِبِ", Out: "بِيبِبِ" },
            { In: "بِبِبِ", Out: "بِبِبِ" },
            { In: "ببِيب", Out: "ببيب" },
            { In: "ببِئب", Out: "ببِئب" },

            { In: " بِيبِبِ ", Out: " بِيبِبِ " },
            { In: " بِبِبِ ", Out: " بِبِبِ " },
            { In: " ببِيب ", Out: " ببيب " },
            { In: " ببِئب ", Out: " ببِئب " },

            { In: "يِمم", Out: "يِمم" },
            { In: " يِمم ", Out: " يِمم " },
            { In: "ميِمم", Out: "ميمم" },
            { In: "مميِ", Out: "مميِ" },
            { In: "مميِ ", Out: "مميِ " },
            { In: " مميِ ", Out: " مميِ " },

            /// السكون والشدة
            { In: "بْبْبْبْ", Out: "بْبْبْبْ" },
            { In: "بّبّبّبّ", Out: "بّبّبّبّ" },
            { In: " بْبْبْبْ ", Out: " بْبْبْبْ " },
            { In: " بّبّبّبّ ", Out: " بّبّبّبّ " },

            { In: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿـفقكلمنهوىيٓٔ", Out: "ءآأؤإئابةتثجحخدذرزسشصضطظعغػؼؽؾؿـفقكلمنهوىيٓٔ" }
        ];

        RunTest("ReduceTashkil", reducedTextData, function (value) {
            return ArBasic.ReduceTashkil(value);
        });
    }
};

export function RunArBasicTests () {
    ArBasicTest.RemoveTatweelTest();
    ArBasicTest.RemoveTashkilTest();
    ArBasicTest.SeparateLamAlefTest();
    ArBasicTest.UnifyLettersTest();
    ArBasicTest.SimplifyTextTest();
    ArBasicTest.ReduceTashkilTest();
}
