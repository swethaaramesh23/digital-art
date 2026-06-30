$htmlFiles = Get-ChildItem -Path *.html
$images = Get-ChildItem -Path "IMAGE" -Filter "*.webp" | Select-Object -ExpandProperty Name
$imageCount = $images.Count
$global:imgIndex = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw

    $evaluator = [System.Text.RegularExpressions.MatchEvaluator] {
        param($match)
        $localImg = "IMAGE/" + $images[$global:imgIndex % $imageCount]
        $global:imgIndex++
        return "src=`"$localImg`""
    }

    $regex = [regex]'src="IMAGE/[^"]+"'
    $content = $regex.Replace($content, $evaluator)

    Set-Content -Path $file.FullName -Value $content
}
