const progress = document.querySelector('.progress');
const header = document.querySelector('.header');
const floatingNavigation = document.querySelector('.floating-navigation');
const primaryLinks = document.querySelectorAll('.header nav a, .floating-navigation a');
const chapterLinks = document.querySelectorAll('.work-navigation a');
const chapterTargets = [...chapterLinks].map(link => document.querySelector(link.hash));
const mainSections = [...document.querySelectorAll('#story, #work, #perspective, #contact')];
let scheduled = false;
function updateCurrent(links, id) {
  links.forEach(link => {
    if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function updateProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${distance > 0 ? window.scrollY / distance * 100 : 0}%`;
  const showNavigation = header.getBoundingClientRect().bottom <= 0;
  // Keep a focused link available if the viewer navigates home with the keyboard.
  floatingNavigation.hidden = !showNavigation && !floatingNavigation.contains(document.activeElement);
  const readingLine = Math.min(window.innerHeight * .3, 240);
  let current = 'main';
  mainSections.forEach(section => {
    if (section.getBoundingClientRect().top <= readingLine) current = section.id;
  });
  updateCurrent(primaryLinks, current);
  let chapter = 'experience';
  chapterTargets.forEach(section => {
    if (section && section.getBoundingClientRect().top <= readingLine) chapter = section.id;
  });
  updateCurrent(chapterLinks, chapter);
  scheduled = false;
}
function scheduleUpdate() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); }
}
window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('hashchange', scheduleUpdate);
floatingNavigation.addEventListener('focusout', scheduleUpdate);
updateProgress();
document.querySelector('#year').textContent = new Date().getFullYear();
