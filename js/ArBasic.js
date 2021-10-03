/**
 * @Name Arabic library for JavaScript v0.0.1
 * @Source https://github.com/hani-ammar/JSArabicLib
 * @Copyright 2021 Hani Ammar, Taha Zerrouki, and other contributors
 * @License MIT license https://opensource.org/licenses/MIT
 */

export const ArBasic = {
    /**
     * تحذف التطويل من الكلمات.
     * Removes Tatweel form words ـ .
     * @param {string} str
     * @returns {string}
     */
    RemoveTatweel: function (str) {
        return str.replaceAll(this.CharacterTable.Tatweel, "");
    },

    /**
     * تأخذ نص وتعيد الكلمات دون تشكيل.
     * كما تأخذ قيمة اختبارية تحدد الاحتفاظ بالشدة من عدمه.
     * Takes string and returns every word without Tashkil.
     * It also takes an optional boolean to keep Shadda or not.
     * @param {string} str
     * @param {boolean} [keepShadda=false]
     * @returns {string}
     */
    RemoveTashkil: function (str, keepShadda = false) {
        let tashkil =
            this.CharacterTable.Fathatan +
            this.CharacterTable.Dammatan +
            this.CharacterTable.Kasratan +
            this.CharacterTable.Fatha +
            this.CharacterTable.Damma +
            this.CharacterTable.Kasra +
            this.CharacterTable.Sukun;

        if (!(keepShadda)) {
            tashkil += this.CharacterTable.Shadda;
        }

        return str.replaceAll(new RegExp(tashkil.split("").join("|"), "g"), "");
    },

    /**
     * حذف التشكيل الواضح نطقه.
     * Removes Tashkil if it's obvious to pronounce.
     * @param {string} str
     * @returns {string}
     */
    ReduceTashkil: function (str) {
        const len = (str.length - 1);
        let newStr = "";

        if (len < 3) {
            // يجب أن يكون طول النص 3 أحرف كحدٍ أقل.
            // String has to be at least 3 characters in length.
            return str;
        }

        let bcc = str[0]; // Previous letter الحرف السابق.
        let cc = str[1]; // Current char الحرف الحالي.
        newStr += bcc;

        for (let i = 1, y = 2; i < len; i++, y++) {
            const ncc = str[y]; // Next char الحرف التالي.

            switch (cc) {
                case this.CharacterTable.Fatha: //  َ Fatha فَتحة.
                {
                    // إضافة الفَتحة فقط إذا كانت في آخر الكلمة، أو على واو أو بعدها واو،
                    // أو على ياء أو بعدها ياء، والواو بهمزة أو بدونها: فقط في حال لم يكن بعد الفتحة ألفٌ.
                    // أو كان الواو و الياء في بداية الكلمة.
                    // Add Fatha only if at the end of a word, or on Waw or what's after it is Waw,
                    // or on Yeh or what's after it is Yeh, and Waw is with Hamza or without:
                    // Only if there is no Alef after it, or Waw Yeh are not at the start of a word.
                    if ((ncc < this.CharacterTable.Hamza) || (ncc > this.CharacterTable.HamzaBelow)) {
                        // نهاية الكلمة
                        // At the end of a word.
                        newStr += str[i];
                    } else {
                        switch (bcc) {
                            case this.CharacterTable.Waw:
                            case this.CharacterTable.WawHamzaAbove:
                            case this.CharacterTable.Yeh:
                            {
                                // إذا كانت الفتحة على واو أو واو عليها همزة،
                                // أو ياء، أضف الفتحة إن لم يكن بعدها ألف بجميع أشكالها.
                                // If the letter is Waw or Waw with Hamza above, or Yeh,
                                // add Fatha unless there is no type of Alef after it.
                                if (i > 1) {
                                    const bbcc = str[i - 2];

                                    if ((bbcc >= this.CharacterTable.Hamza) && (bbcc <= this.CharacterTable.HamzaBelow) &&
                                        (ncc !== this.CharacterTable.Alef) && (ncc !== this.CharacterTable.AlefHamzaAbove) &&
                                        (ncc !== this.CharacterTable.AlefHamzaBelow) && (ncc !== this.CharacterTable.AlefMaddaAbove)) {
                                        newStr += str[i];
                                    }
                                }

                                break;
                            }

                            default: {
                                switch (ncc) {
                                    case this.CharacterTable.Waw:
                                    case this.CharacterTable.WawHamzaAbove:
                                    case this.CharacterTable.Yeh:
                                    {
                                        // إذا كان الحرف التالي هو واو أو واو عليها همزة، أو ياء،
                                        // أضف الفتحة ما لم تكن على ألف بجميع أشكالها
                                        // If the next letter is Waw or Waw with Hamza above, or Yeh,
                                        // add Fatha unless it's not on any type of Alef after it.
                                        if ((bcc !== this.CharacterTable.Alef) && (bcc !== this.CharacterTable.AlefHamzaAbove) &&
                                            (bcc !== this.CharacterTable.AlefHamzaBelow) && (bcc !== this.CharacterTable.AlefMaddaAbove)) {
                                            newStr += str[i];
                                        }

                                        break;
                                    }
                                    default:
                                }
                            }
                        }
                    }

                    break;
                }

                case this.CharacterTable.Damma: //  ُ Damma ضمة.
                {
                    // إضافة الضمة في حالة لم تكن على واو أو بعدها واو, أو في آخر الكلمة، أو بداية الكلام.
                    // Add Damma if it's not on Waw or there is Waw after it, or at the end of a word, or at the start of it.
                    if ((ncc < this.CharacterTable.Hamza) || (ncc > this.CharacterTable.HamzaBelow) ||
                        ((bcc !== this.CharacterTable.Waw) && (bcc !== this.CharacterTable.WawHamzaAbove) &&
                        (ncc !== this.CharacterTable.Waw) && (ncc !== this.CharacterTable.WawHamzaAbove))) {
                        newStr += str[i];
                    } else {
                        if (i > 1) {
                            const bbcc = str[i - 2];

                            if ((bbcc < this.CharacterTable.Hamza) || (bbcc > this.CharacterTable.HamzaBelow)) {
                                newStr += str[i];
                            }
                        } else {
                            newStr += str[i];
                        }
                    }

                    break;
                }

                case this.CharacterTable.Kasra: //  ِ Kasra كسرة.
                {
                    // إضافة الكسرة إن لم تكن على ياء أو بعدها ياء، أو على همزة على ياء،
                    // أو لم تكن تحت ألف همزتهاأسفلها, أو أنها تحت ألف بلا همزة, أو في نهاية الكلمة.
                    // Add Kasra if it's not under Yeh or Yeh is not after it,
                    // or under Yeh with Hamza above it, or not under Alef with Hamza Below it,
                    // or the Kasra is under Alef without any type of Hamza, or at the end of a word.
                    if ((bcc === this.CharacterTable.Alef) ||
                        (ncc < this.CharacterTable.Hamza) || (ncc > this.CharacterTable.HamzaBelow) ||
                        ((bcc !== this.CharacterTable.Yeh) && (bcc !== this.CharacterTable.YehHamzaAbove) &&
                         (bcc !== this.CharacterTable.AlefHamzaBelow) &&
                         (ncc !== this.CharacterTable.Yeh))) {
                        newStr += str[i];
                    } else {
                        if (i > 1) {
                            const bbcc = str[i - 2];

                            if (((bbcc < this.CharacterTable.Hamza) || (bbcc > this.CharacterTable.HamzaBelow)) &&
                                (bcc !== this.CharacterTable.AlefHamzaBelow)) {
                                newStr += str[i];
                            }
                        } else if (bcc !== this.CharacterTable.AlefHamzaBelow) {
                            newStr += str[i];
                        }
                    }

                    break;
                }

                case this.CharacterTable.Shadda:
                case this.CharacterTable.Sukun:
                {
                    // Preserve Shadda الإبقاء على الشدة.
                    // Preserve Sukun الإبقاء على السكون.
                    newStr += str[i];
                    break;
                }

                default:
                {
                    // "bcc" only stores letters المتغير التالي يخزن الحروف فقط.
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
     * تزيل المسافات الزائدة والتطويل وتستبدل العلامات الأعجمية بالعربية.
     * Removes extra spaces, Tatweel and replaces foreign marks.
     * @param {string} str
     * @returns {string}
     */
    ImproveText: function (str) {
        const len = str.length;
        let insertSpace = false;
        let quotatStart = false;
        let ignoreSpace = true;
        let newStr = "";
        let bcc = "";

        if (len < 2) {
            // يجب أن يكون النص أطول من حرف.
            // String length has to be bigger than 1.
            return str;
        }

        for (let i = 0; i < len; i++) {
            const cc = str[i];

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
                    newStr += this.CharacterTable.ArabicComma;
                    insertSpace = true;
                    break;
                }

                case this.CharacterTable.Solidus: // / Solidus شرطة.
                case this.CharacterTable.ReverseSolidus: // \ Reverse Solidus شرطة معكوسة.
                {
                    // استبدال الشرطة المعكوسة بشرطة عادية، مع إزالة المسافات التي قبلها وبعدها.
                    // Replace Reverse Solidus with Solidus, and remove any spaces before or after it.
                    newStr += this.CharacterTable.Solidus;
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
                        newStr += this.CharacterTable.Space;
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
                    newStr += this.CharacterTable.ArabicSemicolon;
                    insertSpace = true;
                    break;
                }

                case this.CharacterTable.ArabicQuestionMark: // ؟ Arabic Question Mark علامة استفهام عربية.
                case this.CharacterTable.QuestionMark: // ? Latin Question Mark علامة استفهام أعجمية.
                {
                    // استبدال علامة الاستفهام الأعجمية بالعربية.
                    // Replace Latin Question Mark with Arabic Question Mark.
                    newStr += this.CharacterTable.ArabicQuestionMark;
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
                        newStr += this.CharacterTable.Space;
                    }

                    // منع إضافة مسافة بعد بداية الاقتباس.
                    // Prevent adding space after quote start.
                    insertSpace = quotatStart;
                    quotatStart = !(quotatStart);
                    ignoreSpace = quotatStart;

                    // استبدال علامات الاقتباس الأعجمي بعلامة الاقتباس العادي.
                    // 34 = " Quotation Mark.
                    newStr += this.CharacterTable.QuotationMark;

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

                        if ((y < len) && (str[y] === this.CharacterTable.Fathatan)) {
                            newStr += this.CharacterTable.Fathatan;
                            ++i;
                        }

                        // إعادة تعيين تجاهل المسافة فيما لو كانت الألف في بداية الكلام.
                        // Reset ignoreSpace if Alef it at the start.
                        // "لإصلاح مشكلة عند تحسين الجملة: "واو أو ياء.
                        ignoreSpace = false;
                    } else if (!(ignoreSpace)) {
                        newStr += this.CharacterTable.Space;
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
                        const ncc = str[y];

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
                        newStr += this.CharacterTable.Tatweel;
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
                        const ncc = str[y];

                        if (ncc !== this.CharacterTable.Space) {
                            if (ncc !== this.CharacterTable.Dot) {
                                break;
                            }

                            repeatedDots = true;
                        }

                        ++y;
                    }

                    if (repeatedDots) {
                        // تمكين إضافة مسافة بعد النقط إن لم يكن بعدها اقتباس.
                        // Enable adding a space after dots if what's after them is not quotation mark.
                        ignoreSpace = false;

                        // عدم إضافة مسافة بعد النقط إذا كانت داخل اقتباس.
                        // Don't add space if the dots are in quotation marks.
                        if ((bcc !== this.CharacterTable.QuotationMark) &&
                            (bcc !== this.CharacterTable.QuotationMarkLeftDouble) &&
                            (bcc !== this.CharacterTable.QuotationMarkRightDouble)) {
                            newStr += this.CharacterTable.Space;
                        }

                        newStr += this.CharacterTable.Dot;
                        newStr += this.CharacterTable.Dot;

                        // تقدم إلى آخر مسافة أو نقطة.
                        // Advanced to the last space or dot.
                        i = (y - 1);
                    }

                    newStr += this.CharacterTable.Dot;
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
                        newStr += this.CharacterTable.Space;
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
                            newStr += this.CharacterTable.Space;
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

            bcc = str[i];
        }

        return this.SeparateLamAlef(newStr);
    },

    /**
     * تستبدل اللام و الألف المدمجتين بما يقابلهما من حرفين.
     * Replaces combined Lam and Alef with their corresponding letters.
     * @param {string} str
     * @returns {string}
     */
    SeparateLamAlef: function (str) {
        str = str.replaceAll(this.CharacterTable.LamAlefCombined,
            this.CharacterTable.Lam + this.CharacterTable.Alef);
        str = str.replaceAll(this.CharacterTable.LamAlefMaddaAboveCombined,
            this.CharacterTable.Lam + this.CharacterTable.AlefMaddaAbove);
        str = str.replaceAll(this.CharacterTable.LamAlefHamzaAboveCombined,
            this.CharacterTable.Lam + this.CharacterTable.AlefHamzaAbove);
        return str.replaceAll(this.CharacterTable.LamAlefHamzaBelowCombined,
            this.CharacterTable.Lam + this.CharacterTable.AlefHamzaBelow);
    },

    /**
     * تستبدل التاء المربوطة بهاء، والألف المقصورة بياء (أخطاء إملائية شائعة).
     * كما تستبدل جميع الهمزات المقترنة بألف أو المنفردة بألف
     * وتستبدل الهمزة التي على الواو والياء بهمزة على السطر.
     * Replaces Teh Marbuta (ة) with Heh (ه), and Alef Maksura (ى) with Yeh (ي); common misspellings.
     * Also, Uses Alef to replaces all Hamzas that are paired with Alef,
     * and uses single Hamza (Hamza on line) to replace any Waw or Yah with HamzaAbove.
     * @param {string} str
     * @returns {string}
     */
    UnifyLetters: function (str) {
        str = str.replaceAll(this.CharacterTable.TehMarbuta, this.CharacterTable.Heh);

        const AlefG =
            this.CharacterTable.AlefMaksura +
            this.CharacterTable.AlefMaddaAbove +
            this.CharacterTable.AlefHamzaAbove +
            this.CharacterTable.AlefHamzaBelow +
            this.CharacterTable.MaddaAbove +
            this.CharacterTable.HamzaAbove +
            this.CharacterTable.HamzaBelow;

        str = str.replaceAll(new RegExp(AlefG.split("").join("|"), "g"), this.CharacterTable.Alef);

        const HamzaG =
            this.CharacterTable.WawHamzaAbove +
            this.CharacterTable.YehHamzaAbove;

        return str.replaceAll(new RegExp(HamzaG.split("").join("|"), "g"), this.CharacterTable.Hamza);
    },

    /**
     * تستخدم عددًا من الدوال لتبسيط النص لغرض تسهيل البحث.
     * Uses a few functions to Simplify text for the purpose of easing search.
     * @param {string} str
     * @returns {string}
     */
    SimplifyText: function (str) {
        str = this.RemoveTatweel(str, false);
        str = this.RemoveTashkil(str);
        str = this.SeparateLamAlef(str);
        return this.UnifyLetters(str);
    },

    /**
     * تفصل التشيكل عن النص، وتعيد النص مع رمز التشكيل.
     * Separates text from Tashkil, and returns text with encoded Tashkil.
     * @param {string} str
     * @returns {object} {EncodeTashkil: string, StrippedText: string}
     */
    EncodeTashkil: function (str) {
        const fathatan = this.CharacterTable.Fathatan.charCodeAt(0);
        const len = str.length;
        let strCode = "";
        let hasTashkil = false;
        let hasShadda = false;
        let tashkilCode = 0;

        for (let i = 0; i < len; i++) {
            const cChar = str[i];

            if ((cChar >= this.CharacterTable.Hamza) && (cChar <= this.CharacterTable.HamzaBelow)) {
                let y = (i + 1);

                while (y < len) {
                    // تحقق فيما إذا كان التشكل فيه شدّة أو لا.
                    // Checking to see if the Tashkil has Shadda or not.
                    const hChar = str[y];

                    if ((hChar >= this.CharacterTable.Fathatan) && (hChar <= this.CharacterTable.Sukun)) {
                        hasTashkil = true;

                        if (hChar === this.CharacterTable.Shadda) {
                            hasShadda = true;
                        } else {
                            // To make Tashkil start from one, it subtracts the start of the Tashkil,
                            // which is "Fathatan", then adds one; because zero means empty.
                            // حتى يكون التشكيل مفهرسًا في مصفوفة، يُطرح رقم أول حرف في التشكيل، ألا وهو الفتحتين،
                            // ثم يضاف واحد حتى يكون العنصر في الحقل رقم 0 فارغًا.

                            // 0: None
                            // 1: Fathatan  ً Arabic Fathatan فتحتان.
                            // 2: Dammatan  ٌ Arabic Dammatan ضمتان.
                            // 3: Kasratan  ٍ Arabic Kasratan كسرتان.
                            // 4: Fatha  َ Arabic Fatha فَتحة.
                            // 5: Damma  ُ Arabic Damma ضمة.
                            // 6: Kasra  ِ Arabic Kasra كسرة.
                            // 7: Shadda  ّ Arabic Shadda شدّة.
                            // 8: Sukun  ْ Arabic Sukun سكون.

                            // See EncodedTashkilTable[];
                            tashkilCode = ((str.charCodeAt(y) - fathatan) + 1);
                        }

                        ++i;
                    } else {
                        break;
                    }

                    ++y;
                }
            }

            if (!(hasTashkil)) {
                // 0 يعني لا تشكيل.
                // 0 Means no Tashkil.
                strCode += "0";
            } else {
                hasTashkil = false;

                if (hasShadda) {
                    hasShadda = false;

                    if (tashkilCode === 0) {
                        // فقط شدّة.
                        // Just Shadda.
                        strCode += "g";
                    } else {
                        // "tashkilCode" is > 0;
                        // 65 is "A"; ASCII
                        // نشكيل مع شدة
                        // Tashkil with Shadda.
                        strCode += String.fromCharCode(tashkilCode + 64);
                        tashkilCode = 0;
                    }
                } else {
                    // "tashkilCode" is > 0;
                    // 97 is "a"; ASCII
                    // نشكيل بدون شدة
                    // Tashkil without Shadda.
                    strCode += String.fromCharCode(tashkilCode + 96);
                    tashkilCode = 0;
                }
            }
        }

        return { EncodedTashkil: strCode, StrippedText: this.RemoveTashkil(str, false) };
    },

    /**
     * تعيد تشكيل النص بناءً على ما رمز التشكيل المرسل.
     * Reconstruct text with given tashkil code.
     * @param {string} str
     * @param {string} tashkilCode
     * @returns {string}
     */
    DecodeTashkil: function (str, tashkilCode) {
        const len = Math.min(str.length, str.length);
        let newStr = "";

        for (let i = 0; i < len; i++) {
            newStr += str[i];

            let tCode = tashkilCode.charCodeAt(i);
            // A - G
            const capitalChar = ((tCode >= 65) && (tCode <= 71));

            // A-G or a-h
            if (capitalChar || ((tCode >= 97) && (tCode <= 104))) {
                if (capitalChar) {
                    // التشكيل به شدة.
                    // Tashkil with Shadda.
                    newStr += this.CharacterTable.Shadda;
                    tCode -= 64;
                } else {
                    // تشكيلا بلا شدة.
                    // Tashkil without Shadda.
                    tCode -= 96;
                }

                newStr += this.EncodedTashkilTable[tCode];
            }
        }

        return newStr;
    },

    CharacterTable: {
        Space: "\u0020", // Space مسافة.
        ExclamationMark: "\u0021", // ! Exclamation Mark علامة تعجب.
        QuotationMark: "\u0022", // " Quotation Mark علامة افتباس عادية.
        LeftParenthesis: "\u0028", // ( Left Parenthesis بداية القوس.
        RightParenthesis: "\u0029", // ) Right Parenthesis نهاية القوس.
        Dot: "\u002E", // . Dot نقطة.
        Solidus: "\u002F", // / Solidus شرطة.
        Comma: "\u002C", // , Latin Comma فاصلة أعجمية.
        Colon: "\u003A", // : Colon نقطتان فوق بعص.
        Semicolon: "\u003B", // ; Latin Semicolon فاصلة منقوطة أعجمية.
        QuestionMark: "\u003F", // ? Latin Question Mark علامة استفهام أعجمية.
        LeftSquareParenthesis: "\u005B", // [ Left Square Parenthesis بداية القوس المربع.
        ReverseSolidus: "\u005C", // \ Reverse Solidus شرطة معكوسة.
        RightSquareParenthesis: "\u005D", // ] Right Square Parenthesis نهاية القوس المربع.
        LeftCurlyBracket: "\u007B", // { Left Curly Bracket بداية القوس المجعد.
        RightCurlyBracket: "\u007D", // } Right Curly Bracket نهاية القوس المجعد.
        ArabicComma: "\u060C", // ، Arabic Comma فاصلة عربية.
        ArabicSemicolon: "\u061B", // ؛ Arabic Semicolon فاصلة منقوطة عربية.
        ArabicQuestionMark: "\u061F", // ؟ Arabic Question Mark علامة استفهام عربية.
        Hamza: "\u0621", // ء Arabic Letter Hamza همزة.
        AlefMaddaAbove: "\u0622", // آ Arabic Letter Alef with Madda above ألف فوقها مدة.
        AlefHamzaAbove: "\u0623", // أ Arabic Letter Alef with Hamza above ألف فوقها همزة.
        WawHamzaAbove: "\u0624", // ا Arabic Letter Waw with Hamza above واو فوقها همزة.
        AlefHamzaBelow: "\u0625", // إ Arabic Letter Alef with Hamza below ألف تحتها همزة.
        YehHamzaAbove: "\u0626", // ئ Arabic Letter Yeh with Hamza Above ياء فقوها همزة.
        Alef: "\u0627", // ا Arabic Letter Alef ألف بلا همزة.
        TehMarbuta: "\u0629", // ة Arabic Letter Teh Marbuta تاء مربوطة.
        Tatweel: "\u0640", // ـ Arabic Tatweel حرف التطويل.
        Lam: "\u0644", // ل Arabic Letter Lam لام.
        Heh: "\u0647", // ه Arabic Letter Heh هاء.
        Waw: "\u0648", // و Arabic Letter Waw واو.
        AlefMaksura: "\u0649", // ى Arabic Letter Alef Maksura ألف مكسورة.
        Yeh: "\u064A", // ي Arabic Letter Yeh ياء.
        Fathatan: "\u064B", //  ً Arabic Fathatan فتحتان.
        Dammatan: "\u064C", //  ٌ Arabic Dammatan ضمتان.
        Kasratan: "\u064D", //  ٍ Arabic Kasratan كسرتان.
        Fatha: "\u064E", //  َ Arabic Fatha فَتحة.
        Damma: "\u064F", //  ُ Arabic Damma ضمة.
        Kasra: "\u0650", //  ِ Arabic Kasra كسرة.
        Shadda: "\u0651", //  ّ Arabic Shadda شدّة.
        Sukun: "\u0652", //  ْ Arabic Sukun سكون.
        MaddaAbove: "\u0653", //  ٓ Arabic Madda Above مدة علوية.
        HamzaAbove: "\u0654", //  ٔ Arabic Hamza Above همزة علوية.
        HamzaBelow: "\u0655", //  ٕ Arabic Hamza Below همزة سفلية.
        QuotationMarkLeftDouble: "\u201C", // “ Left Double Quotation Mark بداية الاقتباس الأعجمي.
        QuotationMarkRightDouble: "\u201D", // ” Right Double Quotation Mark نهاية الاقتباس الأعجمي.
        LamAlefCombined: "\uFEFB", // ﻻ Arabic Letter Lam with Alef (combined Form) لام مدمجة مع ألف.
        LamAlefMaddaAboveCombined: "\uFEF5", // ﻵ Arabic Letter Lam with Alef with Madda Above (combined Form) لام مدمجة مع ألف فوقها مدة.
        LamAlefHamzaAboveCombined: "\uFEF7", // ﻷ Arabic Letter Lam with Alef with Hamza Above (combined Form) لام مدمجة مع ألف فوقها همزة.
        LamAlefHamzaBelowCombined: "\uFEF9" // ﻹ Arabic Letter Lam with Alef with Hamza Below (combined Form) لام مدمجة مع ألف فوقها همزة.
    },

    // Used in DecodeTashkil()
    EncodedTashkilTable: [
        "", // Empty فارغ.
        "\u064B", //  ً Arabic Fathatan فتحتان.
        "\u064C", //  ٌ Arabic Dammatan ضمتان.
        "\u064D", //  ٍ Arabic Kasratan كسرتان.
        "\u064E", //  َ Arabic Fatha فَتحة.
        "\u064F", //  ُ Arabic Damma ضمة.
        "\u0650", //  ِ Arabic Kasra كسرة.
        "\u0651", //  ّ Arabic Shadda شدّة.
        "\u0652" //  ْ Arabic Sukun سكون.
    ]
};
