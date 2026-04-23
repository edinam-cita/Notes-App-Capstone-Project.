let notesArray = [];
let searchItem = "";

//localStorage.clear()

const savedNotes = JSON.parse(localStorage.getItem("notes"));

if (savedNotes) {
  notesArray = savedNotes;
  renderNotes();
}

const title = document.getElementById("title");
const content = document.getElementById("content");
const mainForm = document.getElementById("main-form");
const search = document.getElementById("search");

mainForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const validatedData = validateInput();
  if (!validatedData) return;

  addToNotes(validatedData);
  renderNotes();
  mainForm.reset();
});

search.addEventListener("input", (e) => {
  searchItem = e.target.value.trim();
  renderNotes();
});

function addToNotes(value) {
  notesArray.push({
    title: value.title,
    content: value.content,
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

  return { title: validTitle, content: validContent };
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

  return { title: validEditTitle, content: validEditContent };
}

function saveToNotes() {
  localStorage.setItem("notes", JSON.stringify(notesArray));
}

function renderNotes() {
  const notesList = document.getElementById("notes-list");
  const countDisplay = document.getElementById("count-display");

  notesList.innerHTML = "";

  const filteredNotes = notesArray.filter((item) => {
    const lowercaseTitle = item.title.toLowerCase();
    const lowercaseContent = item.content.toLowerCase();
    const lowercaseSearchterm = searchItem.toLowerCase();

    return (
      lowercaseTitle.includes(lowercaseSearchterm) ||
      lowercaseContent.includes(lowercaseSearchterm)
    );
  });

  if (searchItem.length !== 0 && filteredNotes.length === 0) {
    countDisplay.innerHTML = `No match for ${searchItem}`;
    return
  }

  for (let i = 0; i < filteredNotes.length; i++) {
    const note = filteredNotes[i];
    const notesDiv = document.createElement("div");
    const lineBreak = document.createElement("hr");
    if (!note.isEditing) {
      notesDiv.classList.add("notes-div");
      notesDiv.innerHTML = `
      <div class="info-display">
            <p class="title-display">${note.title}</p>
            <p class="content-display">${note.content}</p>
          </div>
          <div class="edit-manager">
            <button class="delete-btn">Delete</button>
            <button class="edit-btn">Edit</button>
          </div>
      `;

      const deleteBtn = notesDiv.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const index = notesArray.indexOf(note);
        notesArray.splice(index, 1);
        saveToNotes();
        renderNotes();
      });

      const editBtn = notesDiv.querySelector(".edit-btn");
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        note.isEditing = true;
        renderNotes();
      });
    } else {
      notesDiv.innerHTML = `
      <form class="edit-form">
        <label for="title">Title:</label>
        <input type="text" class="edit-title" value="${note.title}" />
        <label for="content">Content:</label>
        <textarea class="edit-content">${note.content}</textarea>
        <div class="edit-buttons">
         <button type="submit">Save</button>
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

        note.title = validatedEditData.title;
        note.content = validatedEditData.content;
        note.isEditing = false;
        saveToNotes();
        renderNotes();
      });

      cancelBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        note.isEditing = false;
        saveToNotes();
        renderNotes();
      });
    }
    notesList.appendChild(notesDiv);
    notesList.appendChild(lineBreak);
  }

  countDisplay.innerHTML = `${
    notesArray.length === 0
      ? "No notes yet. Start writing ✨"
      : `Showing ${filteredNotes.length} of ${notesArray.length} Note${notesArray.length === 1 ? "" : "s"}`
  }`;
}
