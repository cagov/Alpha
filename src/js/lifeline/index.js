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

function hide(id) {
  document.getElementById(id).classList.add("d-none");
}
function hideall() {
  hide("div-checkform");
  hide("div-no-not-sure");
  hide("div-qualified");
  hide("div-total-income");
  hide("div-qualified-income");
}

function show(id) {
  hideall();
  window.scrollTo(0, 0);
  updateSelections();
  showone(id);
}

function showone(id) {
  document.getElementById(id).classList.remove("d-none");
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

//if(document.getElementById("#check-not-sure")) {

document
  .querySelectorAll("#check-not-sure,#check-no")
  .forEach(x => x.addEventListener("click", () => setTimeout(noclick, 1000)));

if (document.querySelector("#btn-next")) {
  document.querySelector("#btn-next").addEventListener("click", nextclick);
}

function nextclick() {
  updateSelections();
  show("div-qualified");
  showone("div-return");
}

function noclick() {
  if (document.querySelector("li.active #check-not-sure,li.active #check-no")) {
    show("div-no-not-sure");
    showone("div-return");
    document.getElementById("lst-household-size").focus();
  }
}

document
  .getElementById("btn-select-people")
  .addEventListener("click", function() {
    if (html5formvalid(this)) {
      const people = Number(
        document.getElementById("lst-household-size").value || 0
      );

      let bucks = 0;
      switch (people) {
        case 1:
        case 2:
          bucks = 27500;
          break;
        case 3:
          bucks = 31900;
          break;
        default:
          bucks = 38800 + 6900 * (people - 3);
      }

      document.getElementById(
        "spn-income-cap"
      ).innerText = bucks.toLocaleString();

      show("div-total-income");
    }
  });

document.getElementById("btn-yes").addEventListener("click", function() {
  show("div-qualified-income");
});

document.getElementById("btn-no").addEventListener("click", function() {
  if (document.querySelector("li.active #check-no")) show("div-not-qualified");
  else show("div-not-sure-qualified");
});

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
