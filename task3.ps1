$allHtml = Get-ChildItem -Path *.html
foreach ($file in $allHtml) {
    $content = Get-Content $file.FullName -Raw
    
    # Inject CSS
    if ($content -notmatch 'animations\.css') {
        $content = $content -replace '</head>', "    <link rel=`"stylesheet`" href=`"css/animations.css`">`n</head>"
    }
    
    # Inject JS
    if ($content -notmatch 'animations\.js') {
        $content = $content -replace '</body>', "    <script src=`"js/animations.js`"></script>`n</body>"
    }
    
    Set-Content -Path $file.FullName -Value $content
}
