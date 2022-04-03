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

    if(navigator.online) {
        uploadBudget();
    }
};

request.onerror = function (e) {
    console.log(e.target.errorCode);
}

// function to execute if attempting to submit a new budget w/ no connectivity
function saveRecord(buzet) {
    const transaction = db.transaction(['new_budget'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_budget');

    budgetObjectStore.add(buzet);
}