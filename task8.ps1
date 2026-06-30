$files = Get-ChildItem -Path . -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # 1. Remove "Stackly" name next to logo
    # In sidebar-logo or logo: <span>Stackly</span>
    $content = $content -replace '<span[^>]*>Stackly</span>', ''
    # Also just "Stackly" text if it's not wrapped in a span (like in some sidebar headers)
    $content = $content -replace '(<a[^>]*class="[^"]*logo[^"]*"[^>]*>.*?<img[^>]*>)\s*Stackly', '$1'
    
    # 2. Add role tabs and animations to auth pages
    if ($file.Name -eq "login.html" -or $file.Name -eq "signup.html") {
        $roleTabs = @"
                <div class="role-tabs reveal" style="animation-delay: 0.2s">
                    <button class="role-tab active" type="button">Collector</button>
                    <button class="role-tab" type="button">Artist</button>
                </div>
                <form
"@
        $content = $content -replace '<form', $roleTabs
        
        # Add reveal animations to the wrapper contents
        $content = $content -replace '<h2>', '<h2 class="reveal">'
        $content = $content -replace '<p>Sign in', '<p class="reveal" style="animation-delay: 0.1s">Sign in'
        $content = $content -replace '<p>Join the', '<p class="reveal" style="animation-delay: 0.1s">Join the'
        $content = $content -replace '<form id=', '<form class="reveal" style="animation-delay: 0.3s" id='
    }
    
    # 3. Add animation in dashboard
    if ($file.Name -match "dashboard") {
        $content = $content -replace 'class="art-card"', 'class="art-card tilt-card reveal"'
        $content = $content -replace 'class="stat-card"', 'class="stat-card reveal"'
        $content = $content -replace 'class="profile-card"', 'class="profile-card reveal"'
        $content = $content -replace 'class="settings-card"', 'class="settings-card reveal"'
        $content = $content -replace 'class="list-item"', 'class="list-item reveal"'
    }
    
    Set-Content -Path $file.FullName -Value $content
}

# Add some extra dashboard animation polish in CSS
$cssUpdate = @"

/* Dashboard entry animations */
.tab-content {
    animation: fadeInPage 0.5s ease-out forwards;
}

.reveal {
    opacity: 0;
    animation: revealSlideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes revealSlideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
"@

Add-Content -Path "css/animations.css" -Value $cssUpdate
