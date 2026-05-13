let notesArray = [];
let searchItem = "";

//localStorage.clear()

function init() {
  const savedNotes = JSON.parse(localStorage.getItem("notes"));

  if (savedNotes) {
    notesArray = savedNotes;
  }

  renderNotes();
  setUpEventListeners();
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
    id: crypto.randomUUID(),
    title: value.title,
    content: value.content,
    isEditing: false,
    createdAt: Date.now(),
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

function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"}`;
  } else if (hours < 24) {
    return `${hours} hr${hours === 1 ? "" : "s"}`;
  } else {
    return `${days} day${days === 1 ? "" : "s"}`;
  }
}

function highlightText(text, searchTerm) {
  if (!searchTerm) return text;

  const lowerText = text.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();

  const startIndex = lowerText.indexOf(lowerSearch);

  if (startIndex === -1) return text;

  const endIndex = startIndex + lowerSearch.length;

  const before = text.slice(0, startIndex);
  const match = text.slice(startIndex, endIndex);
  const after = text.slice(endIndex);

  return `${before}<mark>${match}</mark>${after}`;
}

function setUpEventListeners() {
  const notesList = document.getElementById("notes-list");

  notesList.addEventListener("click", (e) => {
    const id = e.target.dataset.id;

    if (!id) return;

    const note = notesArray.find((n) => n.id === id);

    if (!note) return;

    if (e.target.classList.contains("delete-btn")) {
      notesArray = notesArray.filter((n) => n.id !== id);
      saveToNotes();
      renderNotes();
    }

    if (e.target.classList.contains("edit-btn")) {
      note.isEditing = true;
      renderNotes();
    }

    if (e.target.classList.contains("cancel-btn")) {
      note.isEditing = false;
      saveToNotes();
      renderNotes();
    }
  });
}

function createNoteHTML(note) {
  return `
      <div class="info-display">
            <p class="title-display">${highlightText(note.title, searchItem)}</p>
            <p class="content-display">${highlightText(note.content, searchItem)}</p>
            <p class="time-display">${formatRelativeTime(note.createdAt)}</p>
          </div>
          <div class="edit-manager">
            <button data-id=${note.id} class="delete-btn">Delete</button>
            <button data-id=${note.id} class="edit-btn">Edit</button>
          </div>
      `;
}

function createEditHTML(note) {
  return `
      <form class="edit-form">
        <label for="title">Title:</label>
        <input type="text" class="edit-title" value="${note.title}" />
        <label for="content">Content:</label>
        <textarea class="edit-content">${note.content}</textarea>
        <div class="edit-buttons">
         <button data-id=${note.id} type="submit">Save</button>
         <button data-id=${note.id} type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
      `;
}

function handleEditLogic(id, inputTitle, inputContent) {
  const note = notesArray.find((n) => n.id === id);
  const validated = validateEditInput(inputTitle, inputContent);
  if (!validated) return;

  note.title = validated.title;
  note.content = validated.content;
  note.isEditing = false;
  saveToNotes();
  renderNotes();
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
    countDisplay.innerHTML = `No match for "${searchItem}"`;
    return;
  }

  for (let i = 0; i < filteredNotes.length; i++) {
    const note = filteredNotes[i];
    const notesDiv = document.createElement("div");
    const lineBreak = document.createElement("hr");
    if (!note.isEditing) {
      notesDiv.classList.add("notes-div");
      notesDiv.innerHTML = createNoteHTML(note);
    } else {
      notesDiv.innerHTML = createEditHTML(note);

      const editForm = notesDiv.querySelector(".edit-form");
      const editedTitle = editForm.querySelector(".edit-title");
      const editedContent = editForm.querySelector(".edit-content");

      editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleEditLogic(note.id, editedTitle, editedContent);
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

init();
