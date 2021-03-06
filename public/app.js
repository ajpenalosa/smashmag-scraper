// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  console.log(data);
  console.log("this is the length " + data.length);

  var articleHTML = "<h1>There are no articles</h1>";

  if ( data.length !== 0 ) {
  
    for (var i = 0; i < data.length; i++) {
      // Display the information on the page
  
      var articleHTML = 
  
      "<div class='card' data-id='" + data[i]._id + "'>" +
        "<h5 class='card-header'>" + data[i].title + "</h5>" +
        "<div class='card-body'>" +
          "<p class='card-text'>" + data[i].body + "</p>" +
          "<button class='btn btn-danger btn-delete'><i class='fas fa-trash-alt'></i></button>" +
          "<button class='btn btn-primary btn-notes'><i class='fas fa-sticky-note'></i></button>" +
          "<a href='" + data[i].link + "' target='_blank' class='btn btn-primary'>Read Full Article</a>" +
        "</div>" +
      "</div>";
  
      $("#articles").append(articleHTML);
    }

  }
  else {
    var articleHTML = "<h1 class='text-center'>There are no articles</h1>";
    $("#articles").append(articleHTML);
  }
});

// Scrape button
$(document).on("click","#scraper", function(){
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(data){
    console.log(data);
    location.reload();
  })
});

// Delete button
$(document).on("click",".btn-delete", function(){
  var thisId = $(this).parent().parent().attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  }).then(function(data){
    console.log(data);
    location.reload();
  })
});

// Whenever someone clicks the notes button
$(document).on("click", ".btn-notes", function() {
  $("#notes-modal").modal();
  // Empty the notes from the note section
  $("#notes").empty();
  $(".all-notes").empty();

  var thisId = $(this).parent().parent().attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $(".modal-title").text(data.title);
      // An input to enter a new title
      $("#notes").append("<div class='form-group'><input id='titleinput' class='form-control' name='title' placeholder='Name' ></div>");
      // A textarea to add a new note body
      $("#notes").append("<div class='form-group'><textarea id='bodyinput' class='form-control' name='body' placeholder='Comment'></textarea></div>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-primary btn-block'>Save Comment</button>");

      // If there's notes for the article
      if (data.notes) {
        for ( var i = 0; i < data.notes.length; i++ ) {
          $.getJSON("/note/" + data.notes[i], function(data) {
            if(data.title) {
              console.log(data);
              var notesHTML =
              "<div class='note' data-id='" + data._id + "'>" +
                "<button class='btn btn-danger btn-delete-note'><i class='fas fa-trash-alt'></i></button>" +
                "<h3>" + data.title + "</h3>" +
                "<p>" + data.body + "</p>" +
              "</div>";
  
              $(".all-notes").prepend(notesHTML);
            }
          });
        }
      }
    });
});

// Delete note button
$(document).on("click",".btn-delete-note", function(){
  var thisId = $(this).parent().attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "DELETE",
    url: "/note/" + thisId
  }).then(function(data){
    console.log(data);
    location.reload();
  })
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
