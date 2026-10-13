'use strict';
(() => {
 const products=[
 {id:'vestido',name:'Vestido midi',category:'Vestidos',description:'Uma proposta em vermelho, apresentada em imagem inteira para observar o desenho da peça.',images:['vestido']},
 {id:'conjunto',name:'Conjunto de alfaiataria',category:'Conjuntos',description:'A composição clara ganha uma apresentação completa e uma imagem mais próxima dos detalhes.',images:['conjunto','conjunto-detalhe']},
 {id:'macacao',name:'Macacão amplo',category:'Macacões',description:'Uma proposta em azul, com galeria para explorar a silhueta e os detalhes da apresentação.',images:['macacao','macacao-detalhe']},
 {id:'vestido-preto',name:'Vestido longo',category:'Vestidos',description:'Uma proposta em preto, com imagens para observar o desenho e o detalhe da peça.',images:['vestido-preto','vestido-preto-detalhe']}
 ];
 const $=s=>document.querySelector(s), grid=$('#product-grid'), cards=[...grid.children], favorites=new Set();
 let category='Todas', onlyFavorites=false, current=null, imageIndex=0, opener=null;
 const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function render(){
  const query=normalize($('#product-search').value.trim());
  const ordered=[...products]; if($('#product-sort').value==='name')ordered.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
  let count=0;
  ordered.forEach(p=>{const card=cards[products.indexOf(p)];card.hidden=!((category==='Todas'||category===p.category)&&(!onlyFavorites||favorites.has(p.id))&&normalize(p.name+' '+p.category).includes(query)); if(!card.hidden)count++;grid.append(card)});
  $('#product-count').textContent=count+' '+(count===1?'peça ilustrativa':'peças ilustrativas');
  $('#empty-products').hidden=count>0; $('#clear-filters').hidden=category==='Todas'&&!query&&!onlyFavorites;
  $('#favorites-count').textContent=favorites.size; $('#favorites-toggle').setAttribute('aria-pressed',String(onlyFavorites));
  document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
  document.querySelectorAll('[data-favorite]').forEach(b=>{const p=products.find(p=>p.id===b.dataset.favorite),saved=favorites.has(p.id);b.setAttribute('aria-pressed',String(saved));b.textContent=saved?'♥':'♡';b.setAttribute('aria-label',(saved?'Remover ':'Adicionar ')+p.name+(saved?' dos favoritos':' aos favoritos'))});
 }
 function showImage(){
  const image=$('#product-main-image'); image.src='assets/'+current.images[imageIndex]+'.webp';image.alt=current.name+' — '+(imageIndex?'detalhe ilustrativo':'fotografia ilustrativa');
  $('#gallery-counter').textContent=(imageIndex+1)+' / '+current.images.length;
  $('#gallery-previous').hidden=$('#gallery-next').hidden=current.images.length<2;
  $('.gallery-main').classList.remove('zoomed');$('#zoom-image').setAttribute('aria-pressed','false');$('#zoom-image').textContent='Ampliar imagem';
  [...$('#gallery-thumbnails').children].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===imageIndex)));
 }
 function openProduct(id,button){
  current=products.find(p=>p.id===id);if(!current)return;opener=button;imageIndex=0;
  $('#product-title').textContent=current.name;$('#product-category').textContent=current.category.toUpperCase();$('#product-description').textContent=current.description;
  $('#consultation-result').hidden=true;$('#piece-message').value='';
  const thumbnails=$('#gallery-thumbnails');thumbnails.replaceChildren();
  current.images.forEach((src,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Ver imagem '+(i+1)+' de '+current.name);const img=document.createElement('img');img.src='assets/'+src+'.webp';img.alt='';button.append(img);button.addEventListener('click',()=>{imageIndex=i;showImage()});thumbnails.append(button)});
  showImage();$('#product-dialog').showModal();document.body.classList.add('dialog-open');
 }
 grid.addEventListener('click',e=>{const open=e.target.closest('[data-open]'),fav=e.target.closest('[data-favorite]');if(open)openProduct(open.dataset.open,open);if(fav){const id=fav.dataset.favorite;favorites.has(id)?favorites.delete(id):favorites.add(id);render()}});
 document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;render()}));
 $('#product-search').addEventListener('input',render);$('#product-sort').addEventListener('change',render);
 $('#favorites-toggle').addEventListener('click',()=>{onlyFavorites=!onlyFavorites;render();$('#colecao').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});
 $('#clear-filters').addEventListener('click',()=>{category='Todas';onlyFavorites=false;$('#product-search').value='';render()});
 $('#close-product').addEventListener('click',()=>$('#product-dialog').close());
 $('#product-dialog').addEventListener('close',()=>{document.body.classList.remove('dialog-open');if(opener)opener.focus({preventScroll:true})});
 $('#gallery-previous').addEventListener('click',()=>{imageIndex=(imageIndex+current.images.length-1)%current.images.length;showImage()});
 $('#gallery-next').addEventListener('click',()=>{imageIndex=(imageIndex+1)%current.images.length;showImage()});
 $('#zoom-image').addEventListener('click',()=>{const zoom=$('.gallery-main').classList.toggle('zoomed');$('#zoom-image').setAttribute('aria-pressed',String(zoom));$('#zoom-image').textContent=zoom?'Reduzir imagem':'Ampliar imagem'});
 $('#prepare-consultation').addEventListener('click',()=>{if(!current)return;$('#piece-message').value='Olá! Gostaria de saber mais sobre '+current.name+'. Pode me informar tamanhos, valor e disponibilidade?';$('#consultation-result').hidden=false});
 render();
})();
