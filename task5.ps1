$files = @("login.html", "signup.html")
foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        $particles = @"
    <!-- Floating Particles -->
    <div class="particle" style="width:250px; height:250px; background:rgba(0,229,255,0.15); top:10%; left:5%;"></div>
    <div class="particle" style="width:350px; height:350px; background:rgba(124,58,237,0.15); bottom:10%; right:5%;"></div>
"@
        
        # Inject particles
        $content = $content -replace '(?i)<body[^>]*>', "`$0`n$particles"
        
        # Add gradient bg to auth-layout if it exists, or body
        $content = $content -replace 'class="auth-layout"', 'class="auth-layout animated-gradient-bg"'
        
        # Add glassmorphism to form side
        $content = $content -replace 'class="auth-form-side"', 'class="auth-form-side" style="background: rgba(10,10,15,0.6); backdrop-filter: blur(20px); border-radius: 20px; margin: 2rem; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 0 40px rgba(0,0,0,0.5);"'
        
        Set-Content -Path $file -Value $content
    }
}
