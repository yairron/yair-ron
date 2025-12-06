// פונקציה לטעינת התפריט מקובץ JSON
async function loadHamburgerMenu() {
    try {
        // טעינת קובץ הJSON
        const response = await fetch('/mda/JSON/hamburger_menu.json');
        const data = await response.json();
        
        // מציאת המכולה בתפריט
        const menuContainer = document.querySelector('.side-menu-content ul');
        
        if (!menuContainer) {
            console.error('לא נמצא אלמנט התפריט');
            return;
        }
        
        // ניקוי התוכן הקיים
        menuContainer.innerHTML = '';
        
        // בניית הקישורים מהJSON
        data.menuItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            a.href = item.url;
            a.textContent = item.title;
            
            li.appendChild(a);
            menuContainer.appendChild(li);
        });
        
    } catch (error) {
        console.error('שגיאה בטעינת התפריט:', error);
        // במקרה של שגיאה, הקישורים הקיימים יישארו
    }
}

// טעינת התפריט כשהדף נטען
document.addEventListener('DOMContentLoaded', loadHamburgerMenu);