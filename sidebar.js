function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const tabContents = document.querySelectorAll('.tab-content');
    const reopenButton = document.getElementById('reopenSidebar');

    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        reopenButton.style.display = 'none';
        tabContents.forEach(content => {
            content.style.left = '160px'; // Adjust to sidebar width
            content.style.width = 'calc(100% - 160px)'; // Adjust to sidebar width
        });
    } else {
        sidebar.classList.add('hidden');
        reopenButton.style.display = 'block';
        tabContents.forEach(content => {
            content.style.left = '0';
            content.style.width = '100%';
        });
    }
}
