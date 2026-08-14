const card = document.getElementById('card');
const text = document.getElementById('text');

window.cat.onShow((message) => {
  text.textContent = message;
  // Let layout settle so the transition runs from the off-screen position.
  requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('in')));
});

window.cat.onHide(() => card.classList.remove('in'));
