document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('course-table');
  const addBtn = document.getElementById('add-btn');
  const submitBtn = document.getElementById('submit-btn');
  const scoreDisplay = document.getElementById('score');
  const scoreBoard = document.getElementById('score-board');
  const progressBar = document.getElementById('progress-bar');
  const resetBtn = document.getElementById('reset-btn');

  let grades = JSON.parse(localStorage.getItem("grades")) || [];
  const gradePoints = {"O":10, "A+":9, "A":8, "B+":7, "B":6, "C":5.5, "W":0, "F":0, "Ab":0, "I":0, "*":0};
  
  render();
  
  function rowHtml(subject, n) {
    return `
      <td class="text-center text-lg py-2">${n}.</td>
      <td>
        <input 
          type="number" data-id="${subject.id}" value="${subject.credits || ''}" required
          class="bg-gray-500 px-1.5 py-1 rounded-sm w-full max-w-[120px] focus:outline-none text-center [appearance:textfield]"
        />
      </td>
      <td>
        <select 
          name="grade" data-id="${subject.id}"
          class="bg-gray-500 px-1.5 py-1 rounded-sm w-full max-w-20 focus:outline-none"
        >
          ${[
            "O", "A+", "A", "B+", "B", "C", "W", "F", "Ab", "I", "*"
          ].map(option => 
            `<option value="${option}" ${option === subject.grade ? "selected" : ""}>${option}</option>`
          ).join("")}
        </select>
      </td>
      <td class="text-center">
        <button data-id="${subject.id}" class="flex items-center justify-center">
          <img 
            data-id="${subject.id}"
            src="assets/delete.png" 
            alt="delete" 
            class="w-6 h-7 bg-red-500 rounded-md p-0.5 inline-block ml-2.5"
          />
        </button>
      </td>
    `;
  }

  function render() {
    if (grades.length === 0){
      scoreBoard.classList.add("hidden")
      addSubjects(6);
    } 
    table.innerHTML = "";
    let courseNo = 1;
    grades.forEach(element => {
      const tr = document.createElement('tr');
      tr.className = "border-b border-gray-700";
      tr.innerHTML = rowHtml(element, courseNo++);
      table.appendChild(tr);
    });
  }

  function addSubjects(n) {
    for (let i = 1; i <= n; i++) {
      const grade = {
        id: Date.now() + i,
        credits: '',
        grade: "O"
      };
      grades.push(grade);
    }
    save();
  }

  addBtn.addEventListener('click', () => {
    addSubjects(1);
    render();
  });

  table.addEventListener('input', (e) => {
    if (e.target.tagName === "INPUT") {
      const val = Number(e.target.value);
      if (val >= 0) {
        const idx = grades.findIndex(el => el.id === Number(e.target.dataset.id));
        if (idx !== -1) {
          grades[idx].credits = val;
          save();
        }
      }
    }
  });

  table.addEventListener('change', (e) => {
    if (e.target.tagName === "SELECT") {
      const idx = grades.findIndex(el => el.id === Number(e.target.dataset.id));
      if (idx !== -1) {
        grades[idx].grade = e.target.value;
        save();
      }
    }
  });

  table.addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "IMG") {
      const id = Number(e.target.dataset.id);
      grades = grades.filter(el => el.id !== id);
      save();
      render();
    }
  });

  submitBtn.addEventListener('click', () => {
    const gpa = calculate();
    scoreDisplay.textContent = `${gpa.toFixed(2)}/10.00`;
    scoreBoard.classList.remove("hidden");
    updateProgressBar(gpa);
  });

  resetBtn.addEventListener('click',()=>{
    grades.length=0;
    save();
    render();
  })

  function calculate() {
    let sum = 0, totalCredits = 0;
    grades.forEach(el => {
      totalCredits += Number(el.credits);
      sum += (el.credits * gradePoints[el.grade]);
    });
    let result = sum / totalCredits;
    return isNaN(result) ? 0 : result;
  }

  function updateProgressBar(gpa) {
    const percent = Math.min((gpa / 10) * 100, 100);
    progressBar.style.width = `${percent}%`;
  }

  function save() {
    localStorage.setItem("grades", JSON.stringify(grades));
  }
});
