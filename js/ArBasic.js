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
            // Arabic Tashkil letters are from 1611 to 1618.
            // 1617 = ّ  Shadda شدّة
            if (((cc < this.LettersTable.Fathatan) || (cc > this.LettersTable.Sukun)) ||
                 (keepShadda && (cc === this.LettersTable.Shadda))) {
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
        if ((cc < this.LettersTable.Hamza) || (cc > this.LettersTable.Sukun)) {
            // الرجوع بنعم إذا كان الحرف الحالي ليس عربيًا، وكان السابق ليس من الحركات.
            // Return true if the current letter is not an Arabic one, and the previous one is not Tashkil.
            return ((bcc < this.LettersTable.Fathatan) || (bcc === this.LettersTable.Shadda));
        }

        // التنوين لا يكون إلا لآخر حرف في الكلمة، وهذا الشرط يمرر أي حرف غيره.
        // This condition will make sure that no Tanween is passed, since Tanween is only for the last char ً ٍ ٌ.
        return ((bcc < this.LettersTable.Fathatan) || (bcc > this.LettersTable.Kasratan));
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
        return ((cc < this.LettersTable.Hamza) ||
                (cc > this.LettersTable.Sukun) ||
                (bcc < this.LettersTable.Fatha) ||
                (bcc === this.LettersTable.Shadda));
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
     * حذف التشكيل الواضح نطقه.
     * Removes Tashkil if it's obvious to pronounce.
     *
     * @param {string} str
     * @return {string}
     */
    ReduceTashkil: function (str) {
        const len = (str.length - 1);
        let newStr = "";

        if (len < 3) {
            // يجب أن يكون طول النص 3 أحرف كحدٍ أقل.
            // String has to be at least 3 characters in length.
            return;
        }

        let bcc = str.charCodeAt(0); // Previous letter الحرف السابق.
        let cc = str.charCodeAt(1); // Current char الحرف الحالي.
        newStr += str[0];

        for (let i = 1, y = 2; i < len; i++, y++) {
            const ncc = str.charCodeAt(y); // Next char الحرف التالي.

            switch (cc) {
                case this.LettersTable.Fatha: //  َ Fatha فَتحة.
                {
                    // إضافة الفَتحة فقط إذا كانت في آخر الكلمة، أو على واو أو بعدها واو،
                    // أو على ياء أو بعدها ياء.
                    // Add Fatha only if at the end of a word, or on Waw or what's after it is Waw,
                    // or on Yeh or what's after it is Yeh.
                    if ((bcc === this.LettersTable.Waw) || (bcc === this.LettersTable.Yeh) ||
                        (ncc === this.LettersTable.Waw) || (ncc === this.LettersTable.Yeh) ||
                        ((ncc < this.LettersTable.Hamza) || (ncc > this.LettersTable.Sukun))) {
                        newStr += str[i];
                    }

                    break;
                }

                case this.LettersTable.Damma: //  ُ Damma ضمة.
                {
                    // إضافة الضمة في حالة لم تكن على واو أو بعدها واو.
                    // Add Damma if it's not on Waw or there is Waw after it.
                    if ((bcc !== this.LettersTable.Waw) &&
                        (ncc !== this.LettersTable.Waw)) {
                        newStr += str[i];
                    }

                    break;
                }

                case this.LettersTable.Kasra: //  ِ Kasra كسرة.
                {
                    // إضافة الكسرة إن لم تكن على ياء أو بعدها ياء، أو على همزة على ياء،
                    // أو لم تكن تحت ألف همزتها تحت.
                    // Add Kasra if it's not under Yeh or Yeh is not after it,
                    // or under Yeh with Hamza above it, or not under Alef with Hamza Below it.
                    if ((bcc !== this.LettersTable.Yeh) && (bcc !== this.LettersTable.AlefHamzaBelow) &&
                        (bcc !== this.LettersTable.YehHamzaAbove) &&
                        (ncc !== this.LettersTable.Yeh)) {
                        newStr += str[i];
                    }

                    break;
                }

                case this.LettersTable.Shadda:
                {
                    // Kepp Shadda الإبقاء على الشدة.
                    newStr += str[i];
                    break;
                }

                case this.LettersTable.Sukun:
                {
                    // Kepp Sukun الإبقاء على السكون.
                    newStr += str[i];
                    break;
                }

                default:
                {
                    // "bcc" only stores letter المتغير التالي يخزن الحروف فقط.
                    bcc = cc;
                    newStr += str[i];
                }
            }

            cc = ncc;
        }

        newStr += str[len];
        return newStr;
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
            if (str.charCodeAt(i) !== this.LettersTable.Tatweel) {
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
                case this.LettersTable.Space:
                case 9: // tab
                {
                    // تخطي المسافات المكررة.
                    // Skip duplicate spaces.
                    if (bcc !== this.LettersTable.Space) {
                        insertSpace = true;
                    }

                    break;
                }

                case this.LettersTable.ArabicComma: // ، Arabic Comma فاصلة عربية.
                case this.LettersTable.Comma: // , Latin Comma فاصلة أعجمية.
                {
                    // استبدال الفاصلة الأعجمية بالعربية.
                    // 1548 = ، Arabic Comma.
                    newStr += String.fromCharCode(this.LettersTable.ArabicComma);
                    insertSpace = true;
                    break;
                }

                case this.LettersTable.ArabicSemicolon: // ؛ Arabic Semicolon فاصلة منقوطة عربية.
                case this.LettersTable.Semicolon: // ; Latin Semicolon فاصلة منقوطة أعجمية.
                {
                    // استبدال الفاصلة المنقوطة الأعجمية بالعربية.
                    // 1563 = ؛ Arabic Semicolon.
                    newStr += String.fromCharCode(this.LettersTable.ArabicSemicolon);
                    insertSpace = true;
                    break;
                }

                case this.LettersTable.ArabicQuestionMark: // ؟ Arabic Question Mark علامة استفهام عربية.
                case this.LettersTable.QuestionMark: // ? Latin Question Mark علامة استفهام أعجمية.
                {
                    // استبدال علامة الاستفهام الأعجمية بالعربية.
                    // 1567 = ؟ Arabic Question Mark.
                    newStr += String.fromCharCode(this.LettersTable.ArabicQuestionMark);
                    insertSpace = true;
                    break;
                }

                case this.LettersTable.QuotationMark: // " Quotation Mark علامة افتباس عادية.
                case this.LettersTable.QuotationMarkLeftDouble: // “ Left Double Quotation Mark بداية الاقتباس الأعجمي.
                case this.LettersTable.QuotationMarkRightDouble: // ” Right Double Quotation Mark نهاية الاقتباس الأعجمي.
                {
                    if (!quotatStart) {
                        // إضافة مسافة في بداية أي اقتباس.
                        // Add a space before the start of any quote.
                        newStr += String.fromCharCode(this.LettersTable.Space);
                    }

                    quotatStart = !(quotatStart);

                    // منع إضافة مسافة بعد بداية الاقتباس.
                    // Prevent adding space after the start of a quote.
                    insertSpace = !(quotatStart);
                    ignoreSpace = quotatStart;

                    // استبدال علامات الاقتباس الأعجمي بعلامة الاقتباس العادي.
                    // 34 = " Quotation Mark.
                    newStr += String.fromCharCode(this.LettersTable.QuotationMark);
                    break;
                }

                // نقل الفتحتين إلى قبل الألف.
                // Move Fathatan to be before Alef.
                case this.LettersTable.Alef:
                {
                    const s = str[i];

                    // إذا كانت هناك مسافة قبل الألف، فإن الألف في بداية الكلمة.
                    // If "insertSpace" is true, then Alef is at the start of a word.
                    if (!(insertSpace)) {
                        const y = (i + 1);

                        if ((y < len) && (str.charCodeAt(y) === this.LettersTable.Fathatan)) {
                            newStr += String.fromCharCode(this.LettersTable.Fathatan);
                            ++i;
                        }

                        // إعادة تعيين تجاهل المسافة فيما لو كانت الألف في بداية الكلام.
                        // Reset ignoreSpace if Alef it at the start.
                        // "لإصلاح مشكلة عند تحسين الجملة: "واو أو ياء.
                        ignoreSpace = false;
                    } else if (!(ignoreSpace)) {
                        newStr += String.fromCharCode(this.LettersTable.Space);
                        insertSpace = false;
                    }

                    newStr += s;
                    break;
                }

                // تخطي التطويل.
                // ـ Skip Tatweel.
                case this.LettersTable.Tatweel:
                {
                    let y = (i + 1);
                    let keepTatweel = false;

                    while (y < len) {
                        const ncc = str.charCodeAt(y);

                        // عدم إزالة المدة إذا كانت آخر الكلمة.
                        // Don't remove Tatweel if it's at the end of the word.
                        if (((ncc < this.LettersTable.Fathatan) || (ncc > this.LettersTable.Sukun)) &&
                              ncc !== this.LettersTable.Tatweel) {
                            keepTatweel = true;
                            break;
                        }

                        ++y;
                    }

                    if (keepTatweel) {
                        newStr += String.fromCharCode(this.LettersTable.Tatweel);

                        // تقدم إلى آخر تطويل.
                        // Advanced to the last Tatweel.
                        i = (y - 1);
                    }

                    break;
                }

                case this.LettersTable.Dot: // . Dot نقطة.
                {
                    let y = (i + 1);
                    let repeatedDots = false;

                    // التحقق من النقاط المتكررة
                    // Checking for repeated dots.
                    while (y < len) {
                        const ncc = str.charCodeAt(y);

                        if (ncc !== this.LettersTable.Space) {
                            if (ncc !== this.LettersTable.Dot) {
                                break;
                            }

                            repeatedDots = true;
                        }

                        ++y;
                    }

                    const s = str[i]; // Dot النقطة.

                    if (repeatedDots) {
                        // تمكين إضافة مسافة بعد النقط إن لم يكن بعدها اقتباس.
                        // Enable adding a space after dots if what's after them is not quotation mark.
                        ignoreSpace = false;

                        // عدم إضافة مسافة بعد النقط إذا كانت داخل اقتباس.
                        // Don't add space if the dots are in quotation marks.
                        if ((bcc !== this.LettersTable.QuotationMark) &&
                            (bcc !== this.LettersTable.QuotationMarkLeftDouble) &&
                            (bcc !== this.LettersTable.QuotationMarkRightDouble)) {
                            newStr += String.fromCharCode(this.LettersTable.Space);
                        }

                        newStr += s;
                        newStr += s;

                        // تقدم إلى آخر مسافة أو نقطة.
                        // Advanced to the last space or dot.
                        i = (y - 1);
                    }

                    newStr += s;
                    insertSpace = true;

                    break;
                }

                case this.LettersTable.Colon: // : Colon نقطتان فوق بعص.
                {
                    newStr += str[i];
                    insertSpace = true;
                    break;
                }

                case this.LettersTable.Waw: // و Waw حرف الواو.
                {
                    // تخطي المسافات بعد واو العطف.
                    // Skip spaces after Waw that behaves like "and".
                    if (insertSpace) {
                        newStr += String.fromCharCode(this.LettersTable.Space);
                        ignoreSpace = true;
                        insertSpace = false;
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
                            ((bcc !== this.LettersTable.QuotationMark) && (cc !== 33))) {
                            newStr += String.fromCharCode(this.LettersTable.Space);
                        }

                        insertSpace = false;
                    }

                    if ((cc < this.LettersTable.Fathatan) || (cc > this.LettersTable.Sukun)) {
                        // تفعيل المسافات إذا كان الحرف ليس تشكلًا.
                        // Enable spacing the letter is not Tashkil.
                        ignoreSpace = false;
                    }

                    newStr += str[i];
                }
            }

            bcc = cc;
        }

        return this.SeparateLamAlef(newStr);
    },

    /**
     * تستبدل اللام و الألف المدمجتين بما يقابلهما من حرفين.
     * Replaces combined Lam and Alef with their corresponding letters.
     *
     * @param {string} str
     * @return {string}
     */
    SeparateLamAlef: function (str) {
        const len = str.length;
        let newStr = "";

        for (let i = 0; i < len; i++) {
            const cc = str.charCodeAt(i);

            switch (cc) {
                case this.LettersTable.LamAlefCombined:
                {
                    newStr += String.fromCharCode(this.LettersTable.Lam);
                    newStr += String.fromCharCode(this.LettersTable.Alef);
                    break;
                }

                case this.LettersTable.LamAlefMaddaAboveCombined:
                {
                    newStr += String.fromCharCode(this.LettersTable.Lam);
                    newStr += String.fromCharCode(this.LettersTable.AlefMaddaAbove);
                    break;
                }

                case this.LettersTable.LamAlefHamzaAboveCombined:
                {
                    newStr += String.fromCharCode(this.LettersTable.Lam);
                    newStr += String.fromCharCode(this.LettersTable.AlefHamzaAbove);
                    break;
                }

                case this.LettersTable.LamAlefHamzaBelowCombined:
                {
                    newStr += String.fromCharCode(this.LettersTable.Lam);
                    newStr += String.fromCharCode(this.LettersTable.AlefHamzaBelow);
                    break;
                }

                default:
                    newStr += str[i];
                    break;
            }
        }

        return newStr;
    },

    /**
     * تستبدل جميع الهمزات المقترنة بألف أو المنفردة بألف
     * وتستبدل الهمزة التي على الواو والياء بهمزة على السطر.
     * Uses Alef to replaces all Hamzas that are paired with Alef,
     * and uses single Hamza (Hamza on line) to replace any Waw or
     * Yah with HamzaAbove.
     *
     * @param {string} str
     * @return {string}
     */
    UnifyHamzas: function (str) {
        const len = str.length;
        let newStr = "";

        for (let i = 0; i < len; i++) {
            const cc = str.charCodeAt(i);

            switch (cc) {
                case this.LettersTable.AlefMaddaAbove:
                case this.LettersTable.AlefHamzaAbove:
                case this.LettersTable.AlefHamzaBelow:
                case this.LettersTable.MaddaAbove:
                case this.LettersTable.HamzaAbove:
                case this.LettersTable.HamzaBelow:
                    newStr += String.fromCharCode(this.LettersTable.Alef);
                    break;

                case this.LettersTable.WawHamzaAbove:
                case this.LettersTable.YehHamzaAbove:
                    newStr += String.fromCharCode(this.LettersTable.Hamza);
                    break;

                default:
                    newStr += str[i];
                    break;
            }
        }

        return newStr;
    },

    /**
     * تستبدل التاء المربوطة بهاء، والألف المقصورة بياء (أخطاء إملائية شائعة).
     * Replaces Teh Marbuta (ة) with Heh (ه), and Alef Maksura (ى) with Yeh (ي); common misspellings.
     *
     * @param {string} str
     * @return {string}
     */
    UnifyTehMarbutaAlefMaksura: function (str) {
        const len = str.length;
        let newStr = "";

        for (let i = 0; i < len; i++) {
            const cc = str.charCodeAt(i);

            switch (cc) {
                case this.LettersTable.TehMarbuta:
                    newStr += String.fromCharCode(this.LettersTable.Heh);
                    break;

                case this.LettersTable.AlefMaksura:
                    newStr += String.fromCharCode(this.LettersTable.Yeh);
                    break;

                default:
                    newStr += str[i];
                    break;
            }
        }

        return newStr;
    },

    /**
     * تستخدم عددًا من الدوال لتبسيط النص لغرض تسهيل البحث.
     * Uses a few functions to Simplify text for the purpose of easing search.
     *
     * @param {string} str
     * @return {string}
     */
    SimplifyText: function (str) {
        str = this.RemoveTatweel(str, false);
        str = this.RemoveTashkil(str);
        str = this.SeparateLamAlef(str);
        str = this.UnifyHamzas(str);
        return this.UnifyTehMarbutaAlefMaksura(str);
    },

    // /**
    //  * تأخذ نص وتعيد أحرف الكلمات منفصلة عن بعضها.
    //  * Takes string and return words' letters in disconnected form.
    //  *
    //  * @param {string} str
    //  * @return {string}
    //  */
    // DisconnectChars: function (str) {
    //     const len = str.length;
    //     let newStr = "";

    //     /**
    //      * (UTF-16BE: dec) الحروف العربية في جدول الينيكود هي بين 1569 إلى 1610 حسب الترميز.
    //      * Arabic Alphabet in the Unicode table are between 1569 -> 1610 (UTF-16BE: dec).
    //      */
    //     for (let i = 0; i < len; i++) {
    //         const cc = str.charCodeAt(i);

    //         if ((cc >= this.LettersTable.Hamza) && (cc <= this.LettersTable.Yeh)) {
    //             // بحكم أن المصفوفة تبدأ من العدد 0، يطرح 1569 من رقم الحرف؛ للوصول إلى هيئة الحرف المستقلة.
    //             // Because arrays starts from 0, subtract 1569 from char code; to match the index of isolated form.
    //             if (cc !== this.LettersTable.Tatweel) { // تخطي التطويل.
    //                 newStr += String.fromCharCode(this.IsolatedForms[(cc - this.LettersTable.Hamza)]);
    //             }
    //         } else {
    //             newStr += str[i];
    //         }
    //     }

    //     return newStr;
    // },

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
             * Arabic Tashkil letters are from 1611 to 1618.
             */
            if ((cc >= this.LettersTable.Hamza) && (cc <= this.LettersTable.Sukun)) {
                let hasShadda = false;
                let harakhChar = 0;
                let y = (i + 1);

                while (y < len) {
                    const ncc = str.charCodeAt(y);
                    if ((ncc >= this.LettersTable.Fathatan) && (ncc <= this.LettersTable.Sukun)) {
                        hasTashkil = true;

                        if (ncc !== this.LettersTable.Shadda) {
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
                        case this.LettersTable.Fathatan: //  ً Arabic Fathatan فتحتان.
                            code = 97; // a
                            break;

                        case this.LettersTable.Dammatan: //  ٌ Arabic Dammatan ضمتان.
                            code = 98; // b
                            break;

                        case this.LettersTable.Kasratan: //  ٍ Arabic Kasratan كسرتان.
                            code = 99; // c
                            break;

                        case this.LettersTable.Fatha: //  َ Arabic Fatha فَتحة.
                            code = 100; // d
                            break;

                        case this.LettersTable.Damma: //  ُ Arabic Damma ضمة.
                            code = 101; // e
                            break;

                        case this.LettersTable.Kasra: //  ِ Arabic Kasra كسرة.
                            code = 102; // f
                            break;

                        case this.LettersTable.Sukun: //  ْ Arabic Sukun سكون.
                            code = 103; // g
                            break;

                        default:
                    }

                    if (code !== 0) {
                        if (hasShadda && (code !== this.LettersTable.Sukun)) {
                            // 32 (A و a) عدد الحروف بين.
                            // 32 Number of letters between A and a.
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

    LettersTable: {
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
        AlefMaddaAbove: 1570, // آ Arabic Letter Alef with Madda above ألف فوقها مدة.
        AlefHamzaAbove: 1571, // أ Arabic Letter Alef with Hamza above ألف فوقها همزة.
        WawHamzaAbove: 1572, // ا Arabic Letter Waw with Hamza above واو فوقها همزة.
        AlefHamzaBelow: 1573, // إ Arabic Letter Alef with Hamza below ألف تحتها همزة.
        YehHamzaAbove: 1574, // ئ Arabic Letter Yeh with Hamza Above ياء فقوها همزة.
        Alef: 1575, // ا Arabic Letter Alef ألف بلا همزة.
        TehMarbuta: 1577, // ة Arabic Letter Teh Marbuta تاء مربوطة.
        Tatweel: 1600, // ـ Arabic Tatweel حرف التطويل.
        Lam: 1604, // ل Arabic Letter Lam لام.
        Heh: 1607, // ه Arabic Letter Heh هاء.
        Waw: 1608, // و Arabic Letter Waw واو.
        AlefMaksura: 1609, // ى Arabic Letter Alef Maksura ألف مكسورة.
        Yeh: 1610, // ي Arabic Letter Yeh ياء.
        Fathatan: 1611, //  ً Arabic Fathatan فتحتان.
        Dammatan: 1612, //  ٌ Arabic Dammatan ضمتان.
        Kasratan: 1613, //  ٍ Arabic Kasratan كسرتان.
        Fatha: 1614, //  َ Arabic Fatha فَتحة.
        Damma: 1615, //  ُ Arabic Damma ضمة.
        Kasra: 1616, //  ِ Arabic Kasra كسرة.
        Shadda: 1617, //  ّ Arabic Shadda شدّة.
        Sukun: 1618, //  ْ Arabic Sukun سكون.
        MaddaAbove: 1619, //  ٓ Arabic Madda Above مدة علوية.
        HamzaAbove: 1620, //  ٔ Arabic Hamza Above همزة علوية.
        HamzaBelow: 1621, //  ٕ Arabic Hamza Below همزة سفلية.
        LamAlefCombined: 65275, // ﻻ Arabic Letter Lam with Alef (combined Form) لام مدمجة مع ألف.
        LamAlefMaddaAboveCombined: 65269, // ﻵ Arabic Letter Lam with Alef with Madda Above (combined Form) لام مدمجة مع ألف فوقها مدة.
        LamAlefHamzaAboveCombined: 65271, // ﻷ Arabic Letter Lam with Alef with Hamza Above (combined Form) لام مدمجة مع ألف فوقها همزة.
        LamAlefHamzaBelowCombined: 65273, // ﻹ Arabic Letter Lam with Alef with Hamza Below (combined Form) لام مدمجة مع ألف فوقها همزة.
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
