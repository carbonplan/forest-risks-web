import os

def build_basemap():

    cmds = []

    cmds.append('rm -rf processed/basemap ')
    cmds.append('rm -rf tmp ')
    cmds.append('mkdir tmp ')

    cmds.append(
        'tippecanoe '
        '-z5 '
        '-o tmp/land_water.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/ne_10m_land.geojson raw/ne_10m_lakes.geojson '
    )

    cmds.append(
        'tippecanoe '
        '-Z0 '
        '-z3 '
        '-o tmp/countries.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/ne_10m_admin_0_countries.geojson '
    )

    cmds.append(
        'tippecanoe '
        '-Z4 '
        '-z5 '
        '-o tmp/provinces.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/ne_10m_admin_1_states_provinces.geojson '
    )

    cmds.append(
        'tile-join '
        '-o tmp/basemap.mbtiles '
        '--no-tile-compression '
        '--no-tile-size-limit '
        'tmp/land_water.mbtiles '
        'tmp/countries.mbtiles '
        'tmp/provinces.mbtiles '
    )

    cmds.append(
        'mb-util '
        '--image_format=pbf ' 
        'tmp/basemap.mbtiles '
        'processed/basemap'
    )

    cmds.append('rm -rf tmp ')

    [os.system(cmd) for cmd in cmds]

if __name__ == '__main__':
    build_basemap()