document.addEventListener("DOMContentLoaded", function() {

//----------- VARIABLES -----------------------

  const list = document.querySelector("#list")
  const showPanel = document.querySelector("#show-panel")

  let allBooks = []

// ----------- EVENT LISTENERS ----------------
  document.addEventListener("click", (e) => {

    if (e.target.id === "book-title") {
      renderShowPanel(e.target.dataset.id)
    }
    if (e.target.id === "read-book") {
      readBook(e.target.dataset.id)
    }
  })

// --------- GET REQUEST TO DB ---------------
  fetch("http://localhost:3000/books")
  .then(resp => resp.json())
  .then(books => {
    renderAllBooks(books)
    allBooks = books
  })

// ----------- HELPER METHODS -----------------

  function readBook(bookId) {
    let book = allBooks.find(book => {return book.id == bookId})
    let users = book.users

    if (users.find(user => user.id == 1)) {
      users = users.filter(user => user.id != 1)
    }
    else {
      users.push({"id":1, "username":"pouros"})
    }

    let data = {"users": users}

    fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(updatedBook => {

      let list = allBooks.map(book => {
        if (book.id == updatedBook.id) {
          return updatedBook
        }
        else {
          return book
        }
      })

      allBooks = list
      renderShowPanel(updatedBook.id)
    })
  }

  function renderShowPanel(bookId) {
    let book = allBooks.find(book => {return book.id == bookId})

    let users = []
    book.users.forEach(user => users.push(user.username))

    showPanel.innerHTML = `
    <h3>${book.title}</h3>
    <img src=${book.img_url}>
    <p>${book.description}</p>
    <strong>${users.join(" <br>")}</strong><br>
    <button id="read-book" data-id=${book.id}>Read Book</button>
    `
  }

  function renderAllBooks(books) {
    books.forEach(book => {
      renderSingleBook(book)
    })
  }

  function renderSingleBook(book) {
    list.innerHTML += `<li data-id="${book.id}" id="book-title">${book.title}</li>`
  }



}); // END OF DOM CONTENT LOADED
