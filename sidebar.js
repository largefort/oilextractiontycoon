function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const tabContents = document.querySelectorAll('.tab-content');

    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        tabContents.forEach(content => {
            content.style.left = '220px';
            content.style.width = 'calc(100% - 220px)';
        });
    } else {
        sidebar.classList.add('hidden');
        tabContents.forEach(content => {
            content.style.left = '0';
            content.style.width = '100%';
        });
    }
}
