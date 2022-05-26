{
    // method to submit the form data form new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',

                url: '/posts/create',

                data: newPostForm.serialize(),

                success: function (data) {
                    console.log(data.data.post);
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    // call create comment class
                    new PostComments(data.data.post._id);
                    //  enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post Published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: function (error) {
                    console.log(error.responseText);
                    new Noty({
                        theme: 'relax',
                        text: "Oops,Error!",
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                }
            });
        });
    }

    // method to create post in DOM
    let newPostDom = function (post) {
        return $(`<li id="post-${post._id}">

        <div id="post">
          <small id="delete">
            <a class="delete-post-button" href="/posts/destroy/${post._id}">x</a>
          </small>
          <span id="content">
            ${post.content}
          </span>
          <br>
          <small id="name">
            ${post.user.name }
          </small>
      
          <!-- display the likes of the post -->
          <br>
          <small>
              <a class="toggle-like-button" data-likes="${post.likes.length}" href="/likes/toggle/?id=${post._id}&type=Post">
      
                0Likes
              </a>
          </small>
        </div>
        <div class="post-comments">
          <h4>Comments</h4>
          <form action="/comments/create" method="POST" id="post-${post._id}-comments-form" class="new-comment-form">
            <input id="comment" type="text" name="content" placeholder="add comments here.." required>
            <input type="hidden" name="post" value="${post._id}">
            <input id="comment-btn"type="submit" value="Add Comment">
          </form>
      
          <div class="post-comments-list">
            <ul id="post-comments-${post._id}">
            </ul>
              
           </div>
        </div>
      </li>`)
    }


// to delete post from DOM
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                },
                error: function (err) {
                    console.log(err.responseText);
                }
            });
        });
    }

    let convertPostsToAjax = function () {
        $('#posts-list-container>ul>li').each(function() {
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}