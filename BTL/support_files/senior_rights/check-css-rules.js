// Check CSS rules in stylesheet 1
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlPath = path.join(__dirname, 'senior_rights_new.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const dom = new JSDOM(htmlContent);
const document = dom.window.document;

console.log('📊 בדיקת CSS rules בכל ה-stylesheets:\n');

// Check all stylesheets
for (let i = 0; i < document.styleSheets.length; i++) {
    const sheet = document.styleSheets[i];
    console.log(`\n=== Stylesheet ${i} ===`);
    console.log(`כמות rules: ${sheet.cssRules.length}`);
    
    // Filter for sub-accordion-arrow rules
    const arrowRules = Array.from(sheet.cssRules).filter(rule => 
        rule.selectorText && rule.selectorText.includes('sub-accordion-arrow')
    );
    
    if (arrowRules.length > 0) {
        console.log(`\nנמצאו ${arrowRules.length} rules עבור sub-accordion-arrow:\n`);
        arrowRules.forEach(rule => {
            console.log(`Selector: ${rule.selectorText}`);
            console.log(`CSS: ${rule.cssText}`);
            console.log('---');
        });
    }
}

console.log('\n📋 בדיקת selectors ספציפיים:\n');

// Check for .sub-accordion.active .sub-accordion-arrow
const activeRules = [];
for (let i = 0; i < document.styleSheets.length; i++) {
    const sheet = document.styleSheets[i];
    const rules = Array.from(sheet.cssRules).filter(rule => 
        rule.selectorText && rule.selectorText.includes('.sub-accordion.active .sub-accordion-arrow')
    );
    if (rules.length > 0) {
        activeRules.push(...rules);
    }
}

if (activeRules.length > 0) {
    console.log('✅ נמצא rule עבור .sub-accordion.active .sub-accordion-arrow:');
    activeRules.forEach(rule => console.log(rule.cssText));
} else {
    console.log('❌ לא נמצא rule עבור .sub-accordion.active .sub-accordion-arrow!');
}
