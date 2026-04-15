let notesArray = [];

//localStorage.clear()

const savedNotes = JSON.parse(localStorage.getItem("notes"));

if (savedNotes) {
  notesArray = savedNotes;
  renderNotes();
}

const title = document.getElementById("title");
const content = document.getElementById("content");
const mainForm = document.getElementById("main-form");

mainForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const validatedData = validateInput();
  if (!validatedData) return;

  addToNotes(validatedData);
  renderNotes();
  console.log("works");

  mainForm.reset();
});

function addToNotes(value) {
  notesArray.push({
    title: value.titleValue,
    content: value.contentValue,
    isEditing: false,
  });
  saveToNotes();
}

function validateInput() {
  const validTitle = title.value.trim();
  const validContent = content.value.trim();

  if (validTitle.length === 0) {
    alert("Please enter a valid title");
    return null;
  }

  if (validContent.length === 0) {
    alert("Please enter a valid content");
    return null;
  }

  return { titleValue: validTitle, contentValue: validContent };
}

function validateEditInput(editTitle, editContent) {
  const validEditTitle = editTitle.value.trim();
  const validEditContent = editContent.value.trim();

  if (validEditTitle.length === 0) {
    alert("Please enter a valid title");
    return null;
  }

  if (validEditContent.length === 0) {
    alert("Please enter a valid content");
    return null;
  }

  return { titleEditValue: validEditTitle, contentEditValue: validEditContent };
}

function saveToNotes() {
  localStorage.setItem("notes", JSON.stringify(notesArray));
}

function renderNotes() {
  const notesList = document.getElementById("notes-list");
  notesList.innerHTML = "";

  for (let i = 0; i < notesArray.length; i++) {
    const notesDiv = document.createElement("div");
    const lineBreak = document.createElement("hr");
    if (!notesArray[i].isEditing) {
      notesDiv.classList.add("notes-div");
      notesDiv.innerHTML = `
      <div class="info-display">
            <p class="title-display">${notesArray[i].title}</p>
            <p class="content-display">${notesArray[i].content}</p>
          </div>
          <div class="edit-manager">
            <button class="delete-btn">Delete</button>
            <button class="edit-btn">Edit</button>
          </div>
      `;

      const deleteBtn = notesDiv.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notesArray.splice(i, 1);
        saveToNotes();
        renderNotes();
      });

      const editBtn = notesDiv.querySelector(".edit-btn");
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notesArray[i].isEditing = true;
        renderNotes();
      });
    } else {
      notesDiv.innerHTML = `
      <form class="edit-form">
        <label for="title">Title:</label>
        <input type="text" class="edit-title" value="${notesArray[i].title}" />
        <label for="content">Content:</label>
        <textarea class="edit-content">${notesArray[i].content}</textarea>
        <div class="edit-buttons">
         <button type="submit">Add</button>
         <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
      `;

      const editForm = notesDiv.querySelector(".edit-form");
      const editedTitle = editForm.querySelector(".edit-title");
      const editedContent = editForm.querySelector(".edit-content");

      const cancelBtn = editForm.querySelector(".cancel-btn");

      editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const validatedEditData = validateEditInput(editedTitle, editedContent);
        if (!validatedEditData) return;

        notesArray[i].title = validatedEditData.titleEditValue;
        notesArray[i].content = validatedEditData.contentEditValue;
        notesArray[i].isEditing = false;
        saveToNotes();
        renderNotes();
      });

      cancelBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notesArray[i].isEditing = false;
        saveToNotes();
        renderNotes();
      });
    }
    notesList.appendChild(notesDiv);
    notesList.appendChild(lineBreak);
  }

  const countDisplay = document.getElementById("count-display");
  countDisplay.innerText = `You have ${notesArray.length} Note${notesArray.length === 1 ? "" : "s"}`;
}
