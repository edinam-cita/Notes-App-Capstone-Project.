let notesArray = [];

const savedNotes = JSON.parse(localStorage.getItem("notes"));

if (saveNotes) {
  notesArray = savedNotes;
}

const title = document.getElementById("title");
const content = document.getElementById("content");
const mainForm = document.getElementById("main-form");

mainForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const validatedData = validateInput();
  if (!validatedData) {
    return;
  }
  console.log("works");
});

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

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notesArray));
}
