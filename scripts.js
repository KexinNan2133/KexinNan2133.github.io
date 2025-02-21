document.getElementById('guestbook-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    const entry = { name, message };
    let entries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
    entries.push(entry);
    localStorage.setItem('guestbookEntries', JSON.stringify(entries));

    addEntryToDOM(entry);

    document.getElementById('guestbook-form').reset();
});

function addEntryToDOM(entry) {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'guestbook-entry';
    entryDiv.innerHTML = `<strong>${entry.name}</strong><p>${entry.message}</p>`;
    document.getElementById('guestbook-entries').appendChild(entryDiv);
}

function loadEntries() {
    const entries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
    entries.forEach(addEntryToDOM);
}

window.onload = loadEntries;

document.getElementById('clear-entries').addEventListener('click', function() {
    localStorage.removeItem('guestbookEntries');
    document.getElementById('guestbook-entries').innerHTML = '';
});
