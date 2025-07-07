const folderIcon = document.getElementById('folderIcon');
const popupOverlay = document.getElementById('popupOverlay');
const closeBtn = document.getElementById('closeBtn');

folderIcon.addEventListener('click', function() {
    popupOverlay.style.display = 'block';
});

closeBtn.addEventListener('click', function() {
    popupOverlay.style.display = 'none';
});

// close popup when clicking whitespace
popupOverlay.addEventListener('click', function(e) {
    if (e.target === popupOverlay) {
        popupOverlay.style.display = 'none';
    }
});

// close with esc - close the most recently opened popup
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close the most recent popup first, or main popup if no others
        if (activePopups.size > 0) {
            const lastPopupId = Array.from(activePopups).pop();
            const lastPopup = document.getElementById(lastPopupId);
            if (lastPopup) {
                lastPopup.remove();
                activePopups.delete(lastPopupId);
            }
        } else if (popupOverlay.style.display === 'block') {
            popupOverlay.style.display = 'none';
        }
    }
});

// draggabel pop up code
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
const popupWindow = document.querySelector('.popup-window');
const popupHeader = document.querySelector('.popup-header');

// cursor for dragging
popupHeader.style.cursor = 'move';

popupHeader.addEventListener('mousedown', function(e) {
    // no drag  on buttons
    if (e.target.classList.contains('close-btn') || e.target.classList.contains('expand-btn')) {
        return;
    }
    
    isDragging = true;
    const rect = popupWindow.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    e.preventDefault();
});

document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // don't go outside the window
    const maxX = window.innerWidth - popupWindow.offsetWidth;
    const maxY = window.innerHeight - popupWindow.offsetHeight;
    
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));
    
    popupWindow.style.left = boundedX + 'px';
    popupWindow.style.top = boundedY + 'px';
    popupWindow.style.transform = 'none';
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

//***********  popup windows **********/

// content array
const folderContent = {
   'info': {
    title: 'Personal Info',
    content: `<h3>Quick Stats</h3>
    <ul>
        <li><strong>Name:</strong> Jamie De Los Santos</li>
         <li><strong>Pronouns:</strong> she/they </li>
        <li><strong>Age:</strong> 21</li>
        <li><strong>Birthday:</strong> October 11</li>
        <li><strong>Hometown:</strong> Boston, MA</li>
        <li><strong>Ethnicity:</strong> Dominican & Haitian</li>
        <li><strong>Zodiac Sign:</strong> Libra ♎</li>
        <li><strong>Siblings:</strong> None (only child)</li>
       
    </ul>`
},
    
'bio': {
    title: 'Biography',
    content: `<h3>My Story</h3>
    <p>I work at Artists For Humanity in Boston, where I mentor teens in creative technology, introducing them to tools like TouchDesigner, coding, and digital art. I’ve learned just as much from working with them as I’ve been taught, especially when it comes to thinking outside the box and building interactive, expressive work.</p>
    <p>I got into coding through a mix of codign camps in highschool and community college courses.I actually participated in the KWK Swift Camp ( mobile app development) in 2022. While I started off studying Computer Science, I realized I wanted to work at the intersection of tech, people, and the places we live—so I transitioned to Political Science at UMass Boston, with a continued focus on sustainable development and community tech.</p>
    <p>Now, I’m focused on building creative, community-first projects that bring people together through design, storytelling, and technology.</p>`
},
    'funfacts': {
        title: 'Fun Facts',
        content: `<h3> Fun Facts About Me </h3>
        <ul>
            <li> I am a dancer and have done ballet, tap, jazz, and ballroom</li>
            <li> I have a crazy phobia of elevators (haven't been in one in YEARS!)</li>
            <li> 99% of the time I only drink water and lemonade</li>
        </ul>`
    },
    'education': {
        title: 'Education',
        content: `<h3>My Educational Journey</h3>
        <p>I started out studying Computer Science at community college, where I built a strong foundation in programming and tech. But over time, I realized I was more passionate about people, art, and community-centered work—so I transferred to UMass Boston and switched to Political Science with a focus on environmental science and urban design.</p>
        <p>Even though I changed majors, I still plan to work in tech—just at the intersection of art, community, and social impact.</p>`
    },
    'coding': {
        title: 'Coding Journey',
        content: `<h3>My Programming Path</h3>
        <p>I’ve attended multiple coding camps, including a mobile app development summer program where I built my first app from scratch. I also work with teens at Artists For Humanity, where their wild ideas constantly push me to think more creatively and code more flexibly.</p>
        <p>My toolkit includes HTML, CSS, JavaScript, React, Next.js, Tailwind, and Sanity CMS, and I’ve built everything from hydration reminder apps to CMS-based websites with interactive timelines, motion tracking, and video effects. I'm currently learning Flutter and exploring Unity for creative tech projects.</p>`
    },
    'love': {
        title: 'Things I Love',
        content: `<h3>What I'm Passionate About</h3>
        <p>I love building things that bring people together. Especially teens and underserved communities. I’m passionate about city design, social justice, and finding the intersection between tech, art, and activism.</p>
        <p>Outside of work and school, I love celebrating my culture, experimenting with projection mapping, taking long nature walks, journaling, and occasionally having a dance party.</p>`
    }
};

//*********** Create multiple popup windows **********/
let popupCounter = 0;
const activePopups = new Set();

function createNewPopup(title, content) {
    popupCounter++;
    const popupId = 'popup-' + popupCounter;
    
    // html + vars
    const popupHTML = `
        <div class="popup-overlay secondary-popup" id="${popupId}">
            <div class="popup-window secondary-window" data-popup-id="${popupId}">
                <div class="popup-header">
                    <div class="buttons">
                        <button class="close-btn" data-popup-id="${popupId}">&times;</button>
                    </div>
                    <span class="popup-title">${title}</span>
                    <div></div> 
                </div>
                <div class="small-popup-content">
                    ${content}
                </div>
            </div>
        </div>
    `;
    
    // insert into page
    document.body.insertAdjacentHTML('beforeend', popupHTML);
    
    // get new popup elements
    const popup = document.getElementById(popupId);
    const popupWindow = popup.querySelector('.popup-window');
    const closeBtn = popup.querySelector('.close-btn');
    const header = popup.querySelector('.popup-header');
    
    // display:block
    popup.style.display = 'block';
    activePopups.add(popupId);
    
    // offset when opening multiple
    const offset = (popupCounter - 1) * 30;
    popupWindow.style.left = `calc(50% + ${offset}px)`;
    popupWindow.style.top = `calc(50% + ${offset}px)`;
    popupWindow.style.transform = 'translate(-50%, -50%)';
    
    // close btn
    closeBtn.addEventListener('click', function() {
        popup.remove();
        activePopups.delete(popupId);
    });
    
    // draggable
    makeDraggable(popupWindow, header, popupId);
}

function makeDraggable(popupWindow, header, popupId) {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    header.style.cursor = 'move';
    
    header.addEventListener('mousedown', function(e) {
        if (e.target.classList.contains('close-btn')) {
            return;
        }
        
        isDragging = true;
        const rect = popupWindow.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !activePopups.has(popupId)) return;
        
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        const maxX = window.innerWidth - popupWindow.offsetWidth;
        const maxY = window.innerHeight - popupWindow.offsetHeight;
        
        const boundedX = Math.max(0, Math.min(newX, maxX));
        const boundedY = Math.max(0, Math.min(newY, maxY));
        
        popupWindow.style.left = boundedX + 'px';
        popupWindow.style.top = boundedY + 'px';
        popupWindow.style.transform = 'none';
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
    });
}

document.querySelectorAll('.folder-container').forEach(folder => {
    folder.addEventListener('click', function() {
        const folderClass = this.className.split(' ').find(cls => cls !== 'folder-container');
        const content = folderContent[folderClass];
        
        if (content) {
            createNewPopup(content.title, content.content);
        }
    });
});
