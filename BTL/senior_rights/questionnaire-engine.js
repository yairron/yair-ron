/**
 * Questionnaire Engine
 * מנוע דינמי להצגת שאלונים מבוססי JSON
 * ניתן לשימוש חוזר עבור שאלונים שונים
 */

class QuestionnaireEngine {
    constructor(jsonPath) {
        this.jsonPath = jsonPath;
        this.data = null;
        this.currentQuestionId = null;
        this.answers = {};
        this.questionHistory = [];

        // Sub-questionnaire state
        this.parentState = null;  // Stores parent questionnaire state when running sub-questionnaire
        this.returnToQuestion = null;  // Question to return to after sub-questionnaire

        // DOM Elements
        this.headerEl = document.getElementById('questionnaire-header');
        this.contentEl = document.getElementById('questionnaire-content');
        this.resultEl = document.getElementById('questionnaire-result');
        this.navEl = document.getElementById('questionnaire-nav');
        this.restartBtn = document.getElementById('btn-restart');
        this.goBackBtn = document.getElementById('btn-go-back');
    }

    /**
     * Initialize the questionnaire
     * @param {string} startQuestionId - Optional question ID to start from
     */
    async init(startQuestionId = null) {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.renderHeader();
            this.startQuestionnaire(startQuestionId);
        } catch (error) {
            console.error('Error initializing questionnaire:', error);
            this.showError('שגיאה בטעינת השאלון');
        }
    }

    /**
     * Load questionnaire data from JSON file, then apply NII mapping if defined
     */
    async loadData() {
        const response = await fetch(this.jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.data = await response.json();

        if (this.data.niiMapping) {
            try {
                const niiPath = this.jsonPath.replace(/questionnaires\/[^/]+\.json$/, 'data/nii-constants.json');
                const niiResp = await fetch(niiPath);
                if (niiResp.ok) {
                    const nii = await niiResp.json();
                    this.applyNiiMapping(nii);
                }
            } catch(e) {
                console.warn('⚠️ לא ניתן לטעון nii-constants.json — משתמש בערכי ברירת מחדל', e);
            }
        }
    }

    /**
     * Apply niiMapping: populate calculationRules fields from nii-constants.json values
     */
    applyNiiMapping(nii) {
        if (!this.data.calculationRules) this.data.calculationRules = {};
        Object.entries(this.data.niiMapping).forEach(([rulePath, niiKey]) => {
            if (nii[niiKey]?.value === undefined) return;
            const parts = rulePath.split('.');
            let obj = this.data.calculationRules;
            for (let i = 0; i < parts.length - 1; i++) {
                if (!obj[parts[i]]) obj[parts[i]] = {};
                obj = obj[parts[i]];
            }
            obj[parts[parts.length - 1]] = nii[niiKey].value;
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => this.restart());
        }
        if (this.goBackBtn) {
            this.goBackBtn.addEventListener('click', () => this.goBackFromResult());
        }
    }

    /**
     * Render the header with questionnaire info
     */
    renderHeader() {
        this.headerEl.innerHTML = `
            <h1>${this.data.title}</h1>
            <p class="subtitle">${this.data.description}</p>
            ${this.data.source ? `<span class="source-badge">מקור: ${this.data.source}</span>` : ''}
        `;
    }

    /**
     * Start or restart the questionnaire
     * @param {string} startQuestionId - Optional question ID to start from
     */
    startQuestionnaire(startQuestionId = null) {
        this.answers = {};
        this.questionHistory = [];
        this.resultEl.classList.add('hidden');
        this.navEl.classList.add('hidden');

        // If a specific question is requested, go directly to it
        if (startQuestionId) {
            const question = this.data.questions.find(q => q.id === startQuestionId);
            if (question) {
                this.showQuestion(startQuestionId);
                return;
            }
        }

        // Show intro if exists, otherwise show first question
        if (this.data.intro) {
            this.showIntro();
        } else {
            const firstQuestion = this.data.questions[0];
            if (firstQuestion) {
                this.showQuestion(firstQuestion.id);
            }
        }
    }

    /**
     * Show intro section
     */
    showIntro() {
        const intro = this.data.intro;
        const backToParentHtml = this.parentState ? `
            <button class="back-to-previous" id="btn-back-to-parent">
                <span class="back-arrow">→</span>
                <span>חזרה לשאלון הראשי</span>
            </button>
        ` : '';

        this.contentEl.innerHTML = `
            <div class="intro-container">
                ${backToParentHtml}
                <h3 class="intro-title">${intro.title}</h3>
                <div class="intro-content">${this.resolveDescriptionTemplates(intro.content)}</div>
                <button class="btn btn-primary intro-button" id="btn-start">
                    ${intro.buttonText || 'המשך'}
                </button>
            </div>
        `;

        // Setup start button listener
        const startBtn = this.contentEl.querySelector('#btn-start');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const firstQuestion = this.data.questions[0];
                if (firstQuestion) {
                    this.showQuestion(firstQuestion.id);
                }
            });
        }

        // Setup back-to-parent button listener
        const backToParentBtn = this.contentEl.querySelector('#btn-back-to-parent');
        if (backToParentBtn) {
            backToParentBtn.addEventListener('click', () => this.returnFromSubQuestionnaire(undefined, 'not_eligible'));
        }
    }

    /**
     * Show a specific question
     */
    showQuestion(questionId) {
        // Check if we should skip imputed income questions when we already have the data
        if ((questionId === 'q6_imputed_income_single' || questionId === 'q6_imputed_income_couple')
            && this.answers['q0c_imputed_income_amount']) {
            // Already have imputed income data, skip to vehicle question
            const nextQuestion = questionId === 'q6_imputed_income_single' ? 'q7_vehicle_single' : 'q7_vehicle_couple';
            this.showQuestion(nextQuestion);
            return;
        }

        const question = this.data.questions.find(q => q.id === questionId);
        if (!question) {
            console.error('Question not found:', questionId);
            return;
        }

        this.currentQuestionId = questionId;

        // Add to history if not already there
        if (!this.questionHistory.includes(questionId)) {
            this.questionHistory.push(questionId);
        }

        // Render the question
        this.contentEl.innerHTML = this.renderQuestion(question);

        // Setup option event listeners
        this.setupOptionListeners(question);

        // Setup back button listener
        this.setupBackButtonListener();
    }

    /**
     * Setup back button event listener
     */
    setupBackButtonListener() {
        const backBtn = this.contentEl.querySelector('#btn-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBack());
        }
        const backToParentBtn = this.contentEl.querySelector('#btn-back-to-parent');
        if (backToParentBtn) {
            backToParentBtn.addEventListener('click', () => this.returnFromSubQuestionnaire(undefined, 'not_eligible'));
        }
    }

    /**
     * Go back to previous question
     */
    goBack() {
        if (this.questionHistory.length <= 1) return;

        // Remove current question from history
        const currentQuestionId = this.questionHistory.pop();

        // Remove the answer for the current question
        delete this.answers[currentQuestionId];

        // Get the previous question
        const previousQuestionId = this.questionHistory[this.questionHistory.length - 1];

        // Remove it from history too (showQuestion will add it back)
        this.questionHistory.pop();

        // Also remove the answer for the previous question so user can re-answer
        delete this.answers[previousQuestionId];

        // Show the previous question
        this.showQuestion(previousQuestionId);
    }

    /**
     * Render a question based on its type
     */
    renderQuestion(question) {
        const questionNumber = this.questionHistory.length;
        const showBackButton = this.questionHistory.length > 1;

        let optionsHtml = '';

        switch (question.type) {
            case 'dropdown':
                optionsHtml = this.renderDropdown(question);
                break;
            case 'yesno':
                optionsHtml = this.renderYesNo(question);
                break;
            case 'radio':
                optionsHtml = this.renderRadio(question);
                break;
            case 'assets_form':
                optionsHtml = this.renderAssetsForm(question);
                break;
            case 'number_input':
                optionsHtml = this.renderNumberInput(question);
                break;
            default:
                optionsHtml = this.renderRadio(question);
        }

        const backButtonHtml = showBackButton ? `
            <button class="back-to-previous" id="btn-back">
                <span class="back-arrow">→</span>
                <span>חזרה לשאלה הקודמת</span>
            </button>
        ` : '';

        const backToParentHtml = (!showBackButton && this.parentState) ? `
            <button class="back-to-previous" id="btn-back-to-parent">
                <span class="back-arrow">→</span>
                <span>חזרה לשאלון הראשי</span>
            </button>
        ` : '';

        const descriptionHtml = question.description
            ? `<div class="question-description">${this.resolveDescriptionTemplates(question.description)}</div>`
            : '';

        return `
            <div class="question-container" data-question-id="${question.id}">
                ${backButtonHtml}${backToParentHtml}
                <div class="question-header">
                    <div class="question-number">שאלה ${questionNumber}</div>
                </div>
                <div class="question-text">${this.resolveDescriptionTemplates(question.question)}</div>
                ${descriptionHtml}
                <div class="options-container ${question.type === 'yesno' ? 'options-yesno' : ''}">
                    ${optionsHtml}
                </div>
            </div>
        `;
    }

    /**
     * Resolve {rules.X.Y} placeholders in description text using calculationRules
     */
    resolveDescriptionTemplates(text) {
        if (!this.data.calculationRules) return text;
        return text.replace(/\{rules\.([^}]+)\}/g, (match, path) => {
            const value = path.split('.').reduce((obj, key) => obj?.[key], this.data.calculationRules);
            if (value === undefined || value === null) return match;
            return typeof value === 'number' ? value.toLocaleString('he-IL') : value;
        });
    }

    /**
     * Render dropdown options
     */
    renderDropdown(question) {
        const options = question.options.map(opt =>
            `<option value="${opt.value}">${opt.label}</option>`
        ).join('');

        return `
            <select class="option-dropdown" data-question-id="${question.id}">
                <option value="">-- בחר --</option>
                ${options}
            </select>
        `;
    }

    /**
     * Render Yes/No buttons
     */
    renderYesNo(question) {
        return question.options.map(opt => `
            <button class="option-button ${opt.value === 'yes' ? 'yes-btn' : 'no-btn'}"
                    data-value="${opt.value}"
                    data-question-id="${question.id}">
                ${this.resolveDescriptionTemplates(opt.label)}
            </button>
        `).join('');
    }

    /**
     * Render radio buttons (as styled buttons)
     */
    renderRadio(question) {
        return question.options.map(opt => `
            <button class="option-button"
                    data-value="${opt.value}"
                    data-question-id="${question.id}">
                ${this.resolveDescriptionTemplates(opt.label)}
            </button>
        `).join('');
    }

    /**
     * Render number input field
     */
    renderNumberInput(question) {
        // Get existing value if it was already answered
        const existingValue = this.answers[question.id]?.value || this.answers[question.storeAs]?.value || '';
        
        return `
            <div class="number-input-container">
                <div class="number-input-wrapper">
                    <input type="number"
                           id="number-input-${question.id}"
                           class="number-input"
                           placeholder="${question.placeholder || '0'}"
                           min="0"
                           value="${existingValue}"
                           onfocus="this.select()">
                    <span class="number-input-suffix">${question.suffix || '₪'}</span>
                </div>
                <button class="btn btn-primary number-input-submit" id="btn-submit-number">
                    המשך
                </button>
            </div>
        `;
    }

    /**
     * Render assets form with multiple input fields
     */
    renderAssetsForm(question) {
        const fieldsHtml = question.fields.map(field => {
            const inputType = field.type === 'monthly_income' ? 'monthly_income' : 'currency';
            return `
                <div class="asset-field">
                    <label for="asset-${field.id}">${field.label}</label>
                    <p class="asset-field-description">${this.resolveDescriptionTemplates(field.description)}</p>
                    <div class="asset-input-wrapper">
                        <input type="number"
                               id="asset-${field.id}"
                               class="asset-input"
                               data-field-id="${field.id}"
                               data-field-type="${inputType}"
                               placeholder="0"
                               min="0"
                               value="0"
                               onfocus="this.select()">
                        <span class="asset-currency">₪</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="assets-form-container" data-family-type="${question.familyType}">
                ${fieldsHtml}
                <button class="btn btn-primary assets-form-submit" id="btn-calculate-assets">
                    חשב הכנסה רעיונית
                </button>
            </div>
        `;
    }

    /**
     * Setup event listeners for options
     */
    setupOptionListeners(question) {
        if (question.type === 'dropdown') {
            const dropdown = this.contentEl.querySelector('.option-dropdown');
            if (dropdown) {
                dropdown.addEventListener('change', (e) => {
                    const value = e.target.value;
                    if (value) {
                        this.handleAnswer(question, value);
                    }
                });
            }
        } else if (question.type === 'assets_form') {
            this.setupAssetsFormListeners(question);
        } else if (question.type === 'number_input') {
            this.setupNumberInputListeners(question);
        } else {
            const buttons = this.contentEl.querySelectorAll('.option-button');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const value = e.target.dataset.value;

                    // Visual feedback
                    buttons.forEach(b => b.classList.remove('selected'));
                    e.target.classList.add('selected');

                    // Small delay for visual feedback
                    setTimeout(() => {
                        this.handleAnswer(question, value);
                    }, 300);
                });
            });
        }
    }

    /**
     * Setup event listeners for number input
     */
    setupNumberInputListeners(question) {
        const input = this.contentEl.querySelector('.number-input');
        const submitBtn = this.contentEl.querySelector('#btn-submit-number');

        if (!input || !submitBtn) return;

        submitBtn.addEventListener('click', () => {
            const value = parseFloat(input.value) || 0;

            // Determine storage key (use storeAs if available, otherwise use question id)
            const storageKey = question.storeAs || question.id;

            // Store the answer
            this.answers[storageKey] = {
                question: question.question,
                value: value,
                label: `${value.toLocaleString('he-IL')}₪`
            };

            // Go to next question — conditionalNext takes priority over next
            const nextId = this.resolveConditionalNext(question, value) || question.next;
            if (nextId) {
                if (this.data.results && this.data.results[nextId]) {
                    this.showResult(nextId);
                } else {
                    this.showQuestion(nextId);
                }
            }
        });

        // Allow Enter key to submit
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });
    }

    /**
     * Resolve conditionalNext: evaluate conditions against a numeric value and calculationRules.
     * Each condition: { "if": { "gt"|"gte"|"lt"|"lte": "rules.path" }, "next": "..." }
     * Last entry may be { "else": "..." }
     */
    resolveConditionalNext(question, numericValue) {
        if (!question.conditionalNext) return null;
        const rules = this.data.calculationRules || {};
        const resolvePath = path => path.split('.').reduce((obj, k) => obj?.[k], rules);

        for (const cond of question.conditionalNext) {
            if (cond.else !== undefined) return cond.else;
            if (cond.if) {
                const [op, rulePath] = Object.entries(cond.if)[0];
                const threshold = resolvePath(rulePath);
                if (threshold === undefined) continue;
                const match =
                    (op === 'gt'  && numericValue >  threshold) ||
                    (op === 'gte' && numericValue >= threshold) ||
                    (op === 'lt'  && numericValue <  threshold) ||
                    (op === 'lte' && numericValue <= threshold);
                if (match) return cond.next;
            }
        }
        return null;
    }

    /**
     * Setup event listeners for assets form
     */
    setupAssetsFormListeners(question) {
        const form = this.contentEl.querySelector('.assets-form-container');
        const submitBtn = this.contentEl.querySelector('#btn-calculate-assets');

        if (!form || !submitBtn) return;

        // Get family status and age from previous answers
        const familyStatus = this.answers['q1_family_status']?.value || 'single';
        const ageGroup = this.answers['q1_5_age']?.value || '55plus';

        // Build thresholds from calculationRules.assetRules (JSON-driven, no hardcoded values)
        const assetRules = this.data.calculationRules?.assetRules;
        const profileKey = `${familyStatus}_${ageGroup}`;
        const profile = assetRules?.profiles?.[profileKey] || {};
        const exemptions = assetRules?.exemptions || {};

        const thresholds = {
            exemption: familyStatus === 'single' ? (exemptions.single || 41528) : (exemptions.couple || 62292),
            tier1: profile.tier1,
            tier2: profile.tier2,
            hasTier1_5pct: profile.hasTier1_5pct,
            tier1Rate: profile.tier1Rate,
            tier2Rate: profile.tier2Rate,
            baseRate: assetRules?.baseRate || 0.0417,
            tierThreshold: assetRules?.tierThreshold || 117173,
            tier3Rate: assetRules?.tier3Rate || 0.05
        };

        submitBtn.addEventListener('click', () => {
            const inputs = form.querySelectorAll('.asset-input');
            const assetValues = {};

            inputs.forEach(input => {
                const fieldId = input.dataset.fieldId;
                const fieldType = input.dataset.fieldType;
                const value = parseFloat(input.value) || 0;
                assetValues[fieldId] = { value, type: fieldType };
            });

            // Calculate totals
            const result = this.calculateImputedIncome(assetValues, thresholds);

            // Store the answer
            this.answers[question.id] = {
                question: question.question,
                value: 'assets_calculated',
                label: `סה"כ נכסים: ${result.totalAssets.toLocaleString('he-IL')}₪`,
                assetValues: assetValues,
                calculatedResult: result
            };

            // Show the calculated result
            this.showAssetsResult(result, familyStatus, ageGroup);

            // Scroll to show result container at top
            setTimeout(() => {
                this.resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        });
    }

    /**
     * Calculate imputed income from assets
     */
    calculateImputedIncome(assetValues, thresholds) {
        // Separate asset types
        let totalFinancialAssets = 0;
        let monthlyIncomeFromAssets = 0;

        for (const [fieldId, data] of Object.entries(assetValues)) {
            if (data.type === 'monthly_income') {
                monthlyIncomeFromAssets += data.value;
            } else {
                totalFinancialAssets += data.value;
            }
        }

        // Apply exemption for liquid assets
        const taxableAssets = Math.max(0, totalFinancialAssets - thresholds.exemption);

        // PART B: Tier calculation (only on amounts above tier threshold)
        const tierThreshold = thresholds.tierThreshold || 117173;
        let tiersYearlyIncome = 0;
        let tierBreakdown = [];

        if (taxableAssets > tierThreshold) {
            const amountAboveThreshold = taxableAssets - tierThreshold;
            
            // Check if this configuration has a 1.5% tier
            if (!thresholds.hasTier1_5pct) {
                // Special case: Single under 55 - starts with 3%
                if (amountAboveThreshold <= thresholds.tier1) {
                    // Only tier 1 (3%)
                    tiersYearlyIncome = amountAboveThreshold * thresholds.tier1Rate;
                    tierBreakdown.push({
                        tier: 1,
                        rate: '3%',
                        rangeStart: tierThreshold + 1,
                        rangeEnd: tierThreshold + thresholds.tier1,
                        amount: amountAboveThreshold,
                        income: tiersYearlyIncome
                    });
                } else {
                    // Tier 1 (3%) + Tier 2 (5%)
                    const tier1Income = thresholds.tier1 * thresholds.tier1Rate;
                    const tier2Amount = amountAboveThreshold - thresholds.tier1;
                    const tier2Income = tier2Amount * thresholds.tier2Rate;
                    tiersYearlyIncome = tier1Income + tier2Income;
                    tierBreakdown.push(
                        { 
                            tier: 1, 
                            rate: '3%', 
                            rangeStart: tierThreshold + 1,
                            rangeEnd: tierThreshold + thresholds.tier1,
                            amount: thresholds.tier1, 
                            income: tier1Income 
                        },
                        { 
                            tier: 2, 
                            rate: '5%', 
                            rangeStart: tierThreshold + thresholds.tier1 + 1,
                            rangeEnd: null,
                            amount: tier2Amount, 
                            income: tier2Income 
                        }
                    );
                }
            } else {
                // Normal case: Has 1.5% tier
                if (amountAboveThreshold <= thresholds.tier1) {
                    // Tier 1 only: 1.5%
                    tiersYearlyIncome = amountAboveThreshold * thresholds.tier1Rate;
                    tierBreakdown.push({
                        tier: 1,
                        rate: '1.5%',
                        rangeStart: tierThreshold + 1,
                        rangeEnd: tierThreshold + thresholds.tier1,
                        amount: amountAboveThreshold,
                        income: tiersYearlyIncome
                    });
                } else if (amountAboveThreshold <= thresholds.tier1 + thresholds.tier2) {
                    // Tier 1 + Tier 2
                    const tier1Income = thresholds.tier1 * thresholds.tier1Rate;
                    const tier2Amount = amountAboveThreshold - thresholds.tier1;
                    const tier2Income = tier2Amount * thresholds.tier2Rate;
                    tiersYearlyIncome = tier1Income + tier2Income;
                    tierBreakdown.push(
                        { 
                            tier: 1, 
                            rate: '1.5%', 
                            rangeStart: tierThreshold + 1,
                            rangeEnd: tierThreshold + thresholds.tier1,
                            amount: thresholds.tier1, 
                            income: tier1Income 
                        },
                        { 
                            tier: 2, 
                            rate: '3%', 
                            rangeStart: tierThreshold + thresholds.tier1 + 1,
                            rangeEnd: tierThreshold + thresholds.tier1 + thresholds.tier2,
                            amount: tier2Amount, 
                            income: tier2Income 
                        }
                    );
                } else {
                    // All three tiers
                    const tier1Income = thresholds.tier1 * thresholds.tier1Rate;
                    const tier2Income = thresholds.tier2 * thresholds.tier2Rate;
                    const tier3Amount = amountAboveThreshold - thresholds.tier1 - thresholds.tier2;
                    const tier3Income = tier3Amount * (thresholds.tier3Rate || 0.05);
                    tiersYearlyIncome = tier1Income + tier2Income + tier3Income;
                    tierBreakdown.push(
                        { 
                            tier: 1, 
                            rate: '1.5%', 
                            rangeStart: tierThreshold + 1,
                            rangeEnd: tierThreshold + thresholds.tier1,
                            amount: thresholds.tier1, 
                            income: tier1Income 
                        },
                        { 
                            tier: 2, 
                            rate: '3%', 
                            rangeStart: tierThreshold + thresholds.tier1 + 1,
                            rangeEnd: tierThreshold + thresholds.tier1 + thresholds.tier2,
                            amount: thresholds.tier2, 
                            income: tier2Income 
                        },
                        { 
                            tier: 3, 
                            rate: '5%', 
                            rangeStart: tierThreshold + thresholds.tier1 + thresholds.tier2 + 1,
                            rangeEnd: null,
                            amount: tier3Amount, 
                            income: tier3Income 
                        }
                    );
                }
            }
        }

        // PART A: Base calculation on all taxable assets
        const baseYearlyIncome = taxableAssets * (thresholds.baseRate || 0.0417);

        // Total yearly income = Base + Tiers
        const yearlyImputedIncome = baseYearlyIncome + tiersYearlyIncome;

        const monthlyImputedIncome = yearlyImputedIncome / 12;

        // Total monthly income includes both imputed and actual income from assets
        const totalMonthlyIncome = monthlyImputedIncome + monthlyIncomeFromAssets;

        return {
            totalAssets: totalFinancialAssets,
            exemption: thresholds.exemption,
            taxableAssets: taxableAssets,
            baseRate: thresholds.baseRate || 0.0417,
            baseYearlyIncome: baseYearlyIncome,
            baseMonthlyIncome: baseYearlyIncome / 12,
            tiersYearlyIncome: tiersYearlyIncome,
            tiersMonthlyIncome: tiersYearlyIncome / 12,
            tierBreakdown: tierBreakdown,
            yearlyImputedIncome: yearlyImputedIncome,
            monthlyImputedIncome: monthlyImputedIncome,
            monthlyIncomeFromAssets: monthlyIncomeFromAssets,
            totalMonthlyIncome: totalMonthlyIncome
        };
    }

    /**
     * Show the assets calculation result
     */
    showAssetsResult(result, familyType, ageGroup) {
        // Hide questions
        this.contentEl.innerHTML = '';

        // Build tier breakdown HTML
        let tierBreakdownHtml = '';
        if (result.tierBreakdown.length > 0) {
            tierBreakdownHtml = result.tierBreakdown.map(tier => {
                const rangeText = tier.rangeEnd 
                    ? `${tier.rangeStart.toLocaleString('he-IL')}₪ - ${tier.rangeEnd.toLocaleString('he-IL')}₪`
                    : `${tier.rangeStart.toLocaleString('he-IL')}₪ ומעלה`;
                
                return `
                    <div class="tier-row">
                        <span class="tier-label">מדרגה ${tier.tier} (${tier.rate}):</span>
                        <span class="tier-range">${rangeText}</span>
                        <span class="tier-income">= ${tier.income.toLocaleString('he-IL', { maximumFractionDigits: 0 })}₪/שנה</span>
                    </div>
                `;
            }).join('');
        }

        const familyLabel = familyType === 'single' ? 'יחיד/ה' : 'זוג';
        const ageLabel = ageGroup === 'under55' ? 'מתחת לגיל 55' : 'גיל 55 ומעלה';

        // Show result
        this.resultEl.className = 'result-container info';
        this.resultEl.innerHTML = `
            <div class="result-icon-custom">📊</div>
            <h2 class="result-title">תוצאות החישוב</h2>

            <div class="assets-result-summary">
                <div class="result-row highlight">
                    <span class="result-label">סה"כ שווי נכסים:</span>
                    <span class="result-value">${result.totalAssets.toLocaleString('he-IL')}₪</span>
                </div>
                <div class="result-row">
                    <span class="result-label">פטור (${familyLabel}):</span>
                    <span class="result-value">-${result.exemption.toLocaleString('he-IL')}₪</span>
                </div>
                <div class="result-row">
                    <span class="result-label">סכום לחישוב הכנסה רעיונית:</span>
                    <span class="result-value">${result.taxableAssets.toLocaleString('he-IL')}₪</span>
                </div>

                <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0; border-right: 4px solid #4caf50;">
                    <h4 style="margin: 0 0 10px 0; color: #2e7d32;">📊 פירוט החישוב</h4>
                    
                    <div class="result-row">
                        <span class="result-label">חלק א' - חישוב בסיסי (${(result.baseRate * 100).toFixed(2)}%):</span>
                        <span class="result-value">${result.baseMonthlyIncome.toLocaleString('he-IL', { maximumFractionDigits: 2 })}₪/חודש</span>
                    </div>
                    
                    ${result.tiersMonthlyIncome > 0 ? `
                        <div class="result-row">
                            <span class="result-label">חלק ב' - חישוב מדרגות:</span>
                            <span class="result-value">${result.tiersMonthlyIncome.toLocaleString('he-IL', { maximumFractionDigits: 2 })}₪/חודש</span>
                        </div>
                    ` : ''}
                </div>

                ${tierBreakdownHtml ? `
                    <div class="tier-breakdown">
                        <h4>פירוט מדרגות (חלק ב') - ${ageLabel}:</h4>
                        ${tierBreakdownHtml}
                    </div>
                ` : ''}

                <div class="result-row main-result">
                    <span class="result-label">הכנסה רעיונית שנתית מנכסים:</span>
                    <span class="result-value">${result.yearlyImputedIncome.toLocaleString('he-IL', { maximumFractionDigits: 0 })}₪</span>
                </div>
                <div class="result-row main-result">
                    <span class="result-label">הכנסה רעיונית חודשית מנכסים:</span>
                    <span class="result-value">${result.monthlyImputedIncome.toLocaleString('he-IL', { maximumFractionDigits: 0 })}₪</span>
                </div>

                ${result.monthlyIncomeFromAssets > 0 ? `
                    <div class="result-row income-producing">
                        <span class="result-label">הכנסה חודשית מנכסים מניבים:</span>
                        <span class="result-value">+${result.monthlyIncomeFromAssets.toLocaleString('he-IL')}₪</span>
                    </div>
                    <div class="result-row total-income highlight">
                        <span class="result-label">סה"כ הכנסה חודשית מנכסים:</span>
                        <span class="result-value">${result.totalMonthlyIncome.toLocaleString('he-IL', { maximumFractionDigits: 0 })}₪</span>
                    </div>
                ` : ''}
            </div>

            <div class="result-note">
                <p><strong>שימו לב:</strong> הכנסה זו מתווספת להכנסותיכם האחרות בבדיקת הזכאות להשלמת הכנסה.</p>
                <p>לבדיקה מדויקת יש לפנות לסניף הביטוח הלאומי או לקו השירות *6050.</p>
            </div>

            ${this.parentState ? `
                <button class="btn btn-primary return-to-parent" id="btn-return-to-parent">
                    חזרה לשאלון בדיקת הזכאות עם הסכום המחושב
                </button>
            ` : ''}
        `;
        this.resultEl.classList.remove('hidden');

        // Setup return button if in sub-questionnaire
        if (this.parentState) {
            const returnBtn = this.resultEl.querySelector('#btn-return-to-parent');
            if (returnBtn) {
                returnBtn.addEventListener('click', () => {
                    this.returnFromSubQuestionnaire(result.totalMonthlyIncome);
                });
            }
        }

        // Show navigation
        this.navEl.classList.remove('hidden');
    }

    /**
     * Handle an answer selection
     */
    handleAnswer(question, value) {
        // Find the selected option
        const selectedOption = question.options.find(opt => opt.value === value);
        if (!selectedOption) return;

        // Store the answer
        this.answers[question.id] = {
            question: question.question,
            value: value,
            label: selectedOption.label
        };

        // Support storing additional fields (e.g., work status, preset numeric values)
        // _hidden: true so these internal values don't appear in the answers summary
        if (selectedOption.storeAs) {
            Object.entries(selectedOption.storeAs).forEach(([key, storeValue]) => {
                this.answers[key] = {
                    question: question.question,
                    value: storeValue,
                    label: typeof storeValue === 'number'
                        ? storeValue.toLocaleString('he-IL')
                        : storeValue,
                    _hidden: true
                };
            });
        }

        // Determine next action
        if (selectedOption.subQuestionnaire) {
            // Load sub-questionnaire
            this.loadSubQuestionnaire(selectedOption.subQuestionnaire, selectedOption.returnTo, selectedOption.returnStoreAs);
        } else if (selectedOption.result) {
            // Show result
            this.showResult(selectedOption.result);
        } else if (selectedOption.next) {
            // Show next question
            this.showQuestion(selectedOption.next);
        }
    }

    /**
     * Load a sub-questionnaire
     */
    async loadSubQuestionnaire(questionnaireId, returnToQuestion, returnStoreAs) {
        // Save current state
        this.parentState = {
            data: this.data,
            answers: { ...this.answers },
            questionHistory: [...this.questionHistory],
            currentQuestionId: this.currentQuestionId,
            jsonPath: this.jsonPath,
            triggerQuestionId: this.currentQuestionId,
            returnStoreAs: returnStoreAs || null
        };
        this.returnToQuestion = returnToQuestion;

        // Load the sub-questionnaire
        try {
            const subPath = this.jsonPath.replace(/[^/]+\.json$/, questionnaireId + '.json');
            const response = await fetch(subPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();

            // Reset for sub-questionnaire
            this.questionHistory = [];

            // Update header
            this.renderHeader();

            // Start sub-questionnaire
            if (this.data.intro) {
                this.showIntro();
            } else {
                const firstQuestion = this.data.questions[0];
                if (firstQuestion) {
                    this.showQuestion(firstQuestion.id);
                }
            }
        } catch (error) {
            console.error('Error loading sub-questionnaire:', error);
            this.showError('שגיאה בטעינת שאלון המשנה');
        }
    }

    /**
     * Return from sub-questionnaire to parent questionnaire
     */
    async returnFromSubQuestionnaire(calculatedValue, resultKey) {
        if (!this.parentState) return;

        const triggerQuestionId = this.parentState.triggerQuestionId;

        // Restore parent state
        this.data = this.parentState.data;
        this.answers = this.parentState.answers;
        this.questionHistory = this.parentState.questionHistory;
        this.jsonPath = this.parentState.jsonPath;

        // Store the calculated value from sub-questionnaire
        const returnStoreAs = this.parentState.returnStoreAs || 'q4_imputed_income_amount';
        if (calculatedValue !== undefined) {
            this.answers[returnStoreAs] = {
                question: returnStoreAs === 'q7_vehicle_value' ? 'שווי רכב (מחושב מהשאלון)' : 'הכנסה רעיונית חודשית מנכסים (מחושב)',
                value: calculatedValue,
                label: `${calculatedValue.toLocaleString('he-IL')}₪`
            };
        }

        // Clear parent state
        const returnTo = this.returnToQuestion;
        this.parentState = null;
        this.returnToQuestion = null;

        // Update header back to parent questionnaire
        this.renderHeader();

        // Hide result and nav
        this.resultEl.classList.add('hidden');
        this.navEl.classList.add('hidden');

        // If child not eligible — clear the trigger answer and return to that question
        if (resultKey === 'not_eligible') {
            delete this.answers[triggerQuestionId];
            this.showQuestion(triggerQuestionId);
        } else {
            this.showQuestion(returnTo);
        }
    }

    /**
     * Show the final result
     */
    showResult(resultKey) {
        const result = this.data.results[resultKey];
        if (!result) {
            console.error('Result not found:', resultKey);
            return;
        }

        // Check if this is a dynamic calculation result
        if (result.dynamic) {
            this.showDynamicResult(resultKey);
            return;
        }

        // Hide questions
        this.contentEl.innerHTML = '';

        // Show result
        this.resultEl.className = `result-container ${result.status}`;
        this.resultEl.innerHTML = `
            <div class="result-icon"></div>
            <h2 class="result-title">${result.title}</h2>
            <p class="result-message">${this.resolveDescriptionTemplates(result.message || '')}</p>
               ${result.link ? (this.parentState
                    ? `<button class="result-link btn btn-primary" id="btn-return-to-parent">${result.link.text}</button>`
                    : `<a href="${result.link.url}" class="result-link btn btn-primary">${result.link.text}</a>`)
                + `<br><small class="skip-link" style="margin-top: 10px; display: inline-block;"><a href="javascript:void(0)" class="skip-button">דלק על השלב הזה →</a></small>` : ''}
            ${result.calculator ? this.renderCalculator(result.calculator) : ''}
            ${this.renderAnswersSummary()}
        `;
        this.resultEl.classList.remove('hidden');

        // Setup return button if in sub-questionnaire
        if (this.parentState) {
            const returnBtn = this.resultEl.querySelector('#btn-return-to-parent');
            if (returnBtn) {
                returnBtn.addEventListener('click', () => {
                    this.returnFromSubQuestionnaire(undefined, resultKey);
                });
            }
        }

        // Setup calculator if exists
        if (result.calculator) {
            this.setupCalculator(result.calculator);
        }

        // Show navigation
        this.navEl.classList.remove('hidden');
    }

    /**
     * Show dynamic result with income supplement calculation
     */
    showDynamicResult(resultKey) {
        const result = this.data.results[resultKey];
        if (!result) return;

        // Vehicle deduction calculation (standalone vehicle questionnaire)
        if (result.type === 'calculate_vehicle') {
            this.showVehicleDeductionResult(result);
            return;
        }

        // Calculate income supplement
        const calculation = this.calculateIncomeSupplementEligibility();

        // Hide questions
        this.contentEl.innerHTML = '';

        // Build result HTML
        let resultHtml = `
            <div class="result-icon"></div>
            <h2 class="result-title">${result.title}</h2>
        `;

        if (calculation.eligible) {
            resultHtml += `
                <div class="eligibility-result success">
                    <h3>✓ ייתכן שאת/ה זכאי/ת להשלמת הכנסה</h3>
                    <p class="result-message">${result.message}</p>
                </div>
            `;
        } else {
            resultHtml += `
                <div class="eligibility-result not-eligible">
                    <h3>✗ לא זכאי/ת להשלמת הכנסה</h3>
                    <p class="result-message">${calculation.reason}</p>
                </div>
            `;
        }

        // Calculation details
        resultHtml += `
            <div class="calculation-details">
                <h4>פירוט החישוב</h4>
                <table class="calculation-table">
                    <tr>
                        <td class="calc-label">הרכב משפחה:</td>
                        <td class="calc-value">${calculation.familyComposition}</td>
                    </tr>
                    <tr>
                        <td class="calc-label">תקרת השלמה:</td>
                        <td class="calc-value">${calculation.ceiling.toLocaleString('he-IL')}₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">קצבת זיקנה:</td>
                        <td class="calc-value">${calculation.incomes.oldAgePension.toLocaleString('he-IL')}₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">תקרת הכנסה מפנסיה:</td>
                        <td class="calc-value">${calculation.deductions.pensionExemption.toLocaleString('he-IL')}₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">הכנסה מפנסיה (לפני קיזוז):</td>
                        <td class="calc-value">${calculation.incomes.pensionIncome.toLocaleString('he-IL')}₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">קיזוז - הכנסה מפנסיה:</td>
                        <td class="calc-value">-${calculation.deductions.pensionDeduction.toLocaleString('he-IL')}₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">תקרת הכנסה מעבודה:</td>
                        <td class="calc-value">${calculation.deductions.workExemption.toLocaleString('he-IL')}₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">הכנסה מעבודה (לפני קיזוז):</td>
                        <td class="calc-value">${calculation.incomes.workIncome.toLocaleString('he-IL')}₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">קיזוז - הכנסה מעבודה:</td>
                        <td class="calc-value">-${calculation.deductions.workDeduction.toLocaleString('he-IL')}₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">הכנסה רעיונית מנכסים:</td>
                        <td class="calc-value">${calculation.incomes.imputedIncome.toLocaleString('he-IL', { maximumFractionDigits: 0 })}₪</td>
                    </tr>
                    <tr class="calculation-row-total">
                        <td class="calc-label"><strong>סה"כ הכנסה נטו:</strong></td>
                        <td class="calc-value"><strong>${calculation.netIncome.toLocaleString('he-IL')}₪</strong></td>
                    </tr>
                    <tr>
                        <td class="calc-label">זכות להשלמה (אחרי קיזוזי הכנסה):</td>
                        <td class="calc-value">${calculation.estimatedSupplementBeforeVehicle.toLocaleString('he-IL')}₪</td>
                    </tr>
                    ${calculation.incomes.vehicleValue ? `
                    <tr>
                        <td class="calc-label">שווי רכב (לוי יצחק):</td>
                        <td class="calc-value">${calculation.incomes.vehicleValue.toLocaleString('he-IL')}₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">${calculation.deductions.employmentStatus ? calculation.deductions.employmentStatus : 'סכום ההפחתה משווי רכב'} (הפחתה: ${calculation.deductions.vehicleDeductionBase.toLocaleString('he-IL')}₪):</td>
                        <td class="calc-value">${calculation.deductions.vehicleDeductionBase.toLocaleString('he-IL')}₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">קיזוז רכב (${(calculation.deductions.vehicleDeductionRate * 100).toFixed(0)}% מהערך לאחר הפחתה):</td>
                        <td class="calc-value">-${calculation.deductions.vehicleDeduction.toLocaleString('he-IL')}₪</td>
                    </tr>
                    ${calculation.deductions.vehicleNote ? `
                    <tr>
                        <td class="calc-label">הערה לגבי רכב:</td>
                        <td class="calc-value">${calculation.deductions.vehicleNote}</td>
                    </tr>` : ''}
                    ` : ''}
                    <tr class="calculation-row-supplement">
                        <td class="calc-label"><strong>השלמה משוערת (אחרי קיזוז רכב):</strong></td>
                        <td class="calc-value"><strong>${calculation.estimatedSupplement.toLocaleString('he-IL')}₪</strong></td>
                    </tr>
        `;

        resultHtml += `
                </table>
                <p class="calculation-note"><strong>שימו לב:</strong> זהו חישוב משוער בלבד. הסכומים בפועל עשויים להיות שונים. לבדיקה מדויקת יש לפנות לביטוח הלאומי.</p>
            </div>
        `;

        // Summary
        resultHtml += this.renderAnswersSummary();

        this.resultEl.className = `result-container ${calculation.eligible ? 'success' : 'error'}`;
        this.resultEl.innerHTML = resultHtml;
        this.resultEl.classList.remove('hidden');

        // Show navigation
        this.navEl.classList.remove('hidden');
    }

    /**
     * Show vehicle deduction result for standalone vehicle questionnaire
     */
    showVehicleDeductionResult(result) {
        const rules = this.data.calculationRules?.vehicleRules || {};

        const vehicleValue    = parseFloat(this.answers['vehicle_value']?.value) || 0;
        const retirementAge   = this.answers['retirement_age']?.value === 'yes';
        const workStatus      = this.answers['work_status']?.value || 'not_working';
        const workIncome      = parseFloat(this.answers['work_income']?.value) || 0;
        const specialStatus   = this.answers['special_status']?.value === 'special';
        const dismissedGrace  = this.answers['dismissed_grace']?.value === 'yes';
        const incomeDropGrace = this.answers['income_drop_grace']?.value === 'yes';

        const deductionRate   = rules.deductionRate || 0.03;
        const incomeThreshold = retirementAge
            ? (rules.workIncomeThreshold?.retirement || 2341)
            : (rules.workIncomeThreshold?.regular    || 3442);

        // Grace period overrides: treat as "working" with adjusted income
        let effectiveWorkStatus = workStatus;
        let effectiveWorkIncome = workIncome;
        let graceNote = '';
        if (dismissedGrace) {
            effectiveWorkStatus = 'working';
            graceNote = 'חישוב זה מתבסס על תקופת מעבר של עד 3 חודשים לאחר הפיטורין/ההתפטרות. לאחר מכן יש לפנות לביטוח הלאומי לעדכון.';
        } else if (incomeDropGrace) {
            effectiveWorkStatus = 'working';
            effectiveWorkIncome = rules.workIncomeThreshold?.regular || 3442; // 25% מהשכר הממוצע
            graceNote = 'חישוב זה מתבסס על תקופת מעבר של עד 3 חודשים לאחר ירידת ההכנסה — ההכנסה המיוחסת: 25% מהשכר הממוצע. לאחר מכן יש לפנות לביטוח הלאומי לעדכון.';
        }

        let deductionBase, categoryLabel;
        if (effectiveWorkStatus === 'working' && effectiveWorkIncome > incomeThreshold) {
            deductionBase = rules.deductions?.high_income_worker || 19610;
            categoryLabel = `עובד/ת המשתכר/ת מעל ${incomeThreshold.toLocaleString('he-IL')} ₪/חודש`;
        } else {
            deductionBase = rules.deductions?.other || 11227;
            if (effectiveWorkStatus === 'not_working') {
                categoryLabel = specialStatus
                    ? 'לא עובד/ת — מקבל/ת קצבת שאירים / תלויים בנפגע עבודה'
                    : 'לא עובד/ת';
            } else {
                categoryLabel = `עובד/ת המשתכר/ת עד ${incomeThreshold.toLocaleString('he-IL')} ₪/חודש`;
            }
        }
        if (dismissedGrace)  categoryLabel += ' (תקופת מעבר — פוטר/ה או התפטר/ה)';
        if (incomeDropGrace) categoryLabel += ' (תקופת מעבר — ירידת הכנסה)';

        const adjustedValue    = Math.max(0, vehicleValue - deductionBase);
        const monthlyDeduction = Math.round(adjustedValue * deductionRate);

        let statusClass, statusTitle;
        if (monthlyDeduction === 0) {
            statusClass = 'success';
            statusTitle = 'שווי הרכב אינו מפחית את תוספת הבטחת ההכנסה';
        } else {
            statusClass = 'info';
            statusTitle = `הרכב מפחית את התוספת ב־${monthlyDeduction.toLocaleString('he-IL')} ₪ לחודש`;
        }

        this.contentEl.innerHTML = '';
        this.resultEl.className  = `result-container ${statusClass}`;
        this.resultEl.innerHTML  = `
            <div class="result-icon"></div>
            <h2 class="result-title">${result.title}</h2>

            <div class="calculation-details">
                <h4>פירוט החישוב</h4>
                <table class="calculation-table">
                    <tr>
                        <td class="calc-label">שווי הרכב (לוי יצחק):</td>
                        <td class="calc-value">${vehicleValue.toLocaleString('he-IL')} ₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">קטגוריה:</td>
                        <td class="calc-value">${categoryLabel}</td>
                    </tr>
                    <tr>
                        <td class="calc-label">ניכוי בסיסי — שלב 1:</td>
                        <td class="calc-value">− ${deductionBase.toLocaleString('he-IL')} ₪</td>
                    </tr>
                    <tr>
                        <td class="calc-label">שווי לחישוב (לאחר ניכוי):</td>
                        <td class="calc-value">${adjustedValue.toLocaleString('he-IL')} ₪</td>
                    </tr>
                    <tr class="calculation-row-supplement">
                        <td class="calc-label"><strong>הפחתה חודשית מהתוספת — שלב 2 (× ${(deductionRate * 100).toFixed(0)}%):</strong></td>
                        <td class="calc-value"><strong>${monthlyDeduction.toLocaleString('he-IL')} ₪</strong></td>
                    </tr>
                </table>

                <div class="eligibility-result ${statusClass}" style="margin-top:15px;padding:15px;border-radius:8px;">
                    <h3>${statusTitle}</h3>
                </div>

                ${graceNote ? `<p class="calculation-note" style="margin-top:10px;background:#fff3cd;padding:10px;border-radius:6px;"><strong>תקופת מעבר:</strong> ${graceNote}</p>` : ''}
                <p class="calculation-note" style="margin-top:15px;">
                    <strong>שימו לב:</strong> זהו חישוב משוער בלבד.
                    לבדיקה מדויקת יש לפנות לביטוח הלאומי (*6050).
                </p>
            </div>

            ${this.parentState ? `
                <button class="btn btn-primary return-to-parent" id="btn-return-to-parent">
                    חזרה לשאלון בדיקת הזכאות עם נתוני הרכב
                </button>
            ` : ''}

            ${this.renderAnswersSummary()}
        `;
        this.resultEl.classList.remove('hidden');

        // Setup return button if in sub-questionnaire
        if (this.parentState) {
            const returnBtn = this.resultEl.querySelector('#btn-return-to-parent');
            if (returnBtn) {
                returnBtn.addEventListener('click', () => {
                    this.returnFromSubQuestionnaire(vehicleValue);
                });
            }
        }

        this.navEl.classList.remove('hidden');
    }

    /**
     * Calculate income supplement eligibility and amount
     */
    calculateIncomeSupplementEligibility() {
        const rules = this.data.calculationRules;
        const familyCompositionValue = this.answers['q4_family_composition']?.value;
        const familyCompositionLabel = this.answers['q4_family_composition']?.label;

        // Get ceiling for this family composition
        let ceiling = 0;
        if (familyCompositionValue && rules.familyCompositions && rules.familyCompositions[familyCompositionValue]) {
            ceiling = rules.familyCompositions[familyCompositionValue].ceiling;
        }

        // Determine family/age context
        const isCoupleFamily = !!familyCompositionValue?.includes('couple');
        const isRetirementAge = familyCompositionValue && (familyCompositionValue.includes('70_80') || familyCompositionValue.includes('over80'));

        // Extract income amounts
        const oldAgePension = parseFloat(this.answers['q1_old_age_pension_amount']?.value) || 0;
        const pensionIncome = parseFloat(this.answers['q2_pension_income_amount']?.value) || 0;
        const workIncome = parseFloat(this.answers['q3_work_income_amount']?.value) || 0;
        const imputedIncome = parseFloat(this.answers['q4_imputed_income_amount']?.value) || 0;
        const vehicleValue = parseFloat(this.answers['q7_vehicle_value']?.value) || 0;
        const workStatus = this.answers['q6_work_status']?.value || this.answers['q6_work_status']?.label || 'not_working';
        const isSpecialStatus = this.answers['q8_special_status']?.value === 'special';

        // Get exemption amounts for display
        const pensionExemption = isCoupleFamily ? (rules.incomeDeductions.pensionIncome.exemption_couple || 2823) : (rules.incomeDeductions.pensionIncome.exemption_single || rules.incomeDeductions.pensionIncome.exemption || 1790);
        const isSelfEmployed = workStatus === 'self_employed';
        const workExemption = isSelfEmployed
            ? (rules.incomeDeductions.workIncome.exemption_self_employed || 4655)
            : isCoupleFamily ? (rules.incomeDeductions.workIncome.exemption_couple || 3786) : (rules.incomeDeductions.workIncome.exemption_single || rules.incomeDeductions.workIncome.exemption || 3236);

        // Calculate deductions according to rules
        const pensionDeduction = this.calculatePensionDeduction(pensionIncome, rules, isCoupleFamily);
        const workDeduction = this.calculateWorkDeduction(workIncome, rules, isCoupleFamily, workStatus);
        const imputedDeduction = imputedIncome * rules.incomeDeductions.imputedIncome.deductionRate;
        const vehicleDeductionInfo = this.calculateVehicleDeduction(vehicleValue, workIncome, workStatus, isRetirementAge, isSpecialStatus, rules.vehicleRules);
        const vehicleDeduction = vehicleDeductionInfo.deduction;
        const vehicleDeductionBase = vehicleDeductionInfo.deductionBase || 0;

        // Calculate total counted income without vehicle deduction
        const netIncomeWithoutVehicle = oldAgePension + pensionDeduction + workDeduction + imputedDeduction;

        // Calculate initial supplement (before vehicle deduction)
        const estimatedSupplementBeforeVehicle = Math.max(0, ceiling - netIncomeWithoutVehicle);

        // Calculate final supplement (after vehicle deduction)
        // If vehicle deduction is greater than supplement, final supplement is 0
        const estimatedSupplement = Math.max(0, estimatedSupplementBeforeVehicle - vehicleDeduction);

        // Total net income including vehicle deduction (for eligibility check)
        const netIncome = netIncomeWithoutVehicle + vehicleDeduction;

        // Check eligibility
        const eligible = netIncome < ceiling;

        return {
            eligible: eligible,
            reason: eligible ? '' : `סה"כ הכנסותיך (${netIncome.toLocaleString('he-IL')}₪) עולה על התקרה (${ceiling.toLocaleString('he-IL')}₪).`,
            familyComposition: familyCompositionLabel,
            ceiling: ceiling,
            incomes: {
                oldAgePension: oldAgePension,
                pensionIncome: pensionIncome,
                workIncome: workIncome,
                imputedIncome: imputedIncome,
                vehicleValue: vehicleValue
            },
            deductions: {
                pensionDeduction: pensionDeduction,
                pensionExemption: pensionExemption,
                workDeduction: workDeduction,
                workExemption: workExemption,
                imputedDeduction: imputedDeduction,
                vehicleDeduction: vehicleDeduction,
                vehicleDeductionBase: vehicleDeductionBase,
                vehicleDeductionRate: rules.vehicleRules?.deductionRate || 0.03,
                vehicleNote: vehicleDeductionInfo.note
            },
            netIncome: netIncome,
            estimatedSupplementBeforeVehicle: estimatedSupplementBeforeVehicle,
            estimatedSupplement: estimatedSupplement
        };
    }

    /**
     * Calculate pension income deduction according to rules
     */
    calculatePensionDeduction(pensionIncome, rules, isCoupleFamily = false) {
        const rule = rules.incomeDeductions.pensionIncome;
        // Backward compatibility: support single exemption or separate single/couple
        const exemption = isCoupleFamily ? (rule.exemption_couple || rule.exemption) : (rule.exemption_single || rule.exemption);
        if (pensionIncome <= exemption) {
            return 0;
        }
        const taxableAmount = pensionIncome - exemption;
        return taxableAmount * rule.deductionRate;
    }

    /**
     * Calculate work income deduction according to rules
     */
    calculateWorkDeduction(workIncome, rules, isCoupleFamily = false, workStatus = '') {
        const rule = rules.incomeDeductions.workIncome;
        const isSelfEmployed = workStatus === 'self_employed';
        const exemption = isSelfEmployed
            ? (rule.exemption_self_employed || rule.exemption_single || rule.exemption)
            : isCoupleFamily ? (rule.exemption_couple || rule.exemption) : (rule.exemption_single || rule.exemption);
        if (workIncome <= exemption) {
            return 0;
        }
        const taxableAmount = workIncome - exemption;
        return taxableAmount * rule.deductionRate;
    }

    /**
     * Calculate vehicle-related deduction as imputed income
     * Logic:
     * 1. Up to 46,138 ₪ = no deduction
     * 2. 46,138 to 65,343 ₪ = subtract deduction base (depends on work/retirement age), then 3% of remainder
     * 3. Above 65,343 ₪ = no eligibility (special cases only)
     */
    calculateVehicleDeduction(vehicleValue, workIncome, workStatus, isRetirementAge, isSpecialStatus, vehicleRules) {
        if (!vehicleValue || vehicleValue <= 0 || !vehicleRules) {
            return { deduction: 0, note: '', deductionBase: 0 };
        }

        // Base threshold - no deduction up to 46,138
        const baseThreshold = vehicleRules.baseThreshold; // 46,138

        // Extended threshold - 65,343
        const extendedThreshold = vehicleRules.extendedThreshold; // 65,343

        // If below base threshold, no deduction at all
        if (vehicleValue <= baseThreshold) {
            return { deduction: 0, note: '', deductionBase: 0 };
        }

        // If above extended threshold, cannot be eligible (special case warning)
        if (vehicleValue > extendedThreshold) {
            return {
                deduction: 0,
                note: `שווי הרכב גבוה מ-${extendedThreshold.toLocaleString('he-IL')} ₪ - אין זכאות לקצבה (אלא במקרים מיוחדים בלבד). יש לפנות לביטוח הלאומי לבדיקה ידנית.`,
                deductionBase: 0
            };
        }

        // Between baseThreshold and extendedThreshold - apply deduction logic
        const normalizedStatus = (workStatus || '').toString().toLowerCase();
        const isWorking = normalizedStatus.includes('employed') || normalizedStatus.includes('self');

        let deductionBase = 0;
        let employmentStatus = ''; // For display purposes

        if (isWorking) {
            // Worker: check income thresholds
            const incomeThreshold = isRetirementAge ? vehicleRules.workIncomeThreshold.retirement : vehicleRules.workIncomeThreshold.regular;
            // High income: 19,610 ₪
            // Low income: 10,380 ₪
            if (workIncome > incomeThreshold) {
                deductionBase = vehicleRules.deductions.high_income_worker;    // 19,610
                employmentStatus = `עובד/ת עם הכנסה מעל ${incomeThreshold.toLocaleString('he-IL')}₪`;
            } else {
                deductionBase = vehicleRules.deductions.low_income_worker;     // 10,380
                employmentStatus = `עובד/ת עם הכנסה מתחת ${incomeThreshold.toLocaleString('he-IL')}₪`;
            }
        } else {
            // Non-worker
            if (isRetirementAge || isSpecialStatus) {
                // Retirement age / survivors benefit / work injury dependents: 11,227 ₪
                deductionBase = vehicleRules.deductions.non_worker_extended; // 11,227
                employmentStatus = isRetirementAge ? 'לא עובד/ת - גיל פרישה' : 'לא עובד/ת - מקבל/ת קצבת שאירים/תלויים';
            } else {
                // Regular non-worker: 10,380 ₪
                deductionBase = vehicleRules.deductions.non_worker_regular;  // 10,380
                employmentStatus = 'לא עובד/ת';
            }
        }

        // Calculate: (vehicle value - deduction base) * 3%
        const adjustedValue = vehicleValue - deductionBase;
        const deduction = adjustedValue > 0 ? adjustedValue * vehicleRules.deductionRate : 0;

        return {
            deduction: deduction,
            note: '',
            adjustedValue: adjustedValue,
            deductionBase: deductionBase,
            employmentStatus: employmentStatus
        };
    }

    /**
     * Render the imputed income calculator
     */
    renderCalculator(calcConfig) {
        const minFormatted = calcConfig.min.toLocaleString('he-IL');
        const maxFormatted = calcConfig.max < 10000000 ? calcConfig.max.toLocaleString('he-IL') : '';

        let rangeText = '';
        if (calcConfig.min === 0) {
            rangeText = `(עד ${maxFormatted}₪)`;
        } else if (calcConfig.max >= 10000000) {
            rangeText = `(מעל ${minFormatted}₪)`;
        } else {
            rangeText = `(${minFormatted}₪ - ${maxFormatted}₪)`;
        }

        return `
            <div class="calculator-container">
                <h4>מחשבון הכנסה רעיונית</h4>
                <div class="calculator-field">
                    <label for="asset-input">סכום הנכסים ${rangeText}:</label>
                    <input type="number" id="asset-input" class="calculator-input"
                           placeholder="הזן סכום"
                           min="${calcConfig.min}"
                           max="${calcConfig.max < 10000000 ? calcConfig.max : ''}"
                           data-min="${calcConfig.min}"
                           data-max="${calcConfig.max}">
                    <div id="calc-range-error" class="calculator-error hidden"></div>
                </div>
                <div class="calculator-field">
                    <label>הכנסה רעיונית חודשית:</label>
                    <div id="calc-result" class="calculator-output">-</div>
                </div>
                <div class="calculator-field">
                    <label>הכנסה רעיונית שנתית:</label>
                    <div id="calc-result-yearly" class="calculator-output">-</div>
                </div>
            </div>
        `;
    }

    /**
     * Setup calculator event listeners
     */
    setupCalculator(calcConfig) {
        const input = document.getElementById('asset-input');
        const resultEl = document.getElementById('calc-result');
        const resultYearlyEl = document.getElementById('calc-result-yearly');
        const errorEl = document.getElementById('calc-range-error');

        if (!input || !resultEl) return;

        const minAmount = calcConfig.min;
        const maxAmount = calcConfig.max;
        const type = calcConfig.type;

        // Thresholds based on family status
        const thresholds = type === 'single'
            ? { tier1: 41528, tier2: 83056 }
            : { tier1: 62292, tier2: 124584 };

        input.addEventListener('input', () => {
            const amount = parseFloat(input.value) || 0;

            // Validate range
            if (amount < minAmount && amount > 0) {
                errorEl.textContent = `הסכום המינימלי למדרגה זו הוא ${minAmount.toLocaleString('he-IL')}₪`;
                errorEl.classList.remove('hidden');
                resultEl.textContent = '-';
                resultYearlyEl.textContent = '-';
                return;
            }

            if (maxAmount < 10000000 && amount > maxAmount) {
                errorEl.textContent = `הסכום המקסימלי למדרגה זו הוא ${maxAmount.toLocaleString('he-IL')}₪`;
                errorEl.classList.remove('hidden');
                resultEl.textContent = '-';
                resultYearlyEl.textContent = '-';
                return;
            }

            errorEl.classList.add('hidden');

            if (amount <= 0) {
                resultEl.textContent = '-';
                resultYearlyEl.textContent = '-';
                return;
            }

            // Calculate imputed income in tiers
            let yearlyIncome = 0;

            if (amount <= thresholds.tier1) {
                // Tier 1: 1.5%
                yearlyIncome = amount * 0.015;
            } else if (amount <= thresholds.tier2) {
                // Tier 1 + Tier 2: 1.5% + 3%
                yearlyIncome = (thresholds.tier1 * 0.015) +
                               ((amount - thresholds.tier1) * 0.03);
            } else {
                // All three tiers: 1.5% + 3% + 5%
                yearlyIncome = (thresholds.tier1 * 0.015) +
                               ((thresholds.tier2 - thresholds.tier1) * 0.03) +
                               ((amount - thresholds.tier2) * 0.05);
            }

            const monthlyIncome = yearlyIncome / 12;

            resultEl.textContent = monthlyIncome.toLocaleString('he-IL', {
                style: 'currency',
                currency: 'ILS',
                maximumFractionDigits: 0
            });
            resultYearlyEl.textContent = yearlyIncome.toLocaleString('he-IL', {
                style: 'currency',
                currency: 'ILS',
                maximumFractionDigits: 0
            });
        });
    }

    /**
     * Render summary of all answers
     */
    renderAnswersSummary() {
        if (Object.keys(this.answers).length === 0) return '';

        const answersHtml = Object.values(this.answers).filter(a => !a._hidden).map(answer => `
            <div class="answer-item">
                <span class="answer-question">${this.resolveDescriptionTemplates(answer.question)}</span>
                <span class="answer-value">${answer.label}</span>
            </div>
        `).join('');

        return `
            <div class="answers-summary">
                <h4>סיכום התשובות:</h4>
                ${answersHtml}
            </div>
        `;
    }

    /**
     * Go back to last question from result screen
     */
    goBackFromResult() {
        // Hide result
        this.resultEl.classList.add('hidden');
        this.navEl.classList.add('hidden');

        // Get the last question from history
        const lastQuestionId = this.questionHistory[this.questionHistory.length - 1];

        // Remove it from history (showQuestion will add it back)
        this.questionHistory.pop();

        // Remove the answer so user can re-answer
        delete this.answers[lastQuestionId];

        // Show the last question
        this.showQuestion(lastQuestionId);
    }

    /**
     * Restart the questionnaire
     */
    restart() {
        this.startQuestionnaire();
    }

    /**
     * Show error message
     */
    showError(message) {
        this.headerEl.innerHTML = '';
        this.contentEl.innerHTML = `
            <div class="error-state">
                <h3>⚠️ שגיאה</h3>
                <p>${message}</p>
                <p>אנא נסה לרענן את הדף או לחזור מאוחר יותר.</p>
            </div>
        `;
    }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionnaireEngine;
}
