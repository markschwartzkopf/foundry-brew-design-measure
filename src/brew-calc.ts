const doseInput = document.getElementById("dose") as HTMLInputElement;
doseInput.onchange = () => {
  const dose = parseFloat(doseInput.value) || 0;
  updateState({ dose });
};
const brewMassInput = document.getElementById("brew-mass") as HTMLInputElement;
const bevMassInput = document.getElementById("bev-mass") as HTMLInputElement;
const brewRatioInput = document.getElementById(
  "brew-ratio"
) as HTMLInputElement;
const extInput = document.getElementById("extraction") as HTMLInputElement;
const tdsInput = document.getElementById("tds") as HTMLInputElement;
const basketFilterMassInput = document.getElementById(
  "basket-filter-mass"
) as HTMLInputElement;
const basketFilterCoffeeMassInput = document.getElementById(
  "basket-filter-coffee-mass"
) as HTMLInputElement;
const finalBasketMassInput = document.getElementById(
  "final-basket-mass"
) as HTMLInputElement;
const emptyContainerMassInput = document.getElementById(
  "empty-container-mass"
) as HTMLInputElement;
const fullContainerMassInput = document.getElementById(
  "full-container-mass"
) as HTMLInputElement;
const targetBrewGallonsInput = document.getElementById(
  "target-brew-gallons"
) as HTMLInputElement;
const targetBrewMassInput = document.getElementById(
  "target-brew-mass"
) as HTMLInputElement;
const flowRateSettingInput = document.getElementById(
  "flow-rate-setting"
) as HTMLInputElement;
const correctedFlowRateSettingInput = document.getElementById(
  "corrected-flow-rate-setting"
) as HTMLInputElement;
const absorptionRatioInput = document.getElementById(
  "absorption-ratio"
) as HTMLInputElement;

const designInputs = [
  brewMassInput,
  extInput,
  tdsInput,
  targetBrewGallonsInput,
  absorptionRatioInput,
];

const measureInputs = [
  doseInput,
  tdsInput,
  basketFilterMassInput,
  finalBasketMassInput,
  emptyContainerMassInput,
  fullContainerMassInput,
  targetBrewGallonsInput,
  targetBrewMassInput,
  flowRateSettingInput,
];

const allInputs = [
  ...designInputs,
  ...measureInputs,
  bevMassInput,
  brewRatioInput,
  basketFilterCoffeeMassInput,
  correctedFlowRateSettingInput,
];

const inputsMap: Partial<{ [K in keyof AppState]: HTMLInputElement }> = {
  dose: doseInput,
  brewMass: brewMassInput,
  bevMass: bevMassInput,
  brewRatio: brewRatioInput,
  ext: extInput,
  tds: tdsInput,
  basketFilterMass: basketFilterMassInput,
  basketFilterCoffeeMass: basketFilterCoffeeMassInput,
  finalBasketMass: finalBasketMassInput,
  emptyContainerMass: emptyContainerMassInput,
  fullContainerMass: fullContainerMassInput,
  targetBrewGallons: targetBrewGallonsInput,
  targetBrewMass: targetBrewMassInput,
  flowRateSetting: flowRateSettingInput,
  correctedFlowRateSetting: correctedFlowRateSettingInput,
  absorptionRatio: absorptionRatioInput,
};

const modeFs = document.getElementById("mode") as HTMLFieldSetElement;

const recipeLine = document.getElementById(
  "recipe-line"
) as unknown as SVGPathElement;
const brewPoint = document.getElementById(
  "brew-point"
) as unknown as SVGEllipseElement;

type Mode = "measure" | "design";

type AppState = {
  mode: Mode;
  dose: number | null;
  brewMass: number | null;
  bevMass: number | null;
  brewRatio: number | null;
  ext: number | null;
  tds: number | null;
  basketFilterMass: number | null;
  basketFilterCoffeeMass: number | null;
  finalBasketMass: number | null;
  emptyContainerMass: number | null;
  fullContainerMass: number | null;
  targetBrewGallons: number | null;
  targetBrewMass: number | null;
  flowRateSetting: number | null;
  correctedFlowRateSetting: number | null;
  absorptionRatio: number | null;
};

let state: AppState = {
  mode: "design",
  dose: 200,
  brewMass: 3785,
  bevMass: 3405,
  brewRatio: 19.9,
  ext: 21.8,
  tds: 1.22,
  basketFilterMass: null,
  basketFilterCoffeeMass: null,
  finalBasketMass: null,
  emptyContainerMass: null,
  fullContainerMass: null,
  targetBrewGallons: null,
  targetBrewMass: null,
  flowRateSetting: null,
  correctedFlowRateSetting: null,
  absorptionRatio: 2.1,
};

function inputChangeHandler(key: keyof AppState, input: HTMLInputElement) {
  console.log(`Input change: ${key}`);
  let value: number | null = parseFloat(input.value);
  if (isNaN(value)) value = null;
  updateState({ [key]: value });
}

for (const key in inputsMap) {
  const typedKey = key as keyof AppState;
  const input = inputsMap[typedKey] as HTMLInputElement;
  input.onchange = () => {
    inputChangeHandler(typedKey, input);
  };
}

targetBrewGallonsInput.onchange = () => {
  if (state.mode === "measure") {
    let value: number | null = parseFloat(targetBrewGallonsInput.value);
    if (isNaN(value)) value = null;
    targetBrewMassInput.value = value === null ? "" : String(value * 3785);
    updateState({
      targetBrewGallons: value,
      targetBrewMass: value === null ? null : value * 3785,
    });
  } else {
    let value: number | null = parseFloat(targetBrewGallonsInput.value);
    if (isNaN(value)) value = null;
    brewMassInput.value = value === null ? "" : String(value * 3785);
    targetBrewMassInput.value = value === null ? "" : String(value * 3785);
    updateState({
      targetBrewGallons: value,
      brewMass: value === null ? null : value * 3785,
      targetBrewMass: value === null ? null : value * 3785,
    });
  }
};
targetBrewMassInput.onchange = () => {
  if (state.mode === "measure") {
    let value: number | null = parseFloat(targetBrewMassInput.value);
    if (isNaN(value)) value = null;
    targetBrewGallonsInput.value = value === null ? "" : (value / 3785).toPrecision(3);
    updateState({
      targetBrewMass: value,
      targetBrewGallons: value === null ? null : Number((value / 3785).toPrecision(3)),
    });
  } else inputChangeHandler("targetBrewMass", targetBrewMassInput);
};
brewMassInput.onchange = () => {
  if (state.mode === "design") {
    let value: number | null = parseFloat(brewMassInput.value);
    if (isNaN(value)) value = null;
    targetBrewGallonsInput.value = value === null ? "" : (value / 3785).toPrecision(3);
    updateState({
      brewMass: value,
      targetBrewGallons: value === null ? null : Number((value / 3785).toPrecision(3)),
    });
  }
};

function updateState(newStatePartial: Partial<AppState>) {
  const newState = { ...state, ...newStatePartial };
  if (newState.mode === "design") {
    //dose
    if (
      newState.tds &&
      newState.ext &&
      newState.brewMass &&
      newState.absorptionRatio
    ) {
      newState.dose =
        ((newState.tds / 100) * newState.brewMass) /
        (newState.ext / 100 + (newState.tds / 100) * newState.absorptionRatio);
      newState.dose = Number(newState.dose.toPrecision(3));
    } else newState.dose = null;
    //bevMass
    if (newState.dose && newState.brewMass && newState.absorptionRatio) {
      newState.bevMass =
        newState.brewMass - newState.dose * newState.absorptionRatio;
      newState.bevMass = Math.round(newState.bevMass);
    } else newState.bevMass = null;
    //brewRatio
    if (newState.dose && newState.brewMass) {
      newState.brewRatio = newState.brewMass / newState.dose;
      newState.brewRatio = Math.round(newState.brewRatio * 10) / 10;
    } else newState.brewRatio = null;
    //targetBrewMass
    if (newState.targetBrewGallons !== null) {
      newState.targetBrewMass = newState.targetBrewGallons * 3785;
    }
  } else if (newState.mode === "measure") {
    //bevMass
    if (
      newState.emptyContainerMass !== null &&
      newState.fullContainerMass !== null
    ) {
      newState.bevMass =
        newState.fullContainerMass - newState.emptyContainerMass;
      newState.bevMass = Math.round(newState.bevMass);
    } else newState.bevMass = null;
    //basketFilterCoffeeMass
    if (newState.dose !== null && newState.basketFilterMass !== null) {
      newState.basketFilterCoffeeMass =
        newState.dose + newState.basketFilterMass;
    } else newState.basketFilterCoffeeMass = null;
    //brewMass
    if (
      newState.bevMass !== null &&
      newState.finalBasketMass !== null &&
      newState.basketFilterCoffeeMass !== null
    ) {
      newState.brewMass =
        newState.bevMass +
        (newState.finalBasketMass - newState.basketFilterCoffeeMass);
      newState.brewMass = Math.round(newState.brewMass);
    } else newState.brewMass = null;
    //brewRatio
    if (newState.dose !== null && newState.brewMass !== null) {
      newState.brewRatio = newState.brewMass / newState.dose;
      newState.brewRatio = Math.round(newState.brewRatio * 100) / 100;
    } else newState.brewRatio = null;
    //absorptionRatio
    if (
      newState.bevMass !== null &&
      newState.tds !== null &&
      newState.finalBasketMass !== null &&
      newState.basketFilterCoffeeMass !== null &&
      newState.dose !== null
    ) {
      const coffeeInBev = (newState.tds / 100) * newState.bevMass;
      const waterLeftInBasket =
        newState.finalBasketMass -
        newState.basketFilterCoffeeMass +
        coffeeInBev;
      newState.absorptionRatio = waterLeftInBasket / newState.dose;
      newState.absorptionRatio = Math.round(newState.absorptionRatio * 10) / 10;
    } else newState.absorptionRatio = null;
    //ext
    if (
      newState.tds !== null &&
      newState.bevMass !== null &&
      newState.dose !== null
    ) {
      newState.ext = newState.tds * (newState.bevMass / newState.dose);
      newState.ext = Math.round(newState.ext * 100) / 100;
    } else newState.ext = null;
    //correctedFlowRateSetting
    if (
      newState.flowRateSetting !== null &&
      newState.brewMass !== null &&
      newState.targetBrewMass
    ) {
      newState.correctedFlowRateSetting =
        newState.flowRateSetting *
        (newState.brewMass / newState.targetBrewMass);
      newState.correctedFlowRateSetting =
        Math.round(newState.correctedFlowRateSetting * 100) / 100;
    } else newState.correctedFlowRateSetting = null;
  }
  const json = JSON.stringify(newState);
  const encoded = encodeURIComponent(json);
  history.replaceState(null, "", `#${encoded}`);
  updateUI();
}

function updateUI() {
  const hash = location.hash.slice(1);
  if (!hash) {
    updateState({});
    return;
  } else {
    try {
      const decoded = decodeURIComponent(hash);
      const parsed = JSON.parse(decoded);
      state = { ...state, ...parsed };
    } catch (e) {
      console.error("Error parsing state from URL hash:", e);
      updateState({});
      return;
    }
  }
  if (state.bevMass !== null && state.dose !== null) {
    const y1 = 0.75;
    const y2 = 1.75;
    const x1 = y1 * (state.bevMass / state.dose);
    const x2 = y2 * (state.bevMass / state.dose);
    recipeLine.setAttribute("d", `M${x1} ${y1}L${x2} ${y2}`);
    console.log(recipeLine.getAttribute("d"));
    recipeLine.style.display = "block";
  } else recipeLine.style.display = "none";
  if (state.ext !== null && state.tds !== null) {
    brewPoint.setAttribute("cx", String(state.ext));
    brewPoint.setAttribute("cy", String(state.tds));
    brewPoint.style.display = "block";
  } else brewPoint.style.display = "none";

  if (state.mode === "design") {
    modeFs.querySelector<HTMLInputElement>(
      'input[name="mode"][value="design"]'
    )!.checked = true;
  } else {
    modeFs.querySelector<HTMLInputElement>(
      'input[name="mode"][value="measure"]'
    )!.checked = true;
  }
  for (const key in inputsMap) {
    const typedKey = key as keyof AppState;
    const input = inputsMap[typedKey] as HTMLInputElement;
    if (typedKey === "brewRatio") {
      input.value = state[typedKey] === null ? "" : `${state[typedKey]}:1`;
    } else
      input.value = state[typedKey] === null ? "" : String(state[typedKey]);
  }
  allInputs.forEach((input) => {
    if (state.mode === "design") {
      if (designInputs.includes(input)) {
        input.disabled = false;
      } else {
        input.disabled = true;
      }
    } else if (measureInputs.includes(input)) {
      input.disabled = false;
    } else {
      input.disabled = true;
    }
  });
}

modeFs.onchange = () => {
  const mode = modeFs.querySelector<HTMLInputElement>(
    'input[name="mode"]:checked'
  )!.value as Mode;
  updateState({ mode });
};

updateUI();
