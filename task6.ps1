$file = "dashboard-user.html"
if (Test-Path $file) {
    $content = Get-Content $file -Raw
    
    # 1. Add Analytics and Favorites to Sidebar
    # Insert after Activity Feed
    $sidebarUpdate = @"
                <a href="#activity" class="dash-link"><i class="uil uil-history"></i> <span>Activity Feed</span></a>
                <a href="#analytics" class="dash-link"><i class="uil uil-chart-line"></i> <span>Analytics</span></a>
                <a href="#favorites" class="dash-link"><i class="uil uil-heart-alt"></i> <span>Favorites</span></a>
"@
    $content = $content -replace '<a href="#activity" class="dash-link"><i class="uil uil-history"></i> <span>Activity Feed</span></a>', $sidebarUpdate
    
    # 2. Add Analytics Tab Content
    $analyticsTab = @"
            <!-- ANALYTICS -->
            <div id="analytics" class="tab-content">
                <div class="section-header">
                    <h3>Portfolio Analytics</h3>
                </div>
                <div class="grid-2">
                    <div class="stat-card" style="flex-direction:column; align-items:stretch;">
                        <h4 style="margin:0 0 1rem;">Revenue Graph</h4>
                        <div class="css-chart">
                            <div class="chart-bar" style="height:40%; animation-delay:0.1s;"></div>
                            <div class="chart-bar" style="height:60%; animation-delay:0.2s;"></div>
                            <div class="chart-bar" style="height:30%; animation-delay:0.3s;"></div>
                            <div class="chart-bar" style="height:80%; animation-delay:0.4s;"></div>
                            <div class="chart-bar" style="height:50%; animation-delay:0.5s;"></div>
                            <div class="chart-bar" style="height:90%; animation-delay:0.6s;"></div>
                            <div class="chart-bar" style="height:100%; animation-delay:0.7s;"></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-top:0.5rem; color:var(--text-muted); font-size:0.8rem;">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>
                    <div class="stat-card" style="flex-direction:column; align-items:stretch;">
                        <h4 style="margin:0 0 1rem;">Profile Views</h4>
                        <div style="display:flex; justify-content:center; align-items:center; height:150px;">
                            <div style="width:120px; height:120px; border-radius:50%; background:conic-gradient(var(--accent-violet) 75%, rgba(255,255,255,0.1) 0); display:flex; justify-content:center; align-items:center;">
                                <div style="width:90px; height:90px; background:var(--bg-card); border-radius:50%; display:flex; justify-content:center; align-items:center;">
                                    <h3 style="margin:0;"><span class="count-up" data-target="75">0</span>%</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- FAVORITES -->
            <div id="favorites" class="tab-content">
                <div class="section-header">
                    <h3>Your Favorites</h3>
                </div>
                <div class="art-grid">
                    <div class="art-card"><img loading="lazy" class="art-card-img" src="IMAGE/michael.webp" alt="Art"><div class="art-card-body"><h5>Void Protocol</h5><p class="price">7.5 ETH</p><button class="btn-sm btn-primary-sm" style="width:100%; margin-top:0.5rem;">Buy Now</button></div></div>
                    <div class="art-card"><img loading="lazy" class="art-card-img" src="IMAGE/mp.webp" alt="Art"><div class="art-card-body"><h5>Aurora Dreams</h5><p class="price">2.8 ETH</p><button class="btn-sm btn-primary-sm" style="width:100%; margin-top:0.5rem;">Buy Now</button></div></div>
                </div>
            </div>
"@
    
    # Inject tabs after activity feed tab
    $content = $content -replace '<!-- 3. RECOMMENDED -->', "$analyticsTab`n`n            <!-- 3. RECOMMENDED -->"
    
    Set-Content -Path $file -Value $content
}
