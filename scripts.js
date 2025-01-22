// 提交评论
document.getElementById('comment-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, comment })
    }).then(response => response.json())
      .then(data => {
          alert('留言已提交！');
          loadComments();
          document.getElementById('comment-form').reset();
      });
});

// 加载评论
function loadComments() {
    fetch('http://localhost:3000/comments')
        .then(response => response.json())
        .then(comments => {
            const commentsList = document.getElementById('comments-list');
            commentsList.innerHTML = '';
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.innerHTML = `
                    <div class="name">${comment.name}</div>
                    <div class="text">${comment.comment}</div>
                `;
                commentsList.appendChild(commentElement);
            });
        });
}

// 页面加载时加载评论
window.onload = loadComments;
