/**
 * @Name Arabic library for JavaScript v0.0.1
 * @Source https://github.com/hani-ammar/JSArabicLib
 * @Copyright 2021 Taha Zerrouki, Hani Ammar, and other contributors
 * @License GPL version 2 license https://www.gnu.org/licenses/old-licenses/lgpl-2.0.html
 */

// eslint-disable-next-line no-unused-vars
const ArLib = {
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
            // 1617 = ّ
            if (((cc < 1611) || (cc > 1618)) || (keepShadda && (cc === 1617))) {
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
        if ((cc < 1569) || (cc > 1618)) {
            if ((bcc < 1611) || (bcc === 1617)) {
                // الرجوع بنعم إذا كان الحرف الحالي ليس عربيًا، وكان السابق ليس من الحركات.
                // Return true if the current character is not an Arabic one, and the previous one is not Tashkil.
                return true;
            }
        } else if ((bcc < 1611) || (bcc > 1613)) {
            // التنوين لا يكون إلا لآخر حرف في الكلمة، وهذا الشرط يمرر أي حرف غيره.
            // This condition will make sure that no Tanween is passed, since Tanween is only for the last char ً ٍ ٌ.
            return true;
        }

        return false;
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
        if ((cc < 1569) || (cc > 1618)) {
            return true;
        } else if ((bcc < 1614) || (bcc === 1617)) {
            return true;
        }

        return false;
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
                    case 1618: //  ْ Sukun سكون.
                    case 1614: //  َ Fatha فتحة.
                    {
                        if (cc === 1614) { // Fatha فتحة.
                            // تجاهل الفَتْحَة التي تأتي قبل أي ألف.
                            // Ignore Fatha if it before all types of Alef.
                            const n = (i + 1);
                            if (n < len) {
                                const acc = str.charCodeAt(n);
                                // 1570 = آ // Alef with Madda above.
                                // 1571 = أ // Alef with Hamza above.
                                // 1573 = إ // Alef with Hamza below.
                                // 1575 = ا // Naked Alef.
                                if ((acc === 1570) || (acc === 1571) || (acc === 1573) || (acc === 1575)) {
                                    break;
                                }
                            }
                        }

                        // تجاهل حركتي الفَتْحَة والسكون اللتان ليستا على واوٍ أو ياءٍ، أو أنها في بداية الكلمة
                        // Ignore Fatha and Sukun if it's not on Waw or Yeh, or it's at the beginning of a word.
                        // 1608 = و Waw.
                        // 1610 = ي Yeh.
                        if (((bcc === 1608) || (bcc === 1610)) && (y > 0)) {
                            const acc = str.charCodeAt(i - 2);
                            if ((acc >= 1569) && (acc <= 1618)) {
                                newStr += str[i];
                            }
                        }

                        break;
                    }

                    case 1615: //  ُ Damma ضمة.
                    // تجاهل الضمة التي بعدها واوٍ أو واوٍ عليها همزة أو على واو.
                    // Ignore Damma if it comes before Waw or with Hamza above, or it's on Waw.
                    {
                        const n = (i + 1);
                        if (n < len) {
                            const acc = str.charCodeAt(n);

                            // 1608 = و Waw.
                            // 1572 = ؤ Waw or with Hamza above.
                            if ((acc === 1608) || (acc === 1572) || (bcc === 1608) || (bcc === 1572)) {
                                break;
                            }
                        }

                        // تجاهل الضمة إذا كانت على شدة والشدة على واو، سواء كان على الواو همزة أو لا.
                        // Ignore Damma if it's on Shadda, and Shadda is on Waw (with Hamza above or without).
                        if ((bcc === 1617) && (i > 2)) {
                            const acc = str.charCodeAt(i - 2);
                            if ((acc === 1608) || (acc === 1572)) {
                                break;
                            }
                        }

                        newStr += str[i];
                        break;
                    }

                    case 1616: //  ِ Kasra كسرة.
                    {
                        // تجاهل الكسرة إذا كان بعدها ياء.
                        // Ignore Kasra if it comes before Yeh.
                        const n = (i + 1);
                        if (n < len) {
                            // 1610 = ي Yeh.
                            if (str.charCodeAt(n) === 1610) {
                                break;
                            }
                        }

                        // تجاهل حركة الكسرة التي تحت حرف الألف الذي تحته همزة.
                        // Ignore Kasra if it's under Alef with Hamza below.
                        if (bcc !== 1573) {
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
        return (cStr === 1600);
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
        let ignoreSpace = false;
        let quotatStart = false;
        let textStarted = false;
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
                case 32:
                {
                    // تخطي المسافات المكررة.
                    // Skip duplicate spaces.
                    if ((bcc !== 32) && !(ignoreSpace)) {
                        insertSpace = true;
                    }

                    break;
                }

                case 1548: // ، Arabic Comma فاصلة عربية.
                case 44: // , Latin Comma فاصلة أعجمية.
                {
                    // استبدال الفاصلة الأعجمية بالعربية.
                    // 1548 = ، Arabic Comma.
                    newStr += String.fromCharCode(1548);
                    insertSpace = true;
                    break;
                }

                case 1563: // ؛ Arabic Semicolon فاصلة منقوطة عربية.
                case 59: // ; Latin Semicolon فاصلة منقوطة أعجمية.
                {
                    // استبدال الفاصلة المنقوطة الأعجمية بالعربية.
                    // 1563 = ؛ Arabic Semicolon.
                    newStr += String.fromCharCode(1563);
                    insertSpace = true;
                    break;
                }

                case 1567: // ؟ Arabic Question Mark علامة استفهام عربية.
                case 63: // ? Latin Question Mark علامة استفهام أعجمية.
                {
                    // استبدال علامة الاستفهام الأعجمية بالعربية.
                    // 1567 = ؟ Arabic Question Mark.
                    newStr += String.fromCharCode(1567);
                    insertSpace = true;
                    break;
                }

                case 34: // " Quotation Mark علامة افتباس عادية.
                case 8220: // “ Left Double Quotation Mark بداية الاقتباس الأعجمي.
                case 8221: // ” Right Double Quotation Mark نهاية الاقتباس الأعجمي.
                {
                    if (!quotatStart) {
                        newStr += String.fromCharCode(32);
                    }

                    insertSpace = quotatStart;
                    quotatStart = !(quotatStart);
                    ignoreSpace = quotatStart;

                    // استبدال علامات الاقتباس الأعجمي بعلامة الاقتباس العادي.
                    // 34 = " Quotation Mark.
                    newStr += String.fromCharCode(34);
                    break;
                }

                // تخطي التطويل.
                // ـ Skip Tatweel.
                case 1600:
                    break;

                case 58: // : Colon نقطتان فوق بعص.
                case 46: // . Full Stop نقطة.
                {
                    newStr += String.fromCharCode(cc);
                    insertSpace = true;
                    break;
                }

                default:
                {
                    if (insertSpace) {
                        if (textStarted && ((i + 1) !== str.length)) {
                            newStr += String.fromCharCode(32);
                        }

                        insertSpace = false;
                    }

                    textStarted = true;
                    newStr += str[i];
                }
            }

            bcc = cc;
        }

        return newStr;
    }

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

    //         if ((cc >= 1569) && (cc <= 1610)) {
    //             // بحكم أن المصفوفة تبدأ من العدد 0، يطرح 1569 من رقم الحرف؛ للوصول إلى هيئة الحرف المستقلة.
    //             // Because arrays starts from 0, subtract 1569 from char code; to match the index of isolated form.
    //             if (cc !== 1600) { // تخطي المدّة.
    //                 newStr += String.fromCharCode(this.IsolatedForms[(cc - 1569)]);
    //             }
    //         } else {
    //             newStr += str[i];
    //         }
    //     }

    //     return newStr;
    // },

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
