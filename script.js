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
const selectionPropertyTemplate = document.querySelector("#selection-property-template");
const listPropertyTemplate = document.querySelector("#list-property-template");

function directSelectionProperties(container) {
  if (!container) return [];
  return [...container.children].filter((child) => child.classList.contains("criteria-selection-property"));
}

function directListProperties(container) {
  if (!container) return [];
  return [...container.children].filter((child) => child.classList.contains("criteria-list-property"));
}

function parsePossibleValues(rawValue) {
  if (Array.isArray(rawValue)) {
    return rawValue.map((item) => ({ label: String(item.label || ""), score: String(item.score ?? item.note ?? "0") }));
  }

  try {
    const parsedValues = JSON.parse(rawValue || "[]");
    if (Array.isArray(parsedValues)) {
      return parsedValues.map((item) => ({ label: String(item.label || ""), score: String(item.score ?? item.note ?? "0") }));
    }
  } catch {
    return String(rawValue || "")
      .split(/[,;\n]+/)
      .map((label) => label.trim())
      .filter(Boolean)
      .map((label) => ({ label, score: "0" }));
  }

  return [];
}

const possibleValuesDialog = document.querySelector("#possible-values-dialog");
const possibleValuesForm = document.querySelector("#possible-values-form");
const possibleValuesRows = document.querySelector("#possible-values-rows");
const possibleValuesEmpty = document.querySelector("#possible-values-empty");
const possibleValuesCount = document.querySelector("#possible-values-count");
const closePossibleValuesButton = document.querySelector("#close-possible-values");
let possibleValuesTargetInput = null;
let possibleValuesDraft = [];

function renderPossibleValues() {
  if (!possibleValuesRows || !possibleValuesEmpty || !possibleValuesCount) return;
  possibleValuesRows.replaceChildren();

  possibleValuesDraft.forEach((possibleValue, index) => {
    const row = document.createElement("div");
    row.className = "possible-value-row";

    const drag = document.createElement("span");
    drag.className = "possible-value-drag";
    drag.setAttribute("aria-hidden", "true");
    drag.textContent = "⠿";

    const labelInput = document.createElement("input");
    labelInput.type = "text";
    labelInput.value = possibleValue.label;
    labelInput.placeholder = "Rótulo";
    labelInput.required = true;
    labelInput.setAttribute("aria-label", `Rótulo da opção ${index + 1}`);

    const scoreInput = document.createElement("input");
    scoreInput.type = "number";
    scoreInput.step = "any";
    scoreInput.value = possibleValue.score;
    scoreInput.placeholder = "Valor";
    scoreInput.required = true;
    scoreInput.setAttribute("aria-label", `Valor da opção ${index + 1}`);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "🗑";
    deleteButton.setAttribute("aria-label", `Excluir valor ${index + 1}`);

    labelInput.addEventListener("input", () => { possibleValuesDraft[index].label = labelInput.value; });
    scoreInput.addEventListener("input", () => { possibleValuesDraft[index].score = scoreInput.value; });
    deleteButton.addEventListener("click", () => {
      possibleValuesDraft.splice(index, 1);
      renderPossibleValues();
    });

    row.append(drag, labelInput, scoreInput, deleteButton);
    possibleValuesRows.append(row);
  });

  possibleValuesEmpty.hidden = possibleValuesDraft.length > 0;
  possibleValuesCount.textContent = `${possibleValuesDraft.length} ${possibleValuesDraft.length === 1 ? "valor" : "valores"}`;
}

function addPossibleValue() {
  possibleValuesDraft.push({ label: "", score: "0" });
  renderPossibleValues();
  possibleValuesRows?.querySelector(".possible-value-row:last-child input")?.focus();
}

function openPossibleValuesEditor(targetInput) {
  if (!possibleValuesDialog || !targetInput) return;
  possibleValuesTargetInput = targetInput;
  possibleValuesDraft = parsePossibleValues(targetInput.value);
  renderPossibleValues();
  possibleValuesDialog.showModal();
}

document.querySelectorAll(".add-possible-value-button").forEach((button) => button.addEventListener("click", addPossibleValue));
closePossibleValuesButton?.addEventListener("click", () => possibleValuesDialog?.close());
possibleValuesForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!possibleValuesTargetInput) return;
  possibleValuesTargetInput.value = JSON.stringify(possibleValuesDraft);
  possibleValuesTargetInput.dispatchEvent(new Event("change", { bubbles: true }));
  possibleValuesDialog?.close();
});

function appendSelectionProperty(container, propertyData = {}) {
  if (!container || !selectionPropertyTemplate) return;

  const property = selectionPropertyTemplate.content.cloneNode(true);
  const section = property.querySelector(".criteria-selection-property");
  const form = property.querySelector(".selection-property-form");
  const enabledInput = property.querySelector(".selection-property-enabled");
  const deleteButton = property.querySelector(".delete-selection-property");
  const toggleButton = property.querySelector(".toggle-selection-property");
  const valuesInput = property.querySelector('[name="selectionValues"]');
  const valuesSummary = property.querySelector(".selection-values-summary");
  const addValueButton = property.querySelector(".add-selection-value");

  if (!section || !form) return;

  form.elements.namedItem("selectionName").value = propertyData.name || "";
  form.elements.namedItem("selectionLabel").value = propertyData.label || "";
  form.elements.namedItem("selectionIndex").value = String(propertyData.index || 3);
  const storedPossibleValues = propertyData.possibleValues || parsePossibleValues(propertyData.values || "Valor 1, Valor 2");
  form.elements.namedItem("selectionValues").value = JSON.stringify(storedPossibleValues);
  form.elements.namedItem("selectionDefault").value = propertyData.defaultValue || "";
  form.elements.namedItem("selectionFullLine").checked = propertyData.fullLine !== false;
  form.elements.namedItem("selectionRequired").checked = Boolean(propertyData.required);
  form.elements.namedItem("selectionMultiple").checked = Boolean(propertyData.multiple);
  form.elements.namedItem("selectionHelp").value = propertyData.helpText || "";
  if (enabledInput) enabledInput.checked = propertyData.enabled !== false;

  const updateValuesSummary = () => {
    if (!valuesInput || !valuesSummary) return;
    const configuredValues = parsePossibleValues(valuesInput.value);
    valuesSummary.textContent = `${configuredValues.length} ${configuredValues.length === 1 ? "valor configurado" : "valores configurados"}`;
  };

  deleteButton?.addEventListener("click", () => section.remove());
  addValueButton?.addEventListener("click", () => openPossibleValuesEditor(valuesInput));
  valuesInput?.addEventListener("change", updateValuesSummary);
  enabledInput?.addEventListener("change", () => section.classList.toggle("is-disabled", !enabledInput.checked));
  toggleButton?.addEventListener("click", () => {
    const expanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!expanded));
    toggleButton.setAttribute("aria-label", expanded ? "Expandir propriedade Seleção Multivalor" : "Recolher propriedade Seleção Multivalor");
    toggleButton.textContent = expanded ? "⌄" : "⌃";
    section.classList.toggle("is-collapsed", expanded);
  });

  section.classList.toggle("is-disabled", enabledInput ? !enabledInput.checked : false);
  updateValuesSummary();
  container.append(property);
}

function collectSelectionProperties(container) {
  return directSelectionProperties(container).map((section) => {
    const form = section.querySelector(".selection-property-form");
    const data = new FormData(form);
    const possibleValues = parsePossibleValues(String(data.get("selectionValues") || "[]"));
    return {
      type: "selection",
      enabled: section.querySelector(".selection-property-enabled")?.checked !== false,
      name: String(data.get("selectionName") || ""),
      label: String(data.get("selectionLabel") || ""),
      index: Number(data.get("selectionIndex") || 3),
      values: JSON.stringify(possibleValues),
      possibleValues,
      defaultValue: String(data.get("selectionDefault") || ""),
      fullLine: data.has("selectionFullLine"),
      required: data.has("selectionRequired"),
      multiple: data.has("selectionMultiple"),
      helpText: String(data.get("selectionHelp") || "")
    };
  });
}

const listPropertyTypes = {
  "challenge-list": { label: "Lista de Desafios", icon: "≡" },
  "ods-list": { label: "Lista de ODS", icon: "◎" }
};

function appendListProperty(container, propertyType, propertyData = {}) {
  if (!container || !listPropertyTemplate || !listPropertyTypes[propertyType]) return;

  const typeDetails = listPropertyTypes[propertyType];
  const property = listPropertyTemplate.content.cloneNode(true);
  const section = property.querySelector(".criteria-list-property");
  const form = property.querySelector(".list-property-form");
  const icon = property.querySelector(".list-property-icon");
  const title = property.querySelector(".list-property-title");
  const enabledInput = property.querySelector(".list-property-enabled");
  const deleteButton = property.querySelector(".delete-list-property");
  const toggleButton = property.querySelector(".toggle-list-property");

  if (!section || !form) return;

  section.dataset.propertyType = propertyType;
  section.setAttribute("aria-label", `Propriedade do tipo ${typeDetails.label}`);
  if (icon) icon.textContent = typeDetails.icon;
  if (title) title.textContent = `( ${typeDetails.label} )`;
  if (deleteButton) deleteButton.setAttribute("aria-label", `Excluir propriedade ${typeDetails.label}`);
  if (enabledInput) {
    enabledInput.checked = propertyData.enabled !== false;
    enabledInput.setAttribute("aria-label", `Habilitar propriedade ${typeDetails.label}`);
  }
  if (toggleButton) toggleButton.setAttribute("aria-label", `Recolher propriedade ${typeDetails.label}`);

  form.elements.namedItem("listName").value = propertyData.name || "";
  form.elements.namedItem("listLabel").value = propertyData.label || "";
  form.elements.namedItem("listIndex").value = String(propertyData.index || 3);
  form.elements.namedItem("listValue").value = propertyData.value || "";
  form.elements.namedItem("listWeight").value = propertyData.weight || "1";

  deleteButton?.addEventListener("click", () => section.remove());
  enabledInput?.addEventListener("change", () => section.classList.toggle("is-disabled", !enabledInput.checked));
  toggleButton?.addEventListener("click", () => {
    const expanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", String(!expanded));
    toggleButton.setAttribute("aria-label", expanded ? `Expandir propriedade ${typeDetails.label}` : `Recolher propriedade ${typeDetails.label}`);
    toggleButton.textContent = expanded ? "⌄" : "⌃";
    section.classList.toggle("is-collapsed", expanded);
  });

  section.classList.toggle("is-disabled", enabledInput ? !enabledInput.checked : false);
  container.append(property);
}

function collectListProperties(container) {
  return directListProperties(container).map((section) => {
    const form = section.querySelector(".list-property-form");
    const data = new FormData(form);
    return {
      type: section.dataset.propertyType,
      enabled: section.querySelector(".list-property-enabled")?.checked !== false,
      name: String(data.get("listName") || ""),
      label: String(data.get("listLabel") || ""),
      index: Number(data.get("listIndex") || 3),
      value: String(data.get("listValue") || ""),
      weight: String(data.get("listWeight") || "1")
    };
  });
}

function appendPropertyFromData(container, propertyData = {}) {
  if (listPropertyTypes[propertyData.type]) {
    appendListProperty(container, propertyData.type, propertyData);
    return;
  }
  appendSelectionProperty(container, propertyData);
}

function collectProperties(container) {
  const selectionSections = directSelectionProperties(container);
  const listSections = directListProperties(container);
  const selectionData = collectSelectionProperties(container);
  const listData = collectListProperties(container);
  const selectionProperties = new Map(selectionSections.map((section, index) => [section, selectionData[index]]));
  const listProperties = new Map(listSections.map((section, index) => [section, listData[index]]));
  return [...container.children]
    .filter((section) => selectionProperties.has(section) || listProperties.has(section))
    .map((section) => selectionProperties.get(section) || listProperties.get(section));
}

function appendCriteriaGroup(groupData = {}) {
  if (!criteriaGroups || !criteriaGroupTemplate) return;

  const groupNumber = criteriaGroups.children.length + 1;
  const group = criteriaGroupTemplate.content.cloneNode(true);
  const section = group.querySelector(".criteria-group-section");
  const titleInput = group.querySelector(".criteria-group-title");
  const indexInput = group.querySelector(".criteria-group-index");
  const weightInput = group.querySelector('[name="groupWeight"]');
  const operationInput = group.querySelector('[name="groupOperation"]');
  const enableKeyInput = group.querySelector('[name="groupEnableKey"]');
  const enableValueInput = group.querySelector('[name="groupEnableValue"]');
  const enableLabelInput = group.querySelector('[name="groupEnableLabel"]');

  if (section) section.setAttribute("aria-label", `Grupo ${groupNumber}`);
  if (titleInput) titleInput.value = groupData.title || `Grupo ${groupNumber}`;
  if (indexInput) indexInput.value = String(groupData.index || groupNumber);
  if (weightInput) weightInput.value = groupData.weight || "1";
  if (operationInput) operationInput.value = groupData.operation || "soma";
  if (enableKeyInput) enableKeyInput.checked = Boolean(groupData.enableKey);
  if (enableValueInput) enableValueInput.value = groupData.enableValue || "";
  if (enableLabelInput) enableLabelInput.value = groupData.enableLabel || "";
  (groupData.properties || []).forEach((propertyData) => appendPropertyFromData(section, propertyData));

  criteriaGroups.append(group);
}

if (addCriteriaGroupButton && criteriaGroups && criteriaGroupTemplate) {
  addCriteriaGroupButton.addEventListener("click", () => appendCriteriaGroup());
}

const criteriaStorageKey = "anteprojeto-criteria-cards";

function readSavedCriteria() {
  try {
    const savedCriteria = JSON.parse(localStorage.getItem(criteriaStorageKey) || "[]");
    return Array.isArray(savedCriteria) ? savedCriteria : [];
  } catch {
    return [];
  }
}

const editingCriterionId = new URLSearchParams(window.location.search).get("criterion");
let editingCriterion = null;

function loadCriterionIntoForm(criterion) {
  if (!criterion || !propertiesForm || !criteriaGroups) return;

  propertiesForm.elements.namedItem("name").value = criterion.name || "";
  propertiesForm.elements.namedItem("position").value = String(criterion.position || 1);
  propertiesForm.elements.namedItem("weight").value = criterion.weight || "1";
  propertiesForm.elements.namedItem("operation").value = criterion.operation || "soma";
  const propertiesPanel = propertiesForm.closest(".criteria-properties-panel");
  directSelectionProperties(propertiesPanel).forEach((property) => property.remove());
  directListProperties(propertiesPanel).forEach((property) => property.remove());
  (criterion.properties || []).forEach((propertyData) => appendPropertyFromData(propertiesPanel, propertyData));
  criteriaGroups.replaceChildren();
  (criterion.groups || []).forEach((group) => appendCriteriaGroup(group));
}

if (editingCriterionId && propertiesForm && criteriaGroups) {
  editingCriterion = readSavedCriteria().find((criterion) => String(criterion.id) === editingCriterionId) || null;
  loadCriterionIntoForm(editingCriterion);
}

function createCriterionCard(criterion) {
  const criterionUrl = `criterios.html?criterion=${encodeURIComponent(criterion.id)}`;
  const card = document.createElement("div");
  card.className = "config-card model-card saved-criterion-card";
  card.tabIndex = 0;
  card.setAttribute("role", "link");
  card.setAttribute("aria-label", `Abrir critério ${criterion.name}`);
  card.dataset.criterionId = String(criterion.id);

  const menuButton = document.createElement("button");
  menuButton.type = "button";
  menuButton.className = "card-menu criterion-card-menu-button";
  menuButton.setAttribute("aria-label", `Opções do critério ${criterion.name}`);
  menuButton.setAttribute("aria-haspopup", "menu");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.textContent = "⋮";

  const icon = document.createElement("span");
  icon.className = "card-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "⚙";

  const label = document.createElement("span");
  label.textContent = criterion.name;

  const count = document.createElement("span");
  count.className = "card-count";
  const propertiesCount = (criterion.properties?.length || 0) + (criterion.groups || []).reduce((total, group) => total + (group.properties?.length || 0), 0);
  count.textContent = String(propertiesCount);

  const menu = document.createElement("div");
  menu.className = "criterion-card-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.setAttribute("role", "menuitem");
  deleteButton.textContent = "Excluir";

  const deleteConfirmation = document.createElement("div");
  deleteConfirmation.className = "criterion-delete-confirmation";
  deleteConfirmation.hidden = true;

  const confirmationText = document.createElement("span");
  confirmationText.textContent = "Excluir este cartão?";

  const confirmDeleteButton = document.createElement("button");
  confirmDeleteButton.type = "button";
  confirmDeleteButton.className = "confirm-delete-button";
  confirmDeleteButton.textContent = "Confirmar exclusão";

  const cancelDeleteButton = document.createElement("button");
  cancelDeleteButton.type = "button";
  cancelDeleteButton.className = "cancel-delete-button";
  cancelDeleteButton.textContent = "Cancelar";

  deleteConfirmation.append(confirmationText, confirmDeleteButton, cancelDeleteButton);
  menu.append(deleteButton, deleteConfirmation);

  card.addEventListener("click", () => {
    window.location.href = criterionUrl;
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.location.href = criterionUrl;
    }
  });
  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = menu.hidden;
    document.querySelectorAll(".criterion-card-menu").forEach((item) => { item.hidden = true; });
    document.querySelectorAll(".criterion-card-menu-button").forEach((item) => item.setAttribute("aria-expanded", "false"));
    menu.hidden = !willOpen;
    deleteButton.hidden = false;
    deleteConfirmation.hidden = true;
    menuButton.setAttribute("aria-expanded", String(willOpen));
  });
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteButton.hidden = true;
    deleteConfirmation.hidden = false;
  });
  cancelDeleteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    deleteConfirmation.hidden = true;
    deleteButton.hidden = false;
  });
  confirmDeleteButton.addEventListener("click", (event) => {
    event.stopPropagation();

    try {
      const remainingCriteria = readSavedCriteria().filter((saved) => String(saved.id) !== String(criterion.id));
      localStorage.setItem(criteriaStorageKey, JSON.stringify(remainingCriteria));
      card.remove();
    } catch {
      window.alert("Não foi possível excluir o critério.");
    }
  });
  menu.addEventListener("click", (event) => event.stopPropagation());

  card.append(menuButton, icon, label, count, menu);
  return card;
}

const addCriterionCard = document.querySelector("#add-criterion-card");

if (cards && addCriterionCard) {
  readSavedCriteria()
    .sort((first, second) => Number(first.position) - Number(second.position))
    .forEach((criterion) => addCriterionCard.before(createCriterionCard(criterion)));

  document.addEventListener("click", () => {
    document.querySelectorAll(".criterion-card-menu").forEach((menu) => { menu.hidden = true; });
    document.querySelectorAll(".criterion-card-menu-button").forEach((button) => button.setAttribute("aria-expanded", "false"));
  });
}

const saveCriterionButton = document.querySelector("#save-criterion");
const undoCriterionButton = document.querySelector("#undo-criterion");
const criterionSaveStatus = document.querySelector("#criterion-save-status");

if (saveCriterionButton && propertiesForm && criteriaGroups) {
  saveCriterionButton.addEventListener("click", () => {
    const forms = [propertiesForm, ...criteriaGroups.querySelectorAll(".criteria-group-form"), ...document.querySelectorAll(".selection-property-form, .list-property-form")];
    const invalidForm = forms.find((form) => !form.checkValidity());

    if (invalidForm) {
      invalidForm.reportValidity();
      return;
    }

    const propertiesData = new FormData(propertiesForm);
    const groups = [...criteriaGroups.querySelectorAll(".criteria-group-form")].map((form) => {
      const groupData = new FormData(form);
      const groupSection = form.closest(".criteria-group-section");
      return {
        title: String(groupData.get("groupTitle") || ""),
        index: Number(groupData.get("groupIndex") || 1),
        weight: String(groupData.get("groupWeight") || "1"),
        operation: String(groupData.get("groupOperation") || "soma"),
        enableKey: groupData.has("groupEnableKey"),
        enableValue: String(groupData.get("groupEnableValue") || ""),
        enableLabel: String(groupData.get("groupEnableLabel") || ""),
        properties: collectProperties(groupSection)
      };
    });
    const criterion = {
      id: editingCriterion?.id || Date.now(),
      name: String(propertiesData.get("name") || "").trim(),
      position: Number(propertiesData.get("position") || 1),
      weight: String(propertiesData.get("weight") || "1"),
      operation: String(propertiesData.get("operation") || "soma"),
      properties: collectProperties(propertiesForm.closest(".criteria-properties-panel")),
      groups
    };
    const savedCriteria = readSavedCriteria();
    let existingIndex = savedCriteria.findIndex((saved) => String(saved.id) === String(criterion.id));

    if (existingIndex < 0) {
      existingIndex = savedCriteria.findIndex((saved) => saved.name.toLocaleLowerCase("pt-BR") === criterion.name.toLocaleLowerCase("pt-BR"));
    }

    if (existingIndex >= 0) {
      criterion.id = savedCriteria[existingIndex].id;
      savedCriteria[existingIndex] = criterion;
    } else {
      savedCriteria.push(criterion);
    }

    try {
      localStorage.setItem(criteriaStorageKey, JSON.stringify(savedCriteria));
      if (criterionSaveStatus) criterionSaveStatus.textContent = "Critério salvo com sucesso.";
      window.location.href = "selecao-anteprojeto.html";
    } catch {
      if (criterionSaveStatus) {
        criterionSaveStatus.classList.remove("sr-only");
        criterionSaveStatus.textContent = "Não foi possível salvar o critério.";
      }
    }
  });
}

if (undoCriterionButton && propertiesForm && criteriaGroups) {
  undoCriterionButton.addEventListener("click", () => {
    window.location.href = "selecao-anteprojeto.html";
  });
}

const propertyTypes = [
  { icon: "$", label: "Moeda" },
  { icon: "▣", label: "Data" },
  { icon: "#", label: "Inteiro" },
  { icon: "●", label: "Seleção de localidade" },
  { icon: ".0", label: "Número" },
  { icon: "♜", label: "Seleção de organização" },
  { icon: "☷", label: "Seleção Multivalor" },
  { icon: "T", label: "Texto" },
  { icon: "↔", label: "Área de texto" },
  { icon: "▥", label: "Seleção de unidade" },
  { icon: "≡", label: "Lista de Desafios" },
  { icon: "◎", label: "Lista de ODS" },
  { icon: "◉", label: "Chave" }
];

function closePropertyTypeMenus(exceptMenu = null) {
  document.querySelectorAll(".property-type-menu").forEach((menu) => {
    if (menu !== exceptMenu) menu.hidden = true;
  });
  document.querySelectorAll(".add-property-button").forEach((button) => {
    if (!exceptMenu || button.parentElement?.querySelector(".property-type-menu") !== exceptMenu) {
      button.setAttribute("aria-expanded", "false");
    }
  });
}

function createPropertyTypeMenu(ownerButton) {
  const menu = document.createElement("div");
  menu.className = "property-type-menu";
  menu.setAttribute("role", "menu");
  menu.hidden = true;

  propertyTypes.forEach((propertyType) => {
    const option = document.createElement("button");
    option.type = "button";
    option.setAttribute("role", "menuitem");

    const icon = document.createElement("span");
    icon.className = "property-type-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = propertyType.icon;

    const label = document.createElement("span");
    label.textContent = propertyType.label;
    option.append(icon, label);
    option.addEventListener("click", () => {
      if (propertyType.label === "Seleção Multivalor") {
        const destinationSection = ownerButton.closest(".criteria-group-section, .criteria-properties-panel");
        appendSelectionProperty(destinationSection);
      } else if (propertyType.label === "Lista de Desafios" || propertyType.label === "Lista de ODS") {
        const destinationSection = ownerButton.closest(".criteria-group-section, .criteria-properties-panel");
        const listType = propertyType.label === "Lista de Desafios" ? "challenge-list" : "ods-list";
        appendListProperty(destinationSection, listType);
      }
      menu.hidden = true;
      ownerButton.setAttribute("aria-expanded", "false");
    });
    menu.append(option);
  });

  return menu;
}

document.addEventListener("click", (event) => {
  const addPropertyButton = event.target.closest(".add-property-button");

  if (addPropertyButton) {
    const actions = addPropertyButton.parentElement;
    let menu = actions?.querySelector(".property-type-menu");

    if (!menu && actions) {
      menu = createPropertyTypeMenu(addPropertyButton);
      actions.append(menu);
    }

    if (menu) {
      const willOpen = menu.hidden;
      closePropertyTypeMenus(menu);
      menu.style.left = `${addPropertyButton.offsetLeft}px`;
      menu.style.top = `${addPropertyButton.offsetTop + addPropertyButton.offsetHeight + 4}px`;
      menu.hidden = !willOpen;
      addPropertyButton.setAttribute("aria-expanded", String(willOpen));
    }
    return;
  }

  if (!event.target.closest(".property-type-menu")) closePropertyTypeMenus();
});
