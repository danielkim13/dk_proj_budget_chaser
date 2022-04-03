// creating a variable to hold db connection.
let db;
// establish a connection to IndexedDB database called 'budget'
const request = indexedDB.open("budget", 1);
// emit if the db version changes.
request.onupgradeneeded = function (e) {
  const db = e.target.result;
  db.createObjectStore("new_budget", { autoIncrement: true });
};

// upon successful.
request.onsuccess = function (e) {
  db = e.target.result;

  if (navigator.onLine) {
    uploadBudget();
  }
};

request.onerror = function (e) {
  console.log(e.target.errorCode);
};

// function to execute if attempting to submit a new budget w/ no connectivity
function saveRecord(buzet) {
  const transaction = db.transaction(["new_budget"], "readwrite");

  const budgetObjectStore = transaction.objectStore("new_budget");

  budgetObjectStore.add(buzet);
}

function uploadBudget() {
  const transaction = db.transaction(["new_budget"], "readwrite");

  const budgetObjectStore = transaction.objectStore("new_budget");

  const getAll = budgetObjectStore.getAll();

  // successful getAll execution; requires fetch function.
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(["new_budget"], "readwrite");
          const budgetObjectStore = transaction.objectStore("new_budget");
          budgetObjectStore.clear();

          alert("All budget has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

// listen for app coming back online.
window.addEventListener("online", uploadBudget);
