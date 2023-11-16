import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSetting = {
    databaseURL: "https://realtime-database-3e10c-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSetting)
const database = getDatabase(app)
const dailyReadsInDB = ref(database, "dailyReads")

const saveBtn = document.getElementById("save-btn")
const textareaEl = document.getElementById("textarea-el")
const ulEl = document.getElementById("ul-el")

saveBtn.addEventListener("click", function() {
    const inputText = textareaEl.value
    
    push(dailyReadsInDB, inputText)
    
    clearTextarea()
})

onValue(dailyReadsInDB, function(snapshot) {
    if (snapshot.exists()) {
        let listArray = Object.entries(snapshot.val())
        
        clearReadingList()
        
        for (let i = 0; i < listArray.length; i++) {
            let readingItem = listArray[i]
            let readingItemId = readingItem[0]
            let readingNote = readingItem[1]
            appendItemToListEl(readingItemId, readingNote)
        }
    } else {
        ulEl.innerHTML = "No items to view"
    }
})

function appendItemToListEl(id, val) {
    let liEl = document.createElement("li")
    liEl.textContent = val
        
    liEl.addEventListener("dblclick", function() {
        let readingItemLocationInDb = ref(database, `dailyReads/${id}`)  
        remove(readingItemLocationInDb)
    })
    ulEl.append(liEl)
}

function clearTextarea() {
    textareaEl.value = ""
}

function clearReadingList() {
    ulEl.innerHTML = ""
}
