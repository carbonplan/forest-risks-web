import fsspec
import os

account_key = os.environ['BLOB_ACCOUNT_KEY']
fs = fsspec.get_filesystem_class('az')(account_name = 'carbonplan', account_key=account_key)

fs.put(
	'/Users/freeman/github/carbonplan/forest-risks-web/tiles/processed/basemap', 
	'carbonplan-forests/risks/tiles/basemap/', 
	recursive=True, 
	overwrite=True
)

fs.put(
	'/Users/freeman/github/carbonplan/forest-risks-web/tiles/processed/forests', 
	'carbonplan-forests/risks/tiles/forests/', 
	recursive=True, 
	overwrite=True
)

fs.put(
	'/Users/freeman/github/carbonplan/forest-risks-web/tiles/processed/risks', 
	'carbonplan-forests/risks/tiles/risks/', 
	recursive=True, 
	overwrite=True
)