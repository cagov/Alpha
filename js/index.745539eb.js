class e extends HTMLElement{connectedCallback(){this.expandTarget=this.querySelector(".card-container"),this.expandButton=this.querySelector(".card-header"),this.expandButton.addEventListener("click",this.listen.bind(this)),this.activateButton=this.querySelector(".card-header")}listen(){if(this.cardBodyHeight||(this.cardBodyHeight=this.querySelector(".card-body").clientHeight),this.expandTarget.clientHeight>0){this.expandTarget.style.height="0px",this.expandTarget.setAttribute("aria-hidden","true"),this.querySelector(".card-header").classList.remove("accordion-alpha-open");let e=this.expandTarget;this.activateButton.setAttribute("aria-expanded","false"),setTimeout((function(){e.style.display="none"}),300)}else this.expandTarget.style.display="block",this.expandTarget.style.height=this.cardBodyHeight+"px",this.expandTarget.setAttribute("aria-hidden","false"),this.querySelector(".card-header").classList.add("accordion-alpha-open"),this.querySelector(".card-container").classList.remove("collapsed"),this.activateButton.setAttribute("aria-expanded","true")}}window.customElements.define("cwds-accordion",e);class t extends HTMLElement{connectedCallback(){this.expandTargets=this.querySelectorAll(".list-group-item-action"),this.expandTargets.forEach(e=>{let t=e.querySelector(".details");t.setAttribute("data-collapsed","true"),t.style.height="0px",t.setAttribute("aria-hidden","true"),e.addEventListener("click",this.listen)})}listen(){let e=this.querySelector(".details"),t=this.querySelector(".step-description");var a,n;"true"===e.getAttribute("data-collapsed")?(n=(a=e).scrollHeight,a.style.height=n+"px",a.setAttribute("data-collapsed","false"),e.setAttribute("data-collapsed","false"),t.setAttribute("aria-expanded","true"),e.setAttribute("aria-hidden","false"),this.classList.add("list-open")):(!function(e){var t=e.scrollHeight;requestAnimationFrame((function(){e.style.height=t+"px",requestAnimationFrame((function(){e.style.height="0px"}))})),e.setAttribute("data-collapsed","true"),e.setAttribute("aria-hidden","true")}(e),this.classList.remove("list-open"),t.setAttribute("aria-expanded","false"))}}window.customElements.define("cwds-step-list",t);class a extends window.HTMLElement{connectedCallback(){const e=document.querySelector("html").attributes.lang.value,t="en"===e?"":`?lang=${e}`;window.fetch(`https://api.alpha.ca.gov/StateHolidayCalendar/all${t}`).then(e=>e.json()).then(t=>{t.forEach(e=>{e.dateobject=new Date(e.date)});const a=new Date,n=t.filter(e=>e.dateobject>a)[0],i=e,l=n.dateobject.toLocaleDateString(i,{weekday:"long",month:"long",day:"numeric"});document.getElementById("current-holiday-date").innerText=l,document.getElementById("current-holiday-name").innerText=n.name;const r=document.getElementById("js-template"),o=(e,a)=>{for(const n of t.filter(e=>e.dateobject.getFullYear()===a)){const t=r.content.cloneNode(!0);t.querySelector(".data-holiday-date").innerText=n.dateobject.toLocaleDateString(i,{month:"long",day:"numeric"}),t.querySelector(".data-holiday-day-of-week").innerText=n.dateobject.toLocaleDateString(i,{weekday:"long"}),t.querySelector(".data-holiday-name").innerText=n.name,0!==n.dateobject.getDay()&&6!==n.dateobject.getDay()||t.querySelector(".data-holiday-credit-link").classList.remove("d-none"),e.appendChild(t.querySelector(".data-holiday-row"))}};o(document.getElementById("js-tbody-template-2020-results"),2020),o(document.getElementById("js-tbody-template-2021-results"),2021),o(document.getElementById("js-tbody-template-2022-results"),2022),o(document.getElementById("js-tbody-template-2023-results"),2023),document.querySelectorAll('a[href*="#credits"]').forEach(e=>e.addEventListener("click",()=>{const e=document.querySelector(".js-credits .card-container").style.height;e&&"0px"!==e||document.querySelector(".js-credits button.accordion-alpha").click()}))})}}window.customElements.define("cwds-holidays",a),Array.prototype.forEach.call(document.querySelectorAll(".tooltip-button"),e=>{e.setAttribute("type","button"),e.setAttribute("aria-label","Word Definition");let t=document.createElement("span");t.setAttribute("class","tooltip-container"),e.parentNode.insertBefore(t,e),t.appendChild(e);let a=document.createElement("span");a.setAttribute("role","status"),t.appendChild(a);let n=e.getAttribute("data-tooltip-content");e.addEventListener("click",()=>{a.innerHTML="",window.setTimeout(()=>{a.innerHTML='<span class="tooltip-bubble">'+n+"</span>"},100)}),document.addEventListener("click",t=>{e!==t.target&&(a.innerHTML="")}),e.addEventListener("keydown",e=>{27===(e.keyCode||e.which)&&(a.innerHTML="")}),e.addEventListener("blur",()=>{a.innerHTML=""})}),document.querySelectorAll(".show-all").forEach(e=>{const t=e.classList.contains("d-none");e.addEventListener("click",()=>{let e=0;document.querySelectorAll(`.list-group-item-action${t?".list-open":":not(.list-open)"}`).forEach(t=>setTimeout(()=>t.click(),50*e++)),document.querySelectorAll(".show-all").forEach(e=>e.classList.toggle("d-none"))})});
