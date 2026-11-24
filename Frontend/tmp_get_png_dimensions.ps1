$base = 'C:/Users/techz/.gemini/antigravity/brain/826681da-dd96-45e1-bd3b-b9e818836e7e/.user_uploaded'
Get-ChildItem -Path $base -Filter '*.png' | ForEach-Object {
    $img = [System.Drawing.Image]::FromFile($_.FullName)
    Write-Output "{0}: {1}x{2}" -f $_.Name, $img.Width, $img.Height
    $img.Dispose()
}
