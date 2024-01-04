const bookObjects = document.querySelector(".book-objects"); as HTMLElement
let overlay = document.getElementById("overlay") as HTMLElement;
let modal = document.getElementById("modal") as HTMLElement;

const BASE_URL =
  "https://my-json-server.typicode.com/zocom-christoffer-wallenberg/books-api/books";

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  year: number;
  pages: number;
  plot: string;
  audience: string;
  color: string;
}

function createBookElement(book: Book): HTMLDivElement {
  // skapar ett bookElement för varje item ur arrayen med data. Ger den en klass så den kan stylas i css.
  let bookElement = document.createElement("div");
  bookElement.classList.add("book-element");
  // skapar title-element. Ger texten en klass så den kan stylas i css.
  let titleElement = document.createElement("p");
  titleElement.classList.add("book-title");
  titleElement.innerText = book.title;
  // skapar author-element. Ger texten en klass så den kan stylas i css.
  let authorElement = document.createElement("p");
  authorElement.classList.add("book-author");
  authorElement.innerText = book.author;
  // lägger till barnen titleElement och authorElement till föräldern bookElement
  bookElement.appendChild(titleElement);
  bookElement.appendChild(authorElement);
  //stylar bookElement med bakgrundsfärgen från api:n (book.color)
  bookElement.style.backgroundColor = book.color;

  // Lägger till data attribut
  bookElement.dataset.title = book.title;
  bookElement.dataset.author = book.author;
  bookElement.dataset.plot = book.plot;
  bookElement.dataset.audience = book.audience;
  bookElement.dataset.year = book.year.toString();

  //eftersom bok med id 4 har "null" som värde på pages, kontrolleras om värdet inte är null. om värdet är null, sätts värdet till strängen ""
  if (book.pages !== null) {
    bookElement.dataset.pages = book.pages.toString();
  } else {
    bookElement.dataset.pages = "";
  }
  bookElement.dataset.publisher = book.publisher;

  // Lägger till 'click' event listener
  bookElement.addEventListener("click", function () {
    let title = (this as HTMLElement).dataset.title;
    let author = (this as HTMLElement).dataset.author;
    let plot = (this as HTMLElement).dataset.plot;
    let audience = (this as HTMLElement).dataset.audience;
    let year = Number((this as HTMLElement).dataset.year);
    let pages = Number((this as HTMLElement).dataset.pages);
    let publisher = (this as HTMLElement).dataset.publisher;

    // Fyller modalen med bokinformation
    modal.innerHTML = `
    <h2>${title}</h2>
    <h3>By ${author}</h3>
    <h4>${plot}</h4>
    <div class="grid-area">
    <p>Audience: ${audience}</p>
    <p>First published: ${year}</p>
    <p>Pages: ${pages}</p>
    <p>Publisher: ${publisher}</p>
    </div>
  `;

    // Visa overlayen
    overlay.style.display = "block";
    // lägger till eventlistener på overlay
    overlay.addEventListener("click", function (event) {
      if (event.target === event.currentTarget) {
        (event.target as HTMLElement).style.display = "none";
      }
    });
  });
  return bookElement;
}

async function fetchBooks() {
  try {
    const response = await fetch(BASE_URL);
    const data: Book[] = await response.json();
    // console.log(data);
    data.forEach(function (book) {
      let bookElement = createBookElement(book);
      // säkerställer att dom-elementet bookObjects finns, och inte är "null"
      if (bookObjects) {
        bookObjects.appendChild(bookElement);
        // lägger till bookElement som child till DOM-objektet bookObjects, som blir förälder till alla bokelement
      } else {
        console.error("bookObjects element not found");
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchBooks();
