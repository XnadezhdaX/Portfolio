const form = document.getElementById('bookForm');
const page = document.getElementById('page');
const list = document.getElementById('list');
const entriesBox = document.getElementById('entries');
const cover = document.getElementById('cover');
const empty = document.getElementById('empty');
const KEY = 'bookDiaryEntries';



let items = JSON.parse(localStorage.getItem(KEY)) || [];
let current = null;


function save(){
  localStorage.setItem(KEY, JSON.stringify(items));
}

function graySelect(select) {
  if (select.value) {
    select.classList.add('filled');
  } else {
    select.classList.remove('filled');
  }
}

document.querySelectorAll('select.select-gray').forEach((s) => {
  graySelect(s);
  s.addEventListener('change', () => graySelect(s));
});

function flip() {
  page.classList.add('turning');
  setTimeout(() => page.classList.remove('turning'), 250);
}

function showList(){
  list.innerHTML = '';

  if (items.length === 0) {
    entriesBox.hidden = true;
    empty.style.display = 'block';
    return;
  }

  entriesBox.hidden = false;
  empty.style.display = 'none';

  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'item' + (i === current ? ' active' : '');
    li.innerHTML = `<h4>${item.title || 'Untitled'}</h4><p>${item.author || 'Unknown author'}</p>`;
    li.addEventListener('click', () => showItem(i));
    list.appendChild(li);
  });
}

function showItem(i){
  current = i;
  const item = items[i];

  flip();

  page.innerHTML = `
    <div class="entry-view">
      <h2>${item.title || 'Untitled'}</h2>
      <p class="view-author">${item.author || 'Unknown author'}</p>
      ${item.genre ? `<div class="block"><p class="label-small">Genre</p><p class="text">${item.genre}</p></div>` : ''}
      ${item.liked ? `<div class="block"><p class="label-small">Did you like it?</p><p class="text">${item.liked}</p></div>` : ''}
      ${item.description ? `<div class="block"><p class="label-small">Description</p><p class="text">${item.description}</p></div>` : ''}
      ${item.quote ? `<div class="block"><p class="label-small">Favorite quote</p><p class="text italic">“${item.quote}”</p></div>` : ''}
      ${item.thoughts ? `<div class="block"><p class="label-small">Thoughts about the main characters</p><p class="text">${item.thoughts}</p></div>` : ''}
      <div class="view-actions">
        <button class="small-btn" id="editBtn">Edit</button>
        <button class="small-btn danger" id="deleteBtn">Delete</button>
        <button class="small-btn" id="newBtn">New entry</button>
      </div>
    </div>
  `;

  document.getElementById('editBtn').addEventListener('click', () => editItem(i));
  document.getElementById('deleteBtn').addEventListener('click', () => removeItem(i));
  document.getElementById('newBtn').addEventListener('click', newItem);

  showList();
}

function editItem(i) {
  current = i;
  const item = items[i];
  flip();
  showForm();
  document.getElementById('title').value = item.title || '';
  document.getElementById('author').value = item.author || '';
  document.getElementById('genre').value = item.genre || '';
  document.getElementById('liked').value = item.liked || '';
  document.getElementById('description').value = item.description || '';
  document.getElementById('quote').value = item.quote || '';
  document.getElementById('thoughts').value = item.thoughts || '';
  document.querySelectorAll('select.select-gray').forEach(graySelect);
  document.getElementById('cancelBtn').hidden = false;
  showList();
}



function removeItem(i) {
  if (!confirm('Delete this entry? Other entries will stay.')) return;
  items.splice(i, 1);
  save();
  current = null;
  flip();
  showForm();
  showList();
}

function newItem() {
  current = null;
  flip();
  showForm();
  showList();}





function showForm() {
  page.innerHTML = `
    <form id="bookForm" class="form">
      <div class="field">
        <label for="title">Book title</label>
        <input type="text" id="title" placeholder="Enter the title" required>
      </div>
      <div class="field">
        <label for="author">Author</label>
        <input type="text" id="author" placeholder="Enter the author" required>
      </div>
      <div class="field">
        <label for="genre">Genre</label>
        <input type="text" id="genre" placeholder="Enter the genre">
      </div>
        <div class="field">
            <label for="liked">what do you think of the book?</label>
            <select id="liked" class="select-gray">
                <option value="" disabled selected hidden>Choose an answer</option>
                <option value="bad">bad</option>
                <option value="average">average</option>
                <option value="amazing">amazing</option>
            </select>
        </div>
      <div class="field full">
        <label for="description">Description</label>
        <textarea id="description" rows="3" placeholder="What is the book about?"></textarea>
      </div>
      <div class="field full">
        <label for="quote">Favorite quote</label>
        <textarea id="quote" rows="2" placeholder="Enter a quote you liked"></textarea>
      </div>
      <div class="field full">
        <label for="thoughts">Thoughts about the main characters</label>
        <textarea id="thoughts" rows="3" placeholder="What do you think about them?"></textarea>
      </div>
      <div class="actions">
        <button type="submit" class="btn">Save this page</button>
        <button type="button" class="ghost-btn" id="cancelBtn" hidden>Cancel</button>
      </div>
    </form>
  `;

  bind();
}





function bind(){
  const f = document.getElementById('bookForm');
  const cancel = document.getElementById('cancelBtn');

  f.addEventListener('submit', (e) => {
    e.preventDefault()

    const item ={
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      genre: document.getElementById('genre').value,
      liked: document.getElementById('liked').value,
      description: document.getElementById('description').value,
      quote: document.getElementById('quote').value,
      thoughts: document.getElementById('thoughts').value,
    };

    if(!item.title || !item.author)return;

    if (current === null) {
      items.push(item);
      current = items.length - 1;
    } else {
      items[current] = item;
    }

    save();
    showItem(current);
  });

  cancel.addEventListener('click', () => {
    if (current !== null) {
      showItem(current);
    } else {
      newItem();
    }});

  document.querySelectorAll('select.select-gray').forEach((s) => {
    graySelect(s);
    s.addEventListener('change', () => graySelect(s));
  });
}

cover.addEventListener('click',() => {
  current = null;
  flip();
  showForm();
  showList();
});

showForm();
showList();