if  (window.location.href.endsWith('#2') )
document.querySelectorAll('.list-group-item-action')
  .forEach((x,i)=>{if (i==1) setTimeout(()=>x.click(),500)});


if  (window.location.href.endsWith('#4') )
document.querySelectorAll('.list-group-item-action')
  .forEach((x,i)=>{if (i==3) setTimeout(()=>x.click(),500)});


document.querySelectorAll('.show-all').forEach(x=>{
const is_close_button = x.classList.contains('d-none')

x.addEventListener('click',()=>{
  let wait = 0
  document.querySelectorAll(`.list-group-item-action${is_close_button?'.list-open':':not(.list-open)'}`)
    .forEach(x=>setTimeout(()=>x.click(),50*wait++))

  document.querySelectorAll('.show-all').forEach(y=>y.classList.toggle('d-none'))
})
});
