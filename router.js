// Simple router script to handle navigation between sections
(function() {
    function getBasePath() {
        const path = window.location.pathname;
        const parts = path.split('/');
        // Remove the last two parts if we're in a subdirectory (e.g., /user/ or /admin/)
        if (parts.length > 2 && (parts.includes('user') || parts.includes('admin'))) {
            parts.splice(-2);
        }
        return window.location.origin + parts.join('/');
    }

    function handleRoute() {
        const hash = window.location.hash.toLowerCase();
        const currentPath = window.location.pathname;
        const basePath = getBasePath();
        
        console.log('Current path:', currentPath);
        console.log('Base path:', basePath);
        console.log('Hash:', hash);

        // Default to user section if no hash is present
        if (!hash || hash === '#') {
            window.location.hash = '#user';
            return;
        }

        // Route to appropriate section based on hash
        switch (hash) {
            case '#user':
                if (!currentPath.includes('/user/')) {
                    window.location.href = basePath + 'user/index.html';
                }
                break;
            case '#admin':
                if (!currentPath.includes('/admin/')) {
                    window.location.href = basePath + 'admin/index.html';
                }
                break;
            case '#default':
                // Special case for default
                break;
            default:
                window.location.hash = '#default';
                return;
        }
    }

    // Initialize router
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleRoute);
    } else {
        handleRoute();
    }
})();
