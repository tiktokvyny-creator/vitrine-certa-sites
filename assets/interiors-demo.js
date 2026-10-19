/* Illustrative demos. No requests, lead storage, prices, or fictitious business contacts. */
(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const data=JSON.parse($('#project-data').textContent),saved=new Set();
const form=$('form'),result=$('#request-result'),dialog=$('#project-dialog');
const reduce=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const invalidate=()=>{result.hidden=true;$('#copy-status').textContent='';};
const moveToQuote=()=>{$('#orcamento').scrollIntoView({behavior:reduce()?'instant':'smooth',block:'start'});};
const changeImage=(image,source,alt)=>{image.src='assets/'+source;image.alt=alt;if(!reduce()&&typeof image.animate==='function')image.animate([{opacity:.5,transform:'scale(1.02)'},{opacity:1,transform:'scale(1)'}],{duration:380,easing:'ease-out'});};
const menu=$('#main-nav'),toggle=$('.menu-toggle');
function closeMenu(returnFocus=false){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');if(returnFocus)toggle.focus({preventScroll:true});}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');menu.classList.toggle('open',open);});
$$('#main-nav a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('open'))closeMenu(true);});
function updateFavorites(){
 $$('[data-save-project]').forEach(button=>{const i=Number(button.dataset.saveProject),active=saved.has(i);button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',(active?'Remover referência salva ':'Salvar referência ')+data[i].title);});
 const titles=[...saved].map(i=>data[i].title);
 $('#favorites-status').textContent=titles.length?`${titles.length} ${titles.length===1?'referência salva':'referências salvas'} para o seu projeto.`:'Salve as referências que combinam com seu projeto.';
 $('#selected-projects').textContent=titles.length?'Referências selecionadas: '+titles.join(' · '):'Nenhuma referência salva. Você pode escolher na galeria.';
 invalidate();
}
$$('[data-save-project]').forEach(button=>button.addEventListener('click',()=>{const i=Number(button.dataset.saveProject);saved.has(i)?saved.delete(i):saved.add(i);updateFavorites();}));
let activeFilter='Todos',currentProject=0,dialogTrigger=null;let resetBrief=()=>{};
const visibleProjects=()=>data.map((x,i)=>({x,i})).filter(({x})=>activeFilter==='Todos'||x.category===activeFilter).map(({i})=>i);
$$('[data-project-filter]').forEach(button=>button.addEventListener('click',()=>{
 activeFilter=button.dataset.projectFilter;
 $$('[data-project-filter]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 $$('.project').forEach(card=>{card.hidden=activeFilter!=='Todos'&&card.dataset.category!==activeFilter;});
 const n=visibleProjects().length;$('#filter-status').textContent=`${n} ${n===1?'referência encontrada':'referências encontradas'}.`;
}));
function renderProject(i){
 currentProject=i;const project=data[i];
 changeImage($('#dialog-image'),project.image,project.alt+' — referência ilustrativa');
 $('#dialog-category').textContent=project.eyebrow;$('#dialog-title').textContent=project.title;$('#dialog-description').textContent=project.desc;$('#dialog-details').textContent=project.details;
 const indices=visibleProjects(),position=indices.indexOf(i);$('#dialog-pagination').textContent=`${position+1} / ${indices.length}`;
 $('#previous-project').disabled=indices.length<2;$('#next-project').disabled=indices.length<2;
}
$$('[data-open-project]').forEach(button=>button.addEventListener('click',()=>{dialogTrigger=button;renderProject(Number(button.dataset.openProject));dialog.showModal();document.body.style.overflow='hidden';}));
function navigateProject(offset){const indices=visibleProjects();renderProject(indices[(indices.indexOf(currentProject)+offset+indices.length)%indices.length]);}
$('#previous-project').addEventListener('click',()=>navigateProject(-1));$('#next-project').addEventListener('click',()=>navigateProject(1));
$('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow='';dialogTrigger?.focus({preventScroll:true});});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();navigateProject(1);}if(event.key==='ArrowLeft'){event.preventDefault();navigateProject(-1);}});
$('#use-project').addEventListener('click',()=>{saved.add(currentProject);updateFavorites();const choice=data[currentProject].choice;
 if(document.body.dataset.kind==='stone')$('#environment').value=choice;
 else{const room=$$('input[name=rooms]').find(input=>input.value===choice);if(room)room.checked=true;resetBrief();}
 dialog.close();moveToQuote();(document.body.dataset.kind==='stone'?$('#name'):$('#step-title-0')).focus({preventScroll:true});
});
function favoritesLines(){return saved.size?['Referências: '+[...saved].map(i=>data[i].title).join(' / ')]:[];}
function showResult(lines){$('#request-text').value=lines.join('\n');result.hidden=false;$('#copy-status').textContent='';result.scrollIntoView({behavior:reduce()?'instant':'smooth',block:'nearest'});$('#request-text').focus({preventScroll:true});}
$('#copy-request').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#request-text').value);$('#copy-status').textContent='Mensagem copiada. Nesta demonstração, nada foi enviado.';}catch{$('#request-text').focus();$('#request-text').select();$('#copy-status').textContent='Selecione e copie o texto para compartilhar.';}});
form.addEventListener('input',invalidate);form.addEventListener('change',invalidate);
if(document.body.dataset.kind==='stone'){
 const materials={
  'Granito':{image:'banheiro.webp',alt:'Referência ilustrativa de composição com pedra escura',title:'Presença e textura.',description:'Uma família de pedras com diferentes granulações e tonalidades. Explore opções de chapa e acabamento para a sua composição.'},
  'Mármore':{image:'travertino.webp',alt:'Referência ilustrativa de mobiliário em pedra clara',title:'Veios que contam histórias.',description:'Desenhos naturais e uma variedade de tons para explorar no projeto. O material, a aplicação e os cuidados são definidos com orientação técnica.'},
  'Quartzito':{image:'verde.webp',alt:'Referência ilustrativa de cozinha com quartzito verde',title:'Movimento em cada detalhe.',description:'Pedras naturais de presença marcante e desenhos variados. A escolha da chapa valoriza o movimento dos veios e a composição do ambiente.'},
  'Superfície industrializada':{image:'hero.webp',alt:'Ambiente ilustrativo de referência para composição de superfícies',title:'Uma direção mais uniforme.',description:'Famílias de superfícies fabricadas com diferentes composições, cores e acabamentos. Características e indicação de uso variam conforme produto e fabricante.'}
 };
 let currentMaterial='Granito';
 $$('[data-material]').forEach((button,i)=>button.addEventListener('click',()=>{currentMaterial=button.dataset.material;const m=materials[currentMaterial];$$('[data-material]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));changeImage($('#material-image'),m.image,m.alt);$('#material-label').textContent=`0${i+1} / ${currentMaterial.toLocaleUpperCase('pt-BR')}`;$('#material-title').textContent=m.title;$('#material-description').textContent=m.description;$('#material-status').textContent=`Explorando ${currentMaterial}. Imagem de referência, não amostra técnica. Disponibilidade e indicação de uso devem ser confirmadas.`;}));
 $('#use-material').addEventListener('click',()=>{$('#material').value=currentMaterial;invalidate();moveToQuote();$('#name').focus({preventScroll:true});});
 const number=value=>/^\d+(?:[.,]\d+)?$/.test(value.trim())?Number(value.trim().replace(',','.')):NaN;
 function measures(){let total=0,hasAny=false,error='';const lines=[];
  $$('[data-piece]').forEach((row,i)=>{const l=row.querySelector('[name=length]').value.trim(),d=row.querySelector('[name=depth]').value.trim();if(!l&&!d)return;hasAny=true;const length=number(l),depth=number(d);if(!Number.isFinite(length)||!Number.isFinite(depth)||length<=0||depth<=0){error='Preencha comprimento e profundidade com números maiores que zero, ou deixe o trecho em branco.';return;}total+=length*depth;lines.push(`Trecho ${i+1}: ${length.toLocaleString('pt-BR')} m × ${depth.toLocaleString('pt-BR')} m`);});
  $('#area-output').textContent=!hasAny||error?'— m²':total.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})+' m²';$('#measure-error').textContent=error;
  return {total,hasAny,error,lines};
 }
 function refreshPieces(){const rows=$$('[data-piece]');rows.forEach((row,i)=>{row.querySelector('[name=length]').setAttribute('aria-label',`Comprimento do trecho ${i+1} em metros`);row.querySelector('[name=depth]').setAttribute('aria-label',`Profundidade do trecho ${i+1} em metros`);row.querySelector('.remove-piece').setAttribute('aria-label',`${rows.length===1?'Limpar medidas do':'Remover'} trecho ${i+1}`);});$('#add-piece').disabled=rows.length>=6;}
 $('#pieces').addEventListener('input',measures);
 $('#pieces').addEventListener('click',event=>{const remove=event.target.closest('.remove-piece');if(!remove)return;const row=remove.closest('[data-piece]'),rows=$$('[data-piece]');if(rows.length===1)row.querySelectorAll('input').forEach(input=>{input.value='';});else row.remove();refreshPieces();measures();invalidate();$('#add-piece').focus({preventScroll:true});});
 $('#add-piece').addEventListener('click',()=>{if($$('[data-piece]').length>=6)return;const row=$('[data-piece]').cloneNode(true);row.querySelectorAll('input').forEach(input=>{input.value='';});$('#pieces').append(row);refreshPieces();row.querySelector('input').focus({preventScroll:true});invalidate();});
 form.addEventListener('submit',event=>{event.preventDefault();$('#form-error').textContent='';if(!form.reportValidity())return;const f=new FormData(form),name=String(f.get('name')).trim(),city=String(f.get('city')).trim();if(name.length<2||!city){$('#form-error').textContent='Preencha seu nome e a cidade do projeto.';return;}const m=measures();if(m.error){$('#form-error').textContent='Confira as medidas aproximadas antes de preparar o pedido.';return;}const lines=['Olá! Gostaria de conversar sobre um projeto de marmoraria.','',`Nome: ${name}`,`Cidade e bairro: ${city}`,`Ambiente: ${f.get('environment')}`,`Material de interesse: ${f.get('material')}`,`Acabamento: ${f.get('finish')}`,...favoritesLines()];if(m.hasAny)lines.push(...m.lines,'Área aproximada de superfície: '+$('#area-output').textContent+' (sujeita a medição técnica)');else lines.push('Medidas: ainda não informadas');const note=String(f.get('note')).trim();if(note)lines.push('Observações: '+note);lines.push('','Gostaria de alinhar os detalhes e receber um orçamento.');showResult(lines);});
}else{
 let currentEnvironment=0,briefStep=0;
 const finishDescriptions={'Madeira clara':'Uma direção acolhedora, que valoriza a presença visual da madeira e dos tons claros.','Madeira escura':'Uma direção de contraste e profundidade, com a presença visual dos tons mais escuros da madeira.','Neutros suaves':'Uma direção leve e discreta para combinar superfícies e deixar os objetos do ambiente aparecerem.','Verde natural':'Uma direção de cor inspirada na natureza para conversar com a madeira e os tons neutros.'};
 $$('[data-environment]').forEach(button=>button.addEventListener('click',()=>{currentEnvironment=Number(button.dataset.environment);const p=data[currentEnvironment];$$('[data-environment]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));changeImage($('#environment-image'),p.image,p.alt);$('#environment-label').textContent=p.eyebrow;$('#environment-title').textContent=p.title;$('#environment-description').textContent=p.desc;$('#environment-facts').replaceChildren(...p.details.split(' · ').map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));$('#environment-status').textContent=`Explorando ${p.choice}. Ambiente ilustrativo; medidas e execução são definidas no projeto.`;}));
 $('#use-environment').addEventListener('click',()=>{const room=$$('input[name=rooms]').find(input=>input.value===data[currentEnvironment].choice);if(room)room.checked=true;invalidate();showStep(0);moveToQuote();$('#step-title-0').focus({preventScroll:true});});
 $$('[data-finish]').forEach(button=>button.addEventListener('click',()=>{const finish=button.dataset.finish;$$('[data-finish]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('#finish-name').textContent=finish;$('#finish-description').textContent=finishDescriptions[finish];$('#wood-finish').value=finish;invalidate();}));
 $('#wood-finish').addEventListener('change',()=>{const finish=$('#wood-finish').value;$$('[data-finish]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.finish===finish)));$('#finish-name').textContent=finish;$('#finish-description').textContent=finishDescriptions[finish]||'A empresa pode orientar as combinações durante o desenvolvimento do projeto.';});
 function showStep(index){briefStep=index;$$('[data-brief-step]').forEach((section,i)=>{section.hidden=i!==index;});$$('[data-step-indicator]').forEach((span,i)=>{i===index?span.setAttribute('aria-current','step'):span.removeAttribute('aria-current');});$('#form-error').textContent='';$(`#step-title-${index}`).focus({preventScroll:true});}
 resetBrief=()=>showStep(0);
 function validStep(index){if(index===0&&!$$('input[name=rooms]:checked').length){$('#form-error').textContent='Escolha pelo menos um ambiente para continuar.';return false;}if(index===1&&!$('#property-stage').value){$('#form-error').textContent='Informe o momento do imóvel para continuar.';$('#property-stage').focus({preventScroll:true});return false;}return true;}
 $$('[data-next-step]').forEach(button=>button.addEventListener('click',()=>{if(validStep(briefStep)){showStep(briefStep+1);invalidate();}}));
 $$('[data-previous-step]').forEach(button=>button.addEventListener('click',()=>{showStep(briefStep-1);invalidate();}));
 form.addEventListener('submit',event=>{event.preventDefault();if(briefStep!==2)return;if(!validStep(0)){showStep(0);$('#form-error').textContent='Escolha pelo menos um ambiente para continuar.';return;}if(!validStep(1)){showStep(1);$('#form-error').textContent='Informe o momento do imóvel para continuar.';return;}const f=new FormData(form),name=String(f.get('name')).trim(),city=String(f.get('city')).trim();if(name.length<2||!city){$('#form-error').textContent='Preencha seu nome e a cidade do projeto.';(name.length<2?$('#name'):$('#city')).focus({preventScroll:true});return;}$('#form-error').textContent='';const lines=['Olá! Gostaria de conversar sobre móveis planejados.','',`Nome: ${name}`,`Cidade e bairro: ${city}`,'Ambientes: '+f.getAll('rooms').join(' / '),`Direção de acabamento: ${f.get('finish')}`,`Momento do imóvel: ${f.get('stage')}`,`Planta / medidas: ${f.get('plan')}`,`Quando imagino iniciar: ${f.get('timeframe')}`,...favoritesLines()];const note=String(f.get('note')).trim();if(note)lines.push('O que não pode faltar: '+note);lines.push('','Gostaria de alinhar as possibilidades e os próximos passos do projeto.');showResult(lines);});
}
$('[data-year]').textContent=new Date().getFullYear();
})();
