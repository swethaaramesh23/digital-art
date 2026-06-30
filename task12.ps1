$content = Get-Content "signup.html" -Raw

$newScript = @"
                    if (role === 'Artist') {
                        window.location.href = 'login.html';
                    } else {
                        window.location.href = 'login.html';
                    }
"@

# I'll just replace the inner block that handles redirection in signup.html
$content = $content -replace "(?s)if \(role === 'Artist'\) \{.*?\} else \{.*?\}", $newScript

Set-Content -Path "signup.html" -Value $content
