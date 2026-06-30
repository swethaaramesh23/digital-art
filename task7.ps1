$files = Get-ChildItem -Path . -Filter *.html

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Remove preloading class from body globally
    $content = $content -replace '<body class="preloading">', '<body>'
    
    # Fix the index.html double class issue
    if ($file.Name -eq "index.html") {
        $content = $content -replace 'class="reveal" class="home-hero animated-gradient-bg"', 'class="home-hero animated-gradient-bg reveal"'
    }
    
    Set-Content -Path $file.FullName -Value $content
}

# Increase logo size globally
$cssUpdate = @"

/* Global Logo Size Increase */
.sidebar-logo img, .logo img {
    width: 56px !important;
    height: 56px !important;
}
.sidebar-logo, .logo {
    font-size: 1.5rem !important;
}
"@

Add-Content -Path "css/animations.css" -Value $cssUpdate
