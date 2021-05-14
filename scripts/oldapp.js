//UI Selectors
const main = document.querySelector("#main");
const search = document.querySelector("#filter");
const table = document.querySelector("tbody");
const clear = document.querySelector("#clear");

//Movie Object
class Movie {
  constructor(title, genre, release) {
    this.title = title;
    this.genre = genre;
    this.release = release; 
  }
}

//array to store movie objects
let storage = [];

main.date.addEventListener("blur", (e) => {
  main.date.type = "text";
})

main.date.addEventListener("focus", (e) => {
  main.date.type = "date";
})

main.addEventListener("submit",(e) => {
  //all fields must be filled in 
  if(main.movie.value == "" || main.genre.value == "" ||
    main.date.value == "") {
      alert("Please fill in all fields");
    }
  //create row and insert input into table cells
  else {
    const movie = new Movie(main.movie.value, main.genre.value, main.date.value);
    const tableRow = document.createElement("tr");

    tableRow.setAttribute("class","item");
    tableRow.innerHTML = `<td>${movie.title}</td>
                          <td>${movie.genre}</td>
                          <td>${movie.release}</td>
                          <td><a class="black-text" href=#><i class="material-icons right">clear</i></a></td>`;
    table.appendChild(tableRow);
    
    //clear input fields
    main.movie.value = "";
    main.genre.value = "";
    main.date.value = "";
    //store movie in array
    storage.push(movie);
    //add movie to local storage
    localStorage.setItem("list",JSON.stringify(storage));
  }
  e.preventDefault();
})

//if icon is clicked then the row will be deleted
document.body.addEventListener("click", (e) => {
  if(e.target.parentElement.classList.contains("black-text")) {
    const item = e.target.parentElement.parentElement.parentElement.firstElementChild.innerText;

    //Filter out unwanted movie and overwrite storage    
    storage = storage.filter(listItem => listItem.title != item);
    localStorage.setItem("list",JSON.stringify(storage));

    e.target.parentElement.parentElement.parentElement.remove();
  }
})

//Clears the entire field 
clear.addEventListener("click", (e) => {
  while(table.firstChild) {
    table.removeChild(table.firstChild);
  }
  //Erase local storage
  localStorage.clear("list");
})

//Seach movie by name
search.addEventListener("keyup", (e) => {
  const keyword = search.filter.value.toLowerCase(); //all lowercase input
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
})

//Retrieve contents of local storage when page loads
document.addEventListener("DOMContentLoaded", (e) => {
  //If storage is empty then the array is empty
  if(localStorage.getItem("list") == null) {
    storage = [];
  }
  else {
    //parse JSON format from storage and place in array
    storage = JSON.parse(localStorage.getItem("list"));
    //loop through each object in array and place in table
    storage.forEach(listItem => {
      const tableRow = document.createElement("tr");

      tableRow.setAttribute("class","item");
      tableRow.innerHTML = `<td>${listItem.title}</td>
                            <td>${listItem.genre}</td>
                            <td>${listItem.release}</td>
                            <td><a class="black-text" href=#><i class="material-icons right">clear</i></a></td>`;
      table.appendChild(tableRow);
    })
  }
})