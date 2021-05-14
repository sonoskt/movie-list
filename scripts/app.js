/*The painful but better ES6 class based OOP 
approach to the movie list app

Big takeaways
1.Making each object handle a specific task
  for example the UI class is only concerned
  with making changes to the UI (no heavy logic)
2.The event listeners contain the logic to 
  (for eg ifs and looping)
*/

//Movie Object
class Movie {
  constructor(title, genre, release) {
    this.title = title;
    this.genre = genre;
    this.release = release;
  }
}

//UI Class
class UI {
  //Reveals the date input placeholder when called
  blurDate() {
    document.querySelector("#main").date.type = "text";
  }

  //Reveals the date input when called
  focusDate() {
    document.querySelector("#main").date.type = "date";
  }

  //Adds the movie info to the table
  addMovie(movie) {
    //create row and insert input into table cells
    const table = document.querySelector("tbody");
    const tableRow = document.createElement("tr");

    tableRow.setAttribute("class","item");
    tableRow.innerHTML = `<td>${movie.title}</td>
                          <td>${movie.genre}</td>
                          <td>${movie.release}</td>
                          <td><a class="black-text" href=#><i class="material-icons right">clear</i></a></td>`;
    table.appendChild(tableRow);

    //clear input fields
    document.querySelector("#main").movie.value = "";
    document.querySelector("#main").genre.value = "";
    document.querySelector("#main").date.value = "";
  }

  //Will remove the grandparent of the event target passed in
  deleteMovie(target) {
      const item = target.parentElement.parentElement.parentElement.firstElementChild.innerText;
      
      target.parentElement.parentElement.parentElement.remove();
      return item;
    }

  //Clears the whole table
  clearList() {
    const table = document.querySelector("tbody");

    while(table.firstChild) {
      table.removeChild(table.firstChild);
    }
  }

  //
  searchMovie() {
    const keyword = document.querySelector("#filter").filter.value.toLowerCase(); //all lowercase input
    let searched;

    //loop through each row
    document.querySelectorAll(".item").forEach(row => {
      searched = row.firstElementChild.innerText.toLowerCase();//make movie title lower case
      
      //if keyword is in the movie title it is displayed otherwise it is hidden
      if(searched.indexOf(keyword) === -1) {
        row.style.display = "none";
      }
      else {
        //materialize does not like display block in tables  
        row.style.display = "";
      }
    });
  }
}

//Local Storage class (only uses static methods)
class storedLocal {
  //Checks local storage and returns an empty of populated array
  static checkStorage() {
    let movie_list = [];

    if(localStorage.getItem("movie_list") === null) {
      movie_list = [];
    }
    else {
      movie_list = JSON.parse(localStorage.getItem("movie_list"));
    }
    return movie_list;
  }

  //Add movie to local storage
  static addItem(movie) {
    //Checks current list before adding a movie
    let movie_list = storedLocal.checkStorage();

    //store movie in array
    movie_list.push(movie);
    //Makes changes to local storage
    localStorage.setItem("movie_list",JSON.stringify(movie_list));
  }

  //Delete movie from local storage
  static deleteItem(movieTitle) {
      let movie_list = storedLocal.checkStorage();

      //Uses array method filter to remove unwanted movie
      movie_list = movie_list.filter(listItem => listItem.title != movieTitle);
      localStorage.setItem("movie_list",JSON.stringify(movie_list));
  }

  //Clear Local storage
  static clearStorage() {
    localStorage.clear("movie_list");
  }
}

//Event 
document.querySelector("#main").date.addEventListener("blur", (e) => {
  //must instantiate UI object before accessing methods
  const ui = new UI();

  ui.blurDate();
});

document.querySelector("#main").date.addEventListener("focus", (e) => {
  const ui = new UI();

  ui.focusDate();
});

document.querySelector("#main").addEventListener("submit", (e) => {
  const ui = new UI();

  const main = document.querySelector("#main");
  
  //all fields must be filled in 
  if(main.movie.value === "" || main.genre.value === "" ||
  main.date.value === "") {
    alert("Please fill in all fields");
  }
  else {
    const movie = new Movie(main.movie.value, main.genre.value, main.date.value);
    ui.addMovie(movie);
    storedLocal.addItem(movie);
  }

  e.preventDefault();
});

document.body.addEventListener("click", (e) => {
  const ui = new UI();

  if(e.target.parentElement.classList.contains("black-text")) {
    /*Returns the deleted movie name from the UI and passes
      it into storedLocal method to be deleted from memory
    */
    storedLocal.deleteItem(ui.deleteMovie(e.target));
  }
});

document.querySelector("#clear").addEventListener("click", (e) => {
  const ui = new UI();
  
  ui.clearList();
  storedLocal.clearStorage();
});

document.querySelector("#filter").addEventListener("keyup", (e) => {
  const ui = new UI();
  
  ui.searchMovie();
});

//When page loads check local storage
document.addEventListener("DOMContentLoaded", (e) => {
  const ui = new UI();
  
  let movie_list = storedLocal.checkStorage();

  //if storage is empty then end 
  if (movie_list == []) {
    return;
  } 
  //Otherwise update the UI with local storage items
  else {
    movie_list.forEach(listItem => {
      ui.addMovie(listItem);
    })
  }
});