const dialog = document.querySelector('#system-guide-dialog');
const video = dialog.querySelector('video');
const trigger = document.querySelector('[data-system-guide]');
trigger.addEventListener('click', () => {
  dialog.showModal();
  video.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
});
dialog.addEventListener('close', () => video.pause());
