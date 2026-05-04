// ===== Global Variables =====
let chaptersData = null;

// ===== Initialize Application =====
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load JSON data
        const response = await fetch('sampels_questions.json');
        chaptersData = await response.json();

        // Render chapters
        renderChapters();

        // Initialize accordion functionality
        initializeAccordions();
        openFromHash();
        window.addEventListener('hashchange', openFromHash);

    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('content').innerHTML = '<p style="color: red; text-align: center;">שגיאה בטעינת הנתונים</p>';
    }
});

// ===== Render Chapters =====
function renderChapters() {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    chaptersData.chapters.forEach(chapter => {
        const chapterDiv = createChapterAccordion(chapter);
        contentDiv.appendChild(chapterDiv);
    });
}

// ===== Create Chapter Accordion =====
function createChapterAccordion(chapter) {
    const chapterDiv = document.createElement('div');
    chapterDiv.className = 'accordion-chapter';
    chapterDiv.id = 'ch-' + chapter.id;

    // Chapter Header
    const chapterHeader = document.createElement('div');
    chapterHeader.className = 'accordion-chapter-header';
    chapterHeader.innerHTML = `
        <span>${chapter.title}</span>
        <span class="arrow">▼</span>
    `;

    // Chapter Content
    const chapterContent = document.createElement('div');
    chapterContent.className = 'accordion-chapter-content';

    // Add all questions
    chapter.questions.forEach(question => {
        const questionDiv = createQuestionAccordion(question, chapter.id);
        chapterContent.appendChild(questionDiv);
    });

    chapterDiv.appendChild(chapterHeader);
    chapterDiv.appendChild(chapterContent);

    return chapterDiv;
}

// ===== Create Question Accordion =====
function createQuestionAccordion(question, chapterId) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'accordion-question';
    questionDiv.id = 'ch-' + chapterId + '-q' + question.questionNumber;

    // Question Header
    const questionHeader = document.createElement('div');
    questionHeader.className = 'accordion-question-header';
    questionHeader.innerHTML = `
        <span>שאלה ${question.questionNumber}: ${question.questionText}</span>
        <span class="arrow">▼</span>
    `;

    // Question Content
    const questionContent = document.createElement('div');
    questionContent.className = 'accordion-question-content';

    // Add answer section
    if (question.answer) {
        const answerSection = document.createElement('div');
        answerSection.className = 'question-answer';
        answerSection.innerHTML = `
            <h4>תשובה:</h4>
            <p>${question.answer}</p>
        `;
        questionContent.appendChild(answerSection);
    }

    // Add conditions section
    if (question.conditions && question.conditions.length > 0) {
        const conditionsSection = document.createElement('div');
        conditionsSection.className = 'conditions-section';
        conditionsSection.innerHTML = `
            <h4>תנאים לקבלת התוספת:</h4>
            <ol>
                ${question.conditions.map(cond => `<li>${cond}</li>`).join('')}
            </ol>
        `;
        questionContent.appendChild(conditionsSection);
    }

    // Add calculations section
    if (question.calculations && question.calculations.length > 0) {
        const calcSection = document.createElement('div');
        calcSection.className = 'calculations-section';
        calcSection.innerHTML = `
            <h4>נוסחת החישוב:</h4>
            <ul>
                ${question.calculations.map(calc => `<li>${calc}</li>`).join('')}
            </ul>
        `;
        questionContent.appendChild(calcSection);
    }

    // Add tables section
    if (question.tables && question.tables.length > 0) {
        question.tables.forEach(table => {
            const tableSection = createTableSection(table);
            questionContent.appendChild(tableSection);
        });
    }

    // Add special cases
    if (question.specialCases && question.specialCases.length > 0) {
        const specialSection = createSpecialCasesSection(question.specialCases);
        questionContent.appendChild(specialSection);
    }

    // Add important note
    if (question.importantNote) {
        const noteSection = document.createElement('div');
        noteSection.className = 'important-note';
        noteSection.innerHTML = `
            <h4>חשוב לדעת:</h4>
            <p>${question.importantNote}</p>
        `;
        questionContent.appendChild(noteSection);
    }

    // Add conclusion
    if (question.conclusion) {
        const conclusionSection = document.createElement('div');
        conclusionSection.className = 'conclusion-section';
        conclusionSection.innerHTML = `
            <h4>מסקנה:</h4>
            <p>${question.conclusion}</p>
        `;
        questionContent.appendChild(conclusionSection);
    }

    // Add examples section
    if (question.examples && question.examples.length > 0) {
        const examplesContainer = createExamplesContainer(question.examples, chapterId, question.questionNumber);
        questionContent.appendChild(examplesContainer);
    }

    // Add additional info
    if (question.additionalInfo) {
        const infoSection = document.createElement('div');
        infoSection.className = 'additional-info';
        const linkHtml = question.additionalInfoUrl
            ? `<a href="${question.additionalInfoUrl}" target="_blank" rel="noopener noreferrer">${question.additionalInfo}</a>`
            : question.additionalInfo;
        infoSection.innerHTML = `<p>למידע נוסף: ${linkHtml}</p>`;
        questionContent.appendChild(infoSection);
    }

    questionDiv.appendChild(questionHeader);
    questionDiv.appendChild(questionContent);

    return questionDiv;
}

// ===== Create Table Section =====
function createTableSection(table) {
    const tableSection = document.createElement('div');
    tableSection.className = 'table-section';

    let tableHTML = `<h4>${table.title}</h4>`;
    tableHTML += '<table class="data-table">';

    // Add headers if exists
    if (table.headers && table.headers.length > 0) {
        tableHTML += '<thead><tr>';
        table.headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr></thead>';
    }

    // Add rows
    tableHTML += '<tbody>';
    table.rows.forEach(row => {
        tableHTML += '<tr>';
        row.forEach(cell => {
            tableHTML += `<td>${cell}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';

    tableSection.innerHTML = tableHTML;
    return tableSection;
}

// ===== Create Special Cases Section =====
function createSpecialCasesSection(specialCases) {
    const section = document.createElement('div');
    section.className = 'special-cases';

    let html = '<h4>מקרים מיוחדים:</h4>';
    specialCases.forEach(specialCase => {
        html += `<div class="special-case">`;
        html += `<h5>${specialCase.condition}</h5>`;
        html += `<ul>`;
        specialCase.details.forEach(detail => {
            html += `<li>${detail}</li>`;
        });
        html += `</ul></div>`;
    });

    section.innerHTML = html;
    return section;
}

// ===== Create Examples Container =====
function createExamplesContainer(examples, chapterId, questionNumber) {
    const container = document.createElement('div');
    container.className = 'examples-container';

    const title = document.createElement('h4');
    title.textContent = 'דוגמאות חישוב:';
    container.appendChild(title);

    examples.forEach((example, index) => {
        const exampleDiv = createExampleAccordion(example, chapterId, questionNumber, index);
        container.appendChild(exampleDiv);
    });

    return container;
}

// ===== Create Example Accordion =====
function createExampleAccordion(example, chapterId, questionNumber, index) {
    const exampleDiv = document.createElement('div');
    exampleDiv.className = 'accordion-example';
    exampleDiv.id = 'ch-' + chapterId + '-q' + questionNumber + '-ex-' + index;

    // Example Header
    const exampleHeader = document.createElement('div');
    exampleHeader.className = 'accordion-example-header';
    exampleHeader.innerHTML = `
        <span>${example.title}</span>
        <span class="arrow">▼</span>
    `;

    // Example Content
    const exampleContent = document.createElement('div');
    exampleContent.className = 'accordion-example-content';

    // Add steps
    if (example.steps && example.steps.length > 0) {
        const stepsDiv = document.createElement('div');
        stepsDiv.className = 'example-steps';
        stepsDiv.innerHTML = `
            <h5>שלבי החישוב:</h5>
            <ol>
                ${example.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        `;
        exampleContent.appendChild(stepsDiv);
    }

    // Add result
    if (example.result) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'example-result';
        resultDiv.textContent = example.result;
        exampleContent.appendChild(resultDiv);
    }

    exampleDiv.appendChild(exampleHeader);
    exampleDiv.appendChild(exampleContent);

    return exampleDiv;
}

// ===== Open Accordion from URL Hash =====
function openFromHash() {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;
    const target = document.getElementById(hash);
    if (!target) return;
    const header = target.querySelector('.accordion-chapter-header');
    const content = target.querySelector('.accordion-chapter-content');
    const arrow = header ? header.querySelector('.arrow') : null;
    if (!header || !content) return;
    if (!header.classList.contains('active')) {
        header.classList.add('active');
        if (arrow) arrow.classList.add('active');
        content.classList.add('active');
    }
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 450);
}

// ===== Initialize Accordion Functionality =====
function initializeAccordions() {
    // Use event delegation on the content div
    const contentDiv = document.getElementById('content');

    // Remove old listener if exists
    if (contentDiv.accordionInitialized) {
        return;
    }

    contentDiv.accordionInitialized = true;

    contentDiv.addEventListener('click', function(e) {
        // Check if clicked element is an accordion header or inside one
        let header = null;

        if (e.target.classList.contains('accordion-chapter-header') ||
            e.target.classList.contains('accordion-question-header') ||
            e.target.classList.contains('accordion-example-header')) {
            header = e.target;
        } else if (e.target.closest('.accordion-chapter-header')) {
            header = e.target.closest('.accordion-chapter-header');
        } else if (e.target.closest('.accordion-question-header')) {
            header = e.target.closest('.accordion-question-header');
        } else if (e.target.closest('.accordion-example-header')) {
            header = e.target.closest('.accordion-example-header');
        }

        if (header) {
            e.stopPropagation();
            toggleAccordion(header);
        }
    });
}

// ===== Toggle Accordion =====
function toggleAccordion(clickedHeader) {
    // Get the accordion item and its parent
    const accordionItem = clickedHeader.parentElement;
    const parent = accordionItem.parentElement;

    // Determine the type of accordion
    let accordionClass = '';
    if (clickedHeader.classList.contains('accordion-chapter-header')) {
        accordionClass = 'accordion-chapter';
    } else if (clickedHeader.classList.contains('accordion-question-header')) {
        accordionClass = 'accordion-question';
    } else if (clickedHeader.classList.contains('accordion-example-header')) {
        accordionClass = 'accordion-example';
    }

    // Find all sibling accordions at the same level
    const siblings = Array.from(parent.children).filter(child =>
        child.classList.contains(accordionClass) && child !== accordionItem
    );

    // Close all siblings first
    siblings.forEach(sibling => {
        const header = sibling.querySelector(`.${accordionClass}-header`);
        const content = sibling.querySelector(`.${accordionClass}-content`);
        const arrow = header ? header.querySelector('.arrow') : null;

        if (header) header.classList.remove('active');
        if (arrow) arrow.classList.remove('active');
        if (content) content.classList.remove('active');
    });

    // Wait for siblings to close, then toggle the clicked accordion
    setTimeout(() => {
        // Toggle the clicked accordion
        clickedHeader.classList.toggle('active');
        const arrow = clickedHeader.querySelector('.arrow');
        if (arrow) arrow.classList.toggle('active');

        const content = clickedHeader.nextElementSibling;
        if (content) {
            content.classList.toggle('active');
        }

        // After opening, scroll the header to the top of the viewport
        setTimeout(() => {
            clickedHeader.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 450);
    }, 50);
}

// ===== Helper Functions =====
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
