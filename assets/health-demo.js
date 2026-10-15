(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const menu = $('.menu-toggle');
  const nav = $('#main-nav');
  const closeMenu = () => {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menu');
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header') && menu.getAttribute('aria-expanded') === 'true') closeMenu();
  });

  const filters = document.querySelectorAll('[data-filter-care]');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    document.querySelectorAll('[data-care-category]').forEach(card => {
      card.hidden = button.dataset.filterCare !== 'Todos' && card.dataset.careCategory !== button.dataset.filterCare;
      if (!card.hidden) count++;
    });
    const status = $('#filter-status');
    if (status) status.textContent = `${count} opções de cuidado exibidas.`;
  }));

  const dialog = $('#care-dialog');
  document.querySelectorAll('[data-care-detail]').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('[data-care-category]');
    $('#care-title').textContent = $('h3', card).textContent;
    $('#care-description').textContent = card.dataset.detail;
    $('#care-expectation').textContent = card.dataset.expectation;
    const image = $('.care-photo img', card);
    const detailImage = $('#care-image');
    if (image && detailImage) {
      detailImage.src = image.getAttribute('src');
      detailImage.alt = image.alt;
    }
    $('#dialog-interest').dataset.interest = card.dataset.service;
    dialog.showModal();
  }));
  $('#close-care').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });

  const form = $('#request-form');
  document.querySelectorAll('[data-interest]').forEach(button => button.addEventListener('click', () => {
    const service = button.dataset.interest;
    const select = $('#service');
    if ([...select.options].some(option => option.value === service)) select.value = service;
    if (dialog.open) dialog.close();
    $('#request-result').hidden = true;
    $('#contato').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
    $('#name').focus({preventScroll: true});
  }));
  form.addEventListener('input', () => { $('#request-result').hidden = true; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [
      `Olá! Gostaria de solicitar informações à ${document.body.dataset.demoName}.`,
      '', `Nome: ${String(data.get('name')).trim()}`,
      `Interesse: ${data.get('service')}`,
      `Preferência de atendimento: ${data.get('period') || 'A combinar'}`,
    ];
    const note = String(data.get('note') || '').trim();
    if (note) lines.push(`Observação: ${note}`);
    lines.push('', 'Gostaria de consultar a disponibilidade e receber as orientações para o atendimento.');
    $('#request-text').value = lines.join('\n');
    $('#copy-status').textContent = '';
    $('#request-result').hidden = false;
    $('#request-result').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest'});
    $('#request-text').focus({preventScroll: true});
  });
  $('#copy-request').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('#request-text').value);
      $('#copy-status').textContent = 'Mensagem copiada. Nesta demonstração, nada foi enviado.';
    } catch {
      $('#request-text').focus();
      $('#request-text').select();
      $('#copy-status').textContent = 'Selecione e copie o texto para compartilhar.';
    }
  });
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
