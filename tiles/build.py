import os
import sys

def build_risks():

    cmds = []

    cmds.append('rm -rf processed/risks ')
    cmds.append('rm -rf tmp ')
    cmds.append('mkdir tmp ')

    cmds.append(
        'tippecanoe '
        '-Z3 '
        '-z3 '
        '-o tmp/risks_z3.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/d4/fire.geojson raw/d4/drought.geojson raw/d4/insects.geojson'
    )

    cmds.append(
        'tippecanoe '
        '-Z4 '
        '-z4 '
        '-o tmp/risks_z4.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/d2/fire.geojson raw/d2/drought.geojson raw/d2/insects.geojson'
    )

    cmds.append(
        'tippecanoe '
        '-Z5 '
        '-z5 '
        '-o tmp/risks_z5.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/d1/fire.geojson raw/d1/drought.geojson raw/d1/insects.geojson'
    )

    cmds.append(
        'tile-join '
        '-o tmp/risks.mbtiles '
        '--no-tile-compression '
        '--no-tile-size-limit '
        'tmp/risks_z3.mbtiles '
        'tmp/risks_z4.mbtiles '
        'tmp/risks_z5.mbtiles '
    )

    cmds.append(
        'mb-util '
        '--image_format=pbf ' 
        'tmp/risks.mbtiles '
        'processed/risks'
    )

    cmds.append('rm -rf tmp ')

    [os.system(cmd) for cmd in cmds]


def build_forests():

    cmds = []

    cmds.append('rm -rf processed/forests ')
    cmds.append('rm -rf tmp ')
    cmds.append('mkdir tmp ')

    cmds.append(
        'tippecanoe '
        '-Z3 '
        '-z3 '
        '-o tmp/forests_z3.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/d4/biomass.geojson'
    )

    cmds.append(
        'tippecanoe '
        '-Z4 '
        '-z4 '
        '-o tmp/forests_z4.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/d2/biomass.geojson'
    )

    cmds.append(
        'tippecanoe '
        '-Z5 '
        '-z5 '
        '-o tmp/forests_z5.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/d1/biomass.geojson'
    )

    cmds.append(
        'tile-join '
        '-o tmp/forests.mbtiles '
        '--no-tile-compression '
        '--no-tile-size-limit '
        'tmp/forests_z3.mbtiles '
        'tmp/forests_z4.mbtiles '
        'tmp/forests_z5.mbtiles '
    )

    cmds.append(
        'mb-util '
        '--image_format=pbf ' 
        'tmp/forests.mbtiles '
        'processed/forests'
    )

    cmds.append('rm -rf tmp ')

    [os.system(cmd) for cmd in cmds]


def build_basemap():

    cmds = []

    cmds.append('rm -rf processed/basemap ')
    cmds.append('rm -rf tmp ')
    cmds.append('mkdir tmp ')

    cmds.append(
        'tippecanoe '
        '-z5 '
        '-o tmp/water.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/ne_10m_lakes.geojson '
    )

    cmds.append(
        'tippecanoe '
        '-Z0 '
        '-z2 '
        '-o tmp/countries.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/ne_10m_admin_0_countries.geojson '
    )

    cmds.append(
        'tippecanoe '
        '-Z3 '
        '-z5 '
        '-o tmp/provinces.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/ne_10m_admin_1_states_provinces.geojson '
    )

    cmds.append(
        'tippecanoe '
        '-Z3 '
        '-z5 '
        '-o tmp/roads.mbtiles '
        '--no-feature-limit '
        '--no-tile-size-limit '
        '--extend-zooms-if-still-dropping '
        '--no-tile-compression '
        'raw/ne_10m_roads.geojson '
    )

    cmds.append(
        'tile-join '
        '-o tmp/basemap.mbtiles '
        '--no-tile-compression '
        '--no-tile-size-limit '
        'tmp/water.mbtiles '
        'tmp/countries.mbtiles '
        'tmp/provinces.mbtiles '
        'tmp/roads.mbtiles '
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
    args = sys.argv
    choice = args[1]

    switcher = {
        'basemap': build_basemap,
        'forests': build_forests,
        'risks': build_risks
    }

    if choice not in switcher.keys():
        print(f'choice "{choice}" not recognized')
    else:
        switcher[choice]()