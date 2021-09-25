"use strict";

/**
 * @Name Arabic library for JavaScript v0.0.1
 * @Source https://github.com/hani-ammar/JSArabicLib
 * @Copyright 2021 Taha Zerrouki, Hani Ammar, and other contributors
 * @License MIT license https://opensource.org/licenses/MIT
 */

// eslint-disable-next-line no-unused-vars
const ArBasic = {
    /**
     * تأخذ نص وتعيد الكلمات دون تشكيل.
     * كما تأخذ قيمة اختبارية تحدد الاحتفاظ بالشدة من عدمه.
     * Takes string and returns every word without Tashkil.
     * It also takes an optional boolean to keep Shadda or not.
     *
     * @param {string} str
     * @param {boolean} [keepShadda = false]
     * @return {string}
     */
    RemoveTashkil: function (str, keepShadda = false) {
        const len = str.length;
        let newStr = "";

        // إزالة التشكيل، واختياريًا الشدة.
        // Remove all Tashkil and (Optional) Shadda.
        for (let i = 0; i < len; i++) {
            const cc = str.charCodeAt(i);

            // الحروف المستخدمة في التشكيل هي من 1611 إلى 1618.
            // Arabic Tashkil characters are from 1611 to 1618.
            // 1617 = ّ  Shadda شدّة
            if (((cc < this.CharactersTable.Fathatan) || (cc > this.CharactersTable.Sukun)) ||
                 (keepShadda && (cc === this.CharactersTable.Shadda))) {
                newStr += str[i];
            }
        }

        return newStr;
    },

    /**
     * تعود بلا إذا كان التشكيل آخر الكلمة.
     * It returns false if Tashkil is at the end of the word.
     *
     * @param {number} cc
     * @param {number} bcc
     * @return {boolean}
     */
    CheckLastTashkilForRemoval: function (cc, bcc) {
        if ((cc < this.CharactersTable.Hamza) || (cc > this.CharactersTable.Sukun)) {
            // الرجوع بنعم إذا كان الحرف الحالي ليس عربيًا، وكان السابق ليس من الحركات.
            // Return true if the current character is not an Arabic one, and the previous one is not Tashkil.
            return ((bcc < this.CharactersTable.Fathatan) || (bcc === this.CharactersTable.Shadda));
        }

        // التنوين لا يكون إلا لآخر حرف في الكلمة، وهذا الشرط يمرر أي حرف غيره.
        // This condition will make sure that no Tanween is passed, since Tanween is only for the last char ً ٍ ٌ.
        return ((bcc < this.CharactersTable.Fathatan) || (bcc > this.CharactersTable.Kasratan));
    },

    /**
     * تعود بلا إذا كان التشكيل ليس آخر الكلمة.
     * It returns false if Tashkil is not at the end of the word.
     *
     * @param {number} cc
     * @param {number} bcc
     * @return {boolean}
     */
    CheckLastTashkilForKeeping: function (cc, bcc) {
        return ((cc < this.CharactersTable.Hamza) ||
                (cc > this.CharactersTable.Sukun) ||
                (bcc < this.CharactersTable.Fatha) ||
                (bcc === this.CharactersTable.Shadda));
    },

    /**
     * تزيل التشكيل الأخير لجميع الكلمات في نص معطى في حال كان المتغير الثاني remove قيمته true,
     * عدا ذلك فإنها تبقي التشكيل الأخير للكلمات.
     * It removes the last Tashkil for every word in a given string if “remove” is set to true,
     * otherwise if keeps only the last Tashkil.
     *
     * @param {string} str
     * @param {boolean} [remove = true]
     * @return {string}
     */
    LastTashkil: function (str, remove = true) {
        const len = str.length;
        let newStr = "";

        if (len !== 0) {
            let cc = 0;
            let y = 0;
            let bcc = str.charCodeAt(0);

            for (let i = 1; i < len; i++, y++) {
                cc = str.charCodeAt(i);

                if (remove) {
                    if (this.CheckLastTashkilForRemoval(cc, bcc)) {
                        newStr += str[y];
                    }
                } else if (this.CheckLastTashkilForKeeping(cc, bcc)) {
                    newStr += str[y];
                }

                bcc = cc;
            }

            // آخر حرف.
            // last char.
            if (remove) {
                if (this.CheckLastTashkilForRemoval(cc, bcc)) {
                    newStr += str[y];
                }
            } else if (this.CheckLastTashkilForKeeping(cc, bcc)) {
                newStr += str[y];
            }
        }

        return newStr;
    },

    /**
     * حذف التشكيل الواضح نطقًا.
     * Removes Tashkil if it's obvious to pronounce.
     *
     * @param {string} str
     * @return {string}
     */
    ReduceTashkil: function (str) {
        const len = str.length;
        let newStr = "";

        if (len !== 0) {
            let cc = 0;
            let y = 0;
            let bcc = str.charCodeAt(0);
            newStr += str[0];

            for (let i = 1; i < len; i++, y++) {
                cc = str.charCodeAt(i);

                switch (cc) {
                    // case this.CharactersTable.Sukun: //  ْ Sukun سكون.
                    case this.CharactersTable.Fatha: //  َ Fatha فتحة.
                    {
                        // if (cc === this.CharactersTable.Fatha) { // Fatha فتحة.
                        // تجاهل الفَتْحَة التي تأتي قبل أي ألف.
                        // Ignore Fatha if it before all types of Alef.
                        const n = (i + 1);
                        if (n < len) {
                            const acc = str.charCodeAt(n);
                            // 1570 آ Alef with Madda above ألف ممدودة.
                            // 1571 أ Alef with Hamza above ألف فوقها همزة.
                            // 1573 إ Alef with Hamza below ألف تحتها همزة.
                            // 1575 ا Alef ألف بلا همزة.
                            if ((acc === this.CharactersTable.AlefMadda) || (acc === this.CharactersTable.AlefHamzaAbove) ||
                                (acc === this.CharactersTable.AlefHamzaBelow) || (acc === this.CharactersTable.Alef)) {
                                break;
                            }
                        }
                        // }

                        // تجاهل حركتي الفَتْحَة والسكون اللتين ليستا على واوٍ أو ياءٍ، أو أنهما في بداية الكلمة
                        // Ignore Fatha and Sukun if it's not on Waw or Yeh, or it's at the beginning of a word.
                        // 1608 = و Waw.
                        // 1610 = ي Yeh.
                        if (((bcc === this.CharactersTable.Waw) || (bcc === this.CharactersTable.WawHamzaAbove) ||
                            (bcc === this.CharactersTable.Yeh)) && (y > 0)) {
                            const acc = str.charCodeAt(i - 2);

                            if ((acc >= this.CharactersTable.Hamza) && (acc <= this.CharactersTable.Sukun)) {
                                newStr += str[i];
                            }
                        }

                        break;
                    }

                    case this.CharactersTable.Damma: //  ُ Damma ضمة.
                    // تجاهل الضمة التي بعدها واوٍ أو واوٍ عليها همزة أو على واو.
                    // Ignore Damma if it comes before Waw or with Hamza above, or it's on Waw.
                    {
                        const n = (i + 1);
                        if (n < len) {
                            const acc = str.charCodeAt(n);

                            // 1572 = ؤ Waw with Hamza above.
                            // 1608 = و Waw.
                            if ((acc === this.CharactersTable.Waw) || (acc === this.CharactersTable.WawHamzaAbove) ||
                                (bcc === this.CharactersTable.Waw) || (bcc === this.CharactersTable.WawHamzaAbove)) {
                                break;
                            }
                        }

                        // تجاهل الضمة إذا كانت على شدة والشدة على واو، سواء كان على الواو همزة أو لا.
                        // Ignore Damma if it's on Shadda, and Shadda is on Waw (with Hamza above or without).
                        if ((bcc === this.CharactersTable.Shadda) && (i > 2)) {
                            const acc = str.charCodeAt(i - 2);
                            if ((acc === this.CharactersTable.Waw) || (acc === this.CharactersTable.WawHamzaAbove)) {
                                break;
                            }
                        }

                        newStr += str[i];
                        break;
                    }

                    case this.CharactersTable.Kasra: //  ِ Kasra كسرة.
                    {
                        // تجاهل الكسرة إذا كان بعدها ياء.
                        // Ignore Kasra if it comes before Yeh.
                        const n = (i + 1);
                        if (n < len) {
                            // 1610 = ي Yeh.
                            if (str.charCodeAt(n) === this.CharactersTable.Yeh) {
                                break;
                            }
                        }

                        // تجاهل حركة الكسرة التي تحت حرف الألف الذي تحته همزة.
                        // Ignore Kasra if it's under Alef with Hamza below.
                        if (bcc !== this.CharactersTable.AlefHamzaBelow) {
                            newStr += str[i];
                        }

                        break;
                    }

                    default:
                        newStr += str[i];
                }

                bcc = cc;
            }
        }

        return newStr;
    },

    /**
     * تتحقق فيما إذا كان الحرف المعطى هو حرف تطويل أو لا.
     * Checks if the given character is Tatweel ـ.
     *
     * @param {char} str
     * @return {boolean}
     */
    IsTatweel: function (cStr) {
        // 1600 = Tatweel ـ
        // 1600 = حرف التطويل ـ
        return (cStr === this.CharactersTable.Tatweel);
    },

    /**
     * تحذف التطويل من الكلمات.
     * Removes Tatweel form words ـ .
     *
     * @param {string} str
     * @return {string}
     */
    RemoveTatweel: function (str) {
        const len = str.length;
        let newStr = "";

        for (let i = 0; i < len; i++) {
            if (!(this.IsTatweel(str.charCodeAt(i)))) {
                newStr += str[i];
            }
        }

        return newStr;
    },

    /**
     * تزيل المسافات الزائدة والتطويل وتستبدل العلامات الأعجمية بالعربية.
     * Removes extra spaces, Tatweel and replaces foreign marks.
     *
     * @param {string} str
     * @return {string}
     */
    ImproveText: function (str) {
        const len = str.length;
        let insertSpace = false;
        let quotatStart = false;
        let ignoreSpace = true;
        let newStr = "";
        let bcc = 0;

        if (len === 1) {
            // يجب أن يكون النص أطول من حرف.
            // String length has to be longer than 1.
            return str;
        }

        for (let i = 0; i < len; i++) {
            const cc = str.charCodeAt(i);

            switch (cc) {
                case this.CharactersTable.Space:
                case 9: // tab
                {
                    // تخطي المسافات المكررة.
                    // Skip duplicate spaces.
                    if (bcc !== this.CharactersTable.Space) {
                        insertSpace = true;
                    }

                    break;
                }

                case this.CharactersTable.ArabicComma: // ، Arabic Comma فاصلة عربية.
                case this.CharactersTable.Comma: // , Latin Comma فاصلة أعجمية.
                {
                    // استبدال الفاصلة الأعجمية بالعربية.
                    // 1548 = ، Arabic Comma.
                    newStr += String.fromCharCode(this.CharactersTable.ArabicComma);
                    insertSpace = true;
                    break;
                }

                case this.CharactersTable.ArabicSemicolon: // ؛ Arabic Semicolon فاصلة منقوطة عربية.
                case this.CharactersTable.Semicolon: // ; Latin Semicolon فاصلة منقوطة أعجمية.
                {
                    // استبدال الفاصلة المنقوطة الأعجمية بالعربية.
                    // 1563 = ؛ Arabic Semicolon.
                    newStr += String.fromCharCode(this.CharactersTable.ArabicSemicolon);
                    insertSpace = true;
                    break;
                }

                case this.CharactersTable.ArabicQuestionMark: // ؟ Arabic Question Mark علامة استفهام عربية.
                case this.CharactersTable.QuestionMark: // ? Latin Question Mark علامة استفهام أعجمية.
                {
                    // استبدال علامة الاستفهام الأعجمية بالعربية.
                    // 1567 = ؟ Arabic Question Mark.
                    newStr += String.fromCharCode(this.CharactersTable.ArabicQuestionMark);
                    insertSpace = true;
                    break;
                }

                case this.CharactersTable.QuotationMark: // " Quotation Mark علامة افتباس عادية.
                case this.CharactersTable.QuotationMarkLeftDouble: // “ Left Double Quotation Mark بداية الاقتباس الأعجمي.
                case this.CharactersTable.QuotationMarkRightDouble: // ” Right Double Quotation Mark نهاية الاقتباس الأعجمي.
                {
                    if (!quotatStart) {
                        newStr += String.fromCharCode(this.CharactersTable.Space);
                    }

                    insertSpace = quotatStart;
                    quotatStart = !(quotatStart);
                    ignoreSpace = quotatStart;

                    // استبدال علامات الاقتباس الأعجمي بعلامة الاقتباس العادي.
                    // 34 = " Quotation Mark.
                    newStr += String.fromCharCode(this.CharactersTable.QuotationMark);
                    break;
                }

                // تخطي التطويل.
                // ـ Skip Tatweel.
                case this.CharactersTable.Tatweel:
                    break;

                case this.CharactersTable.Dot: // . Dot نقطة.
                {
                    // const y = (i + 1);
                    // if ((y < len) && (str.charCodeAt(y) === this.CharactersTable.Dot)) {
                    //     // نقاط مكررة.
                    //     // Repeated dots.
                    //     if (insertSpace) {
                    //         newStr += String.fromCharCode(this.CharactersTable.Space);
                    //     }
                    // }

                    newStr += str[i];
                    insertSpace = true;

                    break;
                }

                case this.CharactersTable.Colon: // : Colon نقطتان فوق بعص.
                {
                    newStr += str[i];
                    insertSpace = true;
                    break;
                }

                case this.CharactersTable.Waw: // و Waw حرف الواو.
                {
                    if (insertSpace) {
                        newStr += String.fromCharCode(this.CharactersTable.Space);
                        insertSpace = false;
                        ignoreSpace = true;
                    }

                    newStr += str[i];
                    break;
                }

                default:
                {
                    if (insertSpace) {
                        if (!(ignoreSpace) && ((i + 1) !== str.length) &&
                        // عدم إضافة مسافة بين علامة التعجب والاستفهام.
                        // Don't add space between ! and ?.
                            ((bcc !== this.CharactersTable.QuotationMark) && (cc !== 33))) {
                            newStr += String.fromCharCode(this.CharactersTable.Space);
                        }

                        insertSpace = false;
                    }

                    if ((cc < this.CharactersTable.Fathatan) || (cc > this.CharactersTable.Sukun)) {
                        ignoreSpace = false;
                    }

                    newStr += str[i];
                }
            }

            bcc = cc;
        }

        return newStr;
    },

    /**
     * تفصل التشيكل عن النص، وتعيد النص مع التشكيل مرمزًا.
     * Separates text from Tashkil, and returns text with encoded Tashkil.
     *
     * @param {string} str
     * @return {object} {EncodeTashkil: string, StrippedText: string}
     */
    EncodeTashkil: function (str) {
        const len = str.length;
        let tashkil = "";
        let hasTashkil = false;

        for (let i = 0; i < len; i++) {
            const cc = str.charCodeAt(i);

            /**
             * (UTF-16BE: dec) الحروف العربية في جدول الينيكود هي بين 1569 إلى 1610 حسب الترميز.
             * Arabic Alphabet in the Unicode table are between 1569 -> 1610 (UTF-16BE: dec).
             * الحروف المستخدمة في التشكيل هي من 1611 إلى 1618.
             * Arabic Tashkil characters are from 1611 to 1618.
             */
            if ((cc >= this.CharactersTable.Hamza) && (cc <= this.CharactersTable.Sukun)) {
                let hasShadda = false;
                let harakhChar = 0;
                let y = (i + 1);

                while (y < len) {
                    const ncc = str.charCodeAt(y);
                    if ((ncc >= this.CharactersTable.Fathatan) && (ncc <= this.CharactersTable.Sukun)) {
                        hasTashkil = true;

                        if (ncc !== this.CharactersTable.Shadda) {
                            harakhChar = ncc;
                        } else {
                            hasShadda = true;
                        }

                        ++i;
                    } else {
                        break;
                    }

                    ++y;
                }

                if (hasTashkil) {
                    hasTashkil = false;
                    let code = 0;
                    // 1617 = ّ  Shadda شدّة.

                    switch (harakhChar) {
                        case this.CharactersTable.Fathatan: //  ً Arabic Fathatan فتحتان.
                            code = 97; // a
                            break;

                        case this.CharactersTable.Dammatan: //  ٌ Arabic Dammatan ضمتان.
                            code = 98; // b
                            break;

                        case this.CharactersTable.Kasratan: //  ٍ Arabic Kasratan كسرتان.
                            code = 99; // c
                            break;

                        case this.CharactersTable.Fatha: //  َ Arabic Fatha فتحة.
                            code = 100; // d
                            break;

                        case this.CharactersTable.Damma: //  ُ Arabic Damma ضمة.
                            code = 101; // e
                            break;

                        case this.CharactersTable.Kasra: //  ِ Arabic Kasra كسرة.
                            code = 102; // f
                            break;

                        case this.CharactersTable.Sukun: //  ْ Arabic Sukun سكون.
                            code = 103; // g
                            break;

                        default:
                    }

                    if (code !== 0) {
                        if (hasShadda && (code !== this.CharactersTable.Sukun)) {
                            // 32 (A و a) عدد الحروف بين.
                            // 32 Number of characters between A and a.
                            code -= 32;
                        }
                    } else if (hasShadda) {
                        code = 87; // W
                    }

                    tashkil += String.fromCharCode(code);
                } else {
                    tashkil += "0";
                }
            } else {
                tashkil += str[i];
            }
        }

        return { EncodedTashkil: tashkil, StrippedText: this.RemoveTashkil(str, false) };
    },

    /**
     * تأخذ نص وتعيد أحرف الكلمات منفصلة عن بعضها.
     * Takes string and return words' characters in disconnected form.
     *
     * @param {string} str
     * @return {string}
     */
    // DisconnectChars: function (str) {
    //     const len = str.length;
    //     let newStr = "";

    //     /**
    //      * (UTF-16BE: dec) الحروف العربية في جدول الينيكود هي بين 1569 إلى 1610 حسب الترميز.
    //      * Arabic Alphabet in the Unicode table are between 1569 -> 1610 (UTF-16BE: dec).
    //      */
    //     for (let i = 0; i < len; i++) {
    //         const cc = str.charCodeAt(i);

    //         if ((cc >= this.CharactersTable.Hamza) && (cc <= this.CharactersTable.Yeh)) {
    //             // بحكم أن المصفوفة تبدأ من العدد 0، يطرح 1569 من رقم الحرف؛ للوصول إلى هيئة الحرف المستقلة.
    //             // Because arrays starts from 0, subtract 1569 from char code; to match the index of isolated form.
    //             if (cc !== this.CharactersTable.Tatweel) { // تخطي التطويل.
    //                 newStr += String.fromCharCode(this.IsolatedForms[(cc - this.CharactersTable.Hamza)]);
    //             }
    //         } else {
    //             newStr += str[i];
    //         }
    //     }

    //     return newStr;
    // },

    CharactersTable: {
        Space: 32, // Space مسافة.
        QuotationMark: 34, // " Quotation Mark علامة افتباس عادية.
        Dot: 46, // . Dot نقطة.
        Comma: 44, // , Latin Comma فاصلة أعجمية.
        Colon: 58, // : Colon نقطتان فوق بعص.
        Semicolon: 59, // ; Latin Semicolon فاصلة منقوطة أعجمية.
        QuestionMark: 63, // ? Latin Question Mark علامة استفهام أعجمية.
        ArabicComma: 1548, // ، Arabic Comma فاصلة عربية.
        ArabicSemicolon: 1563, // ؛ Arabic Semicolon فاصلة منقوطة عربية.
        ArabicQuestionMark: 1567, // ؟ Arabic Question Mark علامة استفهام عربية.
        Hamza: 1569, // ء Arabic Letter Hamza همزة.
        AlefMadda: 1570, // آ Alef with Madda above ألف ممدودة.
        AlefHamzaAbove: 1571, // أ Alef with Hamza above ألف فوقها همزة.
        WawHamzaAbove: 1572, // ا Waw with Hamza above واو فوقها همزة.
        AlefHamzaBelow: 1573, // إ Alef with Hamza below ألف تحتها همزة.
        Alef: 1575, // ا Alef ألف بلا همزة.
        Tatweel: 1600, // ـ Tatweel حرف التطويل.
        Waw: 1608, // و Waw واو.
        Yeh: 1610, // ي Arabic Letter Yeh ياء.
        Fathatan: 1611, //  ً Arabic Fathatan فتحتان.
        Dammatan: 1612, //  ٌ Arabic Dammatan ضمتان.
        Kasratan: 1613, //  ٍ Arabic Kasratan كسرتان.
        Fatha: 1614, //  َ Arabic Fatha فتحة.
        Damma: 1615, //  ُ Arabic Damma ضمة.
        Kasra: 1616, //  ِ Arabic Kasra كسرة.
        Shadda: 1617, //  ّ Arabic Shadda شدّة.
        Sukun: 1618, //  ْ Arabic Sukun سكون.
        QuotationMarkLeftDouble: 8220, // “ Left Double Quotation Mark بداية الاقتباس الأعجمي.
        QuotationMarkRightDouble: 8221 // ” Right Double Quotation Mark نهاية الاقتباس الأعجمي.
    }

    /**
     *  ﺀ ﺁ ﺃ ﺅ ﺇ ﺉ ﺍ ﺏ ﺓ ﺕ ﺙ ﺝ ﺡ ﺥ ﺩ ﺭ ﺯ ﺱ ﺵ ﺹ ﺽ ﻁ ﻅ ﻉ ﻍ ﻑ ﻕ ﻙ ﻝ ﻡ ﻥ ﻩ ﻭ ﻯ ﻱ
     * 1600 = ـ مدّة
     * ػ = ﻙ
     * ؼ = ﻙ
     * ﻯ = ؽ ؾ ؿ
     * قائمة بالحروف العربية التي لا تتصل ببعضها.
     * List of Arabic character in uncontactable form.
     */
    // IsolatedForms: [65152, 65153, 65155, 65157, 65159, 65161, 65165, 65167, 65171, 65173, 65177, 65181, 65185,
    //     65189, 65193, 65195, 65197, 65199, 65201, 65205, 65209, 65213, 65217, 65221, 65225,
    //     65241, 65241, 65263, 65263, 65263, 1600, 65229, 65233, 65237, 65241, 65245, 65249, 65253, 65257, 65261, 65263, 65265]
};

// كي يمكن استخدام المِلَفّ مع المتصفح
// To allow this file to be used inside a browser.
if (typeof module !== "undefined") {
    module.exports = {
        ArBasic
    };
}
