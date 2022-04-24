// Get the modal
var uploadModal = document.getElementById("uploadModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var viewModal = document.getElementById("viewModal");

var post = document.getElementById("post0");

var modal;

var postId;

var likedbtn = document.getElementById("likeID");

var commentBtn = document.getElementById("comment-submit");

var newComment = document.getElementById("new-com");

var newCommentBtn = document.getElementById("new-comment-btn");

var com_display = false;

var comments_list = document.getElementById("com-list");



newCommentBtn.onclick = function () {

    if(com_display == false) {
        newComment.style.display = "block";
        comments_list.style.height = "48%";
        com_display = true;
    } else {
        newComment.style.display = "none";
        comments_list.style.height = "50%";
        com_display = false;
    }
    
    
}

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal = uploadModal;
    uploadModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    viewModal.style.display = "none";
    uploadModal.style.display = "none";

    var oldUser = document.getElementsByClassName("commenter");
    var oldComments = document.getElementsByClassName("post-comment");
    for (let i = 0; i < oldComments.length; i++) {
        oldUser[i].remove();
        oldComments[i].remove();
    }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        viewModal.style.display = "none";
        uploadModal.style.display = "none";

        var oldUser = document.getElementsByClassName("commenter");
        var oldComments = document.getElementsByClassName("post-comment");
        for (let i = 0; i < oldComments.length; i++) {
            oldUser[i].remove();
            oldComments[i].remove();
        }
    }


}


function CheckPost(id) {
    console.log("heya");
    postId = id.match(/\d+/);
    modal = viewModal;
    //var image = document.createElement("img");
    var postArray = <%- JSON.stringify(files)%>;
    
    var image = document.getElementById("frameImg");
    var url = "images/"+postArray[postId];
    image.src = url;
    
    
    viewModal.style.display = "block";

    likedbtn.innerHTML = <%- JSON.stringify(likes)%>[postId];

    
    var oldUser = document.getElementsByClassName("commenter");
    var oldComments = document.getElementsByClassName("post-comment");
    for (let i = 0; i < oldComments.length; i++) {
        oldUser[i].remove();
        oldComments[i].remove();
    }


    $.ajax({
        url: "http://localhost:8000/show_comments",
        type: "POST",
        data: {
            postNum: postId,
            url: url,
            //oldComments: com,
        },
        success: function (results) {


            for (let i = 0; i < results[1].length; i++) {
                var commenterLi = document.createElement("li");
                var commentItem = document.createElement("li");
                var comment = document.createElement("p");


                commenterLi.innerHTML = results[0][i] + " - " + results[2][i];
                comment.innerHTML = results[1][i];
                commenterLi.className = "commenter";
                commentItem.className = "post-comment";
                commentItem.id = "comment" + results[1][i].length;
                // comment.innerHTML = "hello";

                var element = document.getElementById("com-list");


                element.appendChild(commenterLi);
                element.appendChild(commentItem);

                var sub_element = document.getElementById("comment" + results[1][i].length);
                sub_element.appendChild(comment);
            }

        }
    });
}


likedbtn.onclick = function () {

    var likes = "<%=likes%>";

    $.ajax({
        url: "http://localhost:8000/like",
        type: "POST",
        data: {
            post_Id: postId,
            likedPost: likes[postId],
        },
        success: function (result) {
            var currentPost = document.getElementById('likes-count-' + postId);



            var newLike = result;
            currentPost.innerHTML = " " + newLike;
            likedbtn.innerHTML = newLike;
            
            $(currentPost).innerHTML.replaceWith(newLike);

        }
    });
}

commentBtn.onclick = function () {

    var profileName = "<%=username%>";
    var newComment = document.getElementById("new-comment").value;
    var comments = "<%=comment_num%>";
    $.ajax({
        url: "http://localhost:8000/comment",
        type: "POST",
        data: {
            post_Id: postId,
            comment: newComment,
            profile_name: profileName,

        },
        success: function (results) {


            var commenterLi = document.createElement("li");
            var commentItem = document.createElement("li");
            var comment = document.createElement("p");

            commenterLi.className = "commenter";
            commenterLi.innerHTML = results[1] + " - " + results[2];
            commentItem.className = "post-comment";
            commentItem.id = "comment" + comments.length;
            comment.innerHTML = results[0];

            var element = document.getElementById("com-list");


            element.insertBefore(commentItem, element.firstChild);
            element.insertBefore(commenterLi, element.firstChild);
            var com_element = document.getElementById("comment" + comments.length);
            com_element.insertBefore(comment, com_element.firstChild);

        }
    });
}