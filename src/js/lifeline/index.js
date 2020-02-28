if (window.location.href.endsWith("#2"))
  document.querySelectorAll(".list-group-item-action").forEach((x, i) => {
    if (i == 1) setTimeout(() => x.click(), 500);
  });

if (window.location.href.endsWith("#4"))
  document.querySelectorAll(".list-group-item-action").forEach((x, i) => {
    if (i == 3) setTimeout(() => x.click(), 500);
  });

document.querySelectorAll(".show-all").forEach(x => {
  const is_close_button = x.classList.contains("d-none");

  x.addEventListener("click", () => {
    let wait = 0;
    document
      .querySelectorAll(
        `.list-group-item-action${
          is_close_button ? ".list-open" : ":not(.list-open)"
        }`
      )
      .forEach(x => setTimeout(() => x.click(), 50 * wait++));

    document
      .querySelectorAll(".show-all")
      .forEach(y => y.classList.toggle("d-none"));
  });
});

function html5formvalid(input) {
  return !input.form.checkValidity || input.form.checkValidity();
}

function updateSelections() {
  const ul_programs = document.getElementById("ul-programs");
  while (ul_programs.firstChild)
    ul_programs.removeChild(ul_programs.firstChild);

  document.querySelectorAll("li.active label").forEach(x => {
    const li = document.createElement("li");
    li.innerText = x.innerText;
    ul_programs.appendChild(li);
  });
}

//Count of programs selected
const programs = new URLSearchParams(window.location.search).get("programs")

if(programs) {
  const btn_not_qualified = document.getElementById("btn-not-qualified")
  const btn_not_sure_qualified = document.getElementById("btn-not-sure-qualified")

  if(btn_not_qualified&&btn_not_sure_qualified) {
    if(programs=="no")
      btn_not_sure_qualified.classList.toggle("d-none")
    else
      btn_not_qualified.classList.toggle("d-none")
  }

  const programs_box = document.getElementById("programs")
  if(programs_box) programs_box.value = programs
}

const household = new URLSearchParams(window.location.search).get("household")
if(household) {
  const people = Number(household)

  let bucks = 0
  switch (people) {
    case 1:
    case 2:
      bucks = 27500
      break
    case 3:
      bucks = 31900
      break
    default:
      bucks = 38800 + 6900 * (people - 3)
  }

  document.getElementById("js-spn-income-cap").innerText = bucks.toLocaleString()
}



if(document.getElementById("btn-yes")) {
  document.getElementById("btn-yes").addEventListener("click", function() {
    show("div-qualified-income");
  });  
}

if(document.getElementById("btn-no")) {
  document.getElementById("btn-no").addEventListener("click", function() {
    if (document.querySelector("li.active #check-no")) show("div-not-qualified");
    else show("div-not-sure-qualified");
  });
}

function itemclick(o) {
  o.addEventListener("click", function() {
    this.parentNode.classList.toggle("active");

    //X-able the next button based on selections
    const button = document.querySelector("#btn-next");
    if (document.querySelector(".list-group li.active")) {
      button.setAttribute("aria-disabled", "false");
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("aria-disabled", "true");
      button.setAttribute("disabled", "");
    }

    updateSelections();
  });
}

//Add click event to every checkbox listitem
Array.prototype.forEach.call(
  document.querySelectorAll(".list-group-item input"),
  itemclick
);

//Tooltip support
Array.prototype.forEach.call(
  document.querySelectorAll(".tooltip-button"),
  function(toggletip) {
    toggletip.setAttribute("type", "button");
    toggletip.setAttribute("aria-label", "Word Definition");

    //wrap a container around the button
    var container = document.createElement("span");
    container.setAttribute("class", "tooltip-container");
    toggletip.parentNode.insertBefore(container, toggletip);
    container.appendChild(toggletip);

    // Create the live region
    var liveRegion = document.createElement("span");
    liveRegion.setAttribute("role", "status");

    // Place the live region in the container
    container.appendChild(liveRegion);

    // Get the message from the data-content element
    var message = toggletip.getAttribute("data-tooltip-content");

    // Toggle the message
    toggletip.addEventListener("click", function() {
      liveRegion.innerHTML = "";
      window.setTimeout(function() {
        liveRegion.innerHTML =
          '<span class="tooltip-bubble">' + message + "</span>";
      }, 100);
    });

    // Close on outside click
    document.addEventListener("click", function(e) {
      if (toggletip !== e.target) {
        liveRegion.innerHTML = "";
      }
    });

    // Remove toggletip on ESC
    toggletip.addEventListener("keydown", function(e) {
      if ((e.keyCode || e.which) === 27) liveRegion.innerHTML = "";
    });

    // Remove on blur
    toggletip.addEventListener("blur", function(e) {
      liveRegion.innerHTML = "";
    });
  }
);
//}
