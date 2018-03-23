
$.getJSON("/articles", function(data) {

  for (var i = 0; i < data.length; i++) {

    var linkHTML  = '<a class="link" href="'+data[i].link+'">'+data[i].link+'</a>';
    $("#articles").append("<p class='title' id='" + data[i]._id + "'>" + data[i].title + "<br/>" + linkHTML + "</p>");
  }
});



$(document).on("click", "p", function() {

  $("#notes").empty();
  $("#bodyinput").empty();

  var thisId = $(this).attr("id");


  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .then(function(data) {
      console.log(data);

      $("#notes").append("<h2>" + data.title + "</h2>");

      $("#notes").append("<input id='titleinput' name='title' >");

      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

      $("#notes").append("<button id='" + data._id + "' class='savenote'>Save Memo</button>");
        $("#notes").append("<button id='" + data._id + "' class='deleteX'>Delete</button>");


      if (data.note) {

        $("#titleinput").val(data.note.title);

        $("#bodyinput").val(data.note.body);
      }
    });
});


$(document).on("click", ".savenote", function() {

  var thisId = $(this).attr("id");


  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {

      title: $("#titleinput").val(),

      body: $("#bodyinput").val()
    }
  })

    .then(function(data) {

      console.log('this note');

      $("#notes").empty();
    });

});
$(document).on("click", ".deleteX", function() {
  var thisId = $(this).attr("id");
  $("#titleinput").empty();
  $("#bodyinput").empty();
  var result = {};
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

    .then(function(data) {
      if(data.note){
        data.note = "";
        result = data;
      }
      });

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: result
  })
  .then(function(data) {

    console.log('this note');
      $("#notes").empty();
  });
});
