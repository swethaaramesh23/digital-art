$files = @("login.html", "signup.html")

foreach ($file in $files) {
    if ($file -eq "login.html") {
        $title = "Sign In"
        $heading = "Welcome Back"
        $subtext = "Sign in to your account"
        $formContent = @"
                    <div class="form-group">
                        <input type="email" class="form-input" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-input" placeholder="Password" required>
                    </div>
                    <div class="form-row">
                        <label class="remember-me"><input type="checkbox"> Remember me</label>
                        <a href="#" class="forgot-link">Forgot password?</a>
                    </div>
                    <button type="submit" class="btn-sign-in">Sign In</button>
"@
        $bottomText = "Don't have an account? <a href='signup.html'>Sign Up</a>"
    } else {
        $title = "Sign Up"
        $heading = "Create Account"
        $subtext = "Join the premier digital art platform"
        $formContent = @"
                    <div class="form-group">
                        <input type="text" class="form-input" placeholder="Full Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" class="form-input" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-input" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn-sign-in">Sign Up</button>
"@
        $bottomText = "Already have an account? <a href='login.html'>Sign In</a>"
    }

    $content = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title — Stackly</title>
    <link rel="icon" href="lo.webp" type="image/webp">
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css">
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/animations.css">
    <style>
        /* Force scrollability */
        html, body {
            overflow-y: auto !important;
            height: auto !important;
            min-height: 100vh;
        }

        .auth-layout { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            min-height: 100vh;
            position: relative;
        }
        
        .auth-form-side {
            display: flex; flex-direction: column; padding: 2.5rem 3.5rem;
            position: relative; z-index: 50;
            background: rgba(10,10,15,0.6); backdrop-filter: blur(20px);
            margin: 2rem; border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 0 40px rgba(0,0,0,0.5);
        }
        .logo { display: inline-flex; align-items: center; gap: .5rem; margin-bottom: 2rem; }
        
        .auth-form-wrapper { flex: 1; display: flex; flex-direction: column; justify-content: center; max-width: 420px; width: 100%; margin: 0 auto; position: relative; z-index: 50; }
        .auth-form-wrapper h2 { font-size: 2rem; font-weight: 700; margin-bottom: .5rem; color: #fff; }
        .auth-form-wrapper > p { color: var(--text-muted); margin-bottom: 2rem; font-size: .95rem; }
        
        .form-group { margin-bottom: 1.25rem; }
        .form-input {
            width: 100%; padding: .85rem 1rem; border-radius: 12px;
            border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.04);
            color: #fff; font-family: inherit; font-size: .925rem; transition: all .3s ease;
        }
        .form-input:focus { outline: none; border-color: var(--accent-violet); box-shadow: 0 0 0 3px rgba(124,58,237,.15); }
        
        .form-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; font-size: .85rem; }
        .remember-me { display: flex; align-items: center; gap: .5rem; color: var(--text-muted); cursor: pointer; }
        .forgot-link { color: var(--accent-violet); text-decoration: none; font-weight: 500; }
        .btn-sign-in { width: 100%; padding: 1rem; font-size: 1rem; font-weight: 600; border-radius: 12px; border: none; cursor: pointer; background: var(--accent-violet); color: #fff; }
        
        .auth-divider { display: flex; align-items: center; gap: 1rem; margin: 1.75rem 0; color: var(--text-muted); font-size: .8rem; }
        .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.08); }
        .social-login-row { display: flex; gap: .75rem; margin-bottom: 2rem; }
        .social-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: .5rem; padding: .75rem 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.03); color: var(--text-muted); text-decoration: none; }
        .auth-bottom-text { text-align: center; color: var(--text-muted); font-size: .9rem; }
        .auth-bottom-text a { color: var(--accent-violet); text-decoration: none; font-weight: 600; }
        
        .auth-art-side {
            position: relative; display: flex; align-items: center; justify-content: center;
            background: linear-gradient(135deg, #7C3AED 0%, #3B0764 40%, #0E1A3A 70%, #00E5FF 100%);
            overflow: hidden; padding: 3rem;
            z-index: 10;
        }
        .art-side-content { position: relative; z-index: 20; text-align: center; max-width: 420px; }
        .art-quote { font-family: 'Outfit', sans-serif; font-size: 1.65rem; font-weight: 600; line-height: 1.55; color: #fff; margin-bottom: 1rem; }
        .art-attribution { color: rgba(255,255,255,.6); font-size: .95rem; font-style: italic; margin-bottom: 2.5rem; }
        
        @media (max-width: 900px) {
            .auth-layout { grid-template-columns: 1fr; display: flex; flex-direction: column; }
            .auth-art-side { display: none; }
            .auth-form-side { margin: 1rem; padding: 2rem 1.5rem; }
        }

        /* Clean animations */
        .fade-in-up {
            opacity: 0;
            animation: customFadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes customFadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Fixed Particles - absolutely positioned within a wrapper so they don't break grid */
        .particles-wrapper {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <div class="auth-layout animated-gradient-bg">
        <div class="particles-wrapper">
            <div class="particle" style="position:absolute; width:250px; height:250px; background:rgba(0,229,255,0.15); top:10%; left:5%;"></div>
            <div class="particle" style="position:absolute; width:350px; height:350px; background:rgba(124,58,237,0.15); bottom:10%; right:5%;"></div>
        </div>

        <div class="auth-form-side">
            <a href="index.html" class="logo"><img src="lo.webp" alt=""></a>
            <div class="auth-form-wrapper">
                <h2 class="fade-in-up">$heading</h2>
                <p class="fade-in-up" style="animation-delay: 0.1s">$subtext</p>
                
                <div class="role-tabs fade-in-up" style="animation-delay: 0.2s; display: flex; gap: 0; margin-bottom: 2rem; border-radius: 50px; overflow: hidden; background: rgba(255,255,255,0.05);">
                    <button class="role-tab active" type="button" style="flex: 1; padding: 0.75rem; border: none; background: var(--accent-violet); color: #fff; cursor: pointer; font-weight: 600;">Collector</button>
                    <button class="role-tab" type="button" style="flex: 1; padding: 0.75rem; border: none; background: transparent; color: var(--text-muted); cursor: pointer; font-weight: 600;">Artist</button>
                </div>

                <form class="fade-in-up" style="animation-delay: 0.3s">
$formContent
                </form>

                <div class="auth-divider fade-in-up" style="animation-delay: 0.4s">Or continue with</div>
                
                <div class="social-login-row fade-in-up" style="animation-delay: 0.5s">
                    <a href="#" class="social-btn"><i class="uil uil-google"></i> Google</a>
                    <a href="#" class="social-btn"><i class="uil uil-apple"></i> Apple</a>
                </div>
                
                <div class="auth-bottom-text fade-in-up" style="animation-delay: 0.6s">
                    $bottomText
                </div>
            </div>
        </div>
        
        <div class="auth-art-side">
            <div class="art-side-content fade-in-up" style="animation-delay: 0.4s">
                <div class="art-quote">"Discover, collect, and sell extraordinary digital art."</div>
                <div class="art-attribution">— The Community</div>
            </div>
        </div>
    </div>
    <script src="js/main.js"></script>
    <!-- Removed animations.js from auth pages to prevent observer conflicts, we use pure CSS here -->
</body>
</html>
"@
    Set-Content -Path $file -Value $content
}
