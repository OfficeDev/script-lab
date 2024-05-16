setlocal
:: Must run as administrator
:: Create a share for the manifest files
set share=C:\manifests
if not exist %share% md %share%

net share manifests=%share%