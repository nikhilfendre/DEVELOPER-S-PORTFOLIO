document.addEventListener('DOMContentLoaded', () => {

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // NAV MENU
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // MODAL ELEMENTS
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalDemo = document.getElementById('modalDemo');
  const modalGithub = document.getElementById('modalGithub');
  const modalCloseBtn = document.querySelector('.modal-close');

  // OPEN MODAL FUNCTION
  function openModal(title, desc, demo, github) {
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalDemo.href = demo;
    modalGithub.href = github;

    modal.hidden = false;
    modal.style.display = "grid";  // ⭐ important
  }

  // CLOSE MODAL FUNCTION
  function closeModal() {
    modal.hidden = true;
    modal.style.display = "none"; // ⭐ important
  }

  // ATTACH CLOSE EVENT TO BUTTON
  modalCloseBtn.addEventListener('click', closeModal);

  // CLOSE WHEN CLICK OUTSIDE MODAL-CONTENT
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC KEY
  window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeModal();
  });

  // PROJECT BUTTONS
  document.querySelectorAll('.view-project').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(
        btn.dataset.title,
        btn.dataset.desc,
        btn.dataset.demo,
        btn.dataset.github
      );
    });
  });

});
