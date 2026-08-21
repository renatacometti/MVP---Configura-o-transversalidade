const officeTitle = document.querySelector("#selected-office");
const officeButtons = document.querySelectorAll("[data-office]");
const cards = document.querySelector("#cards");
const panel = document.querySelector("#config-panel");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");
const toggleButton = document.querySelector("#toggle-panel");

officeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    officeButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    if (officeTitle) officeTitle.textContent = button.dataset.office;
  });
});

function setView(view) {
  const isGrid = view === "grid";
  if (!cards || !gridButton || !listButton) return;
  cards.classList.toggle("cards-grid", isGrid);
  cards.classList.toggle("cards-list", !isGrid);
  gridButton.classList.toggle("selected", isGrid);
  listButton.classList.toggle("selected", !isGrid);
  gridButton.setAttribute("aria-pressed", String(isGrid));
  listButton.setAttribute("aria-pressed", String(!isGrid));
}

if (gridButton) gridButton.addEventListener("click", () => setView("grid"));
if (listButton) listButton.addEventListener("click", () => setView("list"));

if (toggleButton && panel && cards) toggleButton.addEventListener("click", () => {
  const expanded = toggleButton.getAttribute("aria-expanded") === "true";
  toggleButton.setAttribute("aria-expanded", String(!expanded));
  toggleButton.setAttribute("aria-label", expanded ? "Expandir configurações" : "Recolher configurações");
  toggleButton.textContent = expanded ? "⌄" : "⌃";
  panel.classList.toggle("collapsed", expanded);
  cards.classList.toggle("cards-hidden", expanded);
});

const expandAllButton = document.querySelector("#expand-all");
const collapseAllButton = document.querySelector("#collapse-all");

if (expandAllButton) {
  expandAllButton.addEventListener("click", () => {
    if (toggleButton && panel && cards) {
      toggleButton.setAttribute("aria-expanded", "true");
      toggleButton.setAttribute("aria-label", "Recolher modelos");
      toggleButton.textContent = "⌃";
      panel.classList.remove("collapsed");
      cards.classList.remove("cards-hidden");
    }
    if (propertiesToggle && propertiesForm) {
      propertiesToggle.setAttribute("aria-expanded", "true");
      propertiesToggle.setAttribute("aria-label", "Recolher propriedades");
      propertiesToggle.textContent = "⌃";
      propertiesForm.hidden = false;
    }
  });
}

if (collapseAllButton) {
  collapseAllButton.addEventListener("click", () => {
    if (toggleButton && panel && cards) {
      toggleButton.setAttribute("aria-expanded", "false");
      toggleButton.setAttribute("aria-label", "Expandir modelos");
      toggleButton.textContent = "⌄";
      panel.classList.add("collapsed");
      cards.classList.add("cards-hidden");
    }
    if (propertiesToggle && propertiesForm) {
      propertiesToggle.setAttribute("aria-expanded", "false");
      propertiesToggle.setAttribute("aria-label", "Expandir propriedades");
      propertiesToggle.textContent = "⌄";
      propertiesForm.hidden = true;
    }
  });
}

const addGuideButton = document.querySelector("#add-guide");
const guideDialog = document.querySelector("#guide-dialog");
const guideForm = document.querySelector("#guide-form");
const guideNameInput = document.querySelector("#guide-name");
const guideError = document.querySelector("#guide-error");
const cancelGuideButton = document.querySelector("#cancel-guide");

if (addGuideButton && guideDialog && guideNameInput) {
  addGuideButton.addEventListener("click", () => {
    guideNameInput.value = "";
    guideError.textContent = "";
    guideDialog.showModal();
    guideNameInput.focus();
  });
}

if (cancelGuideButton && guideDialog) {
  cancelGuideButton.addEventListener("click", () => guideDialog.close());
}

if (guideForm && guideDialog && guideNameInput && addGuideButton) {
  guideForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const guideName = guideNameInput.value.trim();
    const existingNames = [...document.querySelectorAll(".model-card > span:nth-last-child(2)")]
      .map((item) => item.textContent.trim().toLocaleLowerCase("pt-BR"));

    if (!guideName) {
      guideError.textContent = "Informe o nome da nova guia.";
      guideNameInput.focus();
      return;
    }

    if (existingNames.includes(guideName.toLocaleLowerCase("pt-BR"))) {
      guideError.textContent = "Já existe uma guia com esse nome.";
      guideNameInput.focus();
      return;
    }

    const newCard = document.createElement("button");
    newCard.type = "button";
    newCard.className = "config-card model-card";

    const menu = document.createElement("span");
    menu.className = "card-menu";
    menu.setAttribute("aria-hidden", "true");
    menu.textContent = "⋮";

    const icon = document.createElement("span");
    icon.className = "card-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "▰";

    const label = document.createElement("span");
    label.textContent = guideName;

    const count = document.createElement("span");
    count.className = "card-count";
    count.textContent = "0";

    newCard.append(menu, icon, label, count);
    addGuideButton.before(newCard);
    guideDialog.close();
  });
}

const propertiesToggle = document.querySelector("#toggle-properties");
const propertiesForm = document.querySelector("#properties-form");

if (propertiesToggle && propertiesForm) {
  propertiesToggle.addEventListener("click", () => {
    const expanded = propertiesToggle.getAttribute("aria-expanded") === "true";
    propertiesToggle.setAttribute("aria-expanded", String(!expanded));
    propertiesToggle.setAttribute("aria-label", expanded ? "Expandir propriedades" : "Recolher propriedades");
    propertiesToggle.textContent = expanded ? "⌄" : "⌃";
    propertiesForm.hidden = expanded;
  });
}

document.querySelectorAll(".section-toggle").forEach((toggle) => {
  toggle.addEventListener("change", () => {
    const section = toggle.closest(".relevance-section");
    const status = section?.querySelector(".toggle-status");
    const sectionName = section?.dataset.sectionName || "seção";
    const enabled = toggle.checked;

    section?.classList.toggle("is-disabled", !enabled);
    if (status) status.textContent = enabled ? "Habilitado" : "Desabilitado";
    toggle.setAttribute("aria-label", `${enabled ? "Desabilitar" : "Habilitar"} ${sectionName}`);
  });
});

const addCriteriaGroupButton = document.querySelector("#add-criteria-group");
const criteriaGroups = document.querySelector("#criteria-groups");
const criteriaGroupTemplate = document.querySelector("#criteria-group-template");

if (addCriteriaGroupButton && criteriaGroups && criteriaGroupTemplate) {
  addCriteriaGroupButton.addEventListener("click", () => {
    const groupNumber = criteriaGroups.children.length + 1;
    const group = criteriaGroupTemplate.content.cloneNode(true);
    const section = group.querySelector(".criteria-group-section");
    const titleInput = group.querySelector(".criteria-group-title");
    const indexInput = group.querySelector(".criteria-group-index");

    if (section) section.setAttribute("aria-label", `Grupo ${groupNumber}`);
    if (titleInput) titleInput.value = `Grupo ${groupNumber}`;
    if (indexInput) indexInput.value = String(groupNumber);

    criteriaGroups.append(group);
  });
}
