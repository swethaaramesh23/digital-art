$htmlFiles = Get-ChildItem -Path *.html

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw

    # 1. Remove stackly near logo
    $content = $content -replace '<span class="logo-text">\s*<span class="text-gradient">Stackly</span>\s*</span>', ''
    $content = $content -replace '<span class="logo-text"><span class="text-gradient">Stackly</span></span>', ''
    $content = $content -replace '<img src="lo.webp" alt="Logo">\s*<span>Stackly</span>', '<img src="lo.webp" alt="Logo">'
    
    # login/signup
    $content = $content -replace '<span class="logo-text">\s*<span class="text-gradient">Stackly</span>\s*</span>', ''

    # 2. Address replacements
    $content = $content -replace 'San Francisco, CA', 'Salem, Tamil Nadu'
    $content = $content -replace '101 Web3 Avenue, Suite 500, 94107', 'MMR Complex, Chinna Thirupathi, near Chinna Muniyappan Kovil, Salem 636003'
    $content = $content -replace '\+1 \(555\) 123-4567', '+91 70106 92732'

    # 3. 404 links
    $content = $content -replace 'href="404\.html"', 'href="#"'

    Set-Content -Path $file.FullName -Value $content
}

# Add overflow-x: hidden to html in css
$cssContent = Get-Content "css/styles.css" -Raw
$cssContent = $cssContent -replace 'html \{ scroll-behavior', 'html { overflow-x: hidden; scroll-behavior'
Set-Content -Path "css/styles.css" -Value $cssContent

