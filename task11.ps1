$files = Get-ChildItem -Path . -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace all dead links in footer and social media
    $content = $content -replace 'href="#" class="social-circle"', 'href="404.html" class="social-circle"'
    $content = $content -replace 'href="#" class="social-btn"', 'href="404.html" class="social-btn"'
    $content = $content -replace '<a href="#"><i class="uil uil-twitter-alt">', '<a href="404.html"><i class="uil uil-twitter-alt">'
    $content = $content -replace '<a href="#"><i class="uil uil-instagram">', '<a href="404.html"><i class="uil uil-instagram">'
    $content = $content -replace '<a href="#"><i class="uil uil-discord">', '<a href="404.html"><i class="uil uil-discord">'
    $content = $content -replace '<a href="#"><i class="uil uil-youtube">', '<a href="404.html"><i class="uil uil-youtube">'
    
    # Replace footer links
    $content = $content -replace '<li><a href="#">(Trending|New Drops|Blog|Help Center|Terms of Service|Privacy Policy|FAQ)</a></li>', '<li><a href="404.html">$1</a></li>'
    $content = $content -replace '<a href="#">(Privacy|Terms|Cookies)</a>', '<a href="404.html">$1</a>'

    # Replace specific button links
    $content = $content -replace '<a href="#" class="btn btn-primary magnetic-btn"', '<a href="marketplace.html" class="btn btn-primary magnetic-btn"'
    $content = $content -replace '<a href="#" class="btn btn-outline btn-sm magnetic-btn"', '<a href="marketplace.html" class="btn btn-outline btn-sm magnetic-btn"'
    
    # Auth Pages: Append JS for redirection
    if ($file.Name -eq "login.html" -or $file.Name -eq "signup.html") {
        # Replace the old inline script with the new one
        $scriptReplacement = @"
    <script>
        // Handle the tabs so we don't need main.js
        document.querySelectorAll('.role-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Add styling dynamically since we are overriding main.js
                document.querySelectorAll('.role-tab').forEach(t => {
                    t.style.background = 'transparent';
                    t.style.color = 'var(--text-muted)';
                });
                this.style.background = 'var(--accent-violet)';
                this.style.color = '#fff';
            });
        });

        // Handle form submission and redirection
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Add a small loading effect to the button
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.innerHTML = '<i class="uil uil-spinner-alt"></i> Loading...';
                
                setTimeout(() => {
                    const activeTab = document.querySelector('.role-tab.active');
                    const role = activeTab ? activeTab.textContent.trim() : 'Collector';
                    
                    if (role === 'Artist') {
                        window.location.href = 'dashboard-artist.html';
                    } else {
                        window.location.href = 'dashboard-user.html';
                    }
                }, 800);
            });
        }
    </script>
</body>
"@
        $content = $content -replace '(?s)<script>.*?</script>\s*</body>', $scriptReplacement
    }

    Set-Content -Path $file.FullName -Value $content
}
