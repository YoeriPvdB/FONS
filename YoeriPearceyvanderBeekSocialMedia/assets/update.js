"use strict";
 
function update() {
    $.ajax({
        url: "http://localhost:8000/profile/" + currentUser,
        success:function (result) {
            console.log("hi from ajax");
            console.log(result);
            
            
            // var randomNum = Math.floor(Math.random() * result.length);

            // var output = document.createElement("h2");

            // output.innerHTML = result[randomNum]["message"];
            // $(output).appendTo("#content");

            
        }
    }
    
    );
}