const maxComments = 15; // 最多显示15条评论
let comments = []; // 存储所有评论

document.getElementById('comment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // 获取表单数据
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    // 创建评论对象
    const commentObj = {
        name: name,
        text: comment
    };

    // 添加到评论列表
    comments.push(commentObj);

    // 更新显示的评论
    updateComments();

    // 清空表单
    document.getElementById('comment-form').reset();
});

function updateComments() {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = ''; // 清空当前评论列表

    // 只显示最近的maxComments条评论
    const displayedComments = comments.slice(-maxComments);
    displayedComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <div class="name">${comment.name}</div>
            <div class="text">${comment.text}</div>
        `;
        commentsList.appendChild(commentElement);
    });

    // 控制“查看更多”按钮的显示
    document.getElementById('load-more').style.display = comments.length > maxComments ? 'block' : 'none';
}

// 点击“查看更多”按钮加载更多评论
document.getElementById('load-more').addEventListener('click', () => {
    const commentsList = document.getElementById('comments-list');
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <div class="name">${comment.name}</div>
            <div class="text">${comment.text}</div>
        `;
        commentsList.appendChild(commentElement);
    });
    document.getElementById('load-more').style.display = 'none'; // 隐藏按钮
});