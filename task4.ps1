$file = "index.html"
if (Test-Path $file) {
    $content = Get-Content $file -Raw
    
    # 1. Particles
    $particles = @"
    <!-- Floating Particles -->
    <div class="particle" style="width:250px; height:250px; background:rgba(0,229,255,0.15); top:15%; left:5%;"></div>
    <div class="particle" style="width:350px; height:350px; background:rgba(124,58,237,0.15); bottom:20%; right:10%;"></div>
    <div class="particle" style="width:200px; height:200px; background:rgba(255,0,128,0.1); top:40%; left:40%;"></div>
"@
    # Inject particles after <body>
    $content = $content -replace '(?i)<body[^>]*>', "`$0`n$particles"
    
    # 2. Hero animations
    # Add text-reveal to the main h1
    $content = $content -replace '<h1>', '<h1 class="text-reveal">'
    # Add float-slow to the hero artwork
    $content = $content -replace 'class="hero-artwork"', 'class="hero-artwork float-slow"'
    
    # 3. Scroll reveal to sections
    $content = $content -replace '<section ', '<section class="reveal" '
    
    # 4. Animated counters (Home page stats)
    # E.g. <h2>35k+</h2> -> <h2><span class="count-up" data-target="35000">0</span>+</h2>
    $content = $content -replace '<h2>35k\+</h2>', '<h2><span class="count-up" data-target="35">0</span>k+</h2>'
    $content = $content -replace '<h2>15k\+</h2>', '<h2><span class="count-up" data-target="15">0</span>k+</h2>'
    $content = $content -replace '<h2>20k\+</h2>', '<h2><span class="count-up" data-target="20">0</span>k+</h2>'
    
    # 5. Animated gradient bg to body or hero
    # Let's add it to .home-hero
    $content = $content -replace 'class="home-hero"', 'class="home-hero animated-gradient-bg"'
    
    Set-Content -Path $file -Value $content
}
