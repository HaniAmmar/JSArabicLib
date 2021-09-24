﻿/**
 * @Name Arabic library for JavaScript v0.0.1
 * @Source https://github.com/hani-ammar/JSArabicLib
 * @Copyright 2021 Taha Zerrouki, Hani Ammar, and other contributors
 * @License GPL version 2 license https://www.gnu.org/licenses/old-licenses/lgpl-2.0.html
 */

// eslint-disable-next-line no-unused-vars
const ArLib = {
    /**
     * Takes string and return words' characters in disconnected form.
     * تأخذ نص وتعيد أحرف الكلمات منفصلة عن بعضها.
     *
     * @param {string} str
     * @return {string}
     */
    // DisconnectChars: function (str) {
    //     const len = str.length;
    //     let newstr = "";

    //     /**
    //      * Arabic Alphabet in the Unicode table are between 1569 -> 1610 (UTF-16BE: dec).
    //      * (UTF-16BE: dec) الحروف العربية في جدول الينيكود هي بين 1569 إلى 1610 حسب الترميز.
    //      */
    //     for (let i = 0; i < len; i++) {
    //         const cc = str.charCodeAt(i);

    //         if ((cc >= 1569) && (cc <= 1610)) {
    //             // Because arrays starts from 0, subtract 1569 from char code; to match the index of isolated form.
    //             // بحكم أن المصفوفة تبدأ من العدد 0، يطرح 1569 من رقم الحرف؛ للوصول إلى هيئة الحرف المستقلة.
    //             if (cc !== 1600) { // تخطي المدّة.
    //                 newstr += String.fromCharCode(this.IsolatedForms[(cc - 1569)]);
    //             }
    //         } else {
    //             newstr += str[i];
    //         }
    //     }

    //     return newstr;
    // },

    /**
     * Takes string and returns every word without Tashkil.
     * It also takes an optional boolean to keep Shadda or not.
     * تأخذ نص وتعيد الكلمات دون تشكيل.
     * كما تأخذ قيمة اختبارية تحدد الاحتفاظ بالشدة من عدمه.
     *
     * @param {string} str
     * @param {boolean} [keepShadda = false]
     * @return {string}
     */
    RemoveTashkil: function (str, keepShadda = false) {
        const len = str.length;
        let newstr = "";

        // Remove all Tashkil and (Optional) Shadda.
        // إزالة التشكيل، واختياريًا الشدة.
        for (let i = 0; i < len; i++) {
            const cc = str.charCodeAt(i);

            // Arabic Tashkil characters are from 1611 to 1618.
            // الحروف المستخدمة في التشكيل هي من 1611 إلى 1618.
            // 1617 = ّ
            if (((cc < 1611) || (cc > 1618)) || (keepShadda && (cc === 1617))) {
                newstr += str[i];
            }
        }

        return newstr;
    },

    /**
     * It returns false if Tashkil is at the end of the word.
     * تعود بلا إذا كان التشكيل آخر الكلمة.
     *
     * @param {number} cc
     * @param {number} bcc
     * @return {boolean}
     */
    CheckLastTashkilForRemoval: function (cc, bcc) {
        if ((cc < 1569) || (cc > 1618)) {
            if ((bcc < 1611) || (bcc === 1617)) {
                // Return true if the current character is not an Arabic one, and the previous one is not Tashkil.
                // الرجوع بنعم إذا كان الحرف الحالي ليس عربيًا، وكان السابق ليس من الحركات.
                return true;
            }
        } else if ((bcc < 1611) || (bcc > 1613)) {
            // This condition will make sure that no Tanween is passed, since Tanween is only for the last char ً ٍ ٌ.
            // التنوين لا يكون إلا لآخر حرف في الكلمة، وهذا الشرط يمرر أي حرف غيره.
            return true;
        }

        return false;
    },

    /**
     * It returns false if Tashkil is not at the end of the word.
     * تعود بلا إذا كان التشكيل ليس آخر الكلمة.
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
     * It removes the last Tashkil for every word in a given string if “remove” is set to true,
     * otherwise if keeps only the last Tashkil.
     * تزيل التشكيل الأخير لجميع الكلمات في نص معطى في حال كان المتغير الثاني remove قيمته true,
     * عدا ذلك فإنها تبقي التشكيل الأخير للكلمات.
     *
     * @param {string} str
     * @param {boolean} [remove = false]
     * @return {string}
     */
    LastTashkil: function (str, remove = true) {
        const len = str.length;
        let newstr = "";

        if (len !== 0) {
            let cc = 0;
            let y = 0;
            let bcc = str.charCodeAt(0);

            for (let i = 1; i < len; i++, y++) {
                cc = str.charCodeAt(i);

                if (remove) {
                    if (this.CheckLastTashkilForRemoval(cc, bcc)) {
                        newstr += str[y];
                    }
                } else if (this.CheckLastTashkilForKeeping(cc, bcc)) {
                    newstr += str[y];
                }

                bcc = cc;
            }

            // last char.
            // آخر حرف.
            if (remove) {
                if (this.CheckLastTashkilForRemoval(cc, bcc)) {
                    newstr += str[y];
                }
            } else if (this.CheckLastTashkilForKeeping(cc, bcc)) {
                newstr += str[y];
            }
        }

        return newstr;
    },

    /**
     * Removes Tatweel form words ـ .
     * تحذف التطويل من الكلمات.
     *
     * @param {string} str
     * @return {string}
     */
    RemoveTatweel: function (str) {
        const len = str.length;
        let newstr = "";

        for (let i = 0; i < len; i++) {
            // 1600 = Tatweel ـ
            // 1600 = حرف التطويل ـ
            if (str.charCodeAt(i) !== 1600) {
                newstr += str[i];
            }
        }

        return newstr;
    },

    /**
     * Removes Tashkil if it's obvious to pronounce.
     * حذف التشكيل الواضح نطقًا.
     *
     * @param {string} str
     * @return {string}
     */
    ReduceTashkil: function (str) {
        const len = str.length;
        let newstr = "";

        if (len !== 0) {
            let cc = 0;
            let y = 0;
            let bcc = str.charCodeAt(0);
            newstr += str[0];

            for (let i = 1; i < len; i++, y++) {
                cc = str.charCodeAt(i);

                switch (cc) {
                    case 1618: // Sukun سكون.
                    case 1614: // Fatha فتحة.
                    {
                        if (cc === 1614) { // Fatha فتحة.
                            // Ignore Fatha if it before all types of Alef.
                            // تجاهل الفَتْحَة التي تأتي قبل أي ألف.
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

                        // Ignore Fatha and Sukun if it's not on Waw or Yeh, or it's at the beginning of a word.
                        // تجاهل حركتي الفَتْحَة والسكون اللتان ليستا على واوٍ أو ياءٍ، أو أنها في بداية الكلمة
                        // 1608 = و Waw.
                        // 1610 = ي Yeh.
                        if (((bcc === 1608) || (bcc === 1610)) && (y > 0)) {
                            const acc = str.charCodeAt(i - 2);
                            if ((acc >= 1569) && (acc <= 1618)) {
                                newstr += str[i];
                            }
                        }

                        break;
                    }

                    case 1615: // Damma ضمة.
                    // Ignore Damma if it comes before Waw or with Hamza above, or it's on Waw.
                    // تجاهل الضمة التي بعدها واوٍ أو واوٍ عليها همزة أو على واو.
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

                        // Ignore Damma if it's on Shadda, and Shadda is on Waw (with Hamza above or without).
                        // تجاهل الضمة إذا كانت على شدة والشدة على واو، سواء كان على الواو همزة أو لا.
                        if ((bcc === 1617) && (i > 2)) {
                            const acc = str.charCodeAt(i - 2);
                            if ((acc === 1608) || (acc === 1572)) {
                                break;
                            }
                        }

                        newstr += str[i];
                        break;
                    }

                    case 1616: // Kasra كسرة.
                    {
                        // Ignore Kasra if it comes before Yeh.
                        // تجاهل الكسرة إذا كان بعدها ياء.
                        const n = (i + 1);
                        if (n < len) {
                            // 1610 = ي Yeh.
                            if (str.charCodeAt(n) === 1610) {
                                break;
                            }
                        }

                        // Ignore Kasra if it's under Alef with Hamza below.
                        // تجاهل حركة الكسرة التي تحت حرف الألف الذي تحته همزة.
                        if (bcc !== 1573) {
                            newstr += str[i];
                        }

                        break;
                    }

                    default:
                        newstr += str[i];
                        break;
                }

                bcc = cc;
            }
        }

        return newstr;
    }

    /**
     *  ﺀ ﺁ ﺃ ﺅ ﺇ ﺉ ﺍ ﺏ ﺓ ﺕ ﺙ ﺝ ﺡ ﺥ ﺩ ﺭ ﺯ ﺱ ﺵ ﺹ ﺽ ﻁ ﻅ ﻉ ﻍ ﻑ ﻕ ﻙ ﻝ ﻡ ﻥ ﻩ ﻭ ﻯ ﻱ
     * 1600 = ـ مدّة
     * ػ = ﻙ
     * ؼ = ﻙ
     * ﻯ = ؽ ؾ ؿ
     * List of Arabic character in uncontactable form.
     * قائمة بالحروف العربية التي لا تتصل ببعضها.
     */
    // IsolatedForms: [65152, 65153, 65155, 65157, 65159, 65161, 65165, 65167, 65171, 65173, 65177, 65181, 65185,
    //     65189, 65193, 65195, 65197, 65199, 65201, 65205, 65209, 65213, 65217, 65221, 65225,
    //     65241, 65241, 65263, 65263, 65263, 1600, 65229, 65233, 65237, 65241, 65245, 65249, 65253, 65257, 65261, 65263, 65265]
};
