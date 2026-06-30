$htmlFiles = Get-ChildItem -Path *.html

$images = Get-ChildItem -Path "IMAGE" -Filter "*.webp" | Select-Object -ExpandProperty Name
$imageCount = $images.Count
$imgIndex = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw

    # 1. Replace unsplash images
    # We will find all unsplash URLs and replace them one by one.
    $pattern = 'https://images\.unsplash\.com/[^"''\s\)]+'
    while ($content -match $pattern) {
        $localImg = "IMAGE/" + $images[$imgIndex % $imageCount]
        # Replace only the first occurrence
        $content = $content -replace $pattern, $localImg
        $imgIndex++
    }

    # 2. Add Login button to hamburger menu (nav-links)
    # We'll insert it before the closing </ul> of nav-links if not already there
    if ($content -match '<ul class="nav-links">') {
        if ($content -notmatch 'class="mobile-login-btn"') {
            $loginHtml = '<li class="mobile-login-btn"><a href="login.html" class="btn btn-primary" style="display:block;text-align:center;">Login</a></li>'
            $content = $content -replace '</ul>', "$loginHtml`n            </ul>"
        }
    }

    # 3. Dashboard hamburger
    # The dashboard uses <button class="hamburger-btn" id="open-sidebar"><i class="uil uil-bars"></i></button>
    # The user says "Hamburger is missing in dashboard". Maybe we just need to replace it with the animated one, or ensure it's visible.
    # Let's replace the icon with the animated spans so it looks like a real hamburger.
    $hamburgerHtml = '<button class="hamburger" id="open-sidebar" aria-label="Menu" style="display:flex; z-index:1001;"><span></span><span></span><span></span></button>'
    $content = $content -replace '<button class="hamburger-btn"[^>]*>.*?</button>', $hamburgerHtml

    Set-Content -Path $file.FullName -Value $content
}

# Now CSS updates for mobile-login-btn
$cssContent = Get-Content "css/styles.css" -Raw
if ($cssContent -notmatch '\.mobile-login-btn') {
    $cssContent += "`n/* Mobile Login Button */`n.mobile-login-btn { display: none; }`n@media (max-width: 992px) { .mobile-login-btn { display: block; margin-top: 1rem; } }"
}
Set-Content -Path "css/styles.css" -Value $cssContent

