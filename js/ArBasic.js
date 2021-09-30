/**
 * @Name Arabic library for JavaScript v0.0.1
 * @Source https://github.com/hani-ammar/JSArabicLib
 * @Copyright 2021 Taha Zerrouki, Hani Ammar, and other contributors
 * @License MIT license https://opensource.org/licenses/MIT
 */

export const ArBasic = {
    /**
     * تأخذ نص وتعيد الكلمات دون تشكيل.
     * كما تأخذ قيمة اختبارية تحدد الاحتفاظ بالشدة من عدمه.
     * Takes string and returns every word without Tashkil.
     * It also takes an optional boolean to keep Shadda or not.
     *
     * @param {string} str
     * @param {boolean} [keepShadda = false]
     * @returns {string}
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
            if (((cc < this.CharacterTable.Fathatan) || (cc > this.CharacterTable.Sukun)) ||
                 (keepShadda && (cc === this.CharacterTable.Shadda))) {
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
     * @returns {boolean}
     */
    CheckLastTashkilForRemoval: function (cc, bcc) {
        if ((cc < this.CharacterTable.Hamza) || (cc > this.CharacterTable.HamzaBelow)) {
            // الرجوع بنعم إذا كان الحرف الحالي ليس عربيًا، وكان السابق ليس من الحركات.
            // Return true if the current letter is not an Arabic one, and the previous one is not Tashkil.
            return ((bcc < this.CharacterTable.Fathatan) || (bcc === this.CharacterTable.Shadda));
        }

        // التنوين لا يكون إلا لآخر حرف في الكلمة، وهذا الشرط يمرر أي حرف غيره.
        // This condition will make sure that no Tanween is passed, since Tanween is only for the last char ً ٍ ٌ.
        return ((bcc < this.CharacterTable.Fathatan) || (bcc > this.CharacterTable.Kasratan));
    },

    /**
     * تعود بلا إذا كان التشكيل ليس آخر الكلمة.
     * It returns false if Tashkil is not at the end of the word.
     *
     * @param {number} cc
     * @param {number} bcc
     * @returns {boolean}
     */
    CheckLastTashkilForKeeping: function (cc, bcc) {
        return ((cc < this.CharacterTable.Hamza) ||
                (cc > this.CharacterTable.HamzaBelow) ||
                (bcc < this.CharacterTable.Fatha) ||
                (bcc === this.CharacterTable.Shadda));
    },

    /**
     * تزيل التشكيل الأخير لجميع الكلمات في نص معطى في حال كان المتغير الثاني remove قيمته true,
     * عدا ذلك فإنها تبقي التشكيل الأخير للكلمات.
     * It removes the last Tashkil for every word in a given string if “remove” is set to true,
     * otherwise if keeps only the last Tashkil.
     *
     * @param {string} str
     * @param {boolean} [remove = true]
     * @returns {string}
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
     * @returns {string}
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
                case this.CharacterTable.Fatha: //  َ Fatha فَتحة.
                {
                    // إضافة الفَتحة فقط إذا كانت في آخر الكلمة، أو على واو أو بعدها واو،
                    // أو على ياء أو بعدها ياء، والواو بهمزة أو بدونها: فقط في حال لم يكن بعد الفتحة ألفٌ.
                    // أو كان الواو و الياء في بداية الكلمة.
                    // Add Fatha only if at the end of a word, or on Waw or what's after it is Waw,
                    // or on Yeh or what's after it is Yeh, and Waw is with Hamza or without:
                    // Only if there is not Alef after it, or Waw Yeh are not at the start of a word.
                    if ((ncc < this.CharacterTable.Hamza) || (ncc > this.CharacterTable.HamzaBelow)) {
                        newStr += str[i];
                    } else if (i > 1) {
                        switch (bcc) {
                            case this.CharacterTable.Waw:
                            case this.CharacterTable.WawHamzaAbove:
                            case this.CharacterTable.Yeh:
                            {
                                const bbcc = str.charCodeAt(i - 2);

                                if (((bbcc >= this.CharacterTable.Hamza) && (bbcc <= this.CharacterTable.HamzaBelow)) &&
                                     (ncc !== this.CharacterTable.Alef) && (ncc !== this.CharacterTable.AlefHamzaAbove)) {
                                    newStr += str[i];
                                }

                                break;
                            }

                            default: {
                                switch (ncc) {
                                    case this.CharacterTable.Waw:
                                    case this.CharacterTable.WawHamzaAbove:
                                    case this.CharacterTable.Yeh:
                                        if ((bcc !== this.CharacterTable.Alef) && (bcc !== this.CharacterTable.AlefHamzaAbove)) {
                                            newStr += str[i];
                                        }
                                        break;
                                    default:
                                }
                            }
                        }
                    }

                    break;
                }

                case this.CharacterTable.Damma: //  ُ Damma ضمة.
                {
                    // إضافة الضمة في حالة لم تكن على واو أو بعدها واو, أو في آخر الكلمة.
                    // Add Damma if it's not on Waw or there is Waw after it, or at the end of a word.
                    if ((ncc < this.CharacterTable.Hamza) || (ncc > this.CharacterTable.HamzaBelow) ||
                        ((bcc !== this.CharacterTable.Waw) && (bcc !== this.CharacterTable.WawHamzaAbove) &&
                        (ncc !== this.CharacterTable.Waw) && (ncc !== this.CharacterTable.WawHamzaAbove))) {
                        newStr += str[i];
                    }

                    break;
                }

                case this.CharacterTable.Kasra: //  ِ Kasra كسرة.
                {
                    // إضافة الكسرة إن لم تكن على ياء أو بعدها ياء، أو على همزة على ياء،
                    // أو لم تكن تحت ألف همزتها تحت.
                    // Add Kasra if it's not under Yeh or Yeh is not after it,
                    // or under Yeh with Hamza above it, or not under Alef with Hamza Below it.
                    if ((bcc === this.CharacterTable.Alef) || ((bcc !== this.CharacterTable.Yeh) && (bcc !== this.CharacterTable.AlefHamzaBelow) &&
                        (bcc !== this.CharacterTable.YehHamzaAbove) &&
                        (ncc !== this.CharacterTable.Yeh))) {
                        newStr += str[i];
                    }

                    break;
                }

                case this.CharacterTable.Shadda:
                {
                    // Kepp Shadda الإبقاء على الشدة.
                    newStr += str[i];
                    break;
                }

                case this.CharacterTable.Sukun:
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
     * @returns {string}
     */
    RemoveTatweel: function (str) {
        const len = str.length;
        let newStr = "";

        for (let i = 0; i < len; i++) {
            if (str.charCodeAt(i) !== this.CharacterTable.Tatweel) {
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
     * @returns {string}
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
                case this.CharacterTable.Space:
                case 9: // tab
                {
                    // تخطي المسافات المكررة.
                    // Skip duplicate spaces.
                    if (!(ignoreSpace) && (bcc !== this.CharacterTable.Space)) {
                        insertSpace = true;
                    }

                    break;
                }

                case this.CharacterTable.ArabicComma: // ، Arabic Comma فاصلة عربية.
                case this.CharacterTable.Comma: // , Latin Comma فاصلة أعجمية.
                {
                    // استبدال الفاصلة الأعجمية بالعربية.
                    // Replace Latin Comma with Arabic Comma.
                    newStr += String.fromCharCode(this.CharacterTable.ArabicComma);
                    insertSpace = true;
                    break;
                }

                case this.CharacterTable.Solidus: // / Solidus شرطة.
                case this.CharacterTable.ReverseSolidus: // \ Reverse Solidus شرطة معكوسة.
                {
                    // استبدال الشرطة المعكوسة بشرطة عادية، مع إزالة المسافات التي قبلها وبعدها.
                    // Replace Reverse Solidus with Solidus, and remove any spaces before or after it.
                    newStr += String.fromCharCode(this.CharacterTable.Solidus);
                    insertSpace = false;
                    ignoreSpace = true;
                    break;
                }

                case this.CharacterTable.LeftParenthesis: // ( Left Parenthesis بداية القوس.
                case this.CharacterTable.LeftSquareParenthesis: // [ Left Square Parenthesis بداية القوس المربع.
                case this.CharacterTable.LeftCurlyBracket: // { Left Curly Bracket بداية القوس المجعد.
                {
                    // إضافة مسافة قبل الأقواس.
                    // Add space before ( { [.
                    if (!(ignoreSpace)) {
                        newStr += String.fromCharCode(this.CharacterTable.Space);
                    }

                    newStr += str[i];
                    insertSpace = false;
                    ignoreSpace = true;
                    break;
                }

                case this.CharacterTable.RightParenthesis: // ) Right Parenthesis نهاية القوس.
                case this.CharacterTable.RightSquareParenthesis: // ] Right Square Parenthesis نهاية القوس المربع.
                case this.CharacterTable.RightCurlyBracket: // } Right Curly Bracket نهاية القوس المجعد.
                {
                    newStr += str[i];
                    // إضافة مسافة بعد الأقواس.
                    // Add space after ( { [.
                    insertSpace = true;
                    break;
                }

                case this.CharacterTable.ArabicSemicolon: // ؛ Arabic Semicolon فاصلة منقوطة عربية.
                case this.CharacterTable.Semicolon: // ; Latin Semicolon فاصلة منقوطة أعجمية.
                {
                    // استبدال الفاصلة المنقوطة الأعجمية بالعربية.
                    // Replace Latin Semicolon with Arabic Semicolon.
                    newStr += String.fromCharCode(this.CharacterTable.ArabicSemicolon);
                    insertSpace = true;
                    break;
                }

                case this.CharacterTable.ArabicQuestionMark: // ؟ Arabic Question Mark علامة استفهام عربية.
                case this.CharacterTable.QuestionMark: // ? Latin Question Mark علامة استفهام أعجمية.
                {
                    // استبدال علامة الاستفهام الأعجمية بالعربية.
                    // Replace Latin Question Mark with Arabic Question Mark.
                    newStr += String.fromCharCode(this.CharacterTable.ArabicQuestionMark);
                    insertSpace = true;
                    break;
                }

                case this.CharacterTable.QuotationMark: // " Quotation Mark علامة افتباس عادية.
                case this.CharacterTable.QuotationMarkLeftDouble: // “ Left Double Quotation Mark بداية الاقتباس الأعجمي.
                case this.CharacterTable.QuotationMarkRightDouble: // ” Right Double Quotation Mark نهاية الاقتباس الأعجمي.
                {
                    if (!quotatStart) {
                        // إضافة مسافة في بداية أي اقتباس.
                        // Add a space before the start of any quote.
                        newStr += String.fromCharCode(this.CharacterTable.Space);
                    }

                    // منع إضافة مسافة بعد بداية الاقتباس.
                    // Prevent adding space after quote start.
                    insertSpace = quotatStart;
                    quotatStart = !(quotatStart);
                    ignoreSpace = quotatStart;

                    // استبدال علامات الاقتباس الأعجمي بعلامة الاقتباس العادي.
                    // 34 = " Quotation Mark.
                    newStr += String.fromCharCode(this.CharacterTable.QuotationMark);

                    break;
                }

                // نقل الفتحتين إلى ما قبل الألف.
                // Move Fathatan to the letter that is before Alef.
                case this.CharacterTable.Alef:
                {
                    const s = str[i];

                    // إذا كانت هناك مسافة قبل الألف، فإن الألف في بداية الكلمة.
                    // If "insertSpace" is true, then Alef is at the start of a word.
                    if (!(insertSpace)) {
                        const y = (i + 1);

                        if ((y < len) && (str.charCodeAt(y) === this.CharacterTable.Fathatan)) {
                            newStr += String.fromCharCode(this.CharacterTable.Fathatan);
                            ++i;
                        }

                        // إعادة تعيين تجاهل المسافة فيما لو كانت الألف في بداية الكلام.
                        // Reset ignoreSpace if Alef it at the start.
                        // "لإصلاح مشكلة عند تحسين الجملة: "واو أو ياء.
                        ignoreSpace = false;
                    } else if (!(ignoreSpace)) {
                        newStr += String.fromCharCode(this.CharacterTable.Space);
                        insertSpace = false;
                    }

                    newStr += s;
                    break;
                }

                // تخطي التطويل.
                // ـ Skip Tatweel.
                case this.CharacterTable.Tatweel:
                {
                    let y = (i + 1);
                    let keepTatweel = false;

                    while (y < len) {
                        const ncc = str.charCodeAt(y);

                        // عدم إزالة المدة إذا كانت آخر الكلمة.
                        // Don't remove Tatweel if it's at the end of the word.
                        if (ncc !== this.CharacterTable.Tatweel) {
                            if ((ncc < this.CharacterTable.Hamza) || (ncc > this.CharacterTable.HamzaBelow)) {
                                keepTatweel = true;
                            }

                            break;
                        }

                        ++y;
                    }

                    // تقدم إلى آخر تطويل.
                    // Advanced to last Tatweel.
                    i = (y - 1);

                    if (keepTatweel) {
                        newStr += String.fromCharCode(this.CharacterTable.Tatweel);
                    }

                    break;
                }

                case this.CharacterTable.Dot: // . Dot نقطة.
                {
                    let y = (i + 1);
                    let repeatedDots = false;

                    // التحقق من النقاط المتكررة
                    // Checking for repeated dots.
                    while (y < len) {
                        const ncc = str.charCodeAt(y);

                        if (ncc !== this.CharacterTable.Space) {
                            if (ncc !== this.CharacterTable.Dot) {
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
                        if ((bcc !== this.CharacterTable.QuotationMark) &&
                            (bcc !== this.CharacterTable.QuotationMarkLeftDouble) &&
                            (bcc !== this.CharacterTable.QuotationMarkRightDouble)) {
                            newStr += String.fromCharCode(this.CharacterTable.Space);
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

                case this.CharacterTable.Colon: // : Colon نقطتان فوق بعص.
                {
                    newStr += str[i];
                    insertSpace = true;
                    break;
                }

                case this.CharacterTable.Waw: // و Waw حرف الواو.
                {
                    // تخطي المسافات بعد واو العطف.
                    // Skip spaces after Waw that behaves like "and".
                    if (insertSpace) {
                        newStr += String.fromCharCode(this.CharacterTable.Space);
                        ignoreSpace = true;
                        insertSpace = false;
                    }

                    newStr += str[i];
                    break;
                }

                default:
                {
                    if (insertSpace) {
                        if (((i + 1) !== str.length) &&
                            ((bcc !== this.CharacterTable.QuotationMark) &&
                             (cc !== this.CharacterTable.ExclamationMark))) {
                            // عدم إضافة مسافة بين علامة التعجب والاستفهام.
                            // Don't add space between ! and ?.
                            newStr += String.fromCharCode(this.CharacterTable.Space);
                        }

                        insertSpace = false;
                    }

                    if ((cc < this.CharacterTable.Fathatan) || (cc > this.CharacterTable.Sukun)) {
                        // تفعيل المسافات إذا كان الحرف ليس من الحركات.
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
     * @returns {string}
     */
    SeparateLamAlef: function (str) {
        const len = str.length;
        let newStr = "";

        for (let i = 0; i < len; i++) {
            const cc = str.charCodeAt(i);

            switch (cc) {
                case this.CharacterTable.LamAlefCombined:
                {
                    newStr += String.fromCharCode(this.CharacterTable.Lam);
                    newStr += String.fromCharCode(this.CharacterTable.Alef);
                    break;
                }

                case this.CharacterTable.LamAlefMaddaAboveCombined:
                {
                    newStr += String.fromCharCode(this.CharacterTable.Lam);
                    newStr += String.fromCharCode(this.CharacterTable.AlefMaddaAbove);
                    break;
                }

                case this.CharacterTable.LamAlefHamzaAboveCombined:
                {
                    newStr += String.fromCharCode(this.CharacterTable.Lam);
                    newStr += String.fromCharCode(this.CharacterTable.AlefHamzaAbove);
                    break;
                }

                case this.CharacterTable.LamAlefHamzaBelowCombined:
                {
                    newStr += String.fromCharCode(this.CharacterTable.Lam);
                    newStr += String.fromCharCode(this.CharacterTable.AlefHamzaBelow);
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
     * تستبدل التاء المربوطة بهاء، والألف المقصورة بياء (أخطاء إملائية شائعة).
     * كما تستبدل جميع الهمزات المقترنة بألف أو المنفردة بألف
     * وتستبدل الهمزة التي على الواو والياء بهمزة على السطر.
     * Replaces Teh Marbuta (ة) with Heh (ه), and Alef Maksura (ى) with Yeh (ي); common misspellings.
     * Also, Uses Alef to replaces all Hamzas that are paired with Alef,
     * and uses single Hamza (Hamza on line) to replace any Waw or
     * Yah with HamzaAbove.
     * @param {string} str
     * @returns {string}
     */
    UnifyLetters: function (str) {
        const len = str.length;
        let newStr = "";

        for (let i = 0; i < len; i++) {
            const cc = str.charCodeAt(i);

            switch (cc) {
                case this.CharacterTable.TehMarbuta:
                    newStr += String.fromCharCode(this.CharacterTable.Heh);
                    break;

                case this.CharacterTable.AlefMaksura:
                    newStr += String.fromCharCode(this.CharacterTable.Yeh);
                    break;

                case this.CharacterTable.AlefMaddaAbove:
                case this.CharacterTable.AlefHamzaAbove:
                case this.CharacterTable.AlefHamzaBelow:
                case this.CharacterTable.MaddaAbove:
                case this.CharacterTable.HamzaAbove:
                case this.CharacterTable.HamzaBelow:
                    newStr += String.fromCharCode(this.CharacterTable.Alef);
                    break;

                case this.CharacterTable.WawHamzaAbove:
                case this.CharacterTable.YehHamzaAbove:
                    newStr += String.fromCharCode(this.CharacterTable.Hamza);
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
     * @returns {string}
     */
    SimplifyText: function (str) {
        str = this.RemoveTatweel(str, false);
        str = this.RemoveTashkil(str);
        str = this.SeparateLamAlef(str);
        return this.UnifyLetters(str);
    },

    // /**
    //  * تأخذ نص وتعيد أحرف الكلمات منفصلة عن بعضها.
    //  * Takes string and return words' letters in disconnected form.
    //  *
    //  * @param {string} str
    //  * @returns {string}
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

    //         if ((cc >= this.CharacterTable.Hamza) && (cc <= this.CharacterTable.Yeh)) {
    //             // بحكم أن المصفوفة تبدأ من العدد 0، يطرح 1569 من رقم الحرف؛ للوصول إلى هيئة الحرف المستقلة.
    //             // Because arrays starts from 0, subtract 1569 from char code; to match the index of isolated form.
    //             if (cc !== this.CharacterTable.Tatweel) { // تخطي التطويل.
    //                 newStr += String.fromCharCode(this.IsolatedForms[(cc - this.CharacterTable.Hamza)]);
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
     * @returns {object} {EncodeTashkil: string, StrippedText: string}
     */
    EncodeTashkil: function (str) {
        const len = str.length;
        let isTashkil = false;
        let tCode = "";

        for (let i = 0; i < len; i++) {
            const cc = str.charCodeAt(i);

            /**
             * (UTF-16BE: dec) الحروف العربية في جدول الينيكود هي بين 1569 إلى 1610 حسب الترميز.
             * Arabic Alphabet in the Unicode table are between 1569 -> 1610 (UTF-16BE: dec).
             * الحروف المستخدمة في التشكيل هي من 1611 إلى 1618.
             * Arabic Tashkil letters are from 1611 to 1618.
             */
            if ((cc >= this.CharacterTable.Hamza) && (cc <= this.CharacterTable.HamzaBelow)) {
                let hasShadda = false;
                let harakhChar = 0;
                let y = (i + 1);

                while (y < len) {
                    const ncc = str.charCodeAt(y);

                    if ((ncc >= this.CharacterTable.Fathatan) && (ncc <= this.CharacterTable.Sukun)) {
                        isTashkil = true;

                        if (ncc !== this.CharacterTable.Shadda) {
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

                if (isTashkil) {
                    let code = 0;

                    switch (harakhChar) {
                        case this.CharacterTable.Fathatan: //  ً Arabic Fathatan فتحتان.
                            code = 97; // a
                            break;

                        case this.CharacterTable.Dammatan: //  ٌ Arabic Dammatan ضمتان.
                            code = 98; // b
                            break;

                        case this.CharacterTable.Kasratan: //  ٍ Arabic Kasratan كسرتان.
                            code = 99; // c
                            break;

                        case this.CharacterTable.Fatha: //  َ Arabic Fatha فَتحة.
                            code = 100; // d
                            break;

                        case this.CharacterTable.Damma: //  ُ Arabic Damma ضمة.
                            code = 101; // e
                            break;

                        case this.CharacterTable.Kasra: //  ِ Arabic Kasra كسرة.
                            code = 102; // f
                            break;

                        case this.CharacterTable.Sukun: //  ْ Arabic Sukun سكون.
                            code = 103; // g
                            break;

                        default:
                    }

                    if (code !== 0) {
                        if (hasShadda && (code !== this.CharacterTable.Sukun)) {
                            // 32 (A و a) عدد الحروف بين.
                            // 32 Number of letters between A and a.
                            code -= 32;
                        }
                    } else if (hasShadda) {
                        code = 87; // W
                    }

                    tCode += String.fromCharCode(code);
                }
            }

            if (!isTashkil) {
                tCode += "0";
            }

            isTashkil = false;
        }

        return { EncodedTashkil: tCode, StrippedText: this.RemoveTashkil(str, false) };
    },

    CharacterTable: {
        Space: 32, // Space مسافة.
        ExclamationMark: 33, // ! Exclamation Mark علامة تعجب.
        QuotationMark: 34, // " Quotation Mark علامة افتباس عادية.
        LeftParenthesis: 40, // ( Left Parenthesis بداية القوس.
        RightParenthesis: 41, // ) Right Parenthesis نهاية القوس.
        Dot: 46, // . Dot نقطة.
        Solidus: 47, // / Solidus شرطة.
        Comma: 44, // , Latin Comma فاصلة أعجمية.
        Colon: 58, // : Colon نقطتان فوق بعص.
        Semicolon: 59, // ; Latin Semicolon فاصلة منقوطة أعجمية.
        QuestionMark: 63, // ? Latin Question Mark علامة استفهام أعجمية.
        LeftSquareParenthesis: 91, // [ Left Square Parenthesis بداية القوس المربع.
        ReverseSolidus: 92, // \ Reverse Solidus شرطة معكوسة.
        RightSquareParenthesis: 93, // ] Right Square Parenthesis نهاية القوس المربع.
        LeftCurlyBracket: 123, // { Left Curly Bracket بداية القوس المجعد.
        RightCurlyBracket: 125, // } Right Curly Bracket نهاية القوس المجعد.
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
