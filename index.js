const commentList = document.getElementById('comment-list');
const newCommentForm = document.getElementById('new-comment-form');
const googleSheetUrl = "https://docs.google.com/spreadsheets/d/1NEuuBN6WRmwOFR9PZEFCRirJIA92neDYGXylyLsaX5Y/edit?gid=0#gid=0"; // Ganti dengan URL Web App Anda

async function getComments() {
    try {
        const response = await fetch(googleSheetUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

function displayComments(comments) {
    commentList.innerHTML = '';
    comments.forEach(comment => {
        const newComment = document.createElement('div');
        newComment.classList.add('comment');
        newComment.innerHTML = `
            <div class="author">${comment.name}</div>
            <div class="date">${comment.date}</div>
            <p>${comment.comment}</p>
        `;
        commentList.appendChild(newComment);
    });
}

getComments().then(comments => displayComments(comments));

newCommentForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const commentText = document.getElementById('comment').value;
    const date = new Date().toLocaleString();

    try {
        const response = await fetch(googleSheetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&comment=${encodeURIComponent(commentText)}&date=${encodeURIComponent(date)}
        });
        const data = await response.json();
        if (data.success) {
            console.log("Komentar berhasil dikirim:", data);
            alert("Komentar berhasil dikirim!");
            newCommentForm.reset();
        } else {
            console.error("Error sending comment:", data.error);
            alert("Gagal mengirim komentar. Silakan coba lagi.");
        }
    } catch (error) {
        console.error("Error sending comment:", error);
        alert("Terjadi kesalahan. Silakan coba lagi.");
    }

    getComments().then(comments => displayComments(comments));
});
