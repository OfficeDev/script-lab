$diffs=$(git --no-pager diff HEAD --exit-code)

if($diff -ne 0){
    Write-Host "Diffs were found"
    exit 1
}
else {
    Write-Host "No Diffs Found"
    exit 0
}
