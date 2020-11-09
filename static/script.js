/**
 * This variable stores the logged in user
 */
var loggedUser;

/**
 * This function is called when login button is pressed.
 * Note that this does not perform an actual authentication of the user.
 * A student is loaded given the specified email,
 * if it exists, the studentId is used in future calls.
 */
function login()
{
    //get the form object
    var email = document.getElementById("loginEmail").value;
    // console.log(email);

    fetch('../api/v1/students?email=' + email)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        //console.log(data);
        loggedUser = data[0];
        loggedUser.id = loggedUser.self.substring(loggedUser.self.lastIndexOf('/') + 1);
        document.getElementById("loggedUser").innerHTML = loggedUser.email;
        loadLendings();
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

/**
 * This function refresh the list of books
 */
function loadBooks() {

    const ul = document.getElementById('books'); // Get the list where we will place our authors

    ul.innerHTML = '';

    fetch('../api/v1/books')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        
        // console.log(data);
        
        return data.map(function(book) { // Map through the results and for each run the code below
            
            // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
            
            let li = document.createElement('li');
            let span = document.createElement('span');
            span.innerHTML = `<a href="${book.self}">${book.title}</a>`;
            span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
            
            // Append all our elements
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}
loadBooks();

/**
 * This function is called by the Take button beside each book.
 * It create a new booklendings resource,
 * given the book and the logged in student
 */
function takeBook(bookUrl)
{
    fetch('../api/v1/booklendings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { student: loggedUser.self, book: bookUrl } ),
    })
    .then((resp) => {
        console.log(resp);
        loadLendings();
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

/**
 * This function refresh the list of bookLendings.
 * It only load bookLendings given the logged in student.
 * It is called every time a book is taken of when the user login.
 */
function loadLendings() {

    const ul = document.getElementById('bookLendings'); // Get the list where we will place our lendings

    ul.innerHTML = '';

    fetch('../api/v1/booklendings?studentId=' + loggedUser.id)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        
        console.log(data);
        
        return data.map( (entry) => { // Map through the results and for each run the code below
            
            // let bookId = book.self.substring(book.self.lastIndexOf('/') + 1);
            
            let li = document.createElement('li');
            let span = document.createElement('span');
            span.innerHTML = `<a href="${entry.self}">${entry.book}</a>`;
            // span.innerHTML += `<button type="button" onclick="takeBook('${book.self}')">Take the book</button>`
            
            // Append all our elements
            li.appendChild(span);
            ul.appendChild(li);
        })
    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}


/**
 * This function is called by clicking on the "insert book" button.
 * It creates a new book given the specified title,
 * and force the refresh of the whole list of books.
 */
function insertBook()
{
    //get the book title
    var bookTitle = document.getElementById("bookTitle").value;

    console.log(bookTitle);

    fetch('../api/v1/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { title: bookTitle } ),
    })
    .then((resp) => {
        console.log(resp);
        loadBooks();
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};