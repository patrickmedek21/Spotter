/* -------------------------
   STORAGE AND STATE
------------------------- */

const STORAGE_KEYS = {
  calculations: "spotter-calculations",
  workouts: "spotter-workouts",
  activeWorkout: "spotter-active-workout",
  unit: "spotter-weight-unit"
};

let calculations = [];
let workouts = [];
let activeWorkoutId = null;

let editingCalculationId = null;
let editingSetId = null;
let editingSetWorkoutId = null;

let viewedWorkoutId = null;
let editingExistingWorkout = false;

let weightUnit =
  localStorage.getItem(
    STORAGE_KEYS.unit
  ) || "lb";


/* -------------------------
   ELEMENTS
------------------------- */

const tabButtons =
  document.querySelectorAll(".tab-button");

const tabPanels =
  document.querySelectorAll(".tab-panel");


/* Calculator */

const calculatorExercise =
  document.getElementById(
    "calculatorExercise"
  );

const calculatorWeight =
  document.getElementById(
    "calculatorWeight"
  );

const calculatorReps =
  document.getElementById(
    "calculatorReps"
  );

const calculateButton =
  document.getElementById(
    "calculateButton"
  );

const saveCalculationButton =
  document.getElementById(
    "saveCalculationButton"
  );

const clearCalculationsButton =
  document.getElementById(
    "clearCalculationsButton"
  );

const calculatorResult =
  document.getElementById(
    "calculatorResult"
  );

const savedCalculationsSection =
  document.getElementById(
    "savedCalculationsSection"
  );

const calculationHistory =
  document.getElementById(
    "calculationHistory"
  );


/* Workout creation */

const createWorkoutCard =
  document.getElementById(
    "createWorkoutCard"
  );

const newWorkoutDate =
  document.getElementById(
    "newWorkoutDate"
  );

const newWorkoutName =
  document.getElementById(
    "newWorkoutName"
  );

const createWorkoutButton =
  document.getElementById(
    "createWorkoutButton"
  );

const createWorkoutResult =
  document.getElementById(
    "createWorkoutResult"
  );


/* Active workout */

const activeWorkoutSection =
  document.getElementById(
    "activeWorkoutSection"
  );

const activeWorkoutName =
  document.getElementById(
    "activeWorkoutName"
  );

const activeWorkoutDate =
  document.getElementById(
    "activeWorkoutDate"
  );

const finishWorkoutButton =
  document.getElementById(
    "finishWorkoutButton"
  );

const workoutExercise =
  document.getElementById(
    "workoutExercise"
  );

const workoutWeight =
  document.getElementById(
    "workoutWeight"
  );

const workoutReps =
  document.getElementById(
    "workoutReps"
  );

const addSetButton =
  document.getElementById(
    "addSetButton"
  );

const cancelSetEditButton =
  document.getElementById(
    "cancelSetEditButton"
  );

const workoutResult =
  document.getElementById(
    "workoutResult"
  );

const activeWorkoutExercises =
  document.getElementById(
    "activeWorkoutExercises"
  );


/* Workout history */

const workoutHistorySection =
  document.getElementById(
    "workoutHistorySection"
  );

const workoutHistory =
  document.getElementById(
    "workoutHistory"
  );


/* Workout view */

const workoutViewSection =
  document.getElementById(
    "workoutViewSection"
  );

const backToWorkoutHistoryButton =
  document.getElementById(
    "backToWorkoutHistoryButton"
  );

const editViewedWorkoutButton =
  document.getElementById(
    "editViewedWorkoutButton"
  );

const viewedWorkoutName =
  document.getElementById(
    "viewedWorkoutName"
  );

const viewedWorkoutDate =
  document.getElementById(
    "viewedWorkoutDate"
  );

const viewedWorkoutSummary =
  document.getElementById(
    "viewedWorkoutSummary"
  );

const viewedWorkoutExercises =
  document.getElementById(
    "viewedWorkoutExercises"
  );

const activeWorkoutEyebrow =
  document.getElementById(
    "activeWorkoutEyebrow"
  );

const finishWorkoutButtonText =
  document.getElementById(
    "finishWorkoutButtonText"
  );

const finishWorkoutButtonIcon =
  document.getElementById(
    "finishWorkoutButtonIcon"
  );


/* Progress */

const progressExercise =
  document.getElementById(
    "progressExercise"
  );

const progressEmptyState =
  document.getElementById(
    "progressEmptyState"
  );

const progressTableWrapper =
  document.getElementById(
    "progressTableWrapper"
  );

const progressTableBody =
  document.getElementById(
    "progressTableBody"
  );

const completedWorkoutsValue =
  document.getElementById(
    "completedWorkoutsValue"
  );

const totalSetsValue =
  document.getElementById(
    "totalSetsValue"
  );

const totalRepsValue =
  document.getElementById(
    "totalRepsValue"
  );

const totalVolumeValue =
  document.getElementById(
    "totalVolumeValue"
  );


/* Weight units */

const poundsButton =
  document.getElementById(
    "poundsButton"
  );

const kilogramsButton =
  document.getElementById(
    "kilogramsButton"
  );

const weightLabels =
  document.querySelectorAll(
    "[data-weight-label]"
  );


/* Calculator modes */

const oneRepMaxModeButton =
  document.getElementById(
    "oneRepMaxModeButton"
  );

const repMaxModeButton =
  document.getElementById(
    "repMaxModeButton"
  );

const oneRepMaxCalculatorPanel =
  document.getElementById(
    "oneRepMaxCalculatorPanel"
  );

const repMaxCalculatorPanel =
  document.getElementById(
    "repMaxCalculatorPanel"
  );

const repMaxExercise =
  document.getElementById(
    "repMaxExercise"
  );

const repMaxWeight =
  document.getElementById(
    "repMaxWeight"
  );

const repMaxReps =
  document.getElementById(
    "repMaxReps"
  );

const generateRepMaxTableButton =
  document.getElementById(
    "generateRepMaxTableButton"
  );

const repMaxResult =
  document.getElementById(
    "repMaxResult"
  );

const repMaxResultsSection =
  document.getElementById(
    "repMaxResultsSection"
  );

const repMaxTableBody =
  document.getElementById(
    "repMaxTableBody"
  );


/* -------------------------
   WEIGHT UNITS
------------------------- */

const POUNDS_PER_KILOGRAM =
  2.2046226218;


function convertWeight(
  weight,
  fromUnit,
  toUnit
) {
  const numericWeight =
    Number(weight);

  if (
    !Number.isFinite(numericWeight) ||
    fromUnit === toUnit
  ) {
    return numericWeight;
  }

  const convertedWeight =
    fromUnit === "lb"
      ? numericWeight /
        POUNDS_PER_KILOGRAM
      : numericWeight *
        POUNDS_PER_KILOGRAM;

  return convertedWeight;
}


function convertWeightInput(
  input,
  fromUnit,
  toUnit
) {
  if (
    !input ||
    input.value.trim() === ""
  ) {
    return;
  }

  input.value =
    formatWeight(
      convertWeight(
        input.value,
        fromUnit,
        toUnit
      )
    );
}


function convertStoredWeights(
  fromUnit,
  toUnit
) {
  calculations =
    calculations.map(
      function (calculation) {
        const convertedWeight =
          convertWeight(
            calculation.weight,
            fromUnit,
            toUnit
          );

        return {
          ...calculation,
          weight:
            convertedWeight,
          estimatedOneRepMax:
            calculateEstimatedOneRepMax(
              convertedWeight,
              Number(
                calculation.reps
              )
            )
        };
      }
    );

  workouts =
    workouts.map(
      function (workout) {
        return {
          ...workout,
          sets:
            workout.sets.map(
              function (set) {
                const convertedWeight =
                  convertWeight(
                    set.weight,
                    fromUnit,
                    toUnit
                  );

                return {
                  ...set,
                  weight:
                    convertedWeight,
                  estimatedOneRepMax:
                    calculateEstimatedOneRepMax(
                      convertedWeight,
                      Number(
                        set.reps
                      )
                    )
                };
              }
            )
        };
      }
    );
}


function updateDisplayedUnits() {
  if (poundsButton) {
    poundsButton.classList.toggle(
      "active",
      weightUnit === "lb"
    );

    poundsButton.setAttribute(
      "aria-pressed",
      String(
        weightUnit === "lb"
      )
    );
  }

  if (kilogramsButton) {
    kilogramsButton.classList.toggle(
      "active",
      weightUnit === "kg"
    );

    kilogramsButton.setAttribute(
      "aria-pressed",
      String(
        weightUnit === "kg"
      )
    );
  }

  weightLabels.forEach(
    function (label) {
      label.textContent =
        `Weight (${weightUnit})`;
    }
  );

  const inputStep =
    weightUnit === "lb"
      ? "5"
      : "2.5";

  if (calculatorWeight) {
    calculatorWeight.step =
      inputStep;
  }

  if (workoutWeight) {
    workoutWeight.step =
      inputStep;
  }

  if (repMaxWeight) {
    repMaxWeight.step =
      inputStep;
  }
}


function refreshCalculatorEstimate() {
  if (
    !calculatorResult.textContent.startsWith(
      "Estimated 1RM:"
    )
  ) {
    return;
  }

  const weight =
    Number(
      calculatorWeight.value
    );

  const reps =
    Number(
      calculatorReps.value
    );

  if (
    !Number.isFinite(weight) ||
    weight <= 0
  ) {
    return;
  }

  const estimate =
    calculateEstimatedOneRepMax(
      weight,
      reps
    );

  showMessage(
    calculatorResult,
    `Estimated 1RM: ${estimate} ${weightUnit}`
  );
}


function changeWeightUnit(
  newUnit
) {
  if (
    newUnit !== "lb" &&
    newUnit !== "kg"
  ) {
    return;
  }

  if (
    newUnit === weightUnit
  ) {
    return;
  }

  const previousUnit =
    weightUnit;

  convertWeightInput(
    calculatorWeight,
    previousUnit,
    newUnit
  );

  convertWeightInput(
    workoutWeight,
    previousUnit,
    newUnit
  );

  convertWeightInput(
    repMaxWeight,
    previousUnit,
    newUnit
  );

  convertStoredWeights(
    previousUnit,
    newUnit
  );

  weightUnit = newUnit;

  localStorage.setItem(
    STORAGE_KEYS.unit,
    weightUnit
  );

  saveCalculations();
  saveWorkouts();

  renderCalculations();
  renderWorkoutApp();
  refreshCalculatorEstimate();

  if (
    repMaxResultsSection &&
    !repMaxResultsSection.classList.contains(
      "hidden"
    )
  ) {
    generateRepMaxTable();
  }

  updateDisplayedUnits();
}


if (poundsButton) {
  poundsButton.addEventListener(
    "click",
    function () {
      changeWeightUnit("lb");
    }
  );
}


if (kilogramsButton) {
  kilogramsButton.addEventListener(
    "click",
    function () {
      changeWeightUnit("kg");
    }
  );
}


/* -------------------------
   CALCULATOR MODES
------------------------- */

function openCalculatorMode(mode) {
  const showOneRepMax =
    mode === "one-rep-max";

  oneRepMaxModeButton.classList.toggle(
    "active",
    showOneRepMax
  );

  repMaxModeButton.classList.toggle(
    "active",
    !showOneRepMax
  );

  oneRepMaxModeButton.setAttribute(
    "aria-selected",
    String(showOneRepMax)
  );

  repMaxModeButton.setAttribute(
    "aria-selected",
    String(!showOneRepMax)
  );

  oneRepMaxCalculatorPanel.classList.toggle(
    "active",
    showOneRepMax
  );

  repMaxCalculatorPanel.classList.toggle(
    "active",
    !showOneRepMax
  );

  oneRepMaxCalculatorPanel.hidden =
    !showOneRepMax;

  repMaxCalculatorPanel.hidden =
    showOneRepMax;
}


oneRepMaxModeButton.addEventListener(
  "click",
  function () {
    openCalculatorMode(
      "one-rep-max"
    );
  }
);


repMaxModeButton.addEventListener(
  "click",
  function () {
    openCalculatorMode(
      "rep-max-table"
    );
  }
);


/* -------------------------
   TABS
------------------------- */

tabButtons.forEach(function (button) {
  button.addEventListener(
    "click",
    function () {
      openTab(button.dataset.tab);
    }
  );
});


function openTab(tabId) {
  tabButtons.forEach(function (button) {
    button.classList.toggle(
      "active",
      button.dataset.tab === tabId
    );
  });

  tabPanels.forEach(function (panel) {
    panel.classList.toggle(
      "active",
      panel.id === tabId
    );
  });

  if (tabId === "progressTab") {
    renderProgress();
  }
}


/* -------------------------
   DATES
------------------------- */

function getToday() {
  const now = new Date();

  const localDate = new Date(
    now.getTime() -
      now.getTimezoneOffset() * 60000
  );

  return localDate
    .toISOString()
    .split("T")[0];
}


function setDefaultWorkoutDate() {
  newWorkoutDate.value = getToday();
  updateDefaultWorkoutName();
}


function updateDefaultWorkoutName() {
  newWorkoutName.value = "Workout";
}


newWorkoutDate.addEventListener(
  "change",
  updateDefaultWorkoutName
);


/* -------------------------
   ESTIMATED 1RM
------------------------- */

function getOneRepMaxMultiplier(reps) {
  if (reps < 10) {
    const x = reps - 1;

    return (
      1 +
      0.0492830814 * x -
      0.00222173852 * x ** 2 +
      0.0000858872093 * x ** 3 +
      0.0000010874326 * x ** 4
    );
  }

  return 1 + reps / 30;
}


function calculateEstimatedOneRepMax(
  weight,
  reps
) {
  return Number(
    (
      Number(weight) *
      getOneRepMaxMultiplier(
        Number(reps)
      )
    ).toFixed(1)
  );
}


function calculateEquivalentWeight(
  estimatedOneRepMax,
  reps
) {
  return (
    Number(estimatedOneRepMax) /
    getOneRepMaxMultiplier(
      Number(reps)
    )
  );
}



/* -------------------------
   CALCULATOR
------------------------- */

function getCalculationInputs() {
  const weight =
    Number(calculatorWeight.value);

  const reps =
    Number(calculatorReps.value);

  if (
    !Number.isFinite(weight) ||
    weight <= 0
  ) {
    showMessage(
      calculatorResult,
      "Enter a valid weight.",
      "error"
    );

    return null;
  }

  if (
    !Number.isInteger(reps) ||
    reps < 1 ||
    reps > 100
  ) {
    showMessage(
      calculatorResult,
      "Please enter a value between 1 and 100.",
      "error"
    );

    return null;
  }

  return {
    exercise:
      calculatorExercise.value,
    weight,
    reps,
    estimatedOneRepMax:
      calculateEstimatedOneRepMax(
        weight,
        reps
      )
  };
}


calculateButton.addEventListener(
  "click",
  function () {
    const calculation =
      getCalculationInputs();

    if (!calculation) {
      return;
    }

    showMessage(
      calculatorResult,
      `Estimated 1RM: ${formatWeight(
            calculation.estimatedOneRepMax
          )} ${weightUnit}`
    );
  }
);


saveCalculationButton.addEventListener(
  "click",
  function () {
    const values =
      getCalculationInputs();

    if (!values) {
      return;
    }

    if (editingCalculationId !== null) {
      const index =
        calculations.findIndex(
          function (calculation) {
            return (
              String(calculation.id) ===
              String(editingCalculationId)
            );
          }
        );

      if (index !== -1) {
        calculations[index] = {
          ...calculations[index],
          ...values
        };
      }

      showMessage(
        calculatorResult,
        "Calculation updated."
      );
    } else {
      calculations.push({
        id: createId(),
        ...values,
        createdAt: Date.now()
      });

      showMessage(
        calculatorResult,
        "Calculation saved."
      );
    }

    saveCalculations();
    renderCalculations();
    resetCalculator();
  }
);


function renderCalculations() {
  calculationHistory.innerHTML = "";

  savedCalculationsSection.classList.toggle(
    "hidden",
    calculations.length === 0
  );

  const sortedCalculations =
    [...calculations].sort(
      function (a, b) {
        return (
          Number(b.createdAt || 0) -
          Number(a.createdAt || 0)
        );
      }
    );

  sortedCalculations.forEach(
    function (calculation) {
      const row =
        document.createElement("tr");

      row.innerHTML = `
        <td>
          ${escapeHtml(
            calculation.exercise
          )}
        </td>

        <td>
          ${formatWeight(
            calculation.weight
          )} ${weightUnit}
        </td>

        <td>
          ${calculation.reps}
        </td>

        <td>
          ${formatWeight(
            calculation.estimatedOneRepMax
          )} ${weightUnit}
        </td>

        <td class="action-cell">
          <button
            class="edit-button"
            type="button"
            data-action="edit-calculation"
            data-id="${calculation.id}"
          >
            Edit
          </button>

          <button
            class="delete-button"
            type="button"
            data-action="delete-calculation"
            data-id="${calculation.id}"
          >
            Delete
          </button>
        </td>
      `;

      calculationHistory.appendChild(
        row
      );
    }
  );
}


calculationHistory.addEventListener(
  "click",
  function (event) {
    const button =
      event.target.closest("button");

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const action =
      button.dataset.action;

    const id =
      button.dataset.id;

    if (action === "edit-calculation") {
      startEditingCalculation(id);
    }

    if (action === "delete-calculation") {
      deleteCalculation(id);
    }
  }
);


function startEditingCalculation(id) {
  const calculation =
    calculations.find(
      function (item) {
        return (
          String(item.id) ===
          String(id)
        );
      }
    );

  if (!calculation) {
    return;
  }

  editingCalculationId = id;

  calculatorExercise.value =
    calculation.exercise;

  calculatorWeight.value =
    calculation.weight;

  calculatorReps.value =
    String(calculation.reps);

  saveCalculationButton.textContent =
    "Update Calculation";

  showMessage(
    calculatorResult,
    `Editing ${calculation.exercise}: ${formatWeight(
      calculation.weight
    )} ${weightUnit} × ${calculation.reps}`
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function deleteCalculation(id) {
  calculations =
    calculations.filter(
      function (calculation) {
        return (
          String(calculation.id) !==
          String(id)
        );
      }
    );

  if (
    String(editingCalculationId) ===
    String(id)
  ) {
    resetCalculator();
  }

  saveCalculations();
  renderCalculations();

  showMessage(
    calculatorResult,
    "Calculation deleted."
  );
}


function resetCalculator() {
  editingCalculationId = null;

  calculatorWeight.value = "";
  calculatorReps.value = "";

  saveCalculationButton.textContent =
    "Save Calculation";
}


clearCalculationsButton.onclick =
  function () {
    if (calculations.length === 0) {
      return;
    }

    const confirmed =
      window.confirm(
        "Clear all saved calculations? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    calculations = [];
    editingCalculationId = null;

    localStorage.removeItem(
      STORAGE_KEYS.calculations
    );

    renderCalculations();
    resetCalculator();

    showMessage(
      calculatorResult,
      "All saved calculations cleared."
    );
  };


/* -------------------------
   REP MAX TABLE
------------------------- */

generateRepMaxTableButton.addEventListener(
  "click",
  generateRepMaxTable
);


function generateRepMaxTable() {
  const weight =
    Number(repMaxWeight.value);

  const reps =
    Number(repMaxReps.value);

  if (
    !Number.isFinite(weight) ||
    weight <= 0
  ) {
    showMessage(
      repMaxResult,
      "Enter a valid weight.",
      "error"
    );

    repMaxResultsSection.classList.add(
      "hidden"
    );

    return;
  }

  if (
    !Number.isInteger(reps) ||
    reps < 1 ||
    reps > 100
  ) {
    showMessage(
      repMaxResult,
      "Please enter a value between 1 and 100.",
      "error"
    );

    repMaxResultsSection.classList.add(
      "hidden"
    );

    return;
  }

  const estimatedOneRepMax =
    calculateEstimatedOneRepMax(
      weight,
      reps
    );

  repMaxTableBody.innerHTML = "";

  for (
    let targetReps = 1;
    targetReps <= 20;
    targetReps += 1
  ) {
    const equivalentWeight =
      calculateEquivalentWeight(
        estimatedOneRepMax,
        targetReps
      );

    const row =
      document.createElement("tr");

    const isEnteredSet =
      targetReps === reps;

    if (isEnteredSet) {
      row.classList.add(
        "entered-set-row"
      );
    }

    row.innerHTML = `
      <td>
        ${targetReps}
      </td>

      <td>
        ${formatWeight(
          isEnteredSet
            ? weight
            : equivalentWeight
        )} ${weightUnit}
      </td>
    `;

    repMaxTableBody.appendChild(
      row
    );
  }

  repMaxResultsSection.classList.remove(
    "hidden"
  );

  repMaxResult.textContent = "";
  repMaxResult.className = "result";
}


/* -------------------------
   CREATE WORKOUT
------------------------- */

createWorkoutButton.addEventListener(
  "click",
  function () {
    const date =
      newWorkoutDate.value;

    const name =
      newWorkoutName.value.trim();

    if (!date) {
      showMessage(
        createWorkoutResult,
        "Select a workout date.",
        "error"
      );

      return;
    }

    if (!name) {
      showMessage(
        createWorkoutResult,
        "Enter a workout name.",
        "error"
      );

      return;
    }

    const workout = {
      id: createId(),
      name,
      date,
      sets: [],
      createdAt: Date.now()
    };

    workouts.push(workout);
    activeWorkoutId = workout.id;
    viewedWorkoutId = null;
    editingExistingWorkout = false;

    resetSetEditor();

    saveWorkouts();
    saveActiveWorkoutId();
    renderWorkoutApp();

    showMessage(
      workoutResult,
      `${workout.name} created. Add your first set.`
    );
  }
);


/* -------------------------
   ADD OR UPDATE SET
------------------------- */

addSetButton.addEventListener(
  "click",
  function () {
    const workout =
      getActiveWorkout();

    if (!workout) {
      showMessage(
        workoutResult,
        "Create or open a workout first.",
        "error"
      );

      return;
    }

    const weight =
      Number(workoutWeight.value);

    const reps =
      Number(workoutReps.value);

    if (
      !Number.isFinite(weight) ||
      weight <= 0
    ) {
      showMessage(
        workoutResult,
        "Enter a valid weight.",
        "error"
      );

      return;
    }

    if (
      !Number.isInteger(reps) ||
      reps < 1 ||
      reps > 100
    ) {
      showMessage(
        workoutResult,
        "Please enter a value between 1 and 100.",
        "error"
      );

      return;
    }

    const setValues = {
      exercise:
        workoutExercise.value,
      weight,
      reps,
      estimatedOneRepMax:
        calculateEstimatedOneRepMax(
          weight,
          reps
        )
    };

    if (editingSetId !== null) {
      updateSet(
        workout,
        setValues
      );

      return;
    }

    const newSet = {
      id: createId(),
      ...setValues,
      createdAt: Date.now()
    };

    workout.sets.push(newSet);

    saveWorkouts();
    renderWorkoutApp();

    const allSets =
      getAllWorkoutSets();

    const isPR =
      isCurrentPersonalRecord(
        newSet,
        allSets
      );

    showMessage(
      workoutResult,
      isPR
        ? "Set added — this set is a new PR!"
        : "Set added.",
      isPR
        ? "pr-message"
        : "normal"
    );

    resetSetInputs();
  }
);


function updateSet(
  workout,
  updatedValues
) {
  const setIndex =
    workout.sets.findIndex(
      function (set) {
        return (
          String(set.id) ===
          String(editingSetId)
        );
      }
    );

  if (setIndex === -1) {
    showMessage(
      workoutResult,
      "Could not find the set to update.",
      "error"
    );

    resetSetEditor();
    return;
  }

  workout.sets[setIndex] = {
    ...workout.sets[setIndex],
    ...updatedValues
  };

  saveWorkouts();

  const updatedSet =
    workout.sets[setIndex];

  resetSetEditor();
  renderWorkoutApp();

  const allSets =
    getAllWorkoutSets();

  const isPR =
    isCurrentPersonalRecord(
      updatedSet,
      allSets
    );

  showMessage(
    workoutResult,
    isPR
      ? "Set updated — this set is a new PR!"
      : "Set updated.",
    isPR
      ? "pr-message"
      : "normal"
  );

  resetSetInputs();
}


function startEditingSet(
  workoutId,
  setId
) {
  const workout =
    workouts.find(
      function (item) {
        return (
          String(item.id) ===
          String(workoutId)
        );
      }
    );

  if (!workout) {
    return;
  }

  const set =
    workout.sets.find(
      function (item) {
        return (
          String(item.id) ===
          String(setId)
        );
      }
    );

  if (!set) {
    return;
  }

  activeWorkoutId = workout.id;

  editingSetId = set.id;
  editingSetWorkoutId = workout.id;

  saveActiveWorkoutId();

  workoutExercise.value =
    set.exercise;

  workoutWeight.value =
    set.weight;

  workoutReps.value =
    String(set.reps);

  addSetButton.textContent =
    "Update Set";

  cancelSetEditButton.classList.remove(
    "hidden"
  );

  renderWorkoutApp();
  openTab("workoutTab");

  showMessage(
    workoutResult,
    `Editing ${set.exercise}: ${formatWeight(
      set.weight
    )} ${weightUnit} × ${set.reps}`
  );

  activeWorkoutSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}


cancelSetEditButton.addEventListener(
  "click",
  function () {
    resetSetEditor();
    resetSetInputs();

    showMessage(
      workoutResult,
      "Set edit cancelled."
    );
  }
);


function resetSetEditor() {
  editingSetId = null;
  editingSetWorkoutId = null;

  addSetButton.textContent =
    "Add Set";

  cancelSetEditButton.classList.add(
    "hidden"
  );
}


function resetSetInputs() {
  workoutWeight.value = "";
  workoutReps.value = "";
  workoutWeight.focus();
}


/* -------------------------
   FINISH WORKOUT
------------------------- */

finishWorkoutButton.addEventListener(
  "click",
  function () {
    const workout =
      getActiveWorkout();

    if (
      !workout ||
      workout.sets.length === 0
    ) {
      showMessage(
        workoutResult,
        "Add at least one set before finishing the workout.",
        "error"
      );

      return;
    }

    const completedWorkoutId =
      workout.id;

    const wasEditingExistingWorkout =
      editingExistingWorkout;

    activeWorkoutId = null;
    editingExistingWorkout = false;

    resetSetEditor();

    localStorage.removeItem(
      STORAGE_KEYS.activeWorkout
    );

    saveWorkouts();

    if (wasEditingExistingWorkout) {
      viewedWorkoutId =
        completedWorkoutId;

      renderWorkoutApp();
      renderWorkoutView();

      showMessage(
        createWorkoutResult,
        "Workout changes saved."
      );

      return;
    }

    viewedWorkoutId = null;

    renderWorkoutApp();
    setDefaultWorkoutDate();

    showMessage(
      createWorkoutResult,
      "Workout finished."
    );
  }
);


/* -------------------------
   WORKOUT RENDERING
------------------------- */

function renderWorkoutApp() {
  const activeWorkout =
    getActiveWorkout();

  const viewingWorkout =
    Boolean(
      viewedWorkoutId &&
      !activeWorkout
    );

  createWorkoutCard.classList.toggle(
    "hidden",
    Boolean(activeWorkout) ||
      viewingWorkout
  );

  activeWorkoutSection.classList.toggle(
    "hidden",
    !activeWorkout
  );

  workoutViewSection.classList.toggle(
    "hidden",
    !viewingWorkout
  );

  if (activeWorkout) {
    activeWorkoutName.textContent =
      activeWorkout.name;

    activeWorkoutDate.textContent =
      formatDate(activeWorkout.date);

    if (activeWorkoutEyebrow) {
      activeWorkoutEyebrow.textContent =
        editingExistingWorkout
          ? "Editing Workout"
          : "Active Workout";
    }

    if (finishWorkoutButtonText) {
      finishWorkoutButtonText.textContent =
        editingExistingWorkout
          ? "Save Changes"
          : "Finish Workout";
    }

    if (finishWorkoutButtonIcon) {
      finishWorkoutButtonIcon.className =
        editingExistingWorkout
          ? "fa-solid fa-floppy-disk"
          : "fa-solid fa-flag-checkered";
    }

    renderExerciseGroups(
      activeWorkout,
      activeWorkoutExercises
    );
  } else {
    activeWorkoutExercises.innerHTML =
      "";
  }

  if (viewingWorkout) {
    renderWorkoutView();
  }

  renderWorkoutHistory();
  renderProgress();
  updateDisplayedUnits();
}


function renderWorkoutHistory() {
  workoutHistory.innerHTML = "";

  const completedWorkouts =
    workouts.filter(
      function (workout) {
        const isActiveWorkout =
          activeWorkoutId &&
          String(workout.id) ===
          String(activeWorkoutId);

        return (
          !isActiveWorkout &&
          Array.isArray(workout.sets) &&
          workout.sets.length > 0
        );
      }
    );

  workoutHistorySection.classList.toggle(
    "hidden",
    completedWorkouts.length === 0
  );

  const sortedWorkouts =
    [...completedWorkouts].sort(
      function (a, b) {
        const dateDifference =
          b.date.localeCompare(a.date);

        if (dateDifference !== 0) {
          return dateDifference;
        }

        return (
          Number(b.createdAt || 0) -
          Number(a.createdAt || 0)
        );
      }
    );

  sortedWorkouts.forEach(
    function (workout) {
      const totalSets =
        workout.sets.length;

      const totalReps =
        workout.sets.reduce(
          function (total, set) {
            return (
              total +
              Number(set.reps)
            );
          },
          0
        );

      const totalVolume =
        workout.sets.reduce(
          function (total, set) {
            return (
              total +
              Number(set.weight) *
              Number(set.reps)
            );
          },
          0
        );

      const exerciseCount =
        Object.keys(
          groupSetsByExercise(
            workout.sets
          )
        ).length;

      const details =
        document.createElement(
          "details"
        );

      details.className =
        "workout-card";

      if (
        viewedWorkoutId &&
        String(workout.id) ===
        String(viewedWorkoutId)
      ) {
        details.classList.add(
          "viewed-workout-card"
        );
      }

      details.innerHTML = `
        <summary class="workout-summary">
          <div>
            <h3 class="workout-title">
              ${escapeHtml(workout.name)}
            </h3>

            <p class="workout-history-date">
              ${formatDate(workout.date)}
            </p>

            <p class="summary-metrics">
              ${exerciseCount}
              ${pluralize(
                exerciseCount,
                "exercise"
              )}
              · ${totalSets}
              ${pluralize(
                totalSets,
                "set"
              )}
              · ${totalReps} reps
              · ${formatNumber(
                totalVolume
              )} ${weightUnit} volume
            </p>
          </div>

          <span class="expand-label">
            View Workout
          </span>
        </summary>

        <div class="workout-content">
          <div class="history-exercises"></div>

          <div class="workout-actions">
            <button
              class="secondary-button small-button"
              type="button"
              data-action="open-workout"
              data-id="${workout.id}"
            >
              View Workout
            </button>

            <button
              class="edit-button small-button"
              type="button"
              data-action="rename-workout"
              data-id="${workout.id}"
            >
              Rename
            </button>

            <button
              class="danger-button small-button"
              type="button"
              data-action="delete-workout"
              data-id="${workout.id}"
            >
              Delete Workout
            </button>
          </div>
        </div>
      `;

      workoutHistory.appendChild(
        details
      );

      const exerciseContainer =
        details.querySelector(
          ".history-exercises"
        );

      renderExerciseGroups(
        workout,
        exerciseContainer
      );
    }
  );
}


function renderExerciseGroups(
  workout,
  container
) {
  container.innerHTML = "";

  if (workout.sets.length === 0) {
    container.innerHTML = `
      <p class="empty-workout-message">
        No sets logged yet.
      </p>
    `;

    return;
  }

  const groups =
    groupSetsByExercise(
      workout.sets
    );

  const allSets =
    getAllWorkoutSets();

  const highestWeights =
    getHighestWeightsByExercise(
      allSets
    );

  Object.entries(groups).forEach(
    function ([exercise, sets]) {
      const totalReps =
        sets.reduce(
          function (total, set) {
            return (
              total +
              Number(set.reps)
            );
          },
          0
        );

      const totalVolume =
        sets.reduce(
          function (total, set) {
            return (
              total +
              Number(set.weight) *
              Number(set.reps)
            );
          },
          0
        );

      const details =
        document.createElement(
          "details"
        );

      details.className =
        "exercise-card";

      const rows =
        sets.map(
          function (set, index) {
            const isPR =
              isCurrentPersonalRecord(
                set,
                allSets
              );

            const isHighestWeight =
              Number(set.weight) ===
              highestWeights[
                set.exercise
              ];

            return `
              <tr class="${
                isPR ? "pr-row" : ""
              }">
                <td>
                  ${index + 1}
                </td>

                <td>
                  <span class="weight-cell">
                    ${formatWeight(
                      set.weight
                    )} ${weightUnit}

                    ${
                      isHighestWeight
                        ? "🏆"
                        : ""
                    }
                  </span>
                </td>

                <td>
                  ${set.reps}
                </td>

                <td>
                  ${formatNumber(
                    Number(set.weight) *
                    Number(set.reps)
                  )} ${weightUnit}
                </td>

                <td>
                  ${formatWeight(
                    set.estimatedOneRepMax
                  )} ${weightUnit}
                </td>

                <td class="action-cell">
                  <button
                    class="edit-button small-button"
                    type="button"
                    data-action="edit-set"
                    data-workout-id="${workout.id}"
                    data-set-id="${set.id}"
                  >
                    Edit
                  </button>

                  <button
                    class="delete-button small-button"
                    type="button"
                    data-action="delete-set"
                    data-workout-id="${workout.id}"
                    data-set-id="${set.id}"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            `;
          }
        )
        .join("");

      details.innerHTML = `
        <summary class="exercise-summary">
          <div>
            <h4 class="exercise-title">
              ${escapeHtml(exercise)}
            </h4>

            <p class="summary-metrics">
              ${sets.length}
              ${pluralize(
                sets.length,
                "set"
              )}
              · ${totalReps} reps
              · ${formatNumber(
                totalVolume
              )} ${weightUnit} volume
            </p>
          </div>

          <span class="expand-label">
            View Sets
          </span>
        </summary>

        <div class="exercise-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Set</th>
                <th>Weight</th>
                <th>Reps</th>
                <th>Volume</th>
                <th>Estimated 1RM</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `;

      container.appendChild(
        details
      );
    }
  );
}


/* -------------------------
   WORKOUT ACTIONS
------------------------- */

function processWorkoutButtonClick(
  event
) {
  const button =
    event.target.closest("button");

  if (!button) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (
    button.dataset.processing ===
    "true"
  ) {
    return;
  }

  button.dataset.processing = "true";

  handleWorkoutAction(button);

  window.setTimeout(
    function () {
      delete button.dataset.processing;
    },
    300
  );
}


workoutHistory.onclick =
  processWorkoutButtonClick;


activeWorkoutExercises.onclick =
  processWorkoutButtonClick;


function handleWorkoutAction(button) {
  const action =
    button.dataset.action;

  const workoutId =
    button.dataset.workoutId ||
    button.dataset.id;

  const setId =
    button.dataset.setId;

  if (action === "open-workout") {
    viewWorkout(workoutId);
    return;
  }

  if (action === "rename-workout") {
    renameWorkout(workoutId);
    return;
  }

  if (action === "delete-workout") {
    deleteWorkout(workoutId);
    return;
  }

  if (action === "edit-set") {
    startEditingSet(
      workoutId,
      setId
    );

    return;
  }

  if (action === "delete-set") {
    deleteSet(
      workoutId,
      setId
    );
  }
}


function viewWorkout(id) {
  const workout =
    workouts.find(
      function (item) {
        return (
          String(item.id) ===
          String(id)
        );
      }
    );

  if (!workout) {
    return;
  }

  activeWorkoutId = null;
  editingExistingWorkout = false;
  viewedWorkoutId = workout.id;

  resetSetEditor();

  localStorage.removeItem(
    STORAGE_KEYS.activeWorkout
  );

  renderWorkoutApp();
  openTab("workoutTab");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function startEditingViewedWorkout() {
  const workout =
    workouts.find(
      function (item) {
        return (
          String(item.id) ===
          String(viewedWorkoutId)
        );
      }
    );

  if (!workout) {
    return;
  }

  activeWorkoutId = workout.id;
  editingExistingWorkout = true;
  viewedWorkoutId = null;

  resetSetEditor();

  saveActiveWorkoutId();
  renderWorkoutApp();
  openTab("workoutTab");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function closeWorkoutView() {
  viewedWorkoutId = null;
  editingExistingWorkout = false;

  renderWorkoutApp();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


backToWorkoutHistoryButton.addEventListener(
  "click",
  closeWorkoutView
);


editViewedWorkoutButton.addEventListener(
  "click",
  startEditingViewedWorkout
);


function renderWorkoutView() {
  const workout =
    workouts.find(
      function (item) {
        return (
          String(item.id) ===
          String(viewedWorkoutId)
        );
      }
    );

  if (!workout) {
    closeWorkoutView();
    return;
  }

  viewedWorkoutName.textContent =
    workout.name;

  viewedWorkoutDate.textContent =
    formatDate(workout.date);

  const totalSets =
    workout.sets.length;

  const totalReps =
    workout.sets.reduce(
      function (total, set) {
        return (
          total +
          Number(set.reps)
        );
      },
      0
    );

  const totalVolume =
    workout.sets.reduce(
      function (total, set) {
        return (
          total +
          Number(set.weight) *
          Number(set.reps)
        );
      },
      0
    );

  const exerciseCount =
    Object.keys(
      groupSetsByExercise(
        workout.sets
      )
    ).length;

  viewedWorkoutSummary.innerHTML = `
    <article class="workout-summary-stat">
      <span>Exercises</span>
      <strong>${exerciseCount}</strong>
    </article>

    <article class="workout-summary-stat">
      <span>Sets</span>
      <strong>${totalSets}</strong>
    </article>

    <article class="workout-summary-stat">
      <span>Reps</span>
      <strong>${totalReps}</strong>
    </article>

    <article class="workout-summary-stat">
      <span>Volume</span>
      <strong>
        ${formatNumber(
          totalVolume
        )} ${weightUnit}
      </strong>
    </article>
  `;

  renderReadOnlyExerciseGroups(
    workout,
    viewedWorkoutExercises
  );
}


function renderReadOnlyExerciseGroups(
  workout,
  container
) {
  container.innerHTML = "";

  if (workout.sets.length === 0) {
    container.innerHTML = `
      <p class="empty-workout-message">
        No sets logged in this workout.
      </p>
    `;

    return;
  }

  const groups =
    groupSetsByExercise(
      workout.sets
    );

  Object.entries(groups).forEach(
    function ([exercise, sets]) {
      const totalReps =
        sets.reduce(
          function (total, set) {
            return (
              total +
              Number(set.reps)
            );
          },
          0
        );

      const totalVolume =
        sets.reduce(
          function (total, set) {
            return (
              total +
              Number(set.weight) *
              Number(set.reps)
            );
          },
          0
        );

      const bestEstimatedOneRepMax =
        Math.max(
          ...sets.map(
            function (set) {
              return Number(
                set.estimatedOneRepMax
              );
            }
          )
        );

      const details =
        document.createElement(
          "details"
        );

      details.className =
        "exercise-card read-only-exercise-card";

      const rows =
        sets.map(
          function (set, index) {
            return `
              <tr>
                <td>${index + 1}</td>

                <td>
                  ${formatWeight(
                    set.weight
                  )} ${weightUnit}
                </td>

                <td>${set.reps}</td>

                <td>
                  ${formatNumber(
                    Number(set.weight) *
                    Number(set.reps)
                  )} ${weightUnit}
                </td>

                <td>
                  ${formatWeight(
                    set.estimatedOneRepMax
                  )} ${weightUnit}
                </td>
              </tr>
            `;
          }
        )
        .join("");

      details.innerHTML = `
        <summary class="exercise-summary">
          <div>
            <h4 class="exercise-title">
              ${escapeHtml(exercise)}
            </h4>

            <p class="summary-metrics">
              ${sets.length}
              ${pluralize(
                sets.length,
                "set"
              )}
              · ${totalReps} reps
              · ${formatNumber(
                totalVolume
              )} ${weightUnit} volume
              · Best e1RM:
              ${formatWeight(
                bestEstimatedOneRepMax
              )} ${weightUnit}
            </p>
          </div>

          <span class="expand-label">
            View Sets
          </span>
        </summary>

        <div class="exercise-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Set</th>
                <th>Weight</th>
                <th>Reps</th>
                <th>Volume</th>
                <th>Estimated 1RM</th>
              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `;

      container.appendChild(
        details
      );
    }
  );
}


function renameWorkout(id) {
  const workout =
    workouts.find(function (item) {
      return (
        String(item.id) ===
        String(id)
      );
    });

  if (!workout) {
    return;
  }

  const enteredName =
    window.prompt(
      "Rename workout:",
      workout.name || "Workout"
    );

  if (
    typeof enteredName !== "string"
  ) {
    return;
  }

  const newName =
    enteredName.trim();

  if (!newName) {
    return;
  }

  workout.name = newName;

  saveWorkouts();
  renderWorkoutApp();

  showMessage(
    workoutResult,
    "Workout renamed."
  );
}


function deleteSet(
  workoutId,
  setId
) {
  const workout =
    workouts.find(
      function (item) {
        return (
          String(item.id) ===
          String(workoutId)
        );
      }
    );

  if (!workout) {
    return;
  }

  const set =
    workout.sets.find(
      function (item) {
        return (
          String(item.id) ===
          String(setId)
        );
      }
    );

  if (!set) {
    return;
  }

  const confirmed =
    window.confirm(
      `Delete ${set.exercise}: ${formatWeight(
        set.weight
      )} ${weightUnit} × ${set.reps}?`
    );

  if (!confirmed) {
    return;
  }

  workout.sets =
    workout.sets.filter(
      function (item) {
        return (
          String(item.id) !==
          String(setId)
        );
      }
    );

  if (
    String(editingSetId) ===
    String(setId)
  ) {
    resetSetEditor();
    resetSetInputs();
  }

  saveWorkouts();
  renderWorkoutApp();

  if (
    String(activeWorkoutId) ===
    String(workoutId)
  ) {
    showMessage(
      workoutResult,
      "Set deleted."
    );
  }
}


function deleteWorkout(id) {
  const workout =
    workouts.find(function (item) {
      return (
        String(item.id) ===
        String(id)
      );
    });

  if (!workout) {
    return;
  }

  workouts =
    workouts.filter(function (item) {
      return (
        String(item.id) !==
        String(id)
      );
    });

  if (
    String(activeWorkoutId) ===
    String(id)
  ) {
    activeWorkoutId = null;

    resetSetEditor();

    localStorage.removeItem(
      STORAGE_KEYS.activeWorkout
    );
  }

  if (
    String(editingSetWorkoutId) ===
    String(id)
  ) {
    resetSetEditor();
  }

  saveWorkouts();
  renderWorkoutApp();

  showMessage(
    createWorkoutResult,
    "Workout deleted."
  );
}


/* -------------------------
   PROGRESS
------------------------- */

progressExercise.addEventListener(
  "change",
  renderProgress
);


progressTableBody.addEventListener(
  "click",
  function (event) {
    const workoutLink =
      event.target.closest(
        ".progress-workout-link"
      );

    if (!workoutLink) {
      return;
    }

    viewWorkout(
      workoutLink.dataset.workoutId
    );
  }
);


function renderProgress() {
  renderProgressSummary();

  const selectedExercise =
    progressExercise.value;

  const allSets =
    getAllWorkoutSets();

  const exerciseSets =
    allSets.filter(
      function (set) {
        return (
          set.exercise ===
          selectedExercise
        );
      }
    );

  const currentPRs =
    exerciseSets.filter(
      function (set) {
        return isCurrentPersonalRecord(
          set,
          allSets
        );
      }
    );

  const uniquePRs =
    getUniqueCurrentPRs(
      currentPRs
    );

  uniquePRs.sort(
    function (a, b) {
      const weightDifference =
        Number(b.weight) -
        Number(a.weight);

      if (weightDifference !== 0) {
        return weightDifference;
      }

      const repDifference =
        Number(a.reps) -
        Number(b.reps);

      if (repDifference !== 0) {
        return repDifference;
      }

      return (
        Number(b.createdAt || 0) -
        Number(a.createdAt || 0)
      );
    }
  );

  progressTableBody.innerHTML = "";

  progressEmptyState.classList.toggle(
    "hidden",
    uniquePRs.length > 0
  );

  progressTableWrapper.classList.toggle(
    "hidden",
    uniquePRs.length === 0
  );

  uniquePRs.forEach(
    function (set) {
      const row =
        document.createElement("tr");

      row.innerHTML = `
        <td>
          ${formatWeight(set.weight)} ${weightUnit}
        </td>

        <td>
          ${set.reps}
        </td>

        <td>
          ${formatWeight(
                    set.estimatedOneRepMax
                  )} ${weightUnit}
        </td>

        <td>
          ${formatDate(
            set.workoutDate
          )}
        </td>

        <td>
          <button
            class="progress-workout-link"
            type="button"
            data-workout-id="${set.workoutId}"
            title="Open this workout"
          >
            ${escapeHtml(
              set.workoutName
            )}
          </button>
        </td>
      `;

      progressTableBody.appendChild(
        row
      );
    }
  );
}


function renderProgressSummary() {
  const completedWorkouts =
    workouts.filter(
      function (workout) {
        const isActiveWorkout =
          activeWorkoutId &&
          String(workout.id) ===
          String(activeWorkoutId);

        return (
          !isActiveWorkout &&
          workout.sets.length > 0
        );
      }
    );

  const completedSets =
    completedWorkouts.flatMap(
      function (workout) {
        return workout.sets;
      }
    );

  const totalSets =
    completedSets.length;

  const totalReps =
    completedSets.reduce(
      function (total, set) {
        return (
          total +
          Number(set.reps)
        );
      },
      0
    );

  const totalVolume =
    completedSets.reduce(
      function (total, set) {
        return (
          total +
          Number(set.weight) *
          Number(set.reps)
        );
      },
      0
    );

  completedWorkoutsValue.textContent =
    completedWorkouts.length;

  totalSetsValue.textContent =
    totalSets;

  totalRepsValue.textContent =
    formatNumber(totalReps);

  totalVolumeValue.textContent =
    `${formatNumber(
      totalVolume
    )} ${weightUnit}`;
}


function getUniqueCurrentPRs(
  prSets
) {
  const uniqueRecords =
    new Map();

  prSets.forEach(function (set) {
    const key =
      `${Number(set.weight)}-${Number(
        set.reps
      )}`;

    const existingRecord =
      uniqueRecords.get(key);

    if (
      !existingRecord ||
      isSetMoreRecent(
        set,
        existingRecord
      )
    ) {
      uniqueRecords.set(
        key,
        set
      );
    }
  });

  return Array.from(
    uniqueRecords.values()
  );
}


function isSetMoreRecent(
  candidate,
  current
) {
  if (
    candidate.workoutDate !==
    current.workoutDate
  ) {
    return (
      candidate.workoutDate >
      current.workoutDate
    );
  }

  return (
    Number(candidate.createdAt || 0) >
    Number(current.createdAt || 0)
  );
}


/* -------------------------
   PR LOGIC
------------------------- */

function isCurrentPersonalRecord(
  candidate,
  allSets
) {
  return !allSets.some(
    function (otherSet) {
      if (
        String(otherSet.id) ===
        String(candidate.id)
      ) {
        return false;
      }

      if (
        otherSet.exercise !==
        candidate.exercise
      ) {
        return false;
      }

      const equalOrBetterInBoth =
        Number(otherSet.weight) >=
          Number(candidate.weight) &&
        Number(otherSet.reps) >=
          Number(candidate.reps);

      const strictlyBetterInOne =
        Number(otherSet.weight) >
          Number(candidate.weight) ||
        Number(otherSet.reps) >
          Number(candidate.reps);

      return (
        equalOrBetterInBoth &&
        strictlyBetterInOne
      );
    }
  );
}


function getHighestWeightsByExercise(
  sets
) {
  return sets.reduce(
    function (highest, set) {
      const weight =
        Number(set.weight);

      if (
        highest[set.exercise] ===
          undefined ||
        weight >
          highest[set.exercise]
      ) {
        highest[set.exercise] =
          weight;
      }

      return highest;
    },
    {}
  );
}


/* -------------------------
   DATA HELPERS
------------------------- */

function getActiveWorkout() {
  return (
    workouts.find(
      function (workout) {
        return (
          String(workout.id) ===
          String(activeWorkoutId)
        );
      }
    ) || null
  );
}


function getAllWorkoutSets() {
  return workouts.flatMap(
    function (workout) {
      return workout.sets.map(
        function (set) {
          return {
            ...set,
            workoutId:
              workout.id,
            workoutName:
              workout.name,
            workoutDate:
              workout.date
          };
        }
      );
    }
  );
}


function groupSetsByExercise(sets) {
  return sets.reduce(
    function (groups, set) {
      if (!groups[set.exercise]) {
        groups[set.exercise] = [];
      }

      groups[set.exercise].push(
        set
      );

      return groups;
    },
    {}
  );
}


function normalizeWorkouts(
  workoutList
) {
  return workoutList.map(
    function (workout) {
      const normalizedSets =
        Array.isArray(workout.sets)
          ? workout.sets.map(
              function (set) {
                const weight =
                  Number(set.weight);

                const reps =
                  Number(set.reps);

                return {
                  ...set,
                  id:
                    set.id ||
                    createId(),
                  weight,
                  reps,
                  estimatedOneRepMax:
                    calculateEstimatedOneRepMax(
                      weight,
                      reps
                    ),
                  createdAt:
                    set.createdAt ||
                    Date.now()
                };
              }
            )
          : [];

      return {
        ...workout,
        id:
          workout.id ||
          createId(),
        name:
          workout.name ||
          "Workout",
        date:
          workout.date ||
          getToday(),
        sets:
          normalizedSets,
        createdAt:
          workout.createdAt ||
          Date.now()
      };
    }
  );
}


/* -------------------------
   STORAGE
------------------------- */

function saveCalculations() {
  localStorage.setItem(
    STORAGE_KEYS.calculations,
    JSON.stringify(calculations)
  );
}


function saveWorkouts() {
  localStorage.setItem(
    STORAGE_KEYS.workouts,
    JSON.stringify(workouts)
  );
}


function saveActiveWorkoutId() {
  if (!activeWorkoutId) {
    localStorage.removeItem(
      STORAGE_KEYS.activeWorkout
    );

    return;
  }

  localStorage.setItem(
    STORAGE_KEYS.activeWorkout,
    activeWorkoutId
  );
}


function loadArray(key) {
  try {
    const savedValue =
      localStorage.getItem(key);

    if (!savedValue) {
      return [];
    }

    const parsedValue =
      JSON.parse(savedValue);

    return Array.isArray(parsedValue)
      ? parsedValue
      : [];
  } catch (error) {
    console.error(
      `Could not load ${key}:`,
      error
    );

    return [];
  }
}


/* -------------------------
   GENERAL HELPERS
------------------------- */

const messageTimers =
  new WeakMap();


function showMessage(
  element,
  message,
  type = "normal"
) {
  if (!element) {
    return;
  }

  const existingTimer =
    messageTimers.get(element);

  if (existingTimer) {
    window.clearTimeout(
      existingTimer
    );
  }

  element.classList.remove(
    "message-fading"
  );

  element.textContent = message;
  element.className =
    `result ${type}`;

  if (!message) {
    messageTimers.delete(element);
    return;
  }

  const timer =
    window.setTimeout(
      function () {
        element.classList.add(
          "message-fading"
        );

        window.setTimeout(
          function () {
            if (
              element.classList.contains(
                "message-fading"
              )
            ) {
              element.textContent = "";
              element.className =
                "result";
            }
          },
          350
        );
      },
      5000
    );

  messageTimers.set(
    element,
    timer
  );
}


function formatDate(dateString) {
  return new Date(
    `${dateString}T00:00:00`
  ).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );
}


function formatNumericDate(dateString) {
  if (!dateString) {
    return "";
  }

  return new Date(
    `${dateString}T00:00:00`
  ).toLocaleDateString(
    "en-US"
  );
}


function formatWeight(value) {
  const weight = Number(value);

  if (!Number.isFinite(weight)) {
    return "";
  }

  const roundedWeight =
    Math.round(
      (weight + Number.EPSILON) * 10
    ) / 10;

  return Number.isInteger(
    roundedWeight
  )
    ? String(roundedWeight)
    : roundedWeight.toFixed(1);
}



function formatNumber(value) {
  return Number(value).toLocaleString(
    "en-US",
    {
      maximumFractionDigits: 1
    }
  );
}


function pluralize(count, word) {
  return count === 1
    ? word
    : `${word}s`;
}


function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return (
    `${Date.now()}-` +
    `${Math.random()}`
  );
}


function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* -------------------------
   INITIALIZATION
------------------------- */

function initializeApp() {
  calculations = loadArray(
    STORAGE_KEYS.calculations
  );

  workouts = normalizeWorkouts(
    loadArray(
      STORAGE_KEYS.workouts
    )
  );

  activeWorkoutId =
    localStorage.getItem(
      STORAGE_KEYS.activeWorkout
    );

  if (
    activeWorkoutId &&
    !getActiveWorkout()
  ) {
    activeWorkoutId = null;

    localStorage.removeItem(
      STORAGE_KEYS.activeWorkout
    );
  }

  setDefaultWorkoutDate();
  saveWorkouts();

  renderCalculations();
  renderWorkoutApp();
  renderProgress();
  updateDisplayedUnits();
  openCalculatorMode(
    "one-rep-max"
  );
}

initializeApp();
