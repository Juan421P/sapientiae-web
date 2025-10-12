/*import { Network } from '../../lib/network';

(async function init () {
  await auth();

  const $ = (s,d=document)=>d.querySelector(s);
  const fmt = (iso)=> iso ? new Date(iso).toLocaleDateString(undefined,{day:'2-digit',month:'2-digit',year:'numeric'}) : '—';

  $("#eva-date")?.textContent = new Date().toLocaleString();

  const $cards = document.getElementById('eva-cards');
  const tplCard = document.getElementById('eva-card');
  const skel = document.getElementById('eva-skel');

  const renderSkeletons = (n=2)=>{
    if(!skel) return;
    $cards.innerHTML = '';
    for(let i=0;i<n;i++) $cards.appendChild(skel.content.cloneNode(true));
  };
  const empty = (msg='No hay planes de evaluación.')=>{
    $cards.innerHTML = `
      <div class="col-span-full px-5 py-4 border border-[rgb(var(--off-from))] rounded-lg bg-gradient-to-tr from-[rgb(var(--body-from))] to-[rgb(var(--body-to))] drop-shadow">
        <span class="bg-gradient-to-r from-[rgb(var(--text-from))] to-[rgb(var(--text-to))] bg-clip-text text-transparent">${msg}</span>
      </div>`;
  };

  // util: elige la primera clave que exista en el objeto
  const pickKey = (obj, candidates) => candidates.find(k => obj && Object.hasOwn(obj, k));

  function render(plans){
    $cards.innerHTML = '';
    if(!plans.length) return empty();

    plans.forEach(p=>{
      const titleKey = pickKey(p, ['planName','nombre','title']);
      const descKey  = pickKey(p, ['description','descripcion','detail','details']);
      const dateKey  = pickKey(p, ['createdAt','fecha','created_at','fechaCreacion']);
      const idKey    = pickKey(p, ['evaluationPlanID','id','planId']);
      const offKey   = pickKey(p, ['courseOfferingID','ofertaId','courseOfferingId']);

      const card = tplCard.content.cloneNode(true);
      card.querySelector('h3').textContent = titleKey ? (p[titleKey] || '—') : '—';
      card.querySelector('.date').textContent = dateKey ? fmt(p[dateKey]) : '—';

      const desc = card.querySelector('.desc');
      if (descKey && p[descKey]) desc.textContent = p[descKey]; else desc.remove();

      const [btnEdit, btnResults] = card.querySelectorAll('button');
      const theId = idKey ? p[idKey] : undefined;

      btnEdit.addEventListener('click', ()=>{
        if (theId == null) return;
        location.href = `/html/teacher-portal/evaluations-edit.html?id=${encodeURIComponent(theId)}`;
      });
      btnResults.addEventListener('click', ()=>{
        if (theId == null) return;
        location.href = `/html/teacher-portal/evaluations-results.html?id=${encodeURIComponent(theId)}`;
      });

      $cards.appendChild(card);
    });
  }

  try{
    renderSkeletons(2);

    // 1) Trae todo de TU endpoint actual
    const data = await Network.get({ path: '/api/EvaluationPlans/getEvaluationPlan' }) || [];

    // 2) Si tienes el ID del curso actual, filtramos en cliente (opcional)
    const currentOffering = window.COURSE_OFFERING_ID_ACTUAL;
    let plans = data;
    if (currentOffering != null) {
      // intenta detectar el nombre real de la columna de oferta
      const sample = data[0] || {};
      const offKey = ['courseOfferingID','ofertaId','courseOfferingId'].find(k => Object.hasOwn(sample, k));
      plans = offKey ? data.filter(p => String(p[offKey]) === String(currentOffering)) : data;
    }

    render(plans);
  }catch(err){
    console.error('[Evaluations] load error:', err);
    empty('Ocurrió un error cargando las evaluaciones.');
  }

  document.getElementById('btnCrearEva')?.addEventListener('click', ()=>{
    location.href = '/html/teacher-portal/evaluations.html';
  });
})();
*/