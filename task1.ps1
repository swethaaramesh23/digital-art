$files = @("login.html", "signup.html", "dashboard-user.html", "dashboard-artist.html", "dashboard-admin.html")

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Remove the premium-loader div and its contents
        # The loader looks like:
        # <div id="premium-loader">
        # ...
        # </div>
        # We can use a regex to match from <div id="premium-loader"> up to the matching closing div.
        # Given it's a fixed block of HTML, we can just match everything until </div>\s*<!-- Aurora Background --> or similar.
        
        # Regex to remove loader block:
        $content = $content -replace '(?s)<div id="premium-loader">.*?</div>\s*</div>\s*</div>\s*</div>', ''
        # Let's be safer:
        $content = $content -replace '(?s)<!-- Loading Screen -->.*?<!-- Aurora Background -->', '<!-- Aurora Background -->'
        
        Set-Content -Path $file -Value $content
    }
}

# Add loading="lazy" to all images in all html files except lo.webp (logo)
$allHtml = Get-ChildItem -Path *.html
foreach ($file in $allHtml) {
    $content = Get-Content $file.FullName -Raw
    # Replace <img ...> with <img loading="lazy" ...> if it doesn't already have it and isn't the logo
    $evaluator = [System.Text.RegularExpressions.MatchEvaluator] {
        param($match)
        $imgTag = $match.Value
        if ($imgTag -notmatch 'loading="lazy"' -and $imgTag -notmatch 'lo.webp') {
            return $imgTag -replace '<img ', '<img loading="lazy" '
        }
        return $imgTag
    }
    $regex = [regex]'(?i)<img[^>]+>'
    $content = $regex.Replace($content, $evaluator)
    
    Set-Content -Path $file.FullName -Value $content
}
